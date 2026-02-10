import React from 'react';
import {Appearance} from 'react-native';

import useColorScheme from './use-color-scheme';

type ColorScheme = 'light' | 'dark';

const colorScheme = Appearance.getColorScheme() as ColorScheme;
const ThemeContext = React.createContext<ColorScheme>(colorScheme);
const ThemeConsumer = ThemeContext.Consumer;

const ThemeProvider = ({children}) => {
    const theme = useColorScheme() as ColorScheme;

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export {ThemeContext, ThemeProvider, ThemeConsumer, ColorScheme};
