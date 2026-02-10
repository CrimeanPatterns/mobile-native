import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Platform, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {useDark} from '../../../../theme';
import RadioButton from '../../radioButton';

const AmountRow = React.memo(({label, value, onChangeValue, isActive}) => {
    const isDark = useDark();

    return (
        <View style={styles.container}>
            <Text style={[styles.label, isDark && styles.labelDark]}>{label.toUpperCase()}</Text>
            <View style={[styles.row, isDark && styles.rowDark]}>
                <View style={[styles.iconContainer, isDark && styles.iconContainerDark]}>
                    <Text
                        style={[styles.icon, isActive && styles.activeIcon, isDark && styles.iconDark, isDark && isActive && styles.activeIconDark]}>
                        $
                    </Text>
                </View>
                <TextInput value={value} style={[styles.input, isDark && styles.inputDark]} keyboardType='number-pad' onChangeText={onChangeValue} />
            </View>
        </View>
    );
});

AmountRow.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChangeValue: PropTypes.func,
    isActive: PropTypes.bool,
};

const validateValue = (value) => value.replace(/[^0-9.]/g, '');

const Amount = React.memo(({filter, filtersData, onChangeValue}) => {
    const isDark = useDark();
    const {name} = filter;
    const {exactly, greater, less} = filtersData || {exactly: null, greater: null, less: null};

    const onPressAny = useCallback(() => {
        onChangeValue({name, value: null});
    }, [name, onChangeValue]);

    const onChangeValueExactly = useCallback(
        (exactly) => {
            // eslint-disable-next-line no-param-reassign
            exactly = validateValue(exactly);
            onChangeValue({name, value: {exactly}});
        },
        [name, onChangeValue],
    );

    const onChangeValueGreater = useCallback(
        (greater) => {
            // eslint-disable-next-line no-param-reassign
            greater = validateValue(greater);
            onChangeValue({name, value: {greater}});
        },
        [name, onChangeValue],
    );

    const onChangeValueLess = useCallback(
        (less) => {
            // eslint-disable-next-line no-param-reassign
            less = validateValue(less);
            onChangeValue({name, value: {less}});
        },
        [name, onChangeValue],
    );

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
            <View style={[styles.radioButton, isDark && styles.radioButtonDark]}>
                <RadioButton
                    value={_.isNull(filtersData) || (_.isEmpty(exactly) && _.isEmpty(greater) && _.isEmpty(less))}
                    label='Any'
                    onChangeValue={onPressAny}
                />
            </View>
            <AmountRow label='Exact Amount:' value={exactly} onChangeValue={onChangeValueExactly} isActive={!_.isEmpty(exactly)} />
            <AmountRow label='Greater than:' value={greater} onChangeValue={onChangeValueGreater} isActive={!_.isEmpty(greater)} />
            <AmountRow label='Less than:' value={less} onChangeValue={onChangeValueLess} isActive={!_.isEmpty(less)} />
        </ScrollView>
    );
});

Amount.propTypes = {
    filter: PropTypes.object,
    filtersData: PropTypes.oneOfType([PropTypes.any, PropTypes.object]),
    onChangeValue: PropTypes.func,
};

export default Amount;

const styles = StyleSheet.create({
    radioButton: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    radioButtonDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    container: {
        marginTop: 25,
    },
    label: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 12,
        paddingHorizontal: 16,
    },
    labelDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    row: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginTop: 5,
        borderColor: Colors.gray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: Colors.white,
    },
    rowDark: {
        borderColor: DarkColors.border,
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: '100%',
        marginRight: 10,
        backgroundColor: isIOS ? Colors.grayLight : Colors.gray,
    },
    iconContainerDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.border,
    },
    icon: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: isIOS ? Colors.gray : Colors.grayDarkLight,
    },
    iconDark: {
        color: Colors.white,
    },
    activeIcon: {
        color: isIOS ? Colors.blue : Colors.chetwodeBlue,
    },
    activeIconDark: {
        color: isIOS ? DarkColors.blue : DarkColors.chetwodeBlue,
    },
    input: {
        flex: 1,
        height: '100%',
        paddingRight: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    inputDark: {
        color: Platform.select({
            ios: Colors.white,
            android: DarkColors.text,
        }),
    },
});
