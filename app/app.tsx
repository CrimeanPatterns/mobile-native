import './services/localeManager';

import {RootNotificationManager} from '@components/notification/manager';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {firebase} from '@react-native-firebase/analytics';
import {useFlipper} from '@react-navigation/devtools';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {navigationRef} from '@services/navigator';
import {InsideStackNavigator} from '@stacks/inside';
import {OutsideStackScreen} from '@stacks/outside';
import {NavigationDarkTheme, NavigationDefaultTheme} from '@theme/navigator';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {AppState, I18nManager, NativeModules} from 'react-native';
import SplashScreen from 'react-native-bootsplash';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import {Provider} from 'react-native-paper';
import {RootSiblingParent} from 'react-native-root-siblings';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Bugsnag} from './bugsnag';
import {FlashMessage} from './components/flashMessage';
import {Keychain} from './components/oauth/keychain';
import {ScreenGuard} from './components/screenGuard';
import {StorageProvider} from './context/storage';
import {isAndroid} from './helpers/device';
import {NavigationLinkingOptions} from './navigation/linking';
import Session from './services/session';
import Storage from './storage';
import {ColorSchemeDark, ThemeProvider, useTheme} from './theme';
import {RootStackParamList} from './types/navigation';

firebase.analytics().setAnalyticsCollectionEnabled(true);

I18nManager.allowRTL(false);

function logNavigation(currentScreen, routeParams) {
    const event = {
        screen: currentScreen,
        params: routeParams,
    };

    Bugsnag.leaveBreadcrumb('Navigation state change', event, 'navigation');
}

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

if (!isAndroid && NativeModules.AccessibilityManager) {
    const {AccessibilityManager} = NativeModules;

    AccessibilityManager.setAccessibilityContentSizeMultipliers({
        extraSmall: 0.823,
        small: 0.882,
        medium: 0.941,
        large: 1.0,
        extraLarge: 1.04,
        extraExtraLarge: 1.08,
        extraExtraExtraLarge: 1.12,
        accessibilityMedium: 1.12,
        accessibilityLarge: 1.12,
        accessibilityExtraLarge: 1.12,
        accessibilityExtraExtraLarge: 1.12,
        accessibilityExtraExtraExtraLarge: 1.12,
    });
}
const RootStack = createNativeStackNavigator<RootStackParamList>();

const App = React.memo(() => {
    const [isReady, setIsReady] = useState(false);
    const systemTheme = useTheme();
    const [theme, setTheme] = useState(systemTheme === ColorSchemeDark ? NavigationDarkTheme : NavigationDefaultTheme);
    const routeNameRef = useRef<string>();
    const onNavigatorReady = useCallback(() => {
        routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
        setTimeout(() => SplashScreen.hide(), 300);
    }, []);
    const onStateChange = useCallback(() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
            firebase.analytics().logScreenView({
                screen_class: currentRouteName,
                screen_name: currentRouteName,
            });
            if (!__DEV__) {
                logNavigation(currentRouteName, navigationRef?.getCurrentRoute()?.params);
            }
        }

        routeNameRef.current = currentRouteName;
    }, []);
    const [initialRouteName, setInitialRouteName] = React.useState<'Outside' | 'Inside'>('Outside');
    const initialRedirect = useCallback(() => {
        if (Session.authorized()) {
            setInitialRouteName('Inside');
        }
    }, []);

    useFlipper(navigationRef);

    useEffect(() => setTheme(systemTheme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme), [systemTheme]);

    useEffect(() => {
        const restoreState = async () => {
            try {
                await Storage.sync();
                Session.sync();
                initialRedirect();
            } finally {
                setIsReady(true);
            }
        };

        restoreState();
    }, []);

    const screenOptions: NativeStackNavigationOptions = useMemo(
        () => ({
            headerShown: false,
        }),
        [],
    );

    if (!isReady) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer
                linking={NavigationLinkingOptions}
                ref={navigationRef}
                onStateChange={onStateChange}
                onReady={onNavigatorReady}
                theme={theme}>
                <FlashMessage />
                <StorageProvider>
                    <BottomSheetModalProvider>
                        <RootStack.Navigator screenOptions={screenOptions} initialRouteName={initialRouteName}>
                            <RootStack.Screen name='Outside' component={OutsideStackScreen} />
                            <RootStack.Screen name='Inside' component={InsideStackNavigator} />
                        </RootStack.Navigator>
                    </BottomSheetModalProvider>
                </StorageProvider>
            </NavigationContainer>
            {isAndroid && <ScreenGuard />}
            <RootNotificationManager />
            <Keychain />
        </SafeAreaProvider>
    );
});

export default gestureHandlerRootHOC(() => (
    <ThemeProvider>
        <RootSiblingParent>
            <Provider>
                <App />
            </Provider>
        </RootSiblingParent>
    </ThemeProvider>
));
