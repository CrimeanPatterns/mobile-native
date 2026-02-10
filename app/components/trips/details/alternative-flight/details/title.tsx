import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {isAndroid, isIOS} from '../../../../../helpers/device';
import {Colors, DarkColors} from '../../../../../styles';
import {useDark} from '../../../../../theme';
import Icon from '../../../../icon';
import {TouchableBackground} from '../../../../page/touchable/background';
import styles from './styles';

type Badge = {
    text: string;
    color?: string;
};

type TitleProps = {
    type: string;
    name: string;
    value?: string;
    checkbox: boolean;
    onPress: () => void;
};

type ITitle = React.FunctionComponent<TitleProps>;

const Title: ITitle = ({type, name, value, checkbox, onPress}) => {
    const isDark = useDark();
    const badges = useMemo(
        () => ({
            cheapest: {
                text: Translator.trans('cheapest', {}, 'trips'),
                color: isDark ? DarkColors.green : Colors.green,
            },
            exactMatch: {
                text: Translator.trans('your-award-flight', {}, 'trips'),
            },
        }),
        [isDark],
    );

    const badge: Badge = useMemo(() => badges[type], [badges, type]);

    return (
        <TouchableBackground
            onPress={onPress}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={[styles.containerTitle, isDark && styles.containerDark]}>
            <View style={styles.row}>
                {isIOS && (
                    <View style={[styles.checkbox, {width: 24}]}>
                        {!checkbox && (
                            <Icon
                                name='photo-check-blank-path1'
                                style={{position: 'absolute'}}
                                color={isDark ? DarkColors.border : Colors.grayDark}
                                size={24}
                            />
                        )}
                        <Icon name='photo-check-blank-path2' color={Colors.white} size={24} />
                        {checkbox && (
                            <Icon name='photo-check' style={{position: 'absolute'}} color={Colors.blue} colorDark={DarkColors.blue} size={24} />
                        )}
                    </View>
                )}
                {isAndroid && (
                    <RadioButton
                        value='first'
                        onPress={onPress}
                        status={checkbox ? 'checked' : 'unchecked'}
                        color={isDark ? DarkColors.green : Colors.green}
                        uncheckedColor={isDark ? DarkColors.green : Colors.green}
                    />
                )}
                <View style={styles.title}>
                    <Text style={[styles.text, styles.textLarge, styles.textTitle, isDark && styles.textDark]}>{name}</Text>
                    {_.isString(value) && <Text style={[styles.text, styles.textLarge, isDark && styles.textDark]}>{value}</Text>}
                </View>
            </View>
            {_.isObject(badge) && (
                <View style={styles.rowBlock}>
                    <Text
                        style={[
                            styles.text,
                            styles.textBlock,
                            isDark && styles.textBlockDark,
                            _.isString(badge.color) && {backgroundColor: badge.color},
                        ]}>
                        {badge.text}
                    </Text>
                </View>
            )}
        </TouchableBackground>
    );
};

export default Title;
