import _ from 'lodash';
import {StatusBar} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import url from 'url';

import {isIOS, isTablet} from '../../helpers/device';
import API from '../../services/api';

const statusBarStyle = isTablet ? 'dark-content' : 'light-content';
let oldStatusBarStyle;

export function changeStatusBarStyle() {
    if (isIOS) {
        oldStatusBarStyle = StatusBar.pushStackEntry({
            barStyle: statusBarStyle,
            animate: false,
        });
    }
}

export function resetStatusBarStyle() {
    if (oldStatusBarStyle) {
        StatusBar.popStackEntry(oldStatusBarStyle);
    }
}

export async function signIn(provider, config = {}, signInProvider) {
    const {loginHint: email, ...rest} = config;
    const response = await API.post(`/oauth/${provider}`, {email, ...rest});
    const {data} = response;

    if (_.isObject(data)) {
        const {success} = data;

        if (success) {
            return {success};
        }

        return signInProvider({...config, ...data});
    }

    return undefined;
}

export function signInComplete(config) {
    return API.post(`/oauth/callback`, config);
}

export async function signInProvider(config) {
    const {consentUrl, redirectUrl} = config;
    let successCode;

    changeStatusBarStyle();

    const response = await InAppBrowser.openAuth(consentUrl, redirectUrl, {
        // iOS Properties
        ephemeralWebSession: false,
        // Android Properties
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
    });
    const {type} = response;

    if (type === 'success') {
        const {url: tokenUrl} = response;
        const {
            query: {code},
        } = url.parse(tokenUrl, true);

        if (_.isEmpty(code) === false) {
            successCode = code;
        }
    }

    resetStatusBarStyle();

    if (!successCode) {
        throw new Error('cancel');
    }

    return {code: successCode, ...config};
}

export const propsAreEqual = (prevProps, nextProps) => prevProps.theme === nextProps.theme && prevProps.onPress === nextProps.onPress;
