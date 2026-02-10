import {Platform} from 'react-native';

import {Colors, DarkColors} from '../styles';
import {ColorScheme} from './context';

export type Palette = {
    green: string;
    blue: string;
    orange: string;
    red: string;
    grayDarkLight: string;
    border: string;
    text: string;
    gold;
    chetwodeBlue;
};

export const ThemeColors: Record<ColorScheme, Palette> = {
    light: {
        green: Colors.green,
        blue: Platform.select({ios: Colors.blue, android: Colors.blueDark}),
        orange: Colors.orange,
        red: Colors.red,
        grayDarkLight: Colors.grayDarkLight,
        border: Colors.gray,
        text: Colors.gray,
        gold: Colors.gold,
        chetwodeBlue: Colors.chetwodeBlue,
    },
    dark: {
        green: DarkColors.green,
        blue: DarkColors.blue,
        orange: DarkColors.orange,
        red: DarkColors.red,
        grayDarkLight: DarkColors.gray,
        border: DarkColors.border,
        text: DarkColors.text,
        gold: DarkColors.gold,
        chetwodeBlue: DarkColors.chetwodeBlue,
    },
};
