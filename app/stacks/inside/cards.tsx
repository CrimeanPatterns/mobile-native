import {createMaterialTopTabNavigator, MaterialTopTabNavigationOptions} from '@react-navigation/material-top-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Translator from 'bazinga-translator';
import React, {useCallback, useMemo} from 'react';

import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import AccountHistoryOfferScreen from '../../screens/accounts/account/history/offer';
import {MerchantLookupScreen} from '../../screens/merchant/lookup';
import MerchantOfferScreen from '../../screens/merchant/offer';
import MerchantReverseScreen from '../../screens/merchant/reverse';
import MileValueScreen from '../../screens/mile-value';
import {SpendAnalysisScreen} from '../../screens/spend-analysis';
import {SpendAnalysisDetailsScreen} from '../../screens/spend-analysis/details';
import {TransactionAnalyzerScreen} from '../../screens/transaction-analyzer';
import {Colors, DarkColors, Fonts} from '../../styles';
import {ThemeColors, useDark, useTheme} from '../../theme';
import {CardsStackParamList} from '../../types/navigation';

const CardsStack = createNativeStackNavigator<CardsStackParamList>();
const Tab = createMaterialTopTabNavigator();

const CardsTabScreen: React.FunctionComponent = () => {
    const isDark = useDark();
    const screenOptions = useMemo((): MaterialTopTabNavigationOptions => {
        if (isIOS) {
            return {
                tabBarActiveTintColor: isDark ? DarkColors.blue : Colors.blue,
                tabBarInactiveTintColor: isDark ? Colors.gray : Colors.grayDark,
                // tabBarIndicator: () => null,
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
                backgroundColor: isDark ? DarkColors.bgLight : Colors.chetwodeBlue,
            },
            tabBarIndicatorStyle: {
                backgroundColor: isDark ? DarkColors.chetwodeBlue : Colors.white,
            },
            // @ts-ignore
            mainColorDark: DarkColors.chetwodeBlue,
            mainColorLight: Colors.chetwodeBlue,
        };
    }, [isDark]);

    return (
        <Tab.Navigator
            tabBarPosition='top'
            screenOptions={screenOptions}
            sceneContainerStyle={{
                backgroundColor: isDark ? DarkColors.bg : Colors.white,
            }}>
            <Tab.Screen
                name='SpendAnalysis'
                component={SpendAnalysisScreen}
                options={{
                    title: Translator.trans(/** @Desc("Spend Analysis") */ 'spend-analysis', {}, 'mobile-native'),
                }}
            />
            <Tab.Screen
                name='TransactionAnalyzer'
                component={TransactionAnalyzerScreen}
                options={{title: Translator.trans('transaction-analyzer', {}, 'messages')}}
            />
            <Tab.Screen
                name='MerchantLookup'
                component={MerchantLookupScreen}
                options={{
                    title: Translator.trans(/** @Desc("Lookup Tool") */ 'merchant.lookup-tool', {}, 'mobile-native'),
                }}
            />
        </Tab.Navigator>
    );
};

export const CardsStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const screenOptions = getDefaultNavigationOptions(theme, ThemeColors.light.chetwodeBlue);
    const getScreenOptions = useCallback(
        (props) => {
            const mainColorDark = ThemeColors.dark.chetwodeBlue;
            const mainColorLight = ThemeColors.light.chetwodeBlue;
            const {route} = props;

            return {
                ...screenOptions,
                // title: '',
                // @ts-ignore
                headerShadowVisible: route.name !== 'CardsMain',
                headerLeft: () => null,
                mainColorDark,
                mainColorLight,
            };
        },
        [theme],
    );

    return (
        <CardsStack.Navigator screenOptions={getScreenOptions} id='Cards' initialRouteName='CardsMain'>
            <CardsStack.Screen name='CardsMain' component={CardsTabScreen} />
            <CardsStack.Screen
                name='AccountHistoryOffer'
                component={AccountHistoryOfferScreen}
                options={AccountHistoryOfferScreen.navigationOptions}
            />
            <CardsStack.Screen name='MerchantOffer' component={MerchantOfferScreen} options={MerchantOfferScreen.navigationOptions} />
            <CardsStack.Screen name='MerchantReverse' component={MerchantReverseScreen} options={MerchantReverseScreen.navigationOptions} />
            <CardsStack.Screen
                name='SpendAnalysisDetails'
                component={SpendAnalysisDetailsScreen}
                options={SpendAnalysisDetailsScreen.navigationOptions}
            />
            <CardsStack.Screen name='MileValue' component={MileValueScreen} options={MileValueScreen.navigationOptions} />
        </CardsStack.Navigator>
    );
};
