import Bugsnag from '@bugsnag/react-native';
import {BottomTabNavigationOptions, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createMaterialBottomTabNavigator, MaterialBottomTabNavigationOptions} from '@react-navigation/material-bottom-tabs';
import {CommonActions, NavigationProp, RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {IntlProvider} from 'react-intl';
import {Platform, Text, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import {AutoLoginUpdateProvider} from '../../components/autologin/update';
import Icon from '../../components/icon';
import AppIntro from '../../components/intro';
import {MailboxCheckStatus} from '../../components/mailboxes/checkStatus';
import {InitialNotification, NotificationManager} from '../../components/notification/manager';
import {QuickActionHandler} from '../../components/quickActions';
import {PasscodeProvider} from '../../context/passcode';
import {isAndroid, isIOS} from '../../helpers/device';
import {initialRedirect} from '../../helpers/initialRedirect';
import {RestorationHandler} from '../../helpers/restorationHandler';
import {useProfileData} from '../../hooks/profile';
import ScanCardCamera from '../../screens/accounts/scancard/camera';
import ScanCardCrop from '../../screens/accounts/scancard/crop';
import {SubscriptionPaymentScreen} from '../../screens/profile/subscription/payment';
import {TravelSummaryScreen} from '../../screens/profile/travel-summary';
import {NoteScreen} from '../../screens/trips/note';
import {Billing} from '../../services/billing';
import Booking from '../../services/booking';
import Card from '../../services/card';
import EventEmitter from '../../services/eventEmitter';
import Auth from '../../services/http/auth';
import NotificationManagerService from '../../services/notification';
import StorageSync from '../../services/storageSync';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useColorTheme, useTheme} from '../../theme';
import {InsideStackParamList, InsideStackScreenParams, RootStackParamList} from '../../types/navigation';
import {AccountsStackScreen, AccountStackScreen} from './accounts';
import {BlogStackScreen} from './blog';
import {CardsStackScreen} from './cards';
import {ToolsStackScreen} from './tools';
import {TripsShareScreen, TripsStackScreen, TripStackScreen} from './trips';

const headerColorsDark = {
    AccountsTab: DarkColors.blue,
    Account: DarkColors.blue,
    TripsTab: DarkColors.green,
    CardsTab: DarkColors.chetwodeBlue,
    ToolsTab: DarkColors.gold,
    BlogTab: '#FF1200',
};
const headerColors = {
    AccountsTab: Colors.blueDark,
    Account: Colors.blueDark,
    TripsTab: Colors.green,
    CardsTab: Colors.chetwodeBlue,
    BlogTab: '#D42C20',
    ToolsTab: Colors.gold,
};

const tabBarIcons = {
    AccountsTab: 'menu-accounts',
    TripsTab: 'menu-trips',
    CardsTab: 'menu-cards',
    BlogTab: 'blog',
    ToolsTab: 'menu-tools',
};

const TabBarIcon: React.FunctionComponent<{
    color: string;
    focused: boolean;
    name: keyof typeof tabBarIcons;
}> = React.forwardRef(({color: tintColor, focused, name}, forwardedRef) => {
    const color = Platform.select({
        ios: focused ? Colors.blue : tintColor,
        android: focused ? Colors.white : tintColor,
    });
    const colorDark = Platform.select({
        ios: focused ? DarkColors.blue : tintColor,
        android: focused ? headerColorsDark[name] : tintColor,
    });

    // @ts-ignore
    return <Icon ref={forwardedRef} color={color} colorDark={colorDark} size={24} name={tabBarIcons[name]} />;
});

const TabBarIcons: Record<string, (props: {focused: boolean; color: string; size?: number}) => React.ReactNode> = {
    AccountsTab: ({color, focused}) => <TabBarIcon focused={focused} color={color} name='AccountsTab' />,
    TripsTab: ({color, focused}) => <TabBarIcon focused={focused} color={color} name='TripsTab' />,
    CardsTab: ({color, focused}) => <TabBarIcon focused={focused} color={color} name='CardsTab' />,
    BlogTab: ({color, focused}) => <TabBarIcon focused={focused} color={color} name='BlogTab' />,
    ToolsTab: ({color, focused}) => <TabBarIcon focused={focused} color={color} name='ToolsTab' />,
};

function getTabScreenLabel(routeName: string): string {
    const labels = {
        AccountsTab: Translator.trans('menu.button.accounts', {}, 'menu'),
        TripsTab: Translator.trans('menu.button.trips', {}, 'menu'),
        ToolsTab: Translator.trans(/** @Desc("Tools") */ 'tools', {}, 'mobile-native'),
        CardsTab: Translator.trans(/** @Desc("Cards") */ 'cards', {}, 'mobile-native'),
        BlogTab: 'Blog',
    };

    return labels[routeName];
}

const Tab = isIOS ? createBottomTabNavigator<InsideStackParamList>() : createMaterialBottomTabNavigator<InsideStackParamList>();

const TabNavigator: React.FunctionComponent = () => {
    const theme = useTheme();
    const profile = useProfileData();
    const dimensions = useWindowDimensions();
    const isDark = theme === 'dark';
    const getScreenOptions: (props: {
        route: RouteProp<InsideStackParamList>;
        navigation: NavigationProp<InsideStackParamList>;
    }) => BottomTabNavigationOptions | MaterialBottomTabNavigationOptions = useCallback(
        ({route}) => {
            const {name: routeName} = route;

            if (isIOS) {
                const options: BottomTabNavigationOptions = {
                    tabBarIcon: TabBarIcons[routeName],
                    tabBarLabel: getTabScreenLabel(routeName),
                    tabBarActiveTintColor: isDark ? DarkColors.blue : Colors.blue,
                    tabBarInactiveTintColor: isDark ? DarkColors.grayLight : Colors.grayDark,
                    tabBarStyle: {
                        backgroundColor: isDark ? DarkColors.bg : Colors.grayLight,
                        borderTopWidth: 1,
                        borderTopColor: isDark ? DarkColors.border : Colors.gray,
                    },
                    tabBarLabelStyle: {
                        fontFamily: Fonts.regular,
                        fontSize: 12,
                        lineHeight: 13,
                    },
                    headerShown: false,
                };

                return options;
            }

            const tabBarActiveTintColor = isDark ? headerColorsDark[routeName] : Colors.white;

            return {
                headerShown: false,
                tabBarIcon: TabBarIcons[routeName],
                tabBarLabel: getTabScreenLabel(routeName),
                tabBarActiveTintColor,
                tabBarInactiveTintColor: isDark ? DarkColors.grayLight : Colors.grayDark,
                tabBarColor: isDark ? DarkColors.bgLight : headerColors[routeName],
            } as MaterialBottomTabNavigationOptions;
        },
        [isDark],
    );

    const renderLabel = useCallback(
        (props: {route: RouteProp<InsideStackParamList>}) => {
            const {route} = props;
            const {name: routeName} = route;
            const color = isDark ? headerColorsDark[routeName] : Colors.white;
            const label = getTabScreenLabel(routeName);
            const tabBarLabelStyle = {
                fontFamily: Fonts.regular,
                fontSize: dimensions.width <= 360 && profile.locale === 'ru' ? 10 : 12,
                color,
            };

            return (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={tabBarLabelStyle}>{label}</Text>
                </View>
            );
        },
        [dimensions.width, isDark, profile.locale],
    );

    return (
        <Tab.Navigator
            // @ts-ignore
            screenOptions={getScreenOptions}
            renderLabel={renderLabel}
            id='Main'
            sceneContainerStyle={{
                backgroundColor: isDark ? DarkColors.bg : Colors.white,
            }}>
            <Tab.Screen name='AccountsTab' component={AccountsStackScreen} />
            <Tab.Screen name='TripsTab' component={TripsStackScreen} />
            <Tab.Screen name='CardsTab' component={CardsStackScreen} options={{headerShown: false}} />
            <Tab.Screen name='BlogTab' component={BlogStackScreen} options={{headerShown: false}} />
            <Tab.Screen name='ToolsTab' component={ToolsStackScreen} />
        </Tab.Navigator>
    );
};

const ModalScreensStack = createNativeStackNavigator();
const ModalScreens = () => {
    const selectColor = useColorTheme();

    return (
        <ModalScreensStack.Navigator
            screenOptions={{
                presentation: isAndroid ? 'fullScreenModal' : 'modal',
            }}>
            <ModalScreensStack.Screen
                name='SubscriptionPayment'
                component={SubscriptionPaymentScreen}
                options={SubscriptionPaymentScreen.navigationOptions}
            />
            <ModalScreensStack.Screen name='TravelSummary' component={TravelSummaryScreen} options={{header: () => null}} />
            <ModalScreensStack.Screen name='ScanCardCamera' component={ScanCardCamera} options={ScanCardCamera.navigationOptions} />
            <ModalScreensStack.Screen name='ScanCardCrop' component={ScanCardCrop} options={ScanCardCrop.navigationOptions} />
            <ModalScreensStack.Screen
                name='TimelineNote'
                component={NoteScreen}
                options={(props) => NoteScreen.navigationOptions({...props, selectColor})}
            />
        </ModalScreensStack.Navigator>
    );
};

const SafeAreaInsetsEmulator = () => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isAndroid) {
            SystemNavigationBar.setBarMode('light', 'navigation');
        }
    }, []);

    if (isIOS) {
        return null;
    }

    return (
        <>
            <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: insets.top, backgroundColor: 'rgba(0,0,0,0.1)'}} />
            <View style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: insets.bottom, backgroundColor: 'rgba(0,0,0,0.1)'}} />
        </>
    );
};

