import {NavigationProp} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

import {handleOpenUrl} from '../../../helpers/handleOpenUrl';
import {Colors, DarkColors} from '../../../styles';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../../theme';
import {ProfileStackParamList} from '../../../types/navigation';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable';
// eslint-disable-next-line import/no-unresolved
import styles from './styles';

export const ProfileFormLink: React.FunctionComponent<{
    navigation: NavigationProp<ProfileStackParamList, 'Profile'>;
    name: string;
    text: string;
    formLink?: string;
    formTitle?: string;
    scrollTo?: string;
    reload?: () => void;
}> = (props) => {
    console.log(props);
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const themeColors = ThemeColors[theme];
    const {navigation, name, text, formLink, formTitle, scrollTo, reload} = props;

    const params = {formLink, formTitle, scrollTo, reload};

    const onPress = () =>
        handleOpenUrl(
            {url: formLink},
            () => {
                // @ts-ignore
                navigation.push('ProfileEdit', params);
            },
            params,
        );

    return (
        <TouchableBackground
            onPress={onPress}
            activeBackgroundColor={isDark ? DarkColors.bg : Colors.graySoft}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={{
                height: 48,
                backgroundColor: isDark ? DarkColors.grayDark : Colors.grayLight,
                marginVertical: 12,
                marginHorizontal: 15,
                borderBottomWidth: 2,
                borderBottomColor: isDark ? DarkColors.border : Colors.gray,
                borderColor: isDark ? DarkColors.grayDark : Colors.graySoft,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
            }}>
            <View style={[styles.containerWrap]}>
                <View style={styles.containerCaption}>
                    <Text style={[styles.caption, isDark && styles.labelTextDark]}>{name}</Text>
                </View>
                <View style={styles.containerDetails}>
                    <Text numberOfLines={1} style={[styles.boldText, isDark && styles.textDark]}>
                        {text}
                    </Text>
                </View>
                <Icon style={styles.arrow} name='arrow' color={themeColors.grayDarkLight} size={20} />
            </View>
        </TouchableBackground>
    );
};
