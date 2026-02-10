import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import React, {useEffect, useRef} from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {DateTitle} from '../../components/accounts/history';
import {prepareFields, prepareFieldsSubmit} from '../../components/form';
import Icon from '../../components/icon';
import MileValueCardBar from '../../components/mile-value/mileValueCardBar';
import {HeaderRightButton} from '../../components/page/header/button';
import RefreshableFlatList from '../../components/page/refreshableFlatList';
import SectionRow from '../../components/spend-analysis';
import SpendAnalysisChart from '../../components/spend-analysis/chart';
import SpendAnalysisSettings from '../../components/spend-analysis/settings';
import SpendAnalysisSkeletonChart from '../../components/spend-analysis/skeletonChart';
import SpendAnalysisSkeletonList from '../../components/spend-analysis/skeletonList';
import {isIOS} from '../../helpers/device';
import SpendAnalysisHttp from '../../services/http/spendAnalysis';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import BaseSpendAnalysis from './baseSpendAnalysis';
// eslint-disable-next-line import/no-named-as-default
import SpendAnalysisStub from './stub';
import {styles} from './styles';

class SpendAnalysis extends BaseSpendAnalysis {
    static ANALYTIC_TAG = 'spend-analysis&mid=mobile';

    static ANALYTICS_DATA = {source: SpendAnalysis.ANALYTIC_TAG};

    constructor(props) {
        super(props);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderListFooter = this.renderListFooter.bind(this);
        this.renderEmpty = this.renderEmpty.bind(this);
        this.getSpendAnalysis = this.getSpendAnalysis.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);

        this.state = {
            loading: true,
            rows: null,
            offerFilterIds: null,
            charts: null,
            form: null,
            title: null,
            subTitle: null,
            formData: null,
            notice: null,
            eligibleProviders: null,
            loadingTime: Date.now(),
            visibleSettings: false,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;
        this.cancelToken = axios.CancelToken.source();
        this.willFocusSubscription = navigation.addListener('focus', () => {
            this.setNavigationOptions();
            this.getSpendAnalysis();
        });
    }

