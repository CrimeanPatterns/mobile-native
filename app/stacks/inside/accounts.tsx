import {CompositeScreenProps, RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';

import {HeaderBackButton} from '../../components/page/header/button';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isAndroid} from '../../helpers/device';
import {AccountAddScreen} from '../../screens/accounts/account/add';
import {AccountAutoLoginScreen} from '../../screens/accounts/account/autologin';
import {AccountDetailsBarcodeScreen} from '../../screens/accounts/account/barcode';
import {AccountBalanceChartScreen} from '../../screens/accounts/account/chart';
import {VaccineCardScreen} from '../../screens/accounts/account/covid19';
import {AccountDetailsScreen} from '../../screens/accounts/account/details';
import {AccountEditScreen} from '../../screens/accounts/account/edit';
import {AccountHistoryScreen} from '../../screens/accounts/account/history';
import AccountHistoryOffer from '../../screens/accounts/account/history/offer';
import {AccountDetailsPhonesScreen} from '../../screens/accounts/account/phones';
import AccountPicturesScreen from '../../screens/accounts/account/pictures';
import {AccountScanAddScreen} from '../../screens/accounts/account/scan-add';
import AccountUpdateScreen from '../../screens/accounts/account/update';
import AccountAddListKindScreen from '../../screens/accounts/add/listKind';
import AccountAddListProvider from '../../screens/accounts/add/listProvider';
import DiscoveredAccountAddScreen from '../../screens/accounts/discovered/add';
import DiscoveredAccountsScreen from '../../screens/accounts/discovered/list';
import {AccountListScreen} from '../../screens/accounts/list';
import ScanCardCamera from '../../screens/accounts/scancard/camera';
import ScanCardCrop from '../../screens/accounts/scancard/crop';
import {AccountsTotalsScreen} from '../../screens/accounts/totals';
import AccountsUpdateScreen from '../../screens/accounts/update';
import MileValueScreen from '../../screens/mile-value';
import {BalanceWatchCreditsPaymentScreen} from '../../screens/profile/balanceWatchCredit/payment';
import {StoreLocationsScreen} from '../../screens/store-locations';
import {StoreLocationsListScreen} from '../../screens/store-locations/list';
import {DarkColors} from '../../styles';
import {ThemeColors, useTheme} from '../../theme';
import {AccountsStackParamList, InsideStackScreenParams, RootStackParamList, RootStackScreenProps} from '../../types/navigation';
import {CommonScreens} from '../common';
import {ConnectionsScreens} from './connections';

const AccountsStack = createNativeStackNavigator<AccountsStackParamList>();

export const AccountsStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const screenOptions = getDefaultNavigationOptions(theme, ThemeColors.light.blue);

    const getScreenOptions = useCallback(() => {
        const mainColorDark = ThemeColors.dark.blue;
        const mainColorLight = ThemeColors.light.blue;

        return {
            ...screenOptions,
            mainColorDark,
            mainColorLight,
        };
    }, [screenOptions]);

    const getAccountsListOptions = useCallback((props) => AccountListScreen.navigationOptions({...props, theme}), [theme]);

    return (
        <View style={[{flex: 1}, screenOptions.contentStyle]}>
            <AccountsStack.Navigator screenOptions={getScreenOptions} initialRouteName='AccountsList'>
                <AccountsStack.Screen name='AccountsList' component={AccountListScreen} options={getAccountsListOptions} />

                {/* @ts-ignore */}
                {isAndroid && <AccountsStack.Screen name='Account' component={AccountStackScreen} options={{headerShown: false}} />}
                <AccountsStack.Screen
                    name='AccountAddListProvider'
                    component={AccountAddListProvider}
                    options={AccountAddListProvider.navigationOptions}
                />
                <AccountsStack.Screen
                    name='DiscoveredAccounts'
                    component={DiscoveredAccountsScreen}
                    options={DiscoveredAccountsScreen.navigationOptions}
                />
                <AccountsStack.Screen
                    name='DiscoveredAccountAdd'
                    component={DiscoveredAccountAddScreen}
                    options={DiscoveredAccountAddScreen.navigationOptions}
                />
                <AccountsStack.Screen name='AccountsAdd' component={AccountAddListKindScreen} options={AccountAddListKindScreen.navigationOptions} />
                <AccountsStack.Screen name='AccountScanAdd' component={AccountScanAddScreen} options={AccountScanAddScreen.navigationOptions} />
                <AccountsStack.Screen name='AccountsTotals' component={AccountsTotalsScreen} options={AccountsTotalsScreen.navigationOptions} />
                <AccountsStack.Screen
                    name='AccountsUpdate'
                    component={AccountsUpdateScreen}
                    options={{
                        title: '',
                    }}
                />
                <AccountsStack.Screen name='AccountAdd' component={AccountAddScreen} options={AccountAddScreen.navigationOptions} />
                <AccountsStack.Screen name='AccountUpdate' component={AccountUpdateScreen} options={AccountUpdateScreen.navigationOptions} />
                <AccountsStack.Group>
                    {ConnectionsScreens.map(({name, component}) => (
                        // @ts-ignore
                        <AccountsStack.Screen key={name} name={name} component={component} options={component.navigationOptions} />
                    ))}
                </AccountsStack.Group>
            </AccountsStack.Navigator>
        </View>
    );
};

