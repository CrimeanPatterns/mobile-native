import {useCallback, useEffect, useState} from 'react';

import AccountsListService from '../services/accountsList';
import AccountsList from '../services/accountsList';
import EventEmitter from '../services/eventEmitter';
import AccountApi from '../services/http/account';
import StorageSync from '../services/storageSync';
import {IAccount} from '../types/account';

export type IDiscoveredAccount = {
    email: string;
    id: number;
    provider: string;
    login: string;
};

export const useDiscoveredAccounts = () => {
    const [discoveredAccounts, setDiscoveredAccounts] = useState<IDiscoveredAccount[]>(AccountsListService.getDiscoveredAccounts());

    const updateDiscoveredAccounts = useCallback(async () => {
        await StorageSync.forceUpdate();
        setDiscoveredAccounts(AccountsListService.getDiscoveredAccounts());
    }, []);

    const deleteDiscoveredAccount = useCallback(async (id: number) => {
        await AccountApi.remove('account', id);
        updateDiscoveredAccounts();
    }, []);

    useEffect(() => {
        const listener = EventEmitter.addListener('accountsList:update', () => {
            setDiscoveredAccounts(AccountsListService.getDiscoveredAccounts());
        });

        return () => listener.remove();
    }, []);

    return {
        discoveredAccounts,
        updateDiscoveredAccounts,
        deleteDiscoveredAccount,
    };
};

export const useAccounts = () => {
    const [accounts, setAccounts] = useState<{[key: string]: IAccount}>(AccountsList.getAccounts());

    useEffect(() => {
        const listener = EventEmitter.addListener('accountsList:update', () => {
            setAccounts(AccountsList.getAccounts());
        });

        return () => listener.remove();
    }, []);

    return {accounts};
};
