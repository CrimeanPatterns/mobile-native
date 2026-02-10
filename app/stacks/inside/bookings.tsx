import {createMaterialTopTabNavigator, MaterialTopTabBar, MaterialTopTabNavigationOptions} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';

import {HeaderBackButton} from '../../components/page/header/button';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import BookingDetails from '../../screens/bookings/details';
import BookingsScreen from '../../screens/bookings/list';
import BookingMessages from '../../screens/bookings/messages';
import {BookingNotFound} from '../../screens/bookings/notFound';
import {BookingNotVerified} from '../../screens/bookings/notVerified';
import BookingService from '../../services/booking';
import {Colors, DarkColors, Fonts} from '../../styles';
import {ThemeColors, useDark, useTheme} from '../../theme';
import {BookingDetailsParamList, BookingsStackParamList} from '../../types/navigation';

const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
const BookingDetailsTab = createMaterialTopTabNavigator<BookingDetailsParamList>();

const BookingDetailsScreen = ({navigation, route}) => {
    const isDark = useDark();
    const {requestId} = route.params;
    const screenOptions = useMemo((): MaterialTopTabNavigationOptions => {
        if (isIOS) {
            return {
                tabBarActiveTintColor: isDark ? DarkColors.blue : Colors.blue,
                tabBarInactiveTintColor: isDark ? Colors.gray : Colors.grayDark,
                tabBarIndicatorStyle: {
                    position: 'absolute',
                    bottom: -1,
                    height: 1,
                    backgroundColor: isDark ? DarkColors.blue : Colors.blue,
                },
                tabBarStyle: {
                    borderTopWidth: 0,
                    borderBottomWidth: 1,
                    backgroundColor: isDark ? DarkColors.bg : Colors.grayLight, // iOS
                    borderBottomColor: isDark ? DarkColors.border : Colors.gray,
                },
                tabBarShowIcon: true,
                tabBarLabelStyle: {
                    fontFamily: Fonts.regular,
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 13,
                    textTransform: 'capitalize',
                },
            };
        }

        return {
            tabBarStyle: {
                backgroundColor: isDark ? DarkColors.bgLight : Colors.gold,
            },
            tabBarIndicatorStyle: {
                backgroundColor: isDark ? DarkColors.gold : Colors.white,
            },
        };
    }, [isDark]);

    const request = BookingService.getRequest(parseInt(requestId, 10));
    const isNotFound = _.isUndefined(request);
    const isNotVerified = !isNotFound && request?.statusCode === -1;
    const isDetailsVisible = [isNotFound, isNotVerified].indexOf(true) === -1;

    let initialRouteName = 'Messages';

    if (isNotVerified) {
        initialRouteName = 'NotVerified';
    }
    if (isNotFound) {
        initialRouteName = 'NotFound';
    }

    return (
        <BookingDetailsTab.Navigator
            tabBarPosition='top'
            tabBar={(props) =>
                isDetailsVisible ? (
                    <MaterialTopTabBar {...props} />
                ) : (
                    isIOS && <View style={{backgroundColor: isDark ? DarkColors.border : Colors.gray, height: 1}} />
                )
            }
            screenOptions={screenOptions}
            // @ts-ignore
            initialRouteName={initialRouteName}>
            {isDetailsVisible ? (
                <>
                    <BookingDetailsTab.Screen
                        name='Details'
                        component={BookingDetails}
                        options={BookingDetails.navigationOptions}
                        initialParams={route.params}
                    />
                    <BookingDetailsTab.Screen
                        name='Messages'
                        component={BookingMessages}
                        options={BookingMessages.navigationOptions}
                        initialParams={route.params}
                    />
                </>
            ) : (
                <>
                    {isNotVerified && (
                        <BookingDetailsTab.Screen name='NotVerified' options={BookingNotVerified.navigationOptions}>
                            {() => <BookingNotVerified navigation={navigation} route={route} />}
                        </BookingDetailsTab.Screen>
                    )}
                    {isNotFound && (
                        <BookingDetailsTab.Screen name='NotFound' options={BookingNotFound.navigationOptions} initialParams={route.params}>
                            {() => <BookingNotFound navigation={navigation} route={route} />}
                        </BookingDetailsTab.Screen>
                    )}
                </>
            )}
        </BookingDetailsTab.Navigator>
    );
};

BookingDetailsScreen.navigationOptions = ({route}) => ({
    title: Translator.trans('request.no', {id: route.params?.requestId}, 'booking'),
    headerShadowVisible: false,
});

export const BookingsStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const getScreenOptions = useCallback(
        (props: {route: RouteProp<BookingsStackParamList>; navigation: StackNavigationProp<BookingsStackParamList>}) => {
            const {navigation} = props;
            const state = navigation.getState();
            const navigationOptions = getDefaultNavigationOptions(theme, ThemeColors.light.gold);

            if (state.routes.length === 1 && isIOS) {
                navigationOptions.headerLeft = () => <HeaderBackButton label={Translator.trans('buttons.back', {}, 'mobile')} />;
            }

            return navigationOptions;
        },
        [theme],
    );

    return (
        <BookingsStack.Navigator screenOptions={getScreenOptions} initialRouteName='BookingRequests'>
            <BookingsStack.Screen name='BookingRequests' component={BookingsScreen} options={BookingsScreen.navigationOptions} />
            <BookingsStack.Screen name='BookingDetails' component={BookingDetailsScreen} options={BookingDetailsScreen.navigationOptions} />
        </BookingsStack.Navigator>
    );
};
