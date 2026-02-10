import {RouteProp, StackActions, useScrollToTop} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlashList} from '@shopify/flash-list';
import Translator from 'bazinga-translator';
import {EventSubscription} from 'fbemitter';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import {Header} from '../../components/page/header';
import HeaderButton from '../../components/page/header/button';
import Title from '../../components/page/header/title';
import Picker from '../../components/page/picker';
import RefreshableFlatList from '../../components/page/refreshableFlatList';
import Spinner from '../../components/spinner';
import TimelineListHeader from '../../components/trips/list/header';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import {triggerHapticFeedback} from '../../helpers/haptic';
import Popover from '../../helpers/popover';
import EventEmitter from '../../services/eventEmitter';
import LocaleManager from '../../services/localeManager';
import Session from '../../services/session';
import StorageSync from '../../services/storageSync';
import TimelineService from '../../services/timeline';
import Storage from '../../storage';
import {Colors, DarkColors} from '../../styles';
import {ColorScheme, ThemeColors, useTheme} from '../../theme';
import {TripsStackParamList, TripsStackScreenFunctionalComponent} from '../../types/navigation';
import TimelineEmptyList from './emptyList';
import {TimelineMailboxes} from './mailboxes';

const log = (...args) => {
    console.log('[TIMELINE]', ...args);
};

class RefreshableDraggableFlatList extends DraggableFlatList {
    render() {
        const {horizontal, keyExtractor} = this.props;

        return (
            <View
                onLayout={_.noop}
                ref={this.measureContainer}
                {...this._panResponder.panHandlers}
                style={{flex: 1, opacity: 1}} // Setting { opacity: 1 } fixes Android measurement bug: https://github.com/facebook/react-native/issues/18034#issuecomment-368417691
            >
                <RefreshableFlatList
                    {...this.props}
                    ListComponent={FlashList}
                    scrollEnabled={this.state.activeRow === -1}
                    ref={(ref) => (this._flatList = ref)}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    keyExtractor={keyExtractor || this.keyExtractor}
                    onScroll={({nativeEvent}) => {
                        this._scrollOffset = nativeEvent.contentOffset[horizontal ? 'x' : 'y'];
                    }}
                />
                {this.renderHoverComponent()}
            </View>
        );
    }
}

class Timeline extends BaseThemedPureComponent<
    {
        theme: ColorScheme;
        navigation: StackNavigationProp<TripsStackParamList, 'Timeline'>;
        route: RouteProp<TripsStackParamList, 'Timeline'>;
    },
    {
        loading: boolean;
        showDeleted: boolean;
        items: unknown[];
        canChange: boolean;
        needMore: boolean;
        itineraryForwardEmail: string;
        length: number;
        scrollTo: unknown;
        initialNumToRender: number;
        travelers: unknown[];
        pastTravelLoaded: boolean;
    }
