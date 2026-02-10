import {useContext} from 'react';

import {ColorScheme, ThemeContext} from './context';

export const ColorSchemeDark = 'dark';
export const ColorSchemeLight = 'light';
export const useTheme = (): ColorScheme => useContext(ThemeContext);
export const useDark = (): boolean => {
    const theme = useTheme();

    return theme === ColorSchemeDark;
};
export const useColorTheme = () => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;

    return (light, dark) => (isDark ? dark : light);
};
