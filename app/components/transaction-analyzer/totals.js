import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark, useTheme} from '../../theme';
import {getPalette} from '../accounts/history';
import Skeleton from '../page/skeleton';

const TransactionAnalyzerTotals = React.memo(({totals}) => {
    const isDark = useDark();
    const theme = useTheme();
    const {backgroundColor, valueColor} = getPalette(theme);

    if (!_.isObject(totals)) {
        return <TransactionAnalyzerTotals.Skeleton />;
    }

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.amount]}>
                <Text style={[styles.text, styles.largeText, styles.boldText, isDark && styles.textDark]}>Total</Text>
                <Text style={[styles.text, styles.largeText, styles.boldText, isDark && styles.textDark]}>{totals?.amount}</Text>
            </View>
            <View style={styles.containerTransactions}>
                <View style={styles.transactions}>
                    <View style={styles.row}>
                        <Text style={[styles.text, styles.boldText, isDark && styles.textDark]}>{totals?.transactions}</Text>
                        <Text style={[styles.text, isDark && styles.textDark, styles.marginText]}>Transactions</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.text, styles.boldText, isDark && styles.textDark]}>{totals?.average}</Text>
                        <Text style={[styles.text, isDark && styles.textDark, styles.marginText]}>Average</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    {_.isString(totals?.balanceValue) && _.isString(totals?.balanceMultiplier) && (
                        <View style={styles.flexEnd}>
                            <Text style={[styles.text, styles.largeText, styles.boldText, isDark && styles.textDark]}>{totals.balanceValue}</Text>
                            <View style={[styles.multiplier, isDark && styles.multiplierDark]}>
                                <Text numberOfLines={1} style={[styles.textMultiplier]}>
                                    {totals.balanceMultiplier}
                                </Text>
                            </View>
                        </View>
                    )}
                    {_.isString(totals?.potentialValue) && _.isString(totals?.potentialMultiplier) && (
                        <View style={styles.flexEnd}>
                            <Text style={[styles.text, styles.largeText, styles.boldText, isDark && styles.textDark]}>{totals.potentialValue}</Text>
                            <View
                                style={[
                                    styles.multiplier,
                                    isDark && styles.multiplierDark,
                                    _.isString(totals?.potentialColor) && {backgroundColor: backgroundColor[totals.potentialColor]},
                                ]}>
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styles.textMultiplier,
                                        _.isString(totals?.potentialColor) && {color: valueColor[totals?.potentialColor]},
                                    ]}>
                                    {totals.potentialMultiplier}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
});

TransactionAnalyzerTotals.propTypes = {
    totals: PropTypes.object,
};

const skeletonLayouts = {
    amount: [{key: 'amount', width: 100, height: 19}],
    transactions: [{key: 'transactions', width: 30, height: 16}],
    average: [{key: 'average', width: 50, height: 16}],
    balance: [{key: 'balance', width: 49, height: 19}],
    balanceMultiplier: [{key: 'balanceMultiplier', width: 75, height: 26, borderRadius: 0}],
    potential: [{key: 'potential', width: 51, height: 19}],
    potentialMultiplier: [{key: 'potentialMultiplier', width: 75, height: 26, borderRadius: 0}],
};

TransactionAnalyzerTotals.Skeleton = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.amount]}>
                <Text style={[styles.text, styles.largeText, styles.boldText, isDark && styles.textDark]}>Total</Text>
                <Skeleton layout={skeletonLayouts.amount} />
            </View>
            <View style={styles.containerTransactions}>
                <View style={styles.transactions}>
                    <View style={styles.row}>
                        <Skeleton layout={skeletonLayouts.transactions} />
                        <Text style={[styles.text, isDark && styles.textDark, styles.marginText]}>Transactions</Text>
                    </View>
                    <View style={styles.row}>
                        <Skeleton layout={skeletonLayouts.average} />
                        <Text style={[styles.text, isDark && styles.textDark, styles.marginText]}>Average</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.flexEnd}>
                        <Skeleton layout={skeletonLayouts.balance} />
                        <View style={styles.skeletonMultiplier}>
                            <Skeleton layout={skeletonLayouts.balanceMultiplier} />
                        </View>
                    </View>
                    <View style={styles.flexEnd}>
                        <Skeleton layout={skeletonLayouts.potential} />
                        <View style={styles.skeletonMultiplier}>
                            <Skeleton layout={skeletonLayouts.potentialMultiplier} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
});

export default TransactionAnalyzerTotals;

const styles = StyleSheet.create({
    container: {
        paddingTop: 5,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderColor: Colors.grayDarkLight,
        backgroundColor: isIOS ? Colors.grayLight : Colors.chetwodeBlue,
    },
    containerDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bg,
    },
    amount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    containerTransactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transactions: {
        justifyContent: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    flexEnd: {
        alignItems: 'flex-end',
    },
    multiplier: {
        width: isIOS ? 75 : 60,
        alignItems: 'center',
        paddingVertical: 4,
        marginLeft: 8,
        marginTop: 5,
        backgroundColor: isIOS ? Colors.grayDarkLight : Colors.grayDarkLight,
    },
    skeletonMultiplier: {
        marginLeft: 8,
        marginTop: 5,
    },
    multiplierDark: {
        backgroundColor: isIOS ? DarkColors.gray : DarkColors.bgLight,
    },
    textMultiplier: {
        fontSize: 12,
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
        color: Colors.white,
    },
    text: {
        color: isIOS ? Colors.grayDark : Colors.white,
        fontFamily: Fonts.regular,
        fontSize: 12,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    largeText: {
        fontSize: 15,
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
    greyText: {
        color: Colors.grayDarkLight,
    },
    greyTextDark: {
        color: DarkColors.gray,
    },
    marginText: {
        marginLeft: 5,
    },
});
