import {render} from '@testing-library/react-native';
import React from 'react';

import {ThemeContext} from '../../app/theme';

export const withThemeContext = (Component, theme) => <ThemeContext.Provider value={theme}>{Component}</ThemeContext.Provider>;
export const withLightTheme = (Component) => withThemeContext(Component, 'light');
export const withDarkTheme = (Component) => withThemeContext(Component, 'dark');
export const testChangeTheme = (Component) => {
    const component = (theme) => withThemeContext(Component, theme);
    const field = render(component('light'));
    const {rerender} = field;

    expect(field.toJSON()).toMatchSnapshot('light');

    rerender(component('dark'));

    expect(field.toJSON()).toMatchSnapshot('dark');

    rerender(component('light'));

    expect(field.toJSON()).toMatchSnapshot('light');
};
