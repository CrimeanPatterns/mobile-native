import {RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View} from 'react-native';

import {HeaderBackButton} from '../../components/page/header/button';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isAndroid} from '../../helpers/device';
import {TimelineScreen} from '../../screens/trips';
import TimelineSegmentDetailsScreen from '../../screens/trips/segment/details/screen';
// eslint-disable-next-line import/no-named-as-default
import TimelineSegmentFlights from '../../screens/trips/segment/flights';
import TimelineSegmentFlightsAutoLogin from '../../screens/trips/segment/flights-autologin';
import {ItineraryAutologinScreen} from '../../screens/trips/segment/itineraryAutologin';
import TimelineLoungeDetails from '../../screens/trips/segment/lounges/details';
import TimelineLoungeList from '../../screens/trips/segment/lounges/list';
import TimelineSegmentPhonesScreen from '../../screens/trips/segment/phones/screen';
import TimelineShareScreen from '../../screens/trips/shared';
import TimelineShareSegmentDetails from '../../screens/trips/shared/segment/details';
import TimelineShareSegmentFlights from '../../screens/trips/shared/segment/flights';
import {TimelineShareSegmentPhonesScreen} from '../../screens/trips/shared/segment/phones';
import {ThemeColors, useTheme} from '../../theme';
import {TripsShareStackParamList, TripsStackParamList, TripStackParamList} from '../../types/navigation';
import {CommonScreens} from '../common';

const TripsStack = createNativeStackNavigator<TripsStackParamList>();

export const TripsStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const getScreenOptions = useCallback(() => {
        const mainColorDark = ThemeColors.dark.green;
        const mainColorLight = ThemeColors.light.green;
        const screenOptions = getDefaultNavigationOptions(theme, mainColorLight);

        return {
            ...screenOptions,
            mainColorDark,
            mainColorLight,
        };
    }, [theme]);

    return (
        <TripsStack.Navigator screenOptions={getScreenOptions} initialRouteName='Timeline'>
            <TripsStack.Screen name='Timeline' component={TimelineScreen} options={TimelineScreen.navigationOptions} />
            {isAndroid && <TripsStack.Screen name='Trip' component={TripStackScreen} options={{headerShown: false}} />}
        </TripsStack.Navigator>
    );
};

const TripStack = createNativeStackNavigator<TripStackParamList>();

export const TripStackScreen: React.FunctionComponent<{
    route: RouteProp<TripStackParamList>;
}> = ({route}) => {
    const theme = useTheme();
    const screenOptions = getDefaultNavigationOptions(theme, ThemeColors[theme].green);
    const getScreenOptions = useCallback(
        (props: {route: RouteProp<TripStackParamList>; navigation: StackNavigationProp<TripStackParamList>}) => {
            const mainColorDark = ThemeColors.dark.green;
            const mainColorLight = ThemeColors.light.green;
            const screenOptions = getDefaultNavigationOptions(theme, mainColorLight);
            const {navigation} = props;
            const state = navigation.getState();

            if (state.routes.length === 1) {
                screenOptions.headerLeft = () => <HeaderBackButton />;
            }

            return {
                ...screenOptions,
                mainColorDark,
                mainColorLight,
            };
        },
        [theme],
    );

    return (
        <View style={[{flex: 1}, screenOptions.contentStyle]}>
            <TripStack.Navigator screenOptions={getScreenOptions} initialRouteName='TimelineSegmentDetails'>
                <TripStack.Screen
                    name='TimelineSegmentDetails'
                    component={TimelineSegmentDetailsScreen}
                    options={TimelineSegmentDetailsScreen.navigationOptions}
                    initialParams={route.params}
                />
                <TripStack.Screen
                    name='TimelineSegmentPhones'
                    component={TimelineSegmentPhonesScreen}
                    options={TimelineSegmentPhonesScreen.navigationOptions}
                    initialParams={route.params}
                />
                <TripStack.Screen
                    name='TimelineSegmentFlights'
                    component={TimelineSegmentFlights}
                    options={TimelineSegmentFlights.navigationOptions}
                    initialParams={route.params}
                />
                <TripStack.Screen
                    name='TimelineSegmentFlightsAutoLogin'
                    component={TimelineSegmentFlightsAutoLogin}
                    options={TimelineSegmentFlightsAutoLogin.navigationOptions}
                />
                <TripStack.Screen
                    name='ItineraryAutologin'
                    component={ItineraryAutologinScreen}
                    options={ItineraryAutologinScreen.navigationOptions}
                />
                <TripStack.Screen name='TimelineLoungeList' component={TimelineLoungeList} options={TimelineLoungeList.navigationOptions} />
                <TripStack.Screen name='TimelineLoungeDetails' component={TimelineLoungeDetails} options={TimelineLoungeDetails.navigationOptions} />
                <TripStack.Group>
                    {CommonScreens.map(({name, component, options}) => (
                        <TripsStack.Screen key={name} name={name} component={component} options={options} />
                    ))}
                </TripStack.Group>
            </TripStack.Navigator>
        </View>
    );
};

const TripsShareStack = createNativeStackNavigator<TripsShareStackParamList>();

export const TripsShareScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const getScreenOptions = useCallback(
        (props: {route: RouteProp<TripsShareStackParamList>; navigation: StackNavigationProp<TripsShareStackParamList>}) => {
            const mainColorDark = ThemeColors.dark.green;
            const mainColorLight = ThemeColors.light.green;
            const screenOptions = getDefaultNavigationOptions(theme, mainColorLight);
            const {navigation} = props;
            const state = navigation.getState();

            if (state.routes.length === 1) {
                screenOptions.headerLeft = () => <HeaderBackButton />;
            }

            return {
                ...screenOptions,
                mainColorDark,
                mainColorLight,
                navigationBarColor: theme === 'dark' ? mainColorDark : mainColorLight,
            };
        },
        [theme],
    );

    return (
        <TripsShareStack.Navigator screenOptions={getScreenOptions} initialRouteName='TimelineShare'>
            <TripsShareStack.Screen name='TimelineShare' component={TimelineShareScreen} options={TimelineShareScreen.navigationOptions} />
            <TripsShareStack.Screen
                name='TimelineShareSegmentDetails'
                component={TimelineShareSegmentDetails}
                options={TimelineShareSegmentDetails.navigationOptions}
            />
            <TripsShareStack.Screen
                name='TimelineShareSegmentPhones'
                component={TimelineShareSegmentPhonesScreen}
                options={TimelineShareSegmentPhonesScreen.navigationOptions}
            />
            <TripsShareStack.Screen
                name='TimelineShareSegmentFlights'
                component={TimelineShareSegmentFlights}
                options={TimelineShareSegmentFlights.navigationOptions}
            />
            <TripsShareStack.Group>
                {CommonScreens.map(({name, component, options}) => (
                    <TripsShareStack.Screen key={name} name={name} component={component} options={options} />
                ))}
            </TripsShareStack.Group>
        </TripsShareStack.Navigator>
    );
};
