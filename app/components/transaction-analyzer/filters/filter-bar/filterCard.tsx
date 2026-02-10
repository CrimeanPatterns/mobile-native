import React, {useCallback} from 'react';
import {injectIntl} from 'react-intl';
import {Text} from 'react-native';

import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {Card} from '../../../page/cardBar';
import styles from './styles';

type TransactionAnalyzerCardProps = {
    title: string;
    value: string;
    index: number;
    onPress: (index: number) => void;
    isActive: boolean;
    isChanged: boolean;
};

type ITransactionAnalyzerCard = React.FunctionComponent<TransactionAnalyzerCardProps>;

const TransactionAnalyzerCard: ITransactionAnalyzerCard = ({title, value, index, onPress, isActive, isChanged}) => {
    const isDark = useDark();
    const androidColor = isDark ? DarkColors.chetwodeBlue : Colors.chetwodeBlue;

    const onPressCard = useCallback(() => {
        onPress(index);
    }, [onPress, index]);

    return (
        <Card onPress={onPressCard} disabled={isActive} isActive={isActive} rippleColor={androidColor} activeColor={androidColor}>
            <Text style={[styles.title, isDark && styles.titleDark, isActive && styles.textActive, isActive && isDark && styles.textActiveDark]}>
                {title}
            </Text>
            <Text
                numberOfLines={2}
                style={[
                    styles.filterValue,
                    isDark && styles.filterValueDark,
                    isActive && isChanged && styles.textActiveChanged,
                    isChanged && styles.textChanged,
                    isChanged && isDark && styles.textChangedDark,
                    isActive && styles.textActive,
                    isActive && isDark && styles.textActiveDark,
                ]}>
                {value}
            </Text>
        </Card>
    );
};

const dateFormat = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
};

type DateRangeProps = {
    value: {
        start_date: string;
        end_date: string;
        range?: number;
    };
    filtersValue: {
        default: number;
        name: string;
        ranges: {
            title: string;
            value: number;
        }[];
    };
} & TransactionAnalyzerCardProps;

type IDateRange = React.FunctionComponent<DateRangeProps>;

const DateRange: IDateRange = injectIntl(({intl, value, filtersValue, title, index, onPress, isActive}) => {
    let formattedValue;

    if (value?.start_date && value?.end_date) {
        const startDate = intl.formatDate(new Date(value.start_date), dateFormat);
        const endDate = intl.formatDate(new Date(value.end_date), dateFormat);

        formattedValue = `${startDate} - ${endDate}`;
    } else {
        const range = filtersValue.ranges.find((item) => item.value === value.range);

        formattedValue = range.title;
    }

    return (
        <TransactionAnalyzerCard
            value={formattedValue}
            isChanged={value.range !== filtersValue.default}
            title={title}
            index={index}
            onPress={onPress}
            isActive={isActive}
        />
    );
});

export default TransactionAnalyzerCard;
export {DateRange};