const Stack = createNativeStackNavigator<InsideStackScreenParams>();

export const InsideStackNavigator: React.FunctionComponent<{
    navigation: StackNavigationProp<RootStackParamList, 'Inside'>;
    route: RouteProp<RootStackParamList, 'Inside'>;
}> = ({navigation, route}) => {
    const appIntro = useRef<AppIntro>(null);
    const profile = useProfileData();
    const [showMailboxStatus, setShowMailboxStatus] = useState(false);
    const openMailboxCheckStatus = useCallback(() => setShowMailboxStatus(true), []);
    // @ts-ignore
    const isInitial = useMemo(() => route.params?.reload !== false, [route]);
    const onPasscodeUnlock = useCallback(() => {
        if (_.isObject(profile)) {
            const {restore} = profile;

            if (restore) {
                Billing.restore();
            }
        }

        if (isInitial) {
            StorageSync.forceUpdate();
        }

        appIntro.current?.open();
    }, [profile, isInitial]);
    const doLogout = useCallback(
        (event) => {
            Card.destroy();
            NotificationManagerService.disconnect();
            Auth.logout().then(() => {
                if (!event?.silent) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Outside'}],
                        }),
                    );
                }
            });
        },
        [navigation],
    );

    useEffect(() => {
        const {products} = profile;

        StorageSync.start();

        if (!__DEV__) {
            Bugsnag.setUser(String(profile.UserID));
            if (_.isArray(products)) {
                Billing.init(products.map((product) => product.id));
            }
        }

        appIntro.current?.open();

        return () => {
            StorageSync.stop();
            if (!__DEV__) {
                Billing.destroy();
            }
            Booking.destroy();
        };
    }, []);

    useEffect(() => {
        const logoutListener = EventEmitter.addListener('doLogout', doLogout);

        return () => {
            logoutListener.remove();
        };
    }, []);

    return (
        <>
            <NotificationManager />
            <InitialNotification />
            <RestorationHandler />
            <QuickActionHandler initialRedirect={initialRedirect} />
            <PasscodeProvider initial={isInitial} onUnlock={onPasscodeUnlock}>
                <IntlProvider locale={profile.locale}>
                    <AutoLoginUpdateProvider>
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                            initialRouteName='Main'>
                            <Stack.Screen name='Main' getId={() => 'Main'} component={TabNavigator} navigationKey={`main-${profile.UserID}`} />
                            <Stack.Screen
                                name='ModalScreens'
                                component={ModalScreens}
                                options={{animation: 'slide_from_bottom'}}
                                navigationKey={`modal-screens-${profile.UserID}`}
                            />
                            {isIOS && (
                                <Stack.Screen name='Account' component={AccountStackScreen} navigationKey={`account-stack-${profile.UserID}`} />
                            )}
                            {/** @ts-ignore */}
                            <Stack.Screen name='Trip' component={TripStackScreen} navigationKey={`trip-stack-${profile.UserID}`} />
                            <Stack.Screen name='TripsShare' component={TripsShareScreen} navigationKey={`trips-share-${profile.UserID}`} />
                        </Stack.Navigator>
                        {showMailboxStatus && <MailboxCheckStatus />}
                    </AutoLoginUpdateProvider>
                </IntlProvider>
                <AppIntro ref={appIntro} onClose={openMailboxCheckStatus} />
            </PasscodeProvider>
            <SafeAreaInsetsEmulator />
        </>
    );
};
