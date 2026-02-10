import dynamicLinks from '@react-native-firebase/dynamic-links';
import {isFunction} from 'lodash';
import {useEffect} from 'react';
import {Linking} from 'react-native';

import EventEmitter from '../services/eventEmitter';
import {getFirstAppOpen, setFirstAppOpen} from '../services/session';
import {handleOpenUrl} from './handleOpenUrl';

let restorationUrl;
let initialUrlHandled = false;
const log = (...args) => {
    console.log('[restorationHandler]', ...args);
};

const getInitialUrl = async () => {
    let initialUrl;

    if (restorationUrl) {
        log('has restorationUrl', restorationUrl);
        return restorationUrl;
    }

    try {
        initialUrl = await dynamicLinks().getInitialLink();
        if (initialUrl) {
            initialUrl = initialUrl.url;
        }
    } finally {
        log('Firebase.links().getInitialLink', initialUrl);

        if (!initialUrl) {
            initialUrl = await Linking.getInitialURL();
            log('Linking.getInitialURL', initialUrl);
        }
    }

    if (!initialUrlHandled) {
        initialUrlHandled = true;
        return initialUrl;
    }
    return null;
};

const restorationHandler = async (url) => {
    let initialUrl;

    let handled;

    if (url) {
        initialUrl = url;
    } else {
        initialUrl = await getInitialUrl();
    }

    if (initialUrl) {
        handled = handleOpenUrl({url: initialUrl});

        log(initialUrl, {handled});

        if (!handled) {
            log('set restorationUrl', {initialUrl});

            restorationUrl = initialUrl;
        } else {
            log('clear restorationUrl');
            restorationUrl = null;
        }
    }
};

const linkingHandler = ({url}) => restorationHandler(url);
const initialHandler = async () => {
    await restorationHandler();
    /* eslint-disable camelcase */
    const firstAppOpen = getFirstAppOpen();

    if (firstAppOpen) {
        setFirstAppOpen(false);
    }
    /* eslint-enable camelcase */
};

export const RestorationHandler = () => {
    useEffect(() => {
        let unsubscribeDynamicLink;
        // let linkingListener;

        (async function init() {
            await initialHandler();

            // linkingListener = Linking.addEventListener('url', linkingHandler);
            unsubscribeDynamicLink = dynamicLinks().onLink((link) => {
                console.log(`Firebase.links().onLink`, link);
                restorationHandler(link.url);
            });
        })();

        return () => {
            // linkingListener?.remove();

            if (isFunction(unsubscribeDynamicLink)) {
                unsubscribeDynamicLink();
            }
        };
    }, []);

    useEffect(() => {
        const listener = EventEmitter.addListener('doLogout', () => (restorationUrl = null));

        return () => {
            listener.remove();
        };
    });

    return null;
};