> {
    static components = {
        date: require('../../components/trips/list/date').default,
        planStart: require('../../components/trips/list/planStart').default,
        planEnd: require('../../components/trips/list/planEnd').default,
        trip: require('../../components/trips/list/trip').default,
    };

    private tossingItems: any[];

    private listeners: EventSubscription[] | undefined;

    private willFocusSubscription: (() => void) | undefined;

    private mounted = false;

    static segmentDisabled({startDate, endDate, type}) {
        const now = new Date();
        let date = startDate.ts;

        if (type === 'date') {
            return date * 1000 <= new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        }

        if (['trip', 'layover'].includes(type)) {
            if (_.isObject(endDate)) {
                date = endDate.ts;
            }
        }

        return date * 1000 <= now.getTime();
    }

    static getInitialState(data = {}) {
        const {items: itemsData, itineraryForwardEmail = null, needMore = false, canChange = false, travelers} = data;

        let items = [];
        let position = {};

        if (itemsData) {
            items = Array.from(itemsData.values());
            position = Timeline.getStartPosition(items);
        }

        const {length = 0, scrollTo} = position;

        return {
            loading: false,
            showDeleted: false,
            items,
            canChange,
            needMore,
            itineraryForwardEmail,
            length,
            scrollTo,
            initialNumToRender: items.indexOf(scrollTo) + 15,
            travelers,
            pastTravelLoaded: false,
        };
    }

    static getStartPosition(items, date = new Date()) {
        const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
        let startIndex = null;
        let hasFuture = false;
        let scrollTo;
        let i = items.length - 1;
        let item;

        for (; i >= 0; i -= 1) {
            item = items[i];

            const itemStartDate = item.startDate.ts * 1000;

            hasFuture = hasFuture || itemStartDate >= date1;

            startIndex = i;

            if (itemStartDate > date1) {
                scrollTo = items[i];

                if (scrollTo.type === 'date') {
                    scrollTo = items[i + 1];
                }
            }

            if (itemStartDate < date1 && (item.breakAfter === true || item.breakAfter === undefined)) {
                startIndex += 1;
                break;
            }
        }

        startIndex = startIndex !== null && hasFuture ? startIndex : items.length;

        return {
            length: startIndex,
            scrollTo,
        };
    }

    _scrollView = React.createRef();

    _travelerPicker = React.createRef();

    constructor(props) {
        super(props);

        this.safeSetState = this.safeSetState.bind(this);
        this.refreshData = this.refreshData.bind(this);

        this.showPastTravel = this.showPastTravel.bind(this);
        this.pastTravel = this.pastTravel.bind(this);
        this.toggleDeleted = this.toggleDeleted.bind(this);
        this.showDeleted = this.showDeleted.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
        this.reloadTimeline = this.reloadTimeline.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);

        this._loadSegments = this._loadSegments.bind(this);

        this.renderEmpty = this.renderEmpty.bind(this);
        this.renderHeader = this.renderHeader.bind(this);

        this.state = Timeline.getInitialState({...this.getTimeline(), travelers: this.getTravelers()});

        this.tossingItems = [];
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;

        const items = this.getDisplayItems();
        const {scrollTo} = this.state;

        this.listeners = [EventEmitter.addListener('timeline:update', this.refreshData)];
        this.willFocusSubscription = navigation.addListener('focus', () => this.setHeaderParams());

        if (isIOS && items.indexOf(scrollTo) > 0) {
            setTimeout(() => {
                // @ts-ignore
                this._scrollView.current?._flatList?.scrollToItem({animated: false, item: scrollTo, viewPosition: 0.5});
            }, 25);
        }
    }

    componentWillUnmount() {
        this.mounted = false;

        if (this.listeners) {
            this.listeners.forEach((listener) => listener.remove());
        }

        if (this.willFocusSubscription) {
            this.willFocusSubscription();
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    setStateAsync = (state) =>
        new Promise((resolve) => {
            this.safeSetState(state, resolve);
        });

    get travelerPicker() {
        return this._travelerPicker.current;
    }

    getComponent = (type) => {
        if (['date', 'planStart', 'planEnd'].indexOf(type) > -1) {
            return Timeline.components[type];
        }

        return Timeline.components.trip;
    };

    scrollToTop() {
        // @ts-ignore
        this._scrollView.current?._flatList?.scrollToOffset({animated: true, offset: 0});
    }

    setHeaderParams = (params?) => {
        const {navigation} = this.props;
        const {showDeleted} = this.state;
        // @ts-ignore
        const {name, familyName} = this.getTimeline();
        const travelers = this.getTravelers();
        const hasTravelers = _.isArray(travelers) && !_.isEmpty(travelers) && travelers.length > 1;
        const futureSegments = TimelineService.getSegmentsInRange(new Date(), -1, [], this.userAgentId);
        const futureCount = new Set(futureSegments.map((segment) => segment.futureCountId)).size;
        const loading = params?.loading ?? false;
        const title = familyName || name;

        navigation.setParams({
            futureSegments: futureCount,
            title,
            showDeleted,
            chooseTraveler: hasTravelers ? this.chooseTraveler : undefined,
            toggleDeleted: this.toggleDeleted,
            loading,
        });
    };

    onRefresh = () => {
        const {pastTravelLoaded} = this.state;

        if (pastTravelLoaded) {
            return this._reloadTimeline(false);
        }

        return StorageSync.forceUpdate();
    };

    refreshData() {
        const {showDeleted, pastTravelLoaded} = this.state;
        const list = this.getTimeline();
        const {items, needMore, familyName, name} = list;
        const travelers = this.getTravelers();

        if (pastTravelLoaded) {
            this.onRefresh();
        } else {
            if (showDeleted === true) {
                return;
            }

            if (items.size > 0) {
                this.setList(Array.from(items.values()), needMore);
            } else {
                this.safeSetState(Timeline.getInitialState({...list, travelers}));
            }
        }
    }

    get userAgentId() {
        const {route} = this.props;
        const travelers = this.getTravelers();
        const userId = parseInt(route?.params?.userAgentId, 10);

        return travelers.findIndex(({userAgentId}) => userAgentId === userId) > -1 ? String(userId) : 'my';
    }

    getTimeline() {
        return TimelineService.getTimeline(this.userAgentId) || {};
    }

    getTravelers = () => {
        const travelers = TimelineService.getTravelers();

        return Array.from(travelers.values());
    };

    chooseTraveler = () => {
        if (this.travelerPicker) {
            this.travelerPicker.show();
        }
    };

    changeTraveler = (name, index) => {
        const {navigation} = this.props;
        const {travelers} = this.state;
        const traveler = travelers[index];

        if (_.isObject(traveler)) {
            const {userAgentId} = traveler;

            log('changeTraveler', traveler);

            navigation.dispatch(
                StackActions.replace('Timeline', {
                    userAgentId,
                    title: traveler.name,
                    animation: 'none',
                }),
            );
        }
    };

    filterCurrentTraveler = (traveler) => traveler.userAgentId == this.userAgentId;

    formatTravelerName = (owner) => {
        const {familyName, name} = owner;

        if (familyName) {
            return `${familyName} (${name})`;
        }

        return name;
    };

    setList(items, needMore) {
        const displayItems = this.getDisplayItems();
        let startTime = Date.now();

        if (_.isEmpty(displayItems) === false) {
            startTime = Math.min(Date.now(), displayItems[0].startDate.ts * 1000);
        }

        log('setList', {items, needMore});

        if (_.isArray(items)) {
            this.safeSetState({items});
        }

        const {length} = Timeline.getStartPosition(items, new Date(startTime));

        this.safeSetState({
            needMore,
            length,
        });
    }

    isEmpty() {
        const {items, needMore} = this.state;

        return _.isEmpty(items) && !!needMore;
    }

    showMailboxes() {
        const {mailboxOwners} = Storage.getItem('profile');
        const list = this.getTimeline();

        if (_.isObject(list)) {
            const {canConnectMailbox} = list;

            return canConnectMailbox === true && mailboxOwners.includes(String(this.userAgentId)) === false;
        }

        return false;
    }

    hasPastTravel() {
        const {items, length, needMore} = this.state;

        return items.length !== items.length - length || needMore;
    }

    getDisplayItems() {
        const {items, length} = this.state;

        return items.slice(length);
    }

    showPastTravel() {
        const {length, items} = this.state;
        const list = items.slice(0, length);
        const PAGE_SIZE = 10;
        let counter = 0;
        let lastTs;

        if (list.length > 0) {
            let i = list.length - 1;
            let item;

            for (; i >= 0; i -= 1) {
                item = list[i];
                counter += 1;
                lastTs = item.startDate.ts;

                if (counter > PAGE_SIZE && (item.type === 'planStart' || item.type === 'date') && i > 0 && list[i - 1].type !== 'planStart') {
                    break;
                }
            }

            const {length} = Timeline.getStartPosition(items, new Date(lastTs * 1000));

            log('showPastTravel', {length});

            this.safeSetState({
                length,
            });
        }
    }

    async pastTravel() {
        const {showDeleted, needMore, items, loading} = this.state;
        const displayItems = this.getDisplayItems();

        if (loading === false) {
            if (items.length === displayItems.length && needMore) {
                const startTime = this.getFirstSegmentStartTime();

                this.setLoading(true);

                log('loadSegments', {startTime, showDeleted});

                try {
                    const data = await this.loadSegments(startTime, showDeleted);
                    const {items: newItems, needMore} = data;

                    log('loadSegments, complete', {startTime, showDeleted, newItems});

                    this.safeSetState({pastTravelLoaded: true});
                    this.setList([...newItems, ...items], needMore);
                } finally {
                    this.setLoading(false);
                }
            }

            this.showPastTravel();
        }
    }

    getFirstSegmentStartTime() {
        const {items} = this.state;

        if (items && items.length > 0) {
            const segment = items[0];

            return segment.startDate.ts;
        }

        return 0; // 1970
    }

    _loadSegments(chunkFn, startTime, deleted) {
        const {userAgentId} = this;

        return new Promise((resolve, reject) => {
            chunkFn(userAgentId, {startTime, deleted})
                .then((data) => {
                    if (_.isObject(data)) {
                        return resolve(data);
                    }

                    return reject();
                })
                .catch(reject);
        });
    }

    loadSegments(startTime, deleted) {
        return this._loadSegments(TimelineService.chunked, startTime, deleted);
    }

    loadSegmentsAfter(startTime, deleted) {
        return this._loadSegments(TimelineService.chunkedAfter, startTime, deleted);
    }

    showDeleted(showDeleted) {
        const {navigation} = this.props;

        navigation.setParams({showDeleted});
        this.safeSetState({showDeleted}, this._reloadTimeline);
    }

    async _reloadTimeline(updateParams) {
        const {showDeleted} = this.state;
        const startTime = this.getFirstSegmentStartTime();

        this.setLoading(true, updateParams);

        try {
            const data = await this.loadSegmentsAfter(startTime, showDeleted);
            const {items, needMore} = data;

            this.setList(items, needMore);
        } finally {
            this.setLoading(false, updateParams);
        }
    }

    async reloadTimeline() {
        await this._reloadTimeline();

        // Reload for offline use
        StorageSync.forceUpdate();
    }

    setLoading(loading, updateParams = true) {
        const {navigation} = this.props;

        this.safeSetState({loading});

        if (updateParams) {
            navigation.setParams({loading});
        }
    }

    toggleDeleted() {
        const {showDeleted} = this.state;

        this.showDeleted(!showDeleted);
    }

    getTossingItems = (rowKey, segments) => {
        const items = new Array(segments.length).fill(true);

        let i = parseInt(rowKey, 10) - 1;
        let droppable = true;

        while (i >= 0) {
            if (segments[i].type.match(/plan/)) {
                droppable = false;
            }

            items[i] = droppable;

            i -= 1;
        }

        droppable = true;
        i = parseInt(rowKey, 10) + 1;

        while (i < segments.length) {
            if (segments[i].type.match(/plan/)) {
                droppable = false;
            }

            items[i] = droppable;

            i += 1;
        }

        return items;
    };

    movePlan(plan) {
        const {items} = this.state;
        const {planId, type} = plan;
        const planIndex = items.indexOf(plan);
        let segment = items[planIndex + 1];

        if (type === 'planEnd') {
            segment = items[planIndex - 1];
        }

        const {
            id,
            startDate: {ts},
        } = segment;

        return TimelineService.movePlan(planId, type, id, ts);
    }

    onMoveBegin = (index) => {
        const items = this.getDisplayItems();

        triggerHapticFeedback('impactHeavy');

        this.tossingItems = this.getTossingItems(index, items);
    };

    onMoveEnd = async ({from, to, row}) => {
        this.tossingItems = [];

        if (this.changeOrder({from, to, row}) === true) {
            const response = await this.movePlan(row);
            const {data} = response;

            try {
                if (_.isObject(data)) {
                    const {startTime} = data;
                    const {items} = this.state;
                    const itemIndex = items.indexOf(row);

                    if (itemIndex !== -1) {
                        items[itemIndex].startDate.ts = startTime;

                        await this.safeSetState({items});
                    }
                }
            } finally {
                this.reloadTimeline();
            }
        }
    };

    changeOrder({to, row}) {
        const {items, needMore} = this.state;
        const displayItems = this.getDisplayItems();
        const startPosition = items.indexOf(row);
        const newRow = items[startPosition];
        const firstDisplayItem = displayItems[0];
        const firstDisplayItemIndex = items.indexOf(firstDisplayItem);
        const endPosition = firstDisplayItemIndex + to;

        if (startPosition !== endPosition) {
            let nextItem = items[endPosition + 1];

            if (row.type === 'planEnd') {
                nextItem = items[endPosition - 1];
            }

            newRow.startDate.ts = nextItem.startDate.ts;

            items.splice(startPosition, 1);
            items.splice(endPosition, 0, newRow);

            this.setList(items, needMore);

            return true;
        }

        return false;
    }

    shouldChangeOrder = ({activeRow, nextSpacerIndex}) => {
        const items = this.getDisplayItems();
        const prevIndex = nextSpacerIndex - 1;
        const nextIndex = nextSpacerIndex;
        const currentItem = items[activeRow];
        const prevItem = items[prevIndex];
        const nextItem = items[nextIndex];
        let canChangeOrder = true;

        if (this.tossingItems[nextSpacerIndex - 1]) {
            canChangeOrder = this.tossingItems[nextSpacerIndex - 1];
        } else {
            canChangeOrder = this.tossingItems[nextSpacerIndex];
        }

        if (canChangeOrder) {
            if (prevItem && prevItem.type === 'date' && nextItem && !['planStart', 'planEnd'].includes(nextItem.type)) {
                canChangeOrder = false;
            }

            if (currentItem.type === 'planStart') {
                if (nextItem && nextItem.type === 'planEnd') {
                    canChangeOrder = false;
                }
            }

            if (currentItem.type === 'planEnd') {
                if (prevItem && prevItem.type === 'planStart') {
                    canChangeOrder = false;
                }
            }
        }

        if (canChangeOrder) {
            triggerHapticFeedback('impactLight');
        }

        return canChangeOrder;
    };

    getItemLayout = (data, index) => {
        const item = data[index];
        let height = 68;

        if (item && Timeline.components[item.type]) {
            height = Timeline.components[item.type].LAYOUT_HEIGHT;
        }

        return {length: height, offset: height * index, index};
    };

    renderHeader() {
        const {itineraryForwardEmail, loading} = this.state;
        const showPastTravel = this.hasPastTravel();

        return (
            <TimelineListHeader
                itineraryForwardEmail={itineraryForwardEmail}
                loading={loading}
                showPastTravel={showPastTravel}
                showTravelSummary={this.userAgentId === 'my'}
                pastTravel={this.pastTravel}
                showNotice={!this.showMailboxes()}
            />
        );
    }

    renderFooter = () => {
        if (this.showMailboxes() && !this.isEmpty()) {
            return (
                <>
                    <View style={{flex: 1, height: 30}} />
                    {this.renderMailboxes()}
                </>
            );
        }

        return <View style={{flex: 1, height: 60}} />;
    };

    renderItem = ({item, index, move, moveEnd, isActive}) => {
        const {canChange} = this.state;
        const {theme, navigation, route} = this.props;
        const Row = this.getComponent(item.type);

        if (Row) {
            const rest = {
                theme,
                navigation,
                route,
                index,
                canChange,
                disabled: Timeline.segmentDisabled(item),
                reloadTimeline: this.reloadTimeline,
                setLoading: this.setLoading,
            };

            if (['planStart', 'planEnd'].includes(item.type)) {
                rest.onLongPress = move;
                rest.onPressOut = moveEnd;
                rest.isActive = isActive;
            }

            if (item.type === 'planStart') {
                rest.navigation = navigation;
            }

            return <Row {...item} {...rest} />;
        }

        return null;
    };

    renderEmpty() {
        const hasPastTravel = this.hasPastTravel();

        return (
            <>
                <TimelineEmptyList hasPastTravel={hasPastTravel} />
                {this.showMailboxes() && (
                    <>
                        <View style={{height: 30}} />
                        {this.renderMailboxes()}
                    </>
                )}
            </>
        );
    }

    renderMailboxes() {
        const {travelers} = this.state;
        const owners = [];
        const owner = travelers.find(this.filterCurrentTraveler);

        if (_.isObject(owner)) {
            const {userAgentId} = owner;

            owners.push({value: userAgentId});
        }

        return <TimelineMailboxes owners={owners} source='timeline_offer' reload={this.onRefresh} />;
    }

    renderList() {
        const items = this.getDisplayItems();

        return (
            <RefreshableDraggableFlatList
                ref={this._scrollView}
                style={[styles.page, this.isDark && styles.pageDark]}
                data={items}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListEmptyComponent={this.renderEmpty}
                ListHeaderComponent={this.renderHeader}
                ListFooterComponent={_.isEmpty(items) === false && this.renderFooter}
                scrollPercent={5}
                scrollSpeed={15}
                onMoveBegin={this.onMoveBegin}
                onMoveEnd={this.onMoveEnd}
                shouldChangeOrder={this.shouldChangeOrder}
                onRefresh={this.onRefresh}
                lastSyncDate={Session.getProperty('timestamp')}
                contentInsetAdjustmentBehavior='automatic'
                contentContainerStyle={{minHeight: '100%'}}
                activeScale={1.02}
                keyboardShouldPersistTaps='handled'
                getItemLayout={isIOS ? this.getItemLayout : undefined}
            />
        );
    }

    keyExtractor = (item) => {
        if (_.isString(item.id) === false) {
            if (['planStart', 'planEnd'].includes(item.type)) {
                return `${item.type}.${item.planId}`;
            }
        }

        return item.id;
    };

    render() {
        const {travelers} = this.state;

        return (
            <>
                {this.renderList()}
                {_.isArray(travelers) && (
                    <Picker
                        ref={this._travelerPicker}
                        value={travelers.findIndex(this.filterCurrentTraveler)}
                        title={Translator.trans(/** @Desc("Select traveler") */ 'select-traveler', {}, 'mobile-native')}
                        items={travelers.map(this.formatTravelerName)}
                        onValueChange={this.changeTraveler}
                        cancelButton={Translator.trans('alerts.btn.cancel')}
                        confirmButton={Translator.trans('card-pictures.label.confirm')}
                    />
                )}
            </>
        );
    }
}

export {Timeline};
export const TimelineScreen: TripsStackScreenFunctionalComponent<'Timeline'> = ({navigation, route}) => {
    const {params} = route;
    const theme = useTheme();
    const loading = params?.loading;
    const chooseTraveler = params?.chooseTraveler;
    const showDeleted = params?.showDeleted;
    const toggleDeleted = params?.toggleDeleted;
    const dropdownRef = useRef(null);
    const showPopover = useCallback(() => {
        let menus = [
            {
                menus: [
                    {
                        label: Translator.trans('show.deleted.segments'),
                        // icon: null,
                        key: 'toggle-deleted',
                    },
                ],
            },
        ];

        if (showDeleted) {
            menus = [
                {
                    menus: [
                        {
                            label: Translator.trans('hide.deleted.segments'),
                            key: 'toggle-deleted',
                        },
                    ],
                },
            ];
        }

        let menuWidth = 250;

        if (LocaleManager.get() === 'ru') {
            menuWidth = 300;
        }

        Popover.show(dropdownRef.current, {
            menus,
            menuWidth,
            theme,
            onDone: toggleDeleted,
            iconMargin: 0,
            textMargin: 0,
        });
    }, [showDeleted, dropdownRef, toggleDeleted]);

    const headerTitle = useCallback(() => {
        const title = params?.title;
        const futureSegments = params?.futureSegments;

        if (loading) {
            return <Spinner />;
        }

        if (title) {
            return (
                <Title
                    onPress={chooseTraveler}
                    title={title}
                    amount={futureSegments}
                    amountColor={ThemeColors.light.green}
                    amountColorDark={ThemeColors.dark.green}
                />
            );
        }

        return null;
    }, [chooseTraveler, loading, params?.futureSegments, params?.title]);
    const headerLeft = useCallback(
        () => _.isFunction(chooseTraveler) && <HeaderButton iconName='menu-members' onPress={chooseTraveler} />,
        [chooseTraveler],
    );
    const headerRight = useCallback(() => {
        if (_.isFunction(toggleDeleted)) {
            const headerRight = <HeaderButton ref={dropdownRef} iconName={isIOS ? 'more' : 'android-more'} onPress={showPopover} />;

            if (!isIOS) {
                return (
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        {headerLeft()}
                        {headerRight}
                    </View>
                );
            }

            return headerRight;
        }

        return null;
    }, [headerLeft, toggleDeleted, dropdownRef, showPopover]);

    useEffect(() => {
        const {headerStyle} = getDefaultNavigationOptions(theme, ThemeColors.light.green);

        navigation.setOptions({
            header: () => (
                <Header headerStyle={headerStyle} headerTitle={headerTitle} headerLeft={isIOS ? headerLeft : undefined} headerRight={headerRight} />
            ),
        });
    }, [headerLeft, headerRight, headerTitle, navigation, theme]);

    const ref = React.useRef(null);

    useScrollToTop(
        React.useRef({
            scrollToTop: () => ref.current?.scrollToTop(),
        }),
    );

    return <Timeline theme={theme} navigation={navigation} route={route} ref={ref} />;
};

TimelineScreen.navigationOptions = ({route}) => ({
    title: '',
    header: () => <Header />,
    animation: route.params?.animation ?? 'default',
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});
