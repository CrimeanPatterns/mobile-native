import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import Popover from '../../../helpers/popover';
import {getTouchableComponent} from '../../../helpers/touchable';
import {TripSegmentDetails} from '../../../screens/trips/segment/details';
import TimelineService from '../../../services/timeline';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {withTheme} from '../../../theme';
import Icon from '../../icon';
import Icons from '../icons';
import Row from './row';
import styles from './style';

const TouchableItem = getTouchableComponent(TouchableWithoutFeedback);

class ListView extends PureComponent {
    static propTypes = {
        kind: PropTypes.string,
    };

    static components = {
        layover: require('../list-view/layover').default,
        simple: require('../list-view/simple').default,
        tripChain: require('../list-view/tripChain').default,
        tripPoint: require('../list-view/tripPoint').default,
    };

    render() {
        const {kind, ...props} = this.props;
        const Component = ListView.components[kind];

        if (Component) {
            return <Component {...props} />;
        }

        return null;
    }
}

class Trip extends Row {
    static LAYOUT_HEIGHT = Platform.select({
        ios: 68,
        android: 68,
    });

    static propTypes = {
        blocks: PropTypes.array,
        breakAfter: PropTypes.bool,
        changed: PropTypes.bool,
        deleted: PropTypes.any,
        disabled: PropTypes.bool,
        endDate: PropTypes.object,
        icon: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        listView: PropTypes.object.isRequired,
        menu: PropTypes.any,
        navigation: PropTypes.any,
        startDate: PropTypes.object.isRequired,
        canChange: PropTypes.bool,
        createPlan: PropTypes.bool,
    };

    static getIconProps(icon) {
        if (icon.indexOf('aircraft') > -1) {
            return {
                name: icon.split(/\s/)[1].replace('icon-', '').toLowerCase(),
                type: 'aircraft',
                size: 24,
            };
        }

        return Icons[icon.split(/\s/)[0]];
    }

    static isChanged(val, old) {
        return val !== old;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const {menu = {}, deleted, canChange, createPlan} = nextProps;
        const menus = [];
        let dropdown;
        let subMenus;

        if (deleted) {
            if (canChange) {
                const restoreBtn = {
                    label: Translator.trans('form.button.restore', {}, 'messages'),
                    icon: 'footer-delete',
                    key: 'restore',
                };

                menus.push(restoreBtn);
            }
        } else {
            const {shareCode} = menu;
            const [groupBtn, shareBtn, deleteBtn] = [
                {
                    label: Translator.trans(/** @Desc("Group into a Trip") */ 'group.itinerarie', {}, 'mobile-native'),
                    icon: 'group',
                    key: 'group',
                },
                {
                    label: Translator.trans('trips.segment.share.btn'),
                    icon: Platform.select({ios: 'share', android: 'android-share'}),
                    key: 'share',
                },
                {
                    label: Translator.trans('button.delete'),
                    icon: 'footer-delete',
                    key: 'delete',
                },
            ];

            if (canChange && createPlan) {
                menus.push(groupBtn);
            }

            if (_.isString(shareCode)) {
                menus.push(shareBtn);
            }

            if (canChange) {
                if (isIOS) {
                    menus.push(deleteBtn);
                } else {
                    subMenus = {
                        menus: [deleteBtn],
                    };
                }
            }
        }

        if (_.isEmpty(menus) === false) {
            dropdown = [
                {
                    menus,
                },
            ];

            if (_.isObject(subMenus)) {
                dropdown.push(subMenus);
            }
        } else if (isAndroid) {
            if (_.isObject(subMenus)) {
                dropdown = [{...subMenus}];
            }
        }

        return {
            ...prevState,
            menu: dropdown,
        };
    }

    state = {
        pressed: false,
        menu: null,
    };

    constructor(props) {
        super(props);

        this.share = this.share.bind(this);
        this.groupPlan = this.groupPlan.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.deleteSegment = this.deleteSegment.bind(this);
        this.restoreSegment = this.restoreSegment.bind(this);

        this.onPress = this.onPress.bind(this);
        this.onMenuItemPress = this.onMenuItemPress.bind(this);

        this.menuFunctions = {
            restore: this.restoreSegment,
            delete: this.confirmDelete,
            share: this.share,
            group: this.groupPlan,
        };
    }

