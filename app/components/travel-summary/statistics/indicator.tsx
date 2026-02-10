import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {Colors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import styles from './styles';

type IndicatorProps = {
    value: number;
    title: string;
    percentage: number;
    bgColor: string;
    previousValue?: number | string;
    icon?: string;
    hint?: string;
    color?: string;
    titleColor?: string;
    size?: number;
};

export type IIndicator = React.FunctionComponent<IndicatorProps>;

const Indicator: IIndicator = ({
    value,
    title,
    percentage,
    previousValue,
    icon,
    hint,
    color = Colors.white,
    bgColor,
    titleColor = Colors.white,
    size = 70,
}) => {
    const isDark = useDark();
    const sizeRing = size;
    const fontSize = 26;
    const percentageWidth = _.isNumber(percentage) ? size * (percentage.toString().length + 4) * 0.1 : size * 0.7;

    return (
        <View style={styles.statisticsElement}>
            <View style={[styles.ring, {minWidth: sizeRing, height: sizeRing, borderRadius: sizeRing, borderColor: color}]}>
                <Text style={[styles.value, {color, fontSize}, isDark && styles.valueDark]}>{value}</Text>
                {_.isString(hint) && !_.isNumber(percentage) && <Text style={[styles.hint, {color}]}>{hint}</Text>}
                {_.isNumber(percentage) && (
                    <View style={[styles.label, {backgroundColor: color, borderColor: bgColor, width: percentageWidth}]}>
                        <Text style={[styles.labelValue, {color: bgColor, fontSize: size * 0.2}]}>{`${percentage}%`}</Text>
                    </View>
                )}
                {(_.isString(icon) || _.isNil(previousValue) === false) && (
                    <View
                        style={[
                            styles.iconContainer,
                            {
                                borderColor: bgColor,
                                backgroundColor: bgColor,
                                minWidth: size * 0.5,
                                height: size * 0.5,
                                right: -10,
                                top: -11,
                                borderWidth: 3,
                                borderRadius: 16,
                            },
                        ]}>
                        {_.isString(icon) ? (
                            <Icon
                                name={icon}
                                size={size * 0.34}
                                color={color}
                                style={{
                                    lineHeight: fontSize,
                                }}
                            />
                        ) : (
                            <View
                                style={[
                                    styles.changesContainer,
                                    {backgroundColor: color, minWidth: size * 0.34, height: size * 0.34, borderRadius: (size * 0.34) / 2},
                                ]}>
                                <Text style={[styles.changes, {color: bgColor, fontSize: size * 0.17}]}>{previousValue}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
            <Text style={[styles.title, titleColor && {color: titleColor, fontSize: size * 0.2}, isDark && styles.titleDark]}>{title}</Text>
        </View>
    );
};

export default Indicator;
