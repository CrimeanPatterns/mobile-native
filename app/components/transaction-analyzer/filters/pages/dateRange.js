import DateTimePicker from '@react-native-community/datetimepicker';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback, useState} from 'react';
import {injectIntl} from 'react-intl';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {useDark, useTheme} from '../../../../theme';
import DateTime from '../../../form/field/date';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable/background';
import RadioButtonGroup from '../../radioButtonGroup';

const Calendar = React.memo(({label, value = new Date(), onChangeValue}) => {
    const isDark = useDark();
    const onChange = useCallback(
        (event, date) => {
            onChangeValue(date);
        },
        [onChangeValue],
    );

    return (
        <View style={styles.container}>
            <Text style={[styles.label, isDark && styles.labelDark]}>{label.toUpperCase()}</Text>
            <View style={[styles.value, isDark && styles.valueDark]}>
                <DateTimePicker value={value} display='inline' onChange={onChange} style={[styles.calendar, isDark && styles.calendarDark]} />
            </View>
        </View>
    );
});

Calendar.propTypes = {
    label: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    onChangeValue: PropTypes.func,
};

const DateRow = injectIntl(({intl, label, value, onChangeValue}) => {
    const [visiblePicker, setVisiblePicker] = useState(false);
    const isDark = useDark();
    const iconColor = isDark ? DarkColors.grayDarkLight : Colors.grayDarkLight;
    const touchableColor = isDark ? DarkColors.gray : Colors.gray;

    const normalizeDate = (date) => {
        if (_.isDate(date)) {
            return intl.formatDate(value, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
            });
        }

        return null;
    };

    const onChange = useCallback(
        (event, date) => {
            setVisiblePicker(!visiblePicker);
            if (_.isDate(date)) {
                onChangeValue(date);
            }
        },
        [onChangeValue, setVisiblePicker, visiblePicker],
    );

    return (
        <>
            <Text style={[styles.dateRowTitle, isDark && styles.dateRowTitleDark]}>{label.toUpperCase()}</Text>
            <TouchableBackground
                disabled={false}
                onPress={onChange}
                style={[styles.dateRow, isDark && styles.dateRowDark]}
                rippleColor={touchableColor}>
                <Text numberOfLines={1} ellipsizeMode='tail'>
                    {normalizeDate(value)}
                </Text>
                <Icon name='expiration-date' size={24} color={iconColor} />
            </TouchableBackground>
            {visiblePicker && <DateTimePicker value={value || new Date()} display='default' onChange={onChange} />}
        </>
    );
});

DateRow.propTypes = {
    label: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    onChangeValue: PropTypes.func,
};

const DateRange = React.memo(({filter, filtersData, onChangeValue}) => {
    const theme = useTheme();
    const isDark = useDark();
    const [currentValue, setCurrentValue] = useState(filtersData);
    const {name, ranges} = filter;

    const onPressRadioButton = useCallback(
        (range) => {
            setCurrentValue({range});
            onChangeValue({name, value: {range}});
        },
        [setCurrentValue, onChangeValue, name],
    );

    const onPressFromDate = useCallback(
        (value) => {
            if (_.isString(value)) {
                setCurrentValue({end_date: currentValue.end_date, start_date: value});
                if (_.isString(currentValue.end_date)) {
                    onChangeValue({name, value: {end_date: currentValue.end_date, start_date: value}});
                }
            }
        },
        [setCurrentValue, onChangeValue, currentValue, name],
    );

    const onPressToDate = useCallback(
        (value) => {
            if (_.isString(value)) {
                setCurrentValue({start_date: currentValue.start_date, end_date: value});
                if (_.isString(currentValue.start_date)) {
                    onChangeValue({name, value: {start_date: currentValue.start_date, end_date: value}});
                }
            }
        },
        [setCurrentValue, onChangeValue, currentValue, name],
    );

    return (
        <ScrollView contentInsetAdjustmentBehavior='automatic'>
            <View style={[styles.radioButton, isDark && styles.radioButtonDark]}>
                <RadioButtonGroup onChangeValue={onPressRadioButton} data={ranges} value={filtersData.range} />
            </View>
            <DateTime onChangeValue={onPressFromDate} value={currentValue.start_date} label='From Date:' theme={theme} />
            <DateTime onChangeValue={onPressToDate} value={currentValue.end_date} label='To Date:' theme={theme} />
        </ScrollView>
    );
});

DateRange.propTypes = {
    filter: PropTypes.object,
    filtersData: PropTypes.any,
    onChangeValue: PropTypes.func,
};

export default DateRange;

const styles = StyleSheet.create({
    radioButton: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        marginBottom: 15,
    },
    radioButtonDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
        borderBottomColor: DarkColors.border,
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
        color: Colors.white,
    },
    value: {
        marginTop: 5,
        borderColor: Colors.gray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    valueDark: {
        borderColor: DarkColors.border,
    },
    calendar: {
        backgroundColor: Colors.white,
        color: Colors.grayDark,
    },
    calendarDark: {
        backgroundColor: DarkColors.bg,
    },
    dateRow: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 48,
        marginTop: 5,
        paddingHorizontal: 16,
        paddingVertical: 13,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    dateRowDark: {
        backgroundColor: DarkColors.bgLight,
        borderColor: DarkColors.border,
    },
    dateRowTitle: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
        marginTop: 20,
        paddingHorizontal: 16,
    },
    dateRowTitleDark: {
        color: DarkColors.text,
    },
    dateRowView: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
    },
    dateRowViewDark: {
        color: Colors.grayDark,
    },
});
