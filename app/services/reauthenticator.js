import * as Keychain from 'react-native-keychain';

import {isIOS} from '../helpers/device';
import SessionStorage from './session';

const service = 'secure-auth';
const options = {
    service,
    // accessControl: Keychain.ACCESS_CONTROL.DEVICE_PASSCODE,
    accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
};

export const hasKeychainAccess = () => {
    if (isIOS) {
        return Keychain.canImplyAuthentication(options);
    }

    return true;
};

export const hasKeychainPassword = () => SessionStorage.getProperty('keychain-token');

export const setKeychainPassword = (password) => {
    SessionStorage.setProperty('keychain-token', true);

    Keychain.setGenericPassword('token', password, options);
};
