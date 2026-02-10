import _ from 'lodash';
import React, {PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react';

import {useWillMount} from '../hooks/react';
import AccountsList from '../services/accountsList';
import Booking from '../services/booking';
import CentrifugeProvider from '../services/centrifuge';
import EventEmitter from '../services/eventEmitter';
import LocaleManager from '../services/localeManager';
import Session from '../services/session';
import Timeline, {TimelineEntity} from '../services/timeline';
import UserSettings from '../services/userSettings';
import Storage from '../storage';
import {IProfile} from '../types/profile';

type IStorageProvider = {
    accounts: unknown;
    accountsOptions: unknown;
    profile: Partial<IProfile>;
    timeline: TimelineEntity[] | undefined;
    booking: unknown;
    constants:
        | {
              [key: string]: unknown;
              providerKinds;
          }
        | undefined;
    discoveredAccounts: unknown;
};

export const StorageContext = React.createContext<IStorageProvider>({
    accounts: undefined,
    accountsOptions: undefined,
    profile: {},
    timeline: undefined,
    booking: undefined,
    constants: undefined,
    discoveredAccounts: undefined,
});

export const StorageProvider: React.FunctionComponent<PropsWithChildren> = ({children}) => {
    const getStorageValues = useCallback(() => {
        const booking = Storage.getItem('booking');
        const accounts = Storage.getItem('accounts');
        const accountsOptions = Storage.getItem('accountsOptions');
        const discoveredAccounts = Storage.getItem('discoveredAccounts');
        const timeline = Storage.getItem('timeline');
        const profile = Storage.getItem('profile');
        const constants = Storage.getItem('constants');

        return {
            accounts,
            booking,
            discoveredAccounts,
            timeline,
            profile,
            constants,
            accountsOptions,
        };
    }, []);

    const [storage, setStorage] = useState<IStorageProvider>(getStorageValues);

    useEffect(() => {
        const listener = EventEmitter.addListener('storage:loaded', () => {
            setStorage(getStorageValues());
        });

        return () => listener.remove();
    }, []);

    const updateServices = useCallback(() => {
        const {profile, constants, accounts, discoveredAccounts, timeline, booking, accountsOptions} = storage;

        if (profile) {
            const {centrifugeConfig, language, locations, settings, UserID: userId} = profile;

            if (_.isObject(centrifugeConfig)) {
                CentrifugeProvider.configure(centrifugeConfig);
            }

            if (accounts) {
                // @ts-ignore
                const {providerKinds} = constants;

                AccountsList.set({accounts, discoveredAccounts, providerKinds, userId, accountsOptions});
            }

            if (timeline) {
                Timeline.setList(timeline);
            }

            if (booking) {
                Booking.set(booking);
            }

            if (settings) {
                UserSettings.extend(settings);
            }

            if (_.isObject(locations)) {
                Session.setProperty('locations-total', locations.total || 0);
                Session.setProperty('locations-tracked', locations.tracked || 0);
            }

            LocaleManager.set(language); // TODO: component
        }
    }, [storage]);

    useWillMount(updateServices);

    useEffect(() => {
        updateServices();
    }, [storage]);

    return <StorageContext.Provider value={storage}>{children}</StorageContext.Provider>;
};

export const useStorageContext = (): IStorageProvider => useContext(StorageContext);

export const useStorage = <T extends keyof IStorageProvider>(key: T): IStorageProvider[T] => {
    const storage = useStorageContext();

    return storage[key];
};
