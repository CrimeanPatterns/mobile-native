import {useEffect, useState} from 'react';

import AccountsList from '../services/accountsList';
import EventEmitter from '../services/eventEmitter';
import type {IAccount} from '../types/account';

type AccountData = {
    account: IAccount;
    parentAccount?: IAccount;
};

const getAccount = (id: string, subId?: string): AccountData => {
    const account = AccountsList.getAccount(id);
    let subAccount;

    if (subId) {
        subAccount = AccountsList.getAccount(id, subId);

        return {
            account: subAccount,
            parentAccount: account,
        };
    }

    return {
        account,
    };
};

export const useAccount = (accountId: string, subAccountId?: string): AccountData => {
    const [accountData, setAccountData] = useState<AccountData>(getAccount(accountId, subAccountId));

    useEffect(() => {
        const listener = EventEmitter.addListener('accountsList:update', () => {
            setAccountData(getAccount(accountId, subAccountId));
        });

        return () => {
            listener.remove();
        };
    }, [accountId, subAccountId]);

    return accountData;
};