    onMenuItemPress(selectionIndex, groupIndex = 0) {
        const {menu} = this.state;

        Popover.onMenuItemPress(menu, selectionIndex, groupIndex, this.menuFunctions);
    }

    async setDeleted(deleted) {
        const {id, route} = this.props;
        const userAgentId = route.params?.userAgentId ?? 'my';

        this.setLoading(true);

        try {
            if (deleted) {
                await TimelineService.deleteSegment(id);
            } else {
                await TimelineService.restoreSegment(userAgentId, id);
            }
        } catch {
            this.setLoading(false);
        } finally {
            this.reloadTimeline();
        }
    }

    deleteSegment() {
        this.setDeleted(true);
    }

    restoreSegment() {
        this.setDeleted(false);
    }

    async confirmDelete() {
        await TripSegmentDetails.confirmDelete();
        this.deleteSegment();
    }

    share() {
        const {menu} = this.props;
        const {shareCode} = menu;

        TripSegmentDetails.share(shareCode);
    }

    async groupPlan() {
        const {route, startDate} = this.props;
        const userAgentId = route.params?.userAgentId ?? 'my';

        this.setLoading(true);

        try {
            await TimelineService.groupPlan(userAgentId, startDate.ts);
        } catch {
            this.setLoading(false);
        } finally {
            this.reloadTimeline();
        }
    }

    openLoungeList = () => {
        const {id, listView, navigation} = this.props;
        const {arrTerminal, depTerminal} = listView;

        navigation.navigate('Trip', {
            screen: 'TimelineLoungeList',
            params: {segmentId: id, arrTerminal, depTerminal},
        });
    };

    onPress() {
        const {id, blocks, menu, navigation, route, reloadTimeline, listView} = this.props;
        const userAgentId = route.params?.userAgentId;

        if (listView.kind === 'layover') {
            return this.openLoungeList();
        }

        return (
            blocks &&
            blocks.length > 0 &&
            navigation.navigate('Trip', {
                screen: 'TimelineSegmentDetails',
                params: {
                    id,
                    userAgentId,
                    shareCode: menu && menu.shareCode,
                    reload: reloadTimeline,
                },
            })
        );
    }

    onPressIn = () => {
        this.setState({pressed: true});
    };

    onPressOut = () => {
        this.setState({pressed: false});
    };

    showPopover = () => {
        const {menu} = this.state;
        const {theme} = this.props;
        const menuWidth = 200;

        // if (LocaleManager.get() === 'ru') {
        //     menuWidth = 200;
        // }

        Popover.show(this.dropdownRef, {
            menus: menu,
            onDone: this.onMenuItemPress,
            menuWidth,
            theme,
        });
    };

    getAccessibilityLabel = (listView) => {
        if (listView.kind === 'tripChain') {
            return `${listView.dep} ${listView.arr}`;
        }

        const label = [];

        if (_.isString(listView.title)) {
            label.push(listView.title);
        }

        label.push(listView.val);

        return label.join(' ');
    };

    renderOverlay = () => {
        const {disabled} = this.props;

        return disabled === true && <View style={[styles.overlay, this.isDark && styles.overlayDark]} />;
    };

    renderIconMore = () =>
        Platform.select({
            ios: <Icon name='more' color={this.selectColor(IconColors.gray, Colors.white)} size={24} />,
            android: <Icon name='android-more' color={this.selectColor(Colors.grayDarkLight, DarkColors.text)} size={24} />,
        });

    setDropdownRef = (ref) => {
        this.dropdownRef = ref;
    };

