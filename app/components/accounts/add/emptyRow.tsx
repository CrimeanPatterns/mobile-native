import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import ProviderIcons from '../../../config/providerIcons';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, IconColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles, {activeBackgroundColor, activeBackgroundColorDark, rippleColor, rippleColorDark} from './styles';

type EmptyRowProps = {
    item: {
        KindID: string | number;
        Name: string;
        Notice?: string;
    };
    style?: any;
    onPress: ({kindId: string}) => void;
};

type IEmptyRow = React.FunctionComponent<EmptyRowProps>;

const EmptyRow: IEmptyRow = ({item, style, onPress}) => {
    const isDark = useDark();

    return (
        <TouchableBackground
            style={[styles.container, isDark && styles.containerDark, style]}
            rippleColor={isDark ? rippleColorDark : rippleColor}
            activeBackgroundColor={isDark ? activeBackgroundColorDark : activeBackgroundColor}
            onPress={onPress}>
            <View style={styles.containerIcon}>
                <Icon {...ProviderIcons[item.KindID]} color={isDark ? Colors.white : IconColors.gray} />
            </View>
            <View style={[styles.containerTitle, isDark && styles.containerDark]}>
                <Text style={[styles.text, isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                    {item.Name}
                </Text>
                {_.isString(item.Notice) && _.isEmpty(item.Notice) === false && (
                    <Text style={[styles.textGray, isDark && styles.textGrayDark]}>{`(${item.Notice})`}</Text>
                )}
            </View>
            {isIOS && <Icon name='arrow' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={20} />}
        </TouchableBackground>
    );
};

export default EmptyRow;
