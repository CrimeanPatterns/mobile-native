import {useCallback, useEffect, useRef, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';

// Issue with Appearance change when application going in background, https://github.com/facebook/react-native/issues/28525#issuecomment-719070469

export default function useColorScheme(delay = 500): NonNullable<ColorSchemeName> {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const resetCurrentTimeout = useCallback(() => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }, []);
    const onColorSchemeChange = useCallback(
        (preferences: Appearance.AppearancePreferences) => {
            resetCurrentTimeout();

            timeout.current = setTimeout(() => {
                setColorScheme(preferences.colorScheme);
            }, delay);
        },
        [delay, resetCurrentTimeout],
    );

    useEffect(() => {
        const listener = Appearance.addChangeListener(onColorSchemeChange);

        return () => {
            resetCurrentTimeout();
            listener.remove();
        };
    }, [onColorSchemeChange]);

    return colorScheme as NonNullable<ColorSchemeName>;
}
