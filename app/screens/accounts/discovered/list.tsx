import Translator from 'bazinga-translator';
import React from 'react';

import DiscoveredAccounts from '../../../components/accounts/discovered';
import {useDiscoveredAccounts} from '../../../hooks/accounts';
import {useTheme} from '../../../theme';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

const DiscoveredAccountsScreen: AccountsStackScreenFunctionalComponent<'DiscoveredAccounts'> = ({navigation}) => {
    const theme = useTheme();
    const {discoveredAccounts, updateDiscoveredAccounts, deleteDiscoveredAccount} = useDiscoveredAccounts();

    return (
        <DiscoveredAccounts
            theme={theme}
            discoveredAccounts={discoveredAccounts}
            updateDiscoveredAccounts={updateDiscoveredAccounts}
            deleteDiscoveredAccount={deleteDiscoveredAccount}
            navigation={navigation}
        />
    );
};

DiscoveredAccountsScreen.navigationOptions = () =>
    // const headerBackTitle = Translator.trans('buttons.back', {}, 'mobile');

    ({
        // headerBackTitle,
        // headerTruncatedBackTitle: headerBackTitle,
        title: Translator.trans(/** @Desc('Discovered Accounts') */ 'discovered-accounts', {}, 'mobile-native'),
    });

export default DiscoveredAccountsScreen;
