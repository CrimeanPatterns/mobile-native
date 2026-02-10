import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import {useNavigationMainColor} from '../../theme/navigator';
import {AnimatedIcon} from '../icon';
import CrookedSeparator from '../page/crookedSeparator';
import Skeleton from '../page/skeleton';
import {ActionEdit, ActionPartialRemoval, ActionRemove} from '../page/swipeableList/actionButton';
import {AppleStyleSwipeableRow} from '../page/swipeableList/AppleStyleSwipeableRow';
import {TouchableBackground} from '../page/touchable/background';

const MileValueRow = React.memo(({data, index, onEdit, onDelete}) => {
    const isDark = useDark();
    const mainColor = useNavigationMainColor();

    const [hasSubRows, setHasSubRows] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [rotateAnimation] = useState(useSharedValue(0));
    const swipeableRef = useRef();

    const isFirst = index === 0;
    const {id, custom, name, value, flightClass, brands} = data;
    const canDelete = custom;
    const isPartialRemoval = _.isObject(value?.secondary);
    const maxSwipeDistance = canDelete || isPartialRemoval ? 140 : 70;

    const onPressEdit = useCallback(
        (close: () => void) => {
            onEdit({id, value: value.primary.raw, name});

            close?.();
        },
        [onEdit, id, name, value, swipeableRef],
    );

    const onPressDelete = useCallback(
        (close: () => void) => {
            onDelete({id});
            close?.();
        },
        [onDelete, id, swipeableRef],
    );

    const renderQuickActions = useCallback(
        (close) => (
            <View style={[styles.actionRow, isDark && styles.actionRowDark]}>
                <ActionEdit onPress={() => onPressEdit(close)} />
                {canDelete && <ActionRemove onPress={() => onPressDelete(close)} />}
                {isPartialRemoval && <ActionPartialRemoval onPress={() => onPressDelete(close)} />}
            </View>
        ),
        [canDelete, isPartialRemoval, onPressEdit, onPressDelete, isDark],
    );

    const open = useCallback(() => {
        rotateAnimation.value = withTiming(90, {duration: 200});
        setHasSubRows(true);
    }, [rotateAnimation, setHasSubRows]);

    const closed = useCallback(() => {
        rotateAnimation.value = withTiming(0, {duration: 200});
        setHasSubRows(false);
    }, [rotateAnimation, setHasSubRows]);

    const onPressIn = useCallback(() => {
        setIsPressed(true);
    }, [setIsPressed]);

    const onPressOut = useCallback(() => {
        setIsPressed(false);
    }, [setIsPressed]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{rotateZ: `${rotateAnimation.value}deg`}],
    }));

    const renderSubRow = useCallback(
        ({name, value}, index, rows) => {
            const visibleSeparator = index !== rows.length - 1;

            return (
                <View
                    key={`subRow-${index}`}
                    style={[
                        styles.subRow,
                        isDark && styles.subRowDark,
                        visibleSeparator && styles.separator,
                        isDark && visibleSeparator && styles.separatorDark,
                    ]}>
                    <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={2}>
                        {name}
                    </Text>
                    <Text style={[styles.textBold, isDark && styles.textDark]}>{value.primary.value}</Text>
                </View>
            );
        },
        [isDark],
    );

    const renderRow = useCallback(
        () => (
            <>
                <AppleStyleSwipeableRow renderQuickActions={renderQuickActions} maxSwipeDistance={maxSwipeDistance}>
                    <View style={[styles.row, styles.rowColor, isDark && styles.rowColorDark]}>
                        <Text style={[styles.name, isDark && styles.textDark]} numberOfLines={2}>
                            {name}
                        </Text>
                        <View style={styles.value}>
                            <Text style={[styles.textBold, isDark && styles.textDark]}>{value.primary.value}</Text>
                            {_.isObject(value?.secondary) && (
                                <Text style={[styles.textSmall, isDark && styles.textSmallDark]}>{value.secondary.value}</Text>
                            )}
                        </View>
                    </View>
                </AppleStyleSwipeableRow>
                {(_.isObject(flightClass?.economy) || _.isObject(flightClass?.business)) && (
                    <View style={[styles.detailsContainer, isDark && styles.detailsContainerDark]}>
                        <View style={styles.detailsTitles}>
                            {_.isObject(flightClass?.economy) && (
                                <Text style={[styles.text, isDark && styles.textDark]}>
                                    {`${Translator.trans('economy', {}, 'messages')} / ${Translator.trans('premium-economy', {}, 'messages')}`}
                                </Text>
                            )}
                            {_.isObject(flightClass?.business) && (
                                <Text style={[[styles.text, isDark && styles.textDark]]}>
                                    {`${Translator.trans('notification.devices.business', {}, 'messages')} / ${Translator.trans(
                                        'new_abrequest.cabin.first_class',
                                        {},
                                        'email',
                                    )}`}
                                </Text>
                            )}
                        </View>
                        <View style={styles.details}>
                            <View style={styles.detailsRow}>
                                {isFirst && (
                                    <Text style={[styles.textSmall, isDark && styles.textSmallDark]}>
                                        {`${Translator.trans('regional', {}, 'messages')}:*`}
                                    </Text>
                                )}
                                {_.isObject(flightClass?.economy) && (
                                    <Text style={[styles.text, isDark && styles.textDark]}>{flightClass.economy.regional}</Text>
                                )}
                                {_.isObject(flightClass?.business) && (
                                    <Text style={[styles.text, isDark && styles.textDark]}>{flightClass.business.regional}</Text>
                                )}
                            </View>
                            <View style={styles.detailsRow}>
                                {isFirst && (
                                    <Text style={[styles.textSmall, isDark && styles.textSmallDark]}>
                                        {`${Translator.trans('global', {}, 'messages')}:†`}
                                    </Text>
                                )}
                                {_.isObject(flightClass?.economy) && (
                                    <Text style={[styles.text, isDark && styles.textDark]}>{flightClass.economy.global}</Text>
                                )}
                                {_.isObject(flightClass?.business) && (
                                    <Text style={[styles.text, isDark && styles.textDark]}>{flightClass.business.global}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            </>
        ),
        [swipeableRef, name, value, flightClass, maxSwipeDistance, isFirst, renderQuickActions, isDark],
    );

    const renderTouchableRow = useCallback(() => {
        const arrowColorIOS = isDark ? Colors.white : Colors.grayDark;

        return (
            <>
                <AppleStyleSwipeableRow renderQuickActions={renderQuickActions} maxSwipeDistance={maxSwipeDistance}>
                    <TouchableBackground
                        onPress={hasSubRows ? closed : open}
                        activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                        rippleColor={isDark ? DarkColors.bgLight : Colors.gray}
                        style={[styles.rowColor, isDark && styles.rowColorDark]}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}>
                        <View style={[styles.row, styles.arrowCompensation]}>
                            <Text style={[styles.name, isDark && styles.textDark]} numberOfLines={2}>
                                {name}
                            </Text>
                            <View style={styles.value}>
                                <Text style={[styles.textBold, isDark && styles.textDark]}>{value.primary.value}</Text>
                                {_.isObject(value?.secondary) && (
                                    <Text style={[styles.textSmall, isDark && styles.textSmallDark]}>{value.secondary.value}</Text>
                                )}
                            </View>
                            <View style={styles.icon}>
                                <Animated.View style={animatedStyle}>
                                    <AnimatedIcon name='arrow' color={isIOS ? arrowColorIOS : mainColor} size={20} />
                                </Animated.View>
                            </View>
                        </View>
                    </TouchableBackground>
                </AppleStyleSwipeableRow>
                {hasSubRows && (
                    <View>
                        <CrookedSeparator isPressed={isPressed} />
                        {brands.map(renderSubRow)}
                    </View>
                )}
            </>
        );
    }, [
        isDark,
        renderQuickActions,
        maxSwipeDistance,
        hasSubRows,
        closed,
        open,
        onPressIn,
        onPressOut,
        name,
        value.primary.value,
        value.secondary,
        animatedStyle,
        mainColor,
        isPressed,
        brands,
        renderSubRow,
    ]);

    return _.isEmpty(brands) ? renderRow() : renderTouchableRow();
});

MileValueRow.propTypes = {
    data: PropTypes.object,
    index: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
};

MileValueRow.Title = React.memo(({title, color}) => {
    const isDark = useDark();

    return (
        <View style={[styles.header, isDark && styles.headerDark]}>
            <Text style={[styles.title, isDark && styles.titleDark, {color}]}>{title}</Text>
        </View>
    );
});

MileValueRow.Title.propTypes = {
    title: PropTypes.string,
};

const layoutRow = {
    name: [{key: 'name', width: 170, height: 20}],
    valuePrimary: [{key: 'valuePrimary', width: 70, height: 20}],
    valueSecondary: [{key: 'valueSecondary', width: 50, height: 16}],
    flightClass: [{key: 'flightClass', width: 50, height: 16}],
};

MileValueRow.Skeleton = React.memo(() => {
    const isDark = useDark();

    return (
        <>
            <View style={[styles.row, isDark && styles.rowDark]}>
                <Skeleton layout={layoutRow.name} />
                <View style={styles.value}>
                    <Skeleton layout={layoutRow.valuePrimary} />
                    <Skeleton layout={layoutRow.valueSecondary} style={styles.marginTop} />
                </View>
            </View>
            <View style={[styles.detailsContainer, isDark && styles.detailsContainerDark]}>
                <View style={styles.detailsTitles}>
                    <Text style={[styles.text, isDark && styles.textDark]}>
                        {`${Translator.trans('economy', {}, 'messages')} / ${Translator.trans('premium-economy', {}, 'messages')}`}
                    </Text>
                    <Text style={[[styles.text, isDark && styles.textDark]]}>
                        {`${Translator.trans('notification.devices.business', {}, 'messages')} / ${Translator.trans(
                            'new_abrequest.cabin.first_class',
                            {},
                            'email',
                        )}`}
                    </Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.detailsRow}>
                        <Skeleton layout={layoutRow.flightClass} style={styles.marginTop} />
                        <Skeleton layout={layoutRow.flightClass} style={styles.marginTop} />
                    </View>
                    <View style={styles.detailsRow}>
                        <Skeleton layout={layoutRow.flightClass} style={styles.marginTop} />
                        <Skeleton layout={layoutRow.flightClass} style={styles.marginTop} />
                    </View>
                </View>
            </View>
        </>
    );
});

