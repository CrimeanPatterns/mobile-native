import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useEffect, useRef} from 'react';
import {Text, View} from 'react-native';

import {prepareFields, prepareFieldsSubmit} from '../../components/form';
import Icon from '../../components/icon';
import MileValueCardBar, {MileValueCardBarSkeleton} from '../../components/mile-value/mileValueCardBar';
import {RefreshableSectionList} from '../../components/page';
import {SkeletonCardBar} from '../../components/page/cardBar';
import SearchBar from '../../components/page/searchBar';
import SkeletonSectionList from '../../components/page/skeleton/skeletonSectionList';
import SpendAnalysisSettings from '../../components/spend-analysis/settings';
import TransactionAnalyzerFilterBar from '../../components/transaction-analyzer/filters/filter-bar';
import TransactionAnalyzerFilterModal from '../../components/transaction-analyzer/filters/modal';
import TransactionAnalyzerRow from '../../components/transaction-analyzer/row';
import TransactionAnalyzerTotals from '../../components/transaction-analyzer/totals';
import {isAndroid} from '../../helpers/device';
import API from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {ThemeColors, useTheme} from '../../theme';
import {SpendAnalysis} from '../spend-analysis';
import TransactionAnalyzerStub from './stub';
import styles from './styles';

class TransactionAnalyzer extends SpendAnalysis {
    static ANALYTICS_DATA = {source: 'transaction-analyzer&mid=mobile'};

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            isStub: true,
            visibleModalFilter: false,
            visibleModalSettings: false,
            search: null,
            form: null,
            formData: null,
            transactions: null,
            totals: null,
            nextPageToken: null,
            eligibleProviders: null,
            filters: null,
            filtersData: null,
            activeFilterIndex: 0,
            loadingTime: Date.now(),
            offerFilterIds: [],
        };

        this.cancelToken = axios.CancelToken.source();

        this.getTransactions = this.getTransactions.bind(this);
        this.getTotals = this.getTotals.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);

        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 300);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;
        this.willFocusSubscription = navigation.addListener('focus', () => {
            this.setNavigationOptions();
            this.getData();
        });
    }

    setNavigationOptions() {
        return super.setNavigationOptions();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.cancelToken = null;
        this.willFocusSubscription();
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    normalizeDate = (date) => _.isDate(date) && new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)).toISOString();

    getData = async (pageToken) => {
        if (this.cancelToken) {
            this.cancelToken.cancel();
            this.cancelToken = axios.CancelToken.source();
        }

        await this.getTransactions(pageToken);
        this.getTotals();
        this.getCategories();
    };

    async getTransactions(pageToken) {
        const {navigation} = this.props;
        const {transactions: prevTransactions, search, formData, filtersData} = this.state;
        let filters = filtersData;

        // eslint-disable-next-line camelcase
        if (_.isObject(filters) && _.isDate(filtersData?.date_range?.start_date) && _.isDate(filtersData?.date_range?.end_date)) {
            filters = {
                ...filtersData,
                date_range: {
                    start_date: this.normalizeDate(filtersData.date_range.start_date),
                    end_date: this.normalizeDate(filtersData.date_range.end_date),
                },
            };
        }

        try {
            const response = await API.post(
                `/transactions/data`,
                {
                    descriptionFilter: search,
                    filters,
                    form: formData,
                    nextPageToken: pageToken,
                },
                {
                    cancelToken: this.cancelToken.token,
                },
            );

            const {data} = response;

            if (_.isObject(data)) {
                const {form, filters, transactions, nextPageToken, eligibleProviders, offerFilterIds, mileValue} = data;
                const isStub = _.isArray(transactions) === false;
                const rest = {
                    offerFilterIds,
                    nextPageToken,
                };

                if (_.isObject(form)) {
                    rest.form = form;
                }

                if (_.isString(pageToken)) {
                    rest.transactions = [...prevTransactions, ...transactions];
                } else {
                    rest.transactions = transactions;
                }

                if (!formData && _.isObject(form) && _.isArray(form.children)) {
                    const {fields} = prepareFields(_.cloneDeep(form.children));

                    rest.formData = prepareFieldsSubmit(fields);
                }

                if (_.isObject(filtersData) === false && _.isArray(filters)) {
                    const filtersData = {};

                    filters.forEach(({name, default: _default}) => {
                        let filter = null;

                        if (name === 'date_range' && _.isNumber(_default)) {
                            filter = {range: _default};
                        }

                        filtersData[name] = filter;
                    });

                    rest.filters = filters;
                    rest.filtersData = filtersData;
                }

                this.safeSetState(
                    {
                        isStub,
                        eligibleProviders,
                        mileValue,
                        loadingTime: Date.now(),
                        ...rest,
                    },
                    this.setNavigationOptions,
                );
            }
        } finally {
            this.safeSetState({
                loading: false,
            });
        }
    }

    async getTotals() {
        const {search, formData, filtersData} = this.state;

        if (_.isNull(formData)) {
            return;
        }

        const response = await API.post(
            `/transactions/totals`,
            {
                descriptionFilter: search,
                filters: filtersData,
                form: formData,
            },
            {
                cancelToken: this.cancelToken.token,
            },
        );
        const {data} = response;

        if (_.isObject(data)) {
            const {totals} = data;

            this.safeSetState({
                totals,
            });
        }
    }

    async getCategories() {
        const {formData, filters} = this.state;

        if (_.isNull(formData)) {
            return;
        }

        const response = await API.post(
            `/transactions/categories`,
            {
                form: formData,
            },
            {
                cancelToken: this.cancelToken.token,
            },
        );
        const {data} = response;

        if (_.isObject(data)) {
            const {categories} = data;

            this.safeSetState({
                filters: filters.map((filter) => {
                    if (filter.type === 'category') {
                        return {...filter, choices: categories};
                    }

                    return filter;
                }),
            });
        }
    }

    onEndReached = _.debounce(() => {
        const {nextPageToken} = this.state;

        if (_.isString(nextPageToken)) {
            this.getData(nextPageToken);
        }
    }, 500);

    onSearchInput = (search) => {
        this.safeSetState({search}, this.search);
    };

    search() {
        this.safeSetState({totals: null});
        this.getData();
    }

    toggleFilter(activeFilterIndex) {
        const {visibleModalFilter} = this.state;

        this.safeSetState({visibleModalFilter: !visibleModalFilter, activeFilterIndex});
    }

    saveFilter = (filtersData) => {
        this.safeSetState(
            {
                filtersData,
                loading: true,
                visibleModalFilter: false,
            },
            this.getData,
        );
    };

    toggleSettings() {
        const {visibleModalSettings} = this.state;

        this.safeSetState({visibleModalSettings: !visibleModalSettings});
    }

    saveSettings = (formData) => {
        this.safeSetState(
            {
                formData,
                loading: true,
                visibleModalSettings: false,
            },
            this.getData,
        );
    };

    renderListEmpty = () => {
        const colors = this.themeColors;

        return (
            <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                <Icon name='warning' color={colors.orange} size={24} />
                <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>
                    {Translator.trans('account.history.not-exist', {}, 'messages')}
                </Text>
            </View>
        );
    };

    renderListHeader = () => {
        const {search, filters, mileValue, filtersData} = this.state;
        const {theme, mainColor, navigation} = this.props;

        let tintColor = ThemeColors[theme].blue;

        if (isAndroid) {
            tintColor = this.isDark ? DarkColors.chetwodeBlue : Colors.chetwodeBlue;
        }

        return (
            <>
                <TransactionAnalyzerFilterBar filters={filters} filtersData={filtersData} setActivePage={this.toggleFilter} />
                {this.renderSeparator()}
                <SearchBar
                    tintColor={tintColor}
                    placeholder='Find Transactions'
                    value={search}
                    onChangeText={this.onSearchInput}
                    styles={[!_.isArray(mileValue) && styles.searchBar]}
                />
                {_.isArray(mileValue) && <MileValueCardBar data={mileValue} navigation={navigation} onRefresh={this.getData} />}
            </>
        );
    };

    renderSectionHeader = ({section}) => {
        const {title} = section;

        return <TransactionAnalyzerRow.Title title={title} />;
    };

    renderSkeletonListHeader = () => (
        <>
            <SkeletonCardBar />
            {this.renderSeparator()}
            <SearchBar placeholder='Find Transactions' onChangeText={_.noop} editable={false} />
            <MileValueCardBarSkeleton />
        </>
    );

    renderItem = ({item, index}) => {
        const {transactions, formData, offerFilterIds} = this.state;
        const hasArrow = transactions[index - 1] && transactions[index - 1].kind === 'date';

        return (
            <TransactionAnalyzerRow
                {...item}
                data={item}
                formData={formData}
                offerFilterIds={offerFilterIds}
                arrow={hasArrow}
                extraData={TransactionAnalyzer.ANALYTICS_DATA}
            />
        );
    };

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    renderList = () => {
        const {scrollRef} = this.props;
        const {transactions, totals, loadingTime} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <RefreshableSectionList
                    ref={scrollRef}
                    sections={transactions}
                    renderItem={this.renderItem}
                    ListHeaderComponent={this.renderListHeader()}
                    ListFooterComponent={this.renderSeparator}
                    renderSectionHeader={this.renderSectionHeader}
                    ListEmptyComponent={this.renderListEmpty}
                    ItemSeparatorComponent={this.renderSeparator}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.getData}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10}
                    lastSyncDate={loadingTime}
                    keyboardDismissMode='on-drag'
                />
                {!_.isEmpty(transactions) && <TransactionAnalyzerTotals totals={totals} />}
            </View>
        );
    };

    render() {
        const {
            loading,
            isStub,
            loadingTime,
            eligibleProviders,
            visibleModalSettings,
            visibleModalFilter,
            filters,
            filtersData,
            activeFilterIndex,
            form,
        } = this.state;
        const {navigation} = this.props;

        if (loading) {
            return (
                <View style={[styles.page, this.isDark && styles.pageDark]}>
                    <SkeletonSectionList
                        sections={4}
                        length={2}
                        ListHeaderComponent={this.renderSkeletonListHeader}
                        renderSectionHeader={() => <TransactionAnalyzerRow.SkeletonTitle />}>
                        <TransactionAnalyzerRow.Skeleton />
                    </SkeletonSectionList>
                    <TransactionAnalyzerTotals.Skeleton />
                </View>
            );
        }

        if (isStub) {
            return (
                <TransactionAnalyzerStub
                    navigation={navigation}
                    loadingTime={loadingTime}
                    eligibleProviders={eligibleProviders}
                    onRefresh={this.getData}
                />
            );
        }

        return (
            <>
                {this.renderList()}
                {visibleModalFilter && (
                    <TransactionAnalyzerFilterModal
                        onClose={this.toggleFilter}
                        onApply={this.saveFilter}
                        filters={filters}
                        filtersData={filtersData}
                        activeFilter={activeFilterIndex}
                    />
                )}
                {visibleModalSettings && <SpendAnalysisSettings form={form} onClose={this.toggleSettings} onApply={this.saveSettings} />}
            </>
        );
    }
}

export const TransactionAnalyzerScreen = ({route, navigation}) => {
    const theme = useTheme();
    const isFocused = useIsFocused();
    const scrollViewRef = useRef(null);

    useEffect(() => {
        let unsubscribe;

        if (isFocused) {
            navigation.getParent('Cards').setOptions({
                title: Translator.trans('transaction-analyzer', {}, 'messages'),
                // headerRight: () => <HeaderRightButton iconName={isIOS ? 'settings' : 'icon-android-settings'} onPress={_.noop} />,
            });

            unsubscribe = navigation.getParent('Main').addListener('tabPress', () => {
                scrollViewRef.current?.scrollToOffset({animated: true, offset: 0});
            });
        }

        return unsubscribe;
    }, [isFocused, navigation]);

    return <TransactionAnalyzer theme={theme} route={route} navigation={navigation} isFocused={isFocused} scrollRef={scrollViewRef} />;
};
