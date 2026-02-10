import {DarkTheme, DefaultTheme} from '@react-navigation/native';
import {useDark} from '@theme/use-theme';

import {isIOS} from '../helpers/device';
import {getMainColor} from '../helpers/header';
import {Colors, DarkColors} from '../styles';

export const NavigationDarkTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
        primary: Colors.white,
        background: isIOS ? DarkColors.bg : DarkColors.bgLight,
        card: isIOS ? DarkColors.bg : DarkColors.bgLight,
        text: Colors.white,
        border: Colors.black,
        notification: 'rgb(255, 69, 58)',
    },
};

export const NavigationDefaultTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        primary: Colors.grayDark,
        background: isIOS ? Colors.grayLight : Colors.grayBlue,
        card: 'rgb(255, 255, 255)',
        text: isIOS ? Colors.grayDark : Colors.white,
        border: Colors.gray,
        notification: 'rgb(255, 69, 58)',
    },
};

export const useNavigationMainColor = (): string => {
    const isDark = useDark();

    const selectColor = (light, dark) => (isDark ? dark : light);

    return getMainColor(isIOS ? selectColor(Colors.grayLight, DarkColors.bg) : selectColor(Colors.blueDark, DarkColors.bgLight), isDark);
};