    render() {
        const {id, startDate = {fmt: {}}, icon, listView, changed, blocks, disabled, deleted, aiWarning} = this.props;
        const {pressed, menu} = this.state;

        const isTouchable = _.isEmpty(blocks) === false || _.isNumber(listView.lounges);

        const TouchableView = isTouchable ? TouchableItem : View;
        const colors = this.themeColors;
        const rowStyle = {height: Trip.LAYOUT_HEIGHT, maxHeight: Trip.LAYOUT_HEIGHT};

        return (
            <View
                style={[styles.segment, this.isDark && styles.segmentDark, rowStyle]}
                testID={`timeline-segment-${id}`}
                accessible
                accessibilityLabel={this.getAccessibilityLabel(listView)}>
                <View style={styles.segmentStatus}>
                    {changed && <Icon name='account-disabled' color={colors.orange} size={66} />}
                    {changed && this.renderOverlay()}
                </View>
                <View>
                    <View style={styles.time}>
                        <View style={styles.timeContainer}>
                            {_.isObject(startDate.old) && Trip.isChanged(startDate.fmt.t, startDate.old.fmt.t) && (
                                <Text style={[styles.timeTextThrough, this.isDark && styles.textDark]} allowFontScaling={false}>
                                    {[startDate.old.fmt.t, startDate.old.fmt.p].join(' ')}
                                </Text>
                            )}
                            <Text
                                style={[styles.timeText, this.isDark && styles.textDark, _.isObject(startDate.old) && {color: colors.red}]}
                                allowFontScaling={false}>
                                {[startDate.fmt.t, startDate.fmt.p].join(' ')}
                            </Text>
                        </View>
                        <Text style={[styles.timeZone, this.isDark && styles.textDark]}>{startDate.fmt.tz}</Text>
                    </View>
                    {this.renderOverlay()}
                </View>
                <TouchableView delayPressIn={0} style={styles.flex1} onPress={this.onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
                    <View
                        style={[
                            styles.details,
                            this.isDark && styles.detailsDark,
                            pressed && styles.detailsPressed,
                            pressed && this.isDark && styles.detailsPressedDark,
                            disabled && styles.detailsDisabled,
                            pressed && this.isDark && disabled && styles.detailsDisabledPressedDark,
                            this.isDark && styles.detailsDisabledDark,
                            isTouchable && styles.detailsRight,
                        ]}
                        pointerEvents='box-only'>
                        <View style={styles.icon}>
                            <View style={styles.iconsegment}>
                                <Icon
                                    {...Trip.getIconProps(icon)}
                                    color={this.selectColor(IconColors.gray, isIOS ? Colors.white : DarkColors.text)}
                                />
                            </View>
                        </View>
                        <View style={[styles.flex1, !aiWarning && listView.kind !== 'layover' && {marginRight: isIOS ? 15 : 36}]}>
                            <ListView {...listView} />
                        </View>
                        {aiWarning && (
                            <View style={{marginRight: isIOS ? 20 : 30}}>
                                <Image source={require('@assets/images/ai_icon.png')} />
                            </View>
                        )}
                        {isTouchable && (
                            <View style={isIOS && {width: 33}}>
                                <Icon name='arrow' style={[styles.segmentArrow, this.isDark && styles.segmentArrowDark]} size={20} />
                            </View>
                        )}
                        {!isTouchable && <View style={isIOS && {width: 20}} />}
                        {disabled === true && this.renderOverlay()}
                    </View>
                </TouchableView>
                {deleted === true && (
                    <TouchableView
                        testID={`timeline-segment-${id}`}
                        style={{flex: 1, ...StyleSheet.absoluteFillObject}}
                        onPress={this.onPress}
                        onPressIn={this.onPressIn}
                        onPressOut={this.onPressOut}>
                        <View style={[rowStyle, styles.deleted, this.isDark && styles.deletedDark, disabled && {backgroundColor: 'transparent'}]}>
                            <View style={[styles.deletedSeparator, this.isDark && styles.deletedSeparatorDark]} />
                            <View style={[styles.deletedLabel, this.isDark && styles.deletedLabelDark]}>
                                <View style={[styles.deletedLabelWrap, this.isDark && styles.deletedLabelWrapDark]}>
                                    <Text style={[styles.deletedLabelText, this.isDark && styles.deletedLabelTextDark]}>
                                        {Translator.trans('segment.deleted', {}, 'messages').toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableView>
                )}
                {_.isArray(menu) && listView.kind !== 'layover' && (
                    <TouchableItem ref={this.setDropdownRef} onPress={this.showPopover}>
                        <View style={[styles.segmentMore, isTouchable && styles.segmentMoreRight]}>{this.renderIconMore()}</View>
                    </TouchableItem>
                )}
            </View>
        );
    }
}

export default withTheme(Trip);
export {ListView, Trip};