    componentWillUnmount() {
        this.mounted = false;
        this.willFocusSubscription();
        this.cancelToken.cancel();
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    setNavigationOptions() {
        const {navigation, isFocused} = this.props;
        const {isStub} = this.state;

        if (!isFocused) {
            return;
        }

        if (!isStub) {
            navigation.getParent('Cards').setOptions({
                headerRight: () => <HeaderRightButton iconName={isIOS ? 'settings' : 'icon-android-settings'} onPress={this.toggleSettings} />,
            });
        } else {
            navigation.getParent('Cards').setOptions({
                headerRight: () => null,
            });
        }
    }

    async getSpendAnalysis() {
        const {formData} = this.state;

        this.cancelRequest();

        try {
            const response = await SpendAnalysisHttp.post(formData, {
                cancelToken: this.cancelToken.token,
            });
            const {data} = response;

            if (_.isObject(data)) {
                const {analysis, form, eligibleProviders, mileValue} = data;
                const rest = {};
                const isStub = !_.isObject(analysis);

                if (_.isObject(analysis)) {
                    const {charts, rows, offerFilterIds, title, subTitle, notice} = analysis;

                    this.safeSetState({
                        form,
                        charts,
                        rows,
                        offerFilterIds,
                        title,
                        subTitle,
                        notice,
                    });
                }

                if (!formData && _.isObject(form) && _.isArray(form.children)) {
                    const {fields} = prepareFields(_.cloneDeep(form.children));

                    rest.formData = prepareFieldsSubmit(fields);
                }

                this.safeSetState(
                    {
                        eligibleProviders,
                        mileValue,
                        loadingTime: Date.now(),
                        isStub,
                        ...rest,
                    },
                    this.setNavigationOptions,
                );
            }
        } finally {
            this.safeSetState({loading: false});
        }
    }

    cancelRequest() {
        this.cancelToken.cancel();
        this.cancelToken = axios.CancelToken.source();
    }

    toggleSettings() {
        const {visibleSettings} = this.state;

        this.safeSetState({visibleSettings: !visibleSettings});
    }

    saveSettings = (formData) => {
        this.safeSetState(
            {
                formData,
                visibleSettings: false,
            },
            this.getSpendAnalysis,
        );
    };

    renderHeader() {
        const {charts, title, subTitle, mileValue} = this.state;
        const {navigation} = this.props;

        return (
            <>
                {this.createHeader({title, subTitle})}
                {_.isArray(mileValue) && <MileValueCardBar data={mileValue} navigation={navigation} onRefresh={this.getSpendAnalysis} />}
                {_.isArray(mileValue) && this.renderSeparator()}
                {this.createHeaderCharts({charts})}
                {_.isString(title) && this.renderSeparator()}
            </>
        );
    }

    createHeaderCharts({charts}) {
        if (!_.isArray(charts) || _.isEmpty(charts)) {
            return null;
        }

        const labels = [];
        const pointsEarned = [];
        const earningPotential = [];

        charts.forEach((item) => {
            const {name, potentialValue, value, amount} = item;

            labels.push({name, amount});
            pointsEarned.push(parseInt(value, 10));
            earningPotential.push(parseInt(potentialValue, 10));
        });

        return (
            <>
                <View style={[styles.chartInfo, this.isDark && styles.containerDark]}>
                    <View style={styles.chartInfoBlock}>
                        <View style={[styles.chartInfoIcon, {backgroundColor: this.isDark ? DarkColors.blue : Colors.blue}]} />
                        <Text style={[styles.chartInfoText, this.isDark && styles.textDark]}>Points Earned</Text>
                    </View>
                    <View style={styles.chartInfoBlock}>
                        <View style={[styles.chartInfoIcon, {backgroundColor: this.isDark ? DarkColors.green : Colors.green}]} />
                        <Text style={[styles.chartInfoText, this.isDark && styles.textDark]}>Earning Potential</Text>
                    </View>
                </View>
                <SpendAnalysisChart labels={labels} pointsEarned={pointsEarned} earningPotential={earningPotential} />
            </>
        );
    }

    renderListFooter() {
        const {rows} = this.state;

        if (!_.isEmpty(rows)) {
            return this.renderFooter();
        }

        return null;
    }

    renderEmptyListFooter = () => <SafeAreaView>{this.renderFooter()}</SafeAreaView>;

    renderEmpty() {
        const {notice} = this.state;

        return (
            _.isString(notice) && (
                <View style={styles.noFound}>
                    <Icon name='warning' color={this.isDark ? DarkColors.orange : Colors.orange} style={styles.noFoundIcon} size={17} />
                    <View style={styles.noFoundWrap}>
                        <Text style={styles.noFoundText}>{notice}</Text>
                    </View>
                </View>
            )
        );
    }

    renderItem = ({item, index}) => {
        const {rows, formData = {}, offerFilterIds = []} = this.state;
        const {theme} = this.props;

        if (item.kind === 'row') {
            const hasArrow = rows[index - 1] && rows[index - 1].kind === 'date';

            return (
                <SectionRow
                    {...item}
                    formData={formData}
                    offerFilterIds={offerFilterIds}
                    index={index}
                    arrow={hasArrow}
                    extraData={SpendAnalysis.ANALYTICS_DATA}
                    key={this.keyExtractor(item, index)}
                    theme={theme}
                />
            );
        }

        return <DateTitle theme={theme} title={item.value} key={this.keyExtractor(item, index)} />;
    };

    renderList() {
        const {scrollRef} = this.props;
        const {rows, notice, loadingTime} = this.state;

        return (
            <>
                <RefreshableFlatList
                    ref={scrollRef}
                    windowSize={21}
                    maxToRenderPerBatch={10}
                    scrollEventThrottle={16}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    contentInsetAdjustmentBehavior='automatic'
                    data={rows}
                    ListHeaderComponent={this.renderHeader()}
                    ListEmptyComponent={this.renderEmpty}
                    ListFooterComponent={this.renderListFooter}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    lastSyncDate={loadingTime}
                    onRefresh={this.getSpendAnalysis}
                />
                {_.isString(notice) && _.isEmpty(rows) && this.renderEmptyListFooter()}
            </>
        );
    }

    renderSkeletonListHeader = () => <SpendAnalysisSkeletonChart />;

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    render() {
        const {loading, eligibleProviders, loadingTime, isStub, form, visibleSettings} = this.state;
        const {navigation} = this.props;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        if (loading) {
            return (
                <View style={containerStyle}>
                    <SpendAnalysisSkeletonList ListHeaderComponent={this.renderSkeletonListHeader} ListFooterComponent={this.renderSeparator} />
                </View>
            );
        }

        if (isStub) {
            return (
                <View style={containerStyle}>
                    <SpendAnalysisStub
                        navigation={navigation}
                        eligibleProviders={eligibleProviders}
                        onRefresh={this.getSpendAnalysis}
                        loadingTime={loadingTime}
                    />
                </View>
            );
        }

        return (
            <>
                <View style={containerStyle}>{this.renderList()}</View>
                {visibleSettings && <SpendAnalysisSettings form={form} onClose={this.toggleSettings} onApply={this.saveSettings} />}
            </>
        );
    }
}

export const SpendAnalysisScreen = ({route, navigation}) => {
    const theme = useTheme();
    const isFocused = useIsFocused();
    const scrollViewRef = useRef(null);

    useEffect(() => {
        let unsubscribe;

        if (isFocused) {
            navigation.getParent('Cards').setOptions({
                title: Translator.trans(/** @Desc("Spend Analysis") */ 'spend-analysis', {}, 'mobile-native'),
                // headerRight: () => <HeaderRightButton iconName={isIOS ? 'settings' : 'icon-android-settings'} onPress={_.noop} />,
            });

            unsubscribe = navigation.getParent('Main').addListener('tabPress', () => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToTop();
                }
            });
        }

        return unsubscribe;
    }, [isFocused, navigation]);

    return <SpendAnalysis theme={theme} navigation={navigation} route={route} isFocused={isFocused} scrollRef={scrollViewRef} />;
};
export {SpendAnalysis};