const AccountStack = createNativeStackNavigator<AccountsStackParamList>();

type AccountStackScreenProps = CompositeScreenProps<
    StackScreenProps<InsideStackScreenParams, 'Account'>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export const AccountStackScreen: React.FunctionComponent<AccountStackScreenProps> = ({route}) => {
    const theme = useTheme();
    const getScreenOptions = useCallback(
        (props: {route: RouteProp<AccountsStackParamList>; navigation: StackNavigationProp<AccountsStackParamList>}) => {
            const {navigation} = props;
            const state = navigation.getState();
            const mainColorDark = ThemeColors.dark.blue;
            const mainColorLight = ThemeColors.light.blue;
            const navigationOptions = getDefaultNavigationOptions(theme, mainColorLight);

            if (state.routes.length === 1) {
                navigationOptions.headerLeft = () => <HeaderBackButton label={Translator.trans('menu.button.accounts', {}, 'menu')} />;
            }

            return {
                ...navigationOptions,
                mainColorDark,
                mainColorLight,
                navigationBarColor: theme === 'dark' ? DarkColors.bgLight : fromColor(mainColorLight).darken(0.125).rgb().string(),
            };
        },
        [theme],
    );

    const initialParams = useMemo(() => {
        // @ts-ignore
        const ID = route.params?.ID;
        // @ts-ignore
        const SubAccountID = route.params?.SubAccountID;

        return {ID, SubAccountID};
    }, [route]);

    return (
        <AccountStack.Navigator screenOptions={getScreenOptions} initialRouteName='AccountDetails'>
            <AccountStack.Screen
                name='AccountDetails'
                component={AccountDetailsScreen}
                options={AccountDetailsScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountPictures'
                component={AccountPicturesScreen}
                options={AccountPicturesScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountBalanceChart'
                component={AccountBalanceChartScreen}
                options={AccountBalanceChartScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountEdit'
                component={AccountEditScreen}
                options={AccountEditScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountUpdate'
                component={AccountUpdateScreen}
                options={AccountUpdateScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountHistory'
                component={AccountHistoryScreen}
                options={AccountHistoryScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen name='AccountHistoryOffer' component={AccountHistoryOffer} options={AccountHistoryOffer.navigationOptions} />
            <AccountStack.Screen
                name='AccountAutoLogin'
                component={AccountAutoLoginScreen}
                options={AccountAutoLoginScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountDetailsPhones'
                component={AccountDetailsPhonesScreen}
                options={AccountDetailsPhonesScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen
                name='AccountDetailsBarcode'
                component={AccountDetailsBarcodeScreen}
                options={AccountDetailsBarcodeScreen.navigationOptions}
                initialParams={initialParams}
            />
            <AccountStack.Screen name='AccountsAdd' component={AccountAddListKindScreen} options={AccountAddListKindScreen.navigationOptions} />
            <AccountStack.Screen
                name={'StoreLocations' /* @ts-ignore */}
                component={StoreLocationsScreen /* @ts-ignore */}
                options={StoreLocationsScreen.navigationOptions}
                initialParams={{
                    // @ts-ignore
                    accountId: route.params?.ID,
                }}
            />
            <AccountStack.Screen
                name='StoreLocationsList'
                component={StoreLocationsListScreen}
                options={StoreLocationsListScreen.navigationOptions}
            />
            <AccountStack.Screen
                name='Covid19'
                component={VaccineCardScreen}
                options={VaccineCardScreen.navigationOptions}
                initialParams={route.params}
            />
            <AccountStack.Screen name='ScanCardCamera' component={ScanCardCamera} options={ScanCardCamera.navigationOptions} />
            <AccountStack.Screen name='ScanCardCrop' component={ScanCardCrop} options={ScanCardCrop.navigationOptions} />
            <AccountStack.Screen
                name='BalanceWatchCreditsPayment'
                component={BalanceWatchCreditsPaymentScreen}
                options={BalanceWatchCreditsPaymentScreen.navigationOptions}
            />
            <AccountStack.Screen name='MileValue' component={MileValueScreen} options={MileValueScreen.navigationOptions} />
            <AccountStack.Group>
                {ConnectionsScreens.map(({name, component}) => (
                    // @ts-ignore
                    <AccountStack.Screen key={name} name={name} component={component} options={component.navigationOptions} />
                ))}
            </AccountStack.Group>
            <AccountStack.Group>
                {CommonScreens.map(({name, component, options}) => (
                    <AccountStack.Screen key={name} name={name} component={component} options={options} />
                ))}
            </AccountStack.Group>
        </AccountStack.Navigator>
    );
};
