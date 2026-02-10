import {CommonActions, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

import {useStorage} from '../context/storage';
import Session from '../services/session';
import {IProfile} from '../types/profile';

export const useProfileData = (): IProfile => {
    const profile = useStorage('profile');

    return {
        ...profile,
        lastSyncDate: parseInt(Session.getProperty('timestamp'), 10),
    } as IProfile;
};

export const useProfileScreenReload = (): (() => void) => {
    const navigation = useNavigation();

    return useCallback(() => {
        navigation.dispatch((state) => {
            const {routes} = state;

            return {
                ...CommonActions.setParams({reload: true}),
                source: routes[0].key,
            };
        });
    }, [navigation]);
};
