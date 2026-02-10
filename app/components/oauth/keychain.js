import _ from 'lodash';
import {useEffect} from 'react';
import * as KeychainService from 'react-native-keychain';

import {isIOS} from '../../helpers/device';
import EventEmitter from '../../services/eventEmitter';
import Session from '../../services/session';

const log = (...args) => console.log('[Keychain]', ...args);
const clearToken = (token) => `${token.substr(0, 5)}...${token.substr(-5)}`;

const service = 'secure-auth';
const options = {
    service,
    accessControl: isIOS ? KeychainService.ACCESS_CONTROL.USER_PRESENCE : KeychainService.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    accessible: KeychainService.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationType: KeychainService.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    securityLevel: KeychainService.SECURITY_LEVEL.SECURE_HARDWARE,
    storage: KeychainService.STORAGE_TYPE.RCA,
};
let isSupported = false;

const Keychain = () => {
    useEffect(() => {
        Keychain.testKeychain();
    }, []);

    useEffect(() => {
        const listener = EventEmitter.addListener('doLogout', () => Keychain.removeAccessToken());

        return () => {
            listener.remove();
        };
    });

    return null;
};

Keychain.isSupported = () => isSupported;
Keychain.testKeychain = async () => {
    const testOptions = {...options, service: `${service}-test`};
    const result = await KeychainService.getSupportedBiometryType(testOptions);

    isSupported = result !== null;

    log('test support', {isSupported});

    return isSupported;
};

Keychain.hasAccessToken = () => {
    const hasAccessToken = Session.getProperty('keychain-token');

    log('has access token', hasAccessToken);

    return hasAccessToken;
};
Keychain.setAccessToken = async (token) => {
    let hasAccessToken = false;

    const result = await KeychainService.setGenericPassword('user', token, options);

    if (_.isObject(result)) {
        const {storage} = result;

        hasAccessToken = storage !== null;
    }

    log('set access token', clearToken(token));
    Session.setProperty('keychain-token', hasAccessToken);
};

Keychain.getAccessToken = () =>
    new Promise((resolve, reject) => {
        const config = options;

        config.authenticationPrompt = {
            title: ' ',
        };

        log('request access token', config);

        KeychainService.getGenericPassword(config)
            .then((credentials) => {
                if (_.isObject(credentials)) {
                    const {password} = credentials;

                    log('token is', clearToken(password));
                    resolve(password);
                } else {
                    log('no access token', config);
                    reject();
                }
            })
            .catch(reject);
    });

Keychain.removeAccessToken = () => {
    log('remove access token');
    KeychainService.resetGenericPassword(options);
};

export {Keychain};
