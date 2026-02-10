import {useNavigation, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import React, {useCallback, useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';
// @ts-ignore
import QuickActions from 'react-native-quick-actions';

import {isIOS} from '../helpers/device';
import {PathConfig} from '../navigation/linking';
import {navigateByPath} from '../services/navigator';

const log = (...args) => console.log('[QuickActionHandler]', ...args);

const getQuickActionConfig = () => {
    const accountsLabel = Translator.trans('menu.button.accounts', {}, 'menu');
    const tripsLabel = Translator.trans('menu.button.trips', {}, 'menu');
    const bookingLabel = Translator.trans('menu.button.bookings', {}, 'menu');

    return {
        accounts: {
            type: 'accounts',
            title: accountsLabel,
            subtitle: accountsLabel,
            icon: 'ic_shortcut_accounts',
            userInfo: {
                path: PathConfig.AccountsList,
            },
        },
        trips: {
            type: 'trips',
            title: tripsLabel,
            subtitle: tripsLabel,
            icon: 'ic_shortcut_trips',
            userInfo: {
                path: PathConfig.Timeline,
            },
        },
        booking: {
            type: 'booking',
            title: bookingLabel,
            subtitle: bookingLabel,
            icon: 'ic_shortcut_bookings',
            userInfo: {
                path: PathConfig.Bookings,
            },
        },
    };
};

export const initAndroidDynamicQuickActions = (): void => {
    if (isIOS) {
        return;
    }

    QuickActions.clearShortcutItems();
    QuickActions.setShortcutItems(Object.values(getQuickActionConfig()));
};

export const QuickActionHandler: React.FunctionComponent<{
    initialRedirect: ({navigation, route}) => void;
}> = ({initialRedirect}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const onQuickAction = useCallback((action) => {
        const {
            userInfo: {path},
        } = action;

        log('navigate', action);
        navigateByPath(path);
    }, []);

    useEffect(() => {
        const listener = DeviceEventEmitter.addListener('quickActionShortcut', onQuickAction);

        return () => listener.remove();
    }, []);

    useEffect(() => {
        const init = async () => {
            const initialAction = await QuickActions.popInitialAction();

            if (initialAction) {
                log('initialRedirect', initialAction);
                onQuickAction(initialAction);
            } else {
                initialRedirect({navigation, route});
            }

            initAndroidDynamicQuickActions();
        };

        init();

        return () => QuickActions.clearShortcutItems();
    }, []);

    return null;
};
