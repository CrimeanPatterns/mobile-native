import {createMaterialTopTabNavigator, MaterialTopTabNavigationOptions} from '@react-navigation/material-top-tabs';
import Translator from 'bazinga-translator';
import React, {useMemo} from 'react';

import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import {ToolsStackScreenFunctionalComponent} from '../../types/navigation';
import PurchaseScreen from './purchase';
import TransferScreen from './transfer';

const Tab = createMaterialTopTabNavigator();

const TransferTimesScreen: ToolsStackScreenFunctionalComponent<'TransferTimes'> = ({navigation}) => {
    const isDark = useDark();
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

    return (
        <Tab.Navigator
            tabBarPosition='top'
            screenOptions={screenOptions}
            screenListeners={{
                state: ({data}) => {
                    // @ts-ignore
                    const {state} = data;
                    const {routeNames, index} = state;
                    const routeName = routeNames[index];

                    if (routeName === 'Transfer') {
                        navigation.setOptions({title: Translator.trans('transfer_times', {}, 'messages')});
                    } else if (routeName === 'Purchase') {
                        navigation.setOptions({title: Translator.trans('purchase_times', {}, 'messages')});
                    }
                },
            }}>
            <Tab.Screen name='Transfer' component={TransferScreen} options={TransferScreen.navigationOptions} />
            <Tab.Screen name='Purchase' component={PurchaseScreen} options={PurchaseScreen.navigationOptions} />
        </Tab.Navigator>
    );
};

// @ts-ignore
TransferTimesScreen.navigationOptions = ({route, theme}) => {
    const {headerStyle, headerBackTitle} = getDefaultNavigationOptions(theme, Colors.gold);

    return {
        // headerShown: false,
        headerStyle,
        headerBackTitle,
        headerShadowVisible: false,
        // @ts-ignore
        animation: route.params?.animation ?? 'default',
    };
};

export {TransferTimesScreen};
