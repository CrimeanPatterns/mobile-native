import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {withNavigation} from '../../navigation/withNavigation';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark, useTheme} from '../../theme';
import {getPalette} from '../accounts/history';
import Icon from '../icon';
import Skeleton from '../page/skeleton';
import {TouchableBackground} from '../page/touchable/background';

const TransactionAnalyzerRow = React.memo(
    ({title, category, creditCard, value, earned, potential, navigation, uuid, extraData, offerFilterIds, headerColor}) => {
        const isDark = useDark();
        const theme = useTheme();
        const {backgroundColor, valueColor} = getPalette(theme);
        const isThumbsUp = _.isObject(potential) && potential.type === 'thumb_up';
        const isNegative = _.isUndefined(potential);

        const hasOffer = _.isString(uuid);
        const openOffer = useCallback(() => {
            navigation.navigate('AccountHistoryOffer', {
                uuid,
                extraData: {...extraData, offerFilterIds},
                headerColor: headerColor || Colors.blueDark,
            });
        }, [extraData, headerColor, offerFilterIds, uuid]);

        return (
            <TouchableBackground
                onPress={openOffer}
                disabled={isThumbsUp || !hasOffer}
                activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                rippleColor={isDark ? DarkColors.border : Colors.gray}
                style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.containerRow}>
                    <View style={[styles.row, styles.rowTitle]}>
                        <Text
                            style={[
                                styles.flex1,
                                styles.marginRight,
                                styles.text,
                                styles.textLarge,
                                styles.textBold,
                                isNegative && styles.negative,
                                isDark && styles.textDark,
                                isDark && isNegative && styles.negativeDark,
                            ]}
                            numberOfLines={2}>
                            {title}
                        </Text>
                        <Text
                            style={[
                                styles.text,
                                styles.title,
                                styles.textBold,
                                isNegative && styles.negative,
                                isDark && styles.textDark,
                                isDark && isNegative && styles.negativeDark,
                            ]}>
                            {value}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.flex1}>
                            <Text style={[styles.text, isDark && styles.textDark]}>{category}</Text>
                            <View style={styles.creditCard}>
                                <Text style={[styles.text, styles.textLarge, isDark && styles.textDark]}>{creditCard}</Text>
                            </View>
                        </View>
                        <View style={styles.flexRow}>
                            <View style={[styles.viewContainer]}>
                                <Text style={[styles.text, styles.textLight, isDark && styles.textDark]}>Earned:</Text>
                                <Text
                                    style={[
                                        styles.text,
                                        styles.textLarge,
                                        isNegative && styles.negative,
                                        isDark && styles.textDark,
                                        isDark && isNegative && styles.negativeDark,
                                    ]}>
                                    {earned.value}
                                </Text>
                                <Text
                                    style={[
                                        styles.text,
                                        isNegative && styles.negative,
                                        isDark && styles.textDark,
                                        isDark && isNegative && styles.negativeDark,
                                    ]}>
                                    {earned.pointsValue}
                                </Text>
                                {_.isString(earned.multiplier) && (
                                    <View style={[styles.multiplier, isDark && styles.multiplierDark]}>
                                        <Text style={[styles.text, styles.textBold, styles.textWhite]}>{earned.multiplier}</Text>
                                    </View>
                                )}
                            </View>
                            {_.isObject(potential) && potential.type === 'offer' && (
                                <View style={[styles.viewContainer]}>
                                    <Text style={[styles.text, styles.textLight, isDark && styles.textDark]}>Potential:</Text>
                                    <Text style={[styles.text, styles.textLarge, isDark && styles.textDark]}>{potential.value}</Text>
                                    <Text style={[styles.text, isDark && styles.textDark]}>{potential.pointsValue}</Text>
                                    <View style={[styles.multiplier, {backgroundColor: backgroundColor[potential.color]}]}>
                                        <Text style={[styles.text, styles.textBold, {color: valueColor[potential.color]}]}>
                                            {potential.multiplier}
                                        </Text>
                                    </View>
                                </View>
                            )}
                            {isThumbsUp && (
                                <View style={[styles.viewContainer]}>
                                    <Text style={[styles.text, styles.textLight, isDark && styles.textDark]}>Potential:</Text>
                                    <View style={styles.thumbsup}>
                                        <Icon
                                            name='thumbsup'
                                            size={24}
                                            color={isIOS ? Colors.grayDark : Colors.chetwodeBlue}
                                            colorDark={isIOS ? Colors.white : DarkColors.chetwodeBlue}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                {isIOS && hasOffer && (
                    <View style={styles.arrow}>
                        <Icon name='arrow' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={20} />
                    </View>
                )}
                {isIOS && !hasOffer && <View style={styles.plug} />}
            </TouchableBackground>
        );
    },
);

