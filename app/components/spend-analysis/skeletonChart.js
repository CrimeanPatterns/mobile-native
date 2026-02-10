import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import {MileValueCardBarSkeleton} from '../mile-value/mileValueCardBar';
import Skeleton from '../page/skeleton';

const layoutTitle = {
    title: [{key: 'title', width: 200, height: 30}],
    subTitle: [{key: 'subText', width: 180, height: 30}],
};

const layoutCharts = [
    {
        earned: [{key: 'chartEarned', width: 100, height: 30, borderRadius: 0}],
        potential: [{key: 'chartPotential', width: 105, height: 30, borderRadius: 0}],
    },
    {
        earned: [{key: 'chartEarned', width: 180, height: 30, borderRadius: 0}],
        potential: [{key: 'chartPotential', width: 181, height: 30, borderRadius: 0}],
    },
    {
        earned: [{key: 'chartEarned', width: 130, height: 30, borderRadius: 0}],
        potential: [{key: 'chartPotential', width: 150, height: 30, borderRadius: 0}],
    },
    {
        earned: [{key: 'chartEarned', width: 240, height: 30, borderRadius: 0}],
        potential: [{key: 'chartPotential', width: 280, height: 30, borderRadius: 0}],
    },
];

const SpendAnalysisSkeletonChart = React.memo(() => {
    const isDark = useDark();

    const renderChart = useCallback(
        ({earned, potential}, index) => (
            <View key={index}>
                <View style={[styles.separator, isDark && styles.separatorDark]} />
                <View style={styles.containerChart}>
                    <Skeleton layout={earned} style={styles.chart} />
                    <Skeleton layout={potential} style={styles.chart} />
                </View>
            </View>
        ),
        [isDark],
    );

    return (
        <>
            <View style={[styles.containerTitle, isDark && styles.containerTitleDark]}>
                <Skeleton layout={layoutTitle.title} style={styles.title} />
                <Skeleton layout={layoutTitle.subTitle} style={styles.subTitle} />
            </View>
            <MileValueCardBarSkeleton />
            <View style={[styles.border, isDark && styles.borderDark]} />
            <View style={[styles.chartInfo, isDark && styles.containerDark]}>
                <View style={styles.chartInfoBlock}>
                    <View style={[styles.chartInfoIcon, isDark && styles.chartInfoIconDark]} />
                    <Text style={[styles.chartInfoText, isDark && styles.chartInfoTextDark]}>Points Earned</Text>
                </View>
                <View style={styles.chartInfoBlock}>
                    <View style={[styles.chartInfoIcon, isDark && styles.chartInfoIconDark]} />
                    <Text style={[styles.chartInfoText, isDark && styles.chartInfoTextDark]}>Earning Potential</Text>
                </View>
            </View>
            {layoutCharts.map(renderChart)}
        </>
    );
});

export default SpendAnalysisSkeletonChart;

export const styles = StyleSheet.create({
    containerTitle: {
        paddingHorizontal: 15,
        height: 140,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    containerTitleDark: {
        borderBottomColor: DarkColors.border,
    },
    title: {
        marginBottom: 15,
    },
    subTitle: {
        marginBottom: 5,
    },
    chartInfo: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        padding: 16,
    },
    chartInfoBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: 30,
    },
    chartInfoIcon: {
        width: 15,
        height: 15,
        backgroundColor: Colors.gray,
    },
    chartInfoIconDark: {
        backgroundColor: DarkColors.border,
    },
    chartInfoText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        marginLeft: 6,
        fontSize: isIOS ? 11 : 12,
    },
    chartInfoTextDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    containerChart: {
        paddingHorizontal: 15,
    },
    chart: {
        marginBottom: 5,
    },
    separator: {
        height: 30,
        backgroundColor: Colors.grayLight,
    },
    separatorDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    border: {
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    borderDark: {
        borderTopColor: DarkColors.border,
    },
});