const layoutTitle = {
    title: [{key: 'title', width: 150, height: 25}],
};

MileValueRow.SkeletonTitle = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.header, isDark && styles.headerDark]}>
            <Skeleton layout={layoutTitle.title} />
        </View>
    );
});

export default MileValueRow;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 15,
    },
    rowColor: {
        backgroundColor: Colors.white,
    },
    rowColorDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: Colors.grayLight,
    },
    detailsContainerDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    detailsTitles: {
        justifyContent: 'flex-end',
    },
    details: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    detailsRow: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        minWidth: 50,
        marginLeft: 10,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textSmall: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDarkLight,
    },
    textSmallDark: {
        fontSize: 12,
        color: Colors.grayDarkLight,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: 16,
        color: Colors.grayDark,
    },
    subRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 40,
        backgroundColor: Colors.grayLight,
    },
    subRowDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    name: {
        flex: 1,
        marginRight: 5,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: 16,
        color: Colors.grayDark,
    },
    nameDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    value: {
        alignItems: 'flex-end',
    },
    header: {
        paddingHorizontal: 15,
        paddingBottom: 10,
        paddingTop: 30,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    headerDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
        borderColor: DarkColors.border,
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: 25,
        color: isIOS ? Colors.blue : Colors.gold,
    },
    titleDark: {
        color: isIOS ? DarkColors.blue : DarkColors.gold,
    },
    icon: {
        marginLeft: 5,
    },
    insteadArrow: {
        marginRight: 25,
    },
    actionRow: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
    },
    actionRowDark: {
        backgroundColor: DarkColors.bg,
    },
    marginTop: {
        marginTop: 5,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    separatorDark: {
        borderColor: DarkColors.border,
    },
    arrowCompensation: {
        paddingRight: 12,
    },
});
