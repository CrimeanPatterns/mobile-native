import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {Platform} from 'react-native';

import {isIOS} from '../helpers/device';
import {Colors, DarkColors, Fonts} from '../styles';
import {ColorScheme} from '../theme';

export const BACK_TITLE_COLOR = Platform.select({ios: Colors.grayDark, android: Colors.white});
export const HEADER_TITLE_COLOR = Platform.select({ios: Colors.grayDark, android: Colors.white});

export const getDefaultNavigationOptions = (theme: ColorScheme, headerColor = Colors.grayBlue): NativeStackNavigationOptions => {
    const isDark = theme === 'dark';
    const headerTintColor = Platform.select({ios: isDark ? Colors.white : HEADER_TITLE_COLOR, android: HEADER_TITLE_COLOR});
    const backgroundColorDark = isIOS ? Colors.black : DarkColors.bg;

    return {
        contentStyle: {
            backgroundColor: isDark ? backgroundColorDark : Colors.white,
            flex: 1,
        },
        headerStyle: Platform.select({
            ios: isDark
                ? {
                      backgroundColor: DarkColors.bg,
                      borderBottomColor: Colors.black,
                      borderBottomWidth: 1,
                  }
                : {
                      backgroundColor: Colors.grayLight,
                      borderBottomColor: Colors.gray,
                      borderBottomWidth: 1,
                  },
            android: {
                backgroundColor: isDark ? DarkColors.bgLight : headerColor,
                elevation: 5,
            },
        }),
        headerTitleStyle: Platform.select({
            ios: {
                fontFamily: Fonts.regular,
                fontSize: 17,
                fontWeight: 'normal',
            },
            android: {
                fontFamily: Fonts.bold,
                fontWeight: '500',
                fontSize: 20,
            },
        }),
        headerBackTitleStyle: Platform.select({
            ios: {
                fontFamily: Fonts.regular,
                fontSize: 17,
                fontWeight: 'normal',
                // color: isDark ? Colors.white : BACK_TITLE_COLOR,
            },
            android: {
                fontFamily: Fonts.bold,
                fontWeight: '500',
                fontSize: 20,
                // color: isDark ? DarkColors.text : BACK_TITLE_COLOR,
            },
        }),
        headerTintColor,
        headerBackButtonMenuEnabled: false,
        // navigationBarColor: 'transparent',
        // headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    };
};
