import {RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import React, {useCallback} from 'react';

import {HeaderBackButton} from '../../components/page/header/button';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import {MailboxAddScreen} from '../../screens/mailboxes/add';
import MailboxDetails from '../../screens/mailboxes/details';
import MailboxIMAP from '../../screens/mailboxes/imap';
import Mailboxes from '../../screens/mailboxes/list';
import {OnecardScreen} from '../../screens/other/onecard';
import {PaymentScreen} from '../../screens/other/payment';
import {BalanceWatchCreditsPaymentScreen} from '../../screens/profile/balanceWatchCredit/payment';
import {ProfileEditScreen} from '../../screens/profile/edit';
import {ProfileScreen} from '../../screens/profile/profile';
import SubscriptionCancelScreen from '../../screens/profile/subscription/cancel';
import SubscriptionInfoScreen from '../../screens/profile/subscription/info';
import {TOTPScreen} from '../../screens/profile/two-factor-authentication';
import TOTPCompleteSetupScreen from '../../screens/profile/two-factor-authentication/completeSetup';
import {TOTPManualSetupScreen} from '../../screens/profile/two-factor-authentication/manualSetup';
import TOTPSetupCodeScreen from '../../screens/profile/two-factor-authentication/setupCode';
import {UserDeleteScreen} from '../../screens/profile/userDelete';
import {StoreLocationsScreen} from '../../screens/store-locations';
import {StoreLocationsListScreen} from '../../screens/store-locations/list';
import {ThemeColors, useTheme} from '../../theme';
import {ProfileStackParamList} from '../../types/navigation';
import {CommonScreens} from '../common';
import {ConnectionsScreens} from './connections';

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    // @ts-ignore
    const getScreenOptions = useCallback(
        (props: {route: RouteProp<ProfileStackParamList>; navigation: StackNavigationProp<ProfileStackParamList>}) => {
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
        <ProfileStack.Navigator screenOptions={getScreenOptions} initialRouteName='Profile'>
            <ProfileStack.Screen
                navigationKey='Profile'
                name='Profile'
                component={ProfileScreen}
                options={(props) =>
                    // @ts-ignore
                    ProfileScreen.navigationOptions({...props, theme})
                }
            />
            <ProfileStack.Screen name='ProfileEdit' component={ProfileEditScreen} options={ProfileEditScreen.navigationOptions} />
            <ProfileStack.Screen name='SubscriptionInfo' component={SubscriptionInfoScreen} options={SubscriptionInfoScreen.navigationOptions} />
            <ProfileStack.Screen name='SubscriptionCancel' component={SubscriptionCancelScreen} options={{title: ''}} />
            <ProfileStack.Screen
                name='BalanceWatchCreditsPayment'
                component={BalanceWatchCreditsPaymentScreen}
                options={BalanceWatchCreditsPaymentScreen.navigationOptions}
            />
            <ProfileStack.Screen name='Onecard' component={OnecardScreen} options={OnecardScreen.navigationOptions} />
            <ProfileStack.Screen name='Payment' component={PaymentScreen} options={PaymentScreen.navigationOptions} />
            <ProfileStack.Screen name='StoreLocations' component={StoreLocationsScreen} options={StoreLocationsScreen.navigationOptions} />
            <ProfileStack.Screen
                name='StoreLocationsList'
                component={StoreLocationsListScreen}
                options={StoreLocationsListScreen.navigationOptions}
            />
            <ProfileStack.Screen name='UserDelete' component={UserDeleteScreen} options={UserDeleteScreen.navigationOptions} />
            <ProfileStack.Screen name='TwoFactorAuthentication' component={TOTPScreen} options={TOTPScreen.navigationOptions} />
            <ProfileStack.Screen name='TOTPManualSetup' component={TOTPManualSetupScreen} options={TOTPManualSetupScreen.navigationOptions} />
            <ProfileStack.Screen name='TOTPSetupCode' component={TOTPSetupCodeScreen} options={TOTPSetupCodeScreen.navigationOptions} />
            <ProfileStack.Screen name='TOTPCompleteSetup' component={TOTPCompleteSetupScreen} options={TOTPCompleteSetupScreen.navigationOptions} />
            <ProfileStack.Group key='mailboxes'>
                <ProfileStack.Screen name='Mailboxes' component={Mailboxes} options={Mailboxes.navigationOptions} />
                <ProfileStack.Screen name='MailboxDetails' component={MailboxDetails} options={MailboxDetails.navigationOptions} />
                <ProfileStack.Screen name='MailboxAdd' component={MailboxAddScreen} options={MailboxAddScreen.navigationOptions} />
                <ProfileStack.Screen name='MailboxIMAP' component={MailboxIMAP} options={MailboxIMAP.navigationOptions} />
            </ProfileStack.Group>
            <ProfileStack.Group key='connections'>
                {ConnectionsScreens.map(({name, component}) => (
                    // @ts-ignore
                    <ProfileStack.Screen key={name} name={name} component={component} options={component.navigationOptions} />
                ))}
            </ProfileStack.Group>
            <ProfileStack.Group key='common'>
                {CommonScreens.map(({name, component, options}) => (
                    <ProfileStack.Screen key={name} name={name} component={component} options={options} />
                ))}
            </ProfileStack.Group>
        </ProfileStack.Navigator>
    );
};
