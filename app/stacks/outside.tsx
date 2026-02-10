import {createDrawerNavigator} from '@react-navigation/drawer';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';

import {InitialNotification} from '../components/notification/manager';
import {RecaptchaProvider} from '../components/recaptcha';
import {getDefaultNavigationOptions} from '../config/defaultHeader';
import {isAndroid, isIOS} from '../helpers/device';
import {RestorationHandler} from '../helpers/restorationHandler';
import {PasswordRecoveryScreen, SecurityQuestionsScreen, SignInScreen, SignUpScreen} from '../screens/auth';
import ConnectionInviteScreen from '../screens/connections/connection/invite';
import {MerchantLookupUnauthorizedScreen} from '../screens/merchant/lookup';
import MerchantOffer from '../screens/merchant/offer';
import TimelineSegmentFlightsAutoLogin from '../screens/trips/segment/flights-autologin';
import TimelineShareScreen from '../screens/trips/shared';
import TimelineShareSegmentDetails from '../screens/trips/shared/segment/details';
import TimelineShareSegmentFlights from '../screens/trips/shared/segment/flights';
import {TimelineShareSegmentPhonesScreen} from '../screens/trips/shared/segment/phones';
import {useDark, useTheme} from '../theme';
import {OutsideStackParamList, OutsideStackScreenParams} from '../types/navigation';
import {CommonScreens} from './common';

const OutsideStack = createDrawerNavigator<OutsideStackScreenParams>();

const OutsideMainStack = createNativeStackNavigator<OutsideStackParamList>();

const OutsideMainStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const screenOptions = getDefaultNavigationOptions(theme);

    return (
        <RecaptchaProvider>
            <OutsideMainStack.Navigator screenOptions={screenOptions}>
                <OutsideMainStack.Screen name='SignIn' component={SignInScreen} options={SignInScreen.navigationOptions} />
                <OutsideMainStack.Screen name='SignUp' component={SignUpScreen} options={SignUpScreen.navigationOptions} />
                <OutsideMainStack.Screen
                    name='ForgotPassword'
                    component={PasswordRecoveryScreen}
                    options={PasswordRecoveryScreen.navigationOptions}
                />
                <OutsideMainStack.Screen
                    name='PasswordRecovery'
                    component={PasswordRecoveryScreen}
                    options={PasswordRecoveryScreen.navigationOptions}
                />
                <OutsideMainStack.Screen
                    name='SecurityQuestions'
                    component={SecurityQuestionsScreen}
                    options={SecurityQuestionsScreen.navigationOptions}
                />
                <OutsideMainStack.Group>
                    {CommonScreens.map(({name, component, options}) => (
                        <OutsideMainStack.Screen key={name} name={name} component={component} options={options} />
                    ))}
                    <OutsideMainStack.Screen
                        name='MerchantLookup'
                        component={MerchantLookupUnauthorizedScreen}
                        options={MerchantLookupUnauthorizedScreen.navigationOptions}
                    />
                    <OutsideMainStack.Screen name='MerchantOffer' component={MerchantOffer} options={MerchantOffer.navigationOptions} />
                    <OutsideMainStack.Screen
                        name='ConnectionInvite'
                        component={ConnectionInviteScreen}
                        options={ConnectionInviteScreen.navigationOptions}
                    />
                </OutsideMainStack.Group>
                <OutsideMainStack.Group>
                    <OutsideMainStack.Screen name='TimelineShare' component={TimelineShareScreen} options={TimelineShareScreen.navigationOptions} />
                    <OutsideMainStack.Screen
                        name='TimelineShareSegmentDetails'
                        component={TimelineShareSegmentDetails}
                        options={TimelineShareSegmentDetails.navigationOptions}
                    />
                    <OutsideMainStack.Screen
                        name='TimelineShareSegmentPhones'
                        // @ts-ignore
                        component={TimelineShareSegmentPhonesScreen}
                        options={TimelineShareSegmentPhonesScreen.navigationOptions}
                    />
                    <OutsideMainStack.Screen
                        name='TimelineShareSegmentFlights'
                        component={TimelineShareSegmentFlights}
                        options={TimelineShareSegmentFlights.navigationOptions}
                    />
                    <OutsideMainStack.Screen
                        name='TimelineSegmentFlightsAutoLogin'
                        component={TimelineSegmentFlightsAutoLogin}
                        options={TimelineSegmentFlightsAutoLogin.navigationOptions}
                    />
                </OutsideMainStack.Group>
            </OutsideMainStack.Navigator>
        </RecaptchaProvider>
    );
};

const SafeAreaInsetsEmulator = () => {
    const insets = useSafeAreaInsets();
    const isDark = useDark();

    useEffect(() => {
        if (isAndroid) {
            SystemNavigationBar.setBarMode(isDark ? 'light' : 'dark', 'navigation');
        }
    }, [isDark]);

    if (isIOS) {
        return null;
    }

    return (
        <>
            <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: insets.top, backgroundColor: 'rgba(0,0,0,0.1)'}} />
        </>
    );
};

export const OutsideStackScreen: React.FunctionComponent = () => (
    <>
        <OutsideStack.Navigator
            backBehavior='history'
            drawerContent={require('../components/drawer/content/login').default}
            screenOptions={({route}) => ({
                swipeEdgeWidth: 150,
                overlayColor: 'transparent',
                swipeEnabled: getFocusedRouteNameFromRoute(route) === 'SignIn',
            })}>
            <OutsideStack.Screen name='Main' component={OutsideMainStackScreen} options={{headerShown: false}} />
        </OutsideStack.Navigator>
        <RestorationHandler />
        <InitialNotification />
        <SafeAreaInsetsEmulator />
    </>
);
