import {PureComponent} from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';

import {isIOS} from '../helpers/device';
import {ColorScheme, Palette, ThemeColors} from '../theme';

type ThemeStyle = StyleProp<ViewStyle | TextStyle> | number | string;

type ThemeSpec = {
    light: ThemeStyle;
    dark: ThemeStyle;
};

type PlatformSpec = {
    ios: ThemeSpec;
    android: ThemeSpec;
};

export type ThemedComponentProps = {
    theme: ColorScheme;
};

function isPlatformSpec(spec: PlatformSpec | ThemeSpec): spec is PlatformSpec {
    return (<PlatformSpec>spec).ios !== undefined;
}

class BaseThemedPureComponent<P, S = never> extends PureComponent<P & ThemedComponentProps, S> {
    get isDark(): boolean {
        const {theme} = this.props;

        return theme === 'dark';
    }

    get themeColors(): Palette {
        const {theme} = this.props;

        return ThemeColors[theme];
    }

    selectColor(lightColor: string, darkColor: string): string {
        return this.selectTheme(lightColor, darkColor) as string;
    }

    selectStyle(spec: PlatformSpec | ThemeSpec): ThemeStyle {
        if (isPlatformSpec(spec)) {
            const {ios, android} = spec;

            if (isIOS) {
                return this.selectStyle(ios);
            }

            return this.selectStyle(android);
        }

        const {light, dark} = spec;

        return this.selectTheme(light, dark);
    }

    private selectTheme(light, dark): ThemeStyle {
        if (this.isDark) {
            return dark;
        }

        return light;
    }
}

export {BaseThemedPureComponent as BaseThemedComponent, BaseThemedPureComponent};