TransactionAnalyzerRow.propTypes = {
    title: PropTypes.string,
    category: PropTypes.string,
    creditCard: PropTypes.string,
    value: PropTypes.string,
    earned: PropTypes.object,
    potential: PropTypes.object,
    navigation: PropTypes.object,
    uuid: PropTypes.string,
    extraData: PropTypes.any,
    offerFilterIds: PropTypes.arrayOf(PropTypes.number),
    headerColor: PropTypes.string,
};

TransactionAnalyzerRow.Title = React.memo(({title, isFixed}) => {
    const isDark = useDark();

    return (
        <View style={[styles.containerTitle, isFixed && {backgroundColor: Colors.grayDarkLight}, isDark && styles.containerTitleDark]}>
            <Text style={[styles.text, styles.title, isDark && styles.textDark]}>{title}</Text>
        </View>
    );
});

TransactionAnalyzerRow.Title.propTypes = {
    title: PropTypes.string,
    isFixed: PropTypes.bool,
};

const layoutRow = {
    title: [{key: 'title', width: 180, height: 19}],
    value: [{key: 'value', width: 70, height: 19}],
    category: [{key: 'category', width: 80, height: 15}],
    creditCard: [{key: 'creditCard', width: 160, height: 40}],
    multiplier: [{key: 'row', width: 60, height: 26, borderRadius: 0}],
    earned: {
        value: [{key: 'earned-value', width: 40, height: 19}],
        pointsValue: [{key: 'earned-pointsValue', width: 30, height: 16}],
    },
    potential: {
        value: [{key: 'potential-value', width: 50, height: 19}],
        pointsValue: [{key: 'potential-pointsValue', width: 40, height: 16}],
    },
};

TransactionAnalyzerRow.Skeleton = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.containerRow}>
                <View style={[styles.row, styles.rowTitle]}>
                    <Skeleton layout={layoutRow.title} />
                    <Skeleton layout={layoutRow.value} />
                </View>
                <View style={styles.row}>
                    <View style={styles.flex1}>
                        <Skeleton layout={layoutRow.category} />
                        <View style={styles.creditCard}>
                            <Skeleton layout={layoutRow.creditCard} />
                        </View>
                    </View>
                    <View style={styles.flexRow}>
                        <View style={[styles.viewContainer]}>
                            <Text style={[styles.text, styles.textLight, isDark && styles.textDark]}>Earned:</Text>
                            <Skeleton layout={layoutRow.earned.value} />
                            <Skeleton layout={layoutRow.earned.pointsValue} style={styles.marginSkeleton} />
                            <Skeleton layout={layoutRow.multiplier} style={styles.marginSkeleton} />
                        </View>
                        <View style={[styles.viewContainer]}>
                            <Text style={[styles.text, styles.textLight, isDark && styles.textDark]}>Potential:</Text>
                            <Skeleton layout={layoutRow.potential.value} />
                            <Skeleton layout={layoutRow.potential.pointsValue} style={styles.marginSkeleton} />
                            <Skeleton layout={layoutRow.multiplier} style={styles.marginSkeleton} />
                        </View>
                    </View>
                </View>
            </View>
            <View style={{width: 15}} />
        </View>
    );
});

const layoutTitle = {
    title: [{key: 'date', width: 160, height: 22}],
};

TransactionAnalyzerRow.SkeletonTitle = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.containerTitle, isDark && styles.containerTitleDark]}>
            <Skeleton layout={layoutTitle.title} />
        </View>
    );
});

export default withNavigation(TransactionAnalyzerRow);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        paddingLeft: 15,
        paddingRight: isIOS ? 0 : 15,
    },
    containerDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    containerRow: {
        flex: 1,
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
    },
    flex1: {
        flex: 1,
    },
    viewContainer: {
        width: 60,
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    text: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textLight: {
        color: Colors.grayDarkLight,
    },
    textLarge: {
        fontSize: 15,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
    textWhite: {
        color: Colors.white,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    negative: {
        color: Colors.blue,
    },
    negativeDark: {
        color: DarkColors.blue,
    },
    multiplier: {
        alignItems: 'center',
        width: 60,
        paddingVertical: 4,
        marginTop: 4,
        backgroundColor: Colors.grayDarkLight,
    },
    marginSkeleton: {
        marginTop: 4,
    },
    multiplierDark: {
        backgroundColor: isIOS ? DarkColors.gray : DarkColors.bgLight,
    },
    rowTitle: {
        marginBottom: 5,
    },
    creditCard: {
        flex: 1,
        justifyContent: 'center',
    },
    thumbsup: {
        flex: 1,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerTitle: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.grayLight,
    },
    containerTitleDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bgLight,
    },
    title: {
        fontSize: 17,
    },
    arrow: {
        alignItems: 'flex-end',
        marginLeft: 5,
        marginRight: 8,
        marginBottom: 7,
    },
    plug: {
        width: 33,
    },
    marginRight: {
        marginRight: 10,
    },
});
