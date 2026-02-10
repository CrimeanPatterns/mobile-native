import _ from 'lodash';

import {useProfileData} from '../../../hooks/profile';
import {useWillMount} from '../../../hooks/react';
import {PathConfig} from '../../../navigation/linking';
import AccountsList from '../../../services/accountsList';
import {navigateByPath} from '../../../services/navigator';
import {IAccount} from '../../../types/account';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

const VaccineCardScreen: AccountsStackScreenFunctionalComponent<'Covid19'> = () => {
    const profile = useProfileData();

    useWillMount(() => {
        const accounts: Record<string, IAccount> = AccountsList.getAccounts();

        if (_.isObject(accounts)) {
            const vaccineCard = _.chain(Object.values(accounts))
                .filter((account) => account.VaccineCardAccount === true && account.UserID === profile.UserID && _.isNil(account.UserAgentID))
                .orderBy(['ID'], ['desc'])
                .head()
                .value();

            if (_.isNil(vaccineCard)) {
                navigateByPath(PathConfig.AccountAdd, {providerId: 'vaccine-card'});
            } else {
                navigateByPath(PathConfig.AccountDetails, {ID: vaccineCard.TableName[0].toLowerCase() + vaccineCard.ID});
            }
        }
    });

    return null;
};

VaccineCardScreen.navigationOptions = () => ({title: ''});

export {VaccineCardScreen};
