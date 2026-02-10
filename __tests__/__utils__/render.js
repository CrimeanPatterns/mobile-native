import {shallow as enzymeShallow} from 'enzyme';
import renderer from 'react-test-renderer';

import {withDarkTheme, withLightTheme, withThemeContext} from './theme';

export const renderLight = (Component) => renderer.create(withLightTheme(Component));
export const renderDark = (Component) => renderer.create(withDarkTheme(Component));

export const shallow = (Component, theme = 'light') => enzymeShallow(withThemeContext(Component, theme));
