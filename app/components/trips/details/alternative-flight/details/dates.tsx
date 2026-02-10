import React, {useCallback} from 'react';
import {Text, View} from 'react-native';

import {Colors, DarkColors} from '../../../../../styles';
import {useDark} from '../../../../../theme';
import Icon from '../../../../icon';
import {DatesVal} from '../types';
import styles from './styles';

type IDates = React.FunctionComponent<{
    name: string;
    weekDay: string;
    val: DatesVal;
}>;

const Dates: IDates = ({name, weekDay, val}) => {
    const isDark = useDark();

    const renderCode = useCallback(
        ({code, time}) => (
            <View style={[styles.codeTime, isDark && styles.codeTimeDark]}>
                <View style={[styles.code, isDark && styles.codeDark]}>
                    <Text style={[styles.text, styles.textLarge, styles.textDark]}>{code}</Text>
                </View>
                <View style={styles.time}>
                    <Text style={[styles.text, styles.textSmall, styles.textBlue, isDark && styles.textBlueDark]}>{time}</Text>
                </View>
            </View>
        ),
        [isDark],
    );

    return (
        <View style={[styles.container, styles.borderTop, isDark && [styles.containerDark, styles.borderTopDark]]}>
            <View>
                <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
                <Text style={[styles.text, styles.textSmall, isDark && styles.textDark]}>{weekDay}</Text>
            </View>
            <View style={styles.row}>
                {renderCode(val.from)}
                <Icon name='arrow' color={Colors.grayDarkLight} colorDark={DarkColors.border} size={24} />
                {renderCode(val.to)}
            </View>
        </View>
    );
};

export default Dates;
