/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import {Alert, Platform} from 'react-native';
import ApiSignature from 'react-native-api-signature';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import Prompt from 'react-native-prompt-android';

import {Keychain} from '../components/oauth/keychain';
import {Tracking} from '../components/tracking';
import {isIOS} from '../helpers/device';
import EventEmitter from './eventEmitter';
import GlobalError, {httpErrors} from './globalError';
import LocaleManager from './localeManager';
import NotificationUtils from './notification/utils';

const APP_VERSION = DeviceInfo.getVersion();
const {API_URL} = Config;
const BASE_URL = `${API_URL}/m/api`;

declare module 'axios' {
    export interface AxiosRequestConfig {
        globalError?: boolean;
        retry?: number;
    }
}

const HEADERS = {
    ACCEPT_TIMEZONE: 'accept-timezone',
    ACCEPT_LANGUAGE: 'accept-language',
    X_AW_VERSION: 'x-aw-version',
    X_AW_PLATFORM: 'x-aw-platform',
    X_XSRF_TOKEN: 'x-xsrf-token',
    X_XSRF_FAILED: 'x-xsrf-failed',
    X_AW_DEVICE_ID: 'x-aw-device-id',
    X_AW_SECURE_TOKEN: 'x-aw-secure-token',
    X_AW_SECURE_VALUE: 'x-aw-secure-value',
    X_AW_DEVICE_UUID: 'x-aw-device-uuid',
    X_AW_DEVICE_TOKEN: 'x-aw-device-token',
    X_AW_REAUTH_CONTEXT: 'x-aw-reauth-context',
    X_AW_REAUTH_REQUIRED: 'x-aw-reauth-required',
    X_AW_REAUTH_INPUT: 'x-aw-reauth-input',
    X_AW_REAUTH_INTENT: 'x-aw-reauth-intent',
    X_AW_REAUTH_ERROR: 'x-aw-reauth-error',
    X_AW_REAUTH_RETRY: 'x-aw-reauth-retry',
    X_AW_EXTERNAL_TRACKING: 'x-aw-external-tracking',
};

const X_AW_REAUTH = {
    CONTEXT_PASSWORD: 'password',
    CONTEXT_OTC: 'code',
    CONTEXT_KEYCHAIN: 'keychain',
};

const {
    ACCEPT_TIMEZONE,
    ACCEPT_LANGUAGE,
    X_AW_VERSION,
    X_AW_PLATFORM,
    X_XSRF_TOKEN,
    X_XSRF_FAILED,
    X_AW_DEVICE_ID,
    X_AW_SECURE_TOKEN,
    X_AW_SECURE_VALUE,
    X_AW_DEVICE_UUID,
    X_AW_DEVICE_TOKEN,
    X_AW_REAUTH_CONTEXT,
    X_AW_REAUTH_REQUIRED,
    X_AW_REAUTH_INPUT,
    X_AW_REAUTH_INTENT,
    X_AW_REAUTH_ERROR,
    X_AW_REAUTH_RETRY,
    X_AW_EXTERNAL_TRACKING,
} = HEADERS;

const API = axios.create({});

API.defaults.baseURL = BASE_URL;
API.defaults.headers.common[X_AW_VERSION] = APP_VERSION;
API.defaults.headers.common[X_AW_PLATFORM] = Platform.OS;
API.defaults.timeout = 30000;

let xsrf = '';
let token;
let deviceCheckToken = null;
let deviceUUID = '';

function getXSRFToken() {
    return xsrf;
}

function setXSRFToken(token: string) {
    xsrf = token;
}

function setXSRFTokenFromResponse(response) {
    if (response && response.headers && response.headers[X_XSRF_TOKEN]) {
        setXSRFToken(response.headers[X_XSRF_TOKEN]);
    }
}

function setDeviceToken(token) {
    deviceCheckToken = token;
}

DeviceInfo.getUniqueId().then((id) => (deviceUUID = id));
if (isIOS) {
    DeviceInfo.getDeviceToken().then(setDeviceToken).catch(_.noop);
}

function getAPIHeaders() {
    const deviceId = NotificationUtils.getDeviceId();
    const headers = {
        [X_AW_PLATFORM]: Platform.OS,
        [X_AW_VERSION]: APP_VERSION,
        [ACCEPT_TIMEZONE]: String(-new Date().getTimezoneOffset() / 60),
        [ACCEPT_LANGUAGE]: LocaleManager.get(),
        [X_AW_DEVICE_UUID]: deviceUUID,
    };

    if (xsrf) {
        headers[X_XSRF_TOKEN] = xsrf;
    }

    if (deviceId) {
        headers[X_AW_DEVICE_ID] = String(NotificationUtils.getDeviceId());
    }

    if (deviceCheckToken) {
        // @ts-ignore
        headers[X_AW_DEVICE_TOKEN] = deviceCheckToken;
    }

    return headers;
}

// External tracking
API.interceptors.response.use((response) => {
    if (_.isObject(response)) {
        const {headers} = response;

        if (_.isObject(headers)) {
            if (headers[X_AW_EXTERNAL_TRACKING]) {
                console.log(`[Tracking] handle header`, headers[X_AW_EXTERNAL_TRACKING]);
                Tracking.track(headers[X_AW_EXTERNAL_TRACKING]);
            }
        }
    }

    return response;
}, undefined);

// Do not handle canceled requests
API.interceptors.response.use(undefined, (rejection) => {
    if (axios.isCancel(rejection)) {
        return false;
    }

    return Promise.reject(rejection);
});

// Global interceptor
API.interceptors.request.use((config) => {
    // @ts-ignore
    const {retry = 3} = config;

    // @ts-ignore
    config.retry = retry;
    config.headers = {
        ...config.headers,
        ...getAPIHeaders(),
    };

    if (Keychain.hasAccessToken() && ![X_AW_REAUTH.CONTEXT_OTC, X_AW_REAUTH.CONTEXT_PASSWORD].includes(config.headers[X_AW_REAUTH_CONTEXT])) {
        config.headers[X_AW_REAUTH_CONTEXT] = X_AW_REAUTH.CONTEXT_KEYCHAIN;
    }

    if (token) {
        // secure token
        return ApiSignature.createApiSignature(token, 'sha-256').then((signature) => {
            config.headers[X_AW_SECURE_TOKEN] = signature;
            config.headers[X_AW_SECURE_VALUE] = token;
            token = null;
            return config;
        });
    }

    return config;
}, undefined);

// Logout interceptor
API.interceptors.response.use(undefined, (rejection) => {
    const {response} = rejection;

    if (response && response.status === 403 && response.data && response.data.logout === true) {
        rejection.config.retry = 0;
        EventEmitter.emit('doLogout');
    }

    return Promise.reject(rejection);
});

API.interceptors.response.use(
    (response) => {
        if (response && response.headers && response.headers[X_AW_SECURE_TOKEN]) {
            token = response.headers[X_AW_SECURE_TOKEN];
        }

        return response;
    },
    (rejection) => {
        const {response, config} = rejection;

        if (
            response &&
            response.status === 403 &&
            response.headers &&
            response.headers[X_AW_SECURE_TOKEN] &&
            _.isUndefined(response.headers[X_XSRF_FAILED])
        ) {
            token = response.headers[X_AW_SECURE_TOKEN];

            return API(config);
        }

        return Promise.reject(rejection);
    },
);

// XSRF interceptor
API.interceptors.response.use(
    (response) => {
        setXSRFTokenFromResponse(response);

        return response;
    },
    (rejection) => {
        const {response} = rejection;

        setXSRFTokenFromResponse(response);

        return Promise.reject(rejection);
    },
);

function askPassword(context, text) {
    let message = Translator.trans('provide-aw-password');

    if (context === X_AW_REAUTH.CONTEXT_OTC) {
        message = text;
    }

    return new Promise((resolve, reject) => {
        let buttons = [
            {
                text: Translator.trans('form.button.submit'),
                onPress: (input) => {
                    if (_.isString(input) && input.length > 0) {
                        resolve({input});
                    }
                },
            },
        ];

        if (context === X_AW_REAUTH.CONTEXT_OTC) {
            buttons.push({
                text: Translator.trans('button.resend'),
                onPress: () => resolve({resend: true}),
            });
        }

        buttons.push({
            text: Translator.trans('alerts.btn.cancel'),
            onPress: reject,
        });

        if (buttons.length === 2) {
            buttons = buttons.reverse();
        }

        Prompt(message, undefined, buttons, {
            type: context === X_AW_REAUTH.CONTEXT_PASSWORD ? 'secure-text' : 'plain-text',
            cancelable: false,
        });
    });
}

const needRetry = (rejection) => {
    if (_.isObject(rejection) && _.has(rejection, 'config')) {
        const {
            // @ts-ignore
            response,
            // @ts-ignore
            config: {retry = 0},
        } = rejection;

        if (retry > 0) {
            if (!response) {
                return true;
            }

            if (response.status === 403 && _.isUndefined(response.headers[X_XSRF_FAILED]) === false) {
                return true;
            }

            return ![400, 403, 404, 500].includes(response.status);
        }
    }

    return false;
};

// Retry interceptor
API.interceptors.response.use(undefined, (rejection) => {
    if (needRetry(rejection)) {
        const {config} = rejection;
        const {__retryCount: retryCount = 0, retry} = config;

        config.__retryCount = retryCount + 1;
        config.__isRetryRequest = true;

        if (config.__retryCount < retry) {
            const promise = new Promise((resolve) => {
                setTimeout(resolve, 0.5 * (2 ** config.__retryCount - 1) * 1000);
            });

            return promise.then(() => API(config));
        }
    }

    return Promise.reject(rejection);
});

const alert = (message) =>
    new Promise((resolve) =>
        Alert.alert(
            '',
            message,
            [
                {
                    text: Translator.trans('button.ok', {}, 'messages'),
                    onPress: resolve,
                },
            ],
            {cancelable: false},
        ),
    );

const retryReauth = (rejection) => {
    const {config, response} = rejection;
    const {headers} = response;

    if (headers[X_AW_REAUTH_RETRY] === String(true)) {
        delete config.headers[X_AW_REAUTH_CONTEXT];
        delete config.headers[X_AW_REAUTH_INPUT];
        return API(config);
    }

    return Promise.reject(rejection);
};

const showAuthError = async (rejection) => {
    const {response} = rejection;
    const {headers} = response;

    await alert(headers[X_AW_REAUTH_ERROR]);

    return retryReauth(rejection);
};

// Handle x-aw-reauth-*
API.interceptors.response.use(
    (response) => {
        if (_.has(response, 'headers')) {
            const {headers} = response;

            if (_.isObject(headers)) {
                const token = headers[X_AW_REAUTH_INPUT];

                if (headers[X_AW_REAUTH_CONTEXT] === X_AW_REAUTH.CONTEXT_KEYCHAIN && !_.isEmpty(token)) {
                    Keychain.setAccessToken(token);
                }
            }
        }
        return response;
    },
    (rejection) => {
        const {config, response} = rejection;

        if (_.isObject(response)) {
            // @ts-ignore
            const {headers} = response;

            if (_.isObject(headers)) {
                if (headers[X_AW_REAUTH_ERROR]) {
                    return showAuthError(rejection);
                }

                if (headers[X_AW_REAUTH_REQUIRED]) {
                    const context = headers[X_AW_REAUTH_CONTEXT];

                    if (context === X_AW_REAUTH.CONTEXT_KEYCHAIN) {
                        return Keychain.getAccessToken()
                            .then((input) => {
                                config.headers[X_AW_REAUTH_CONTEXT] = context;
                                config.headers[X_AW_REAUTH_INPUT] = input;
                                return API(config);
                            })
                            .catch(() => {
                                config.headers[X_AW_REAUTH_CONTEXT] = X_AW_REAUTH.CONTEXT_PASSWORD;
                                return API(config);
                            });
                    }

                    if ([X_AW_REAUTH.CONTEXT_PASSWORD, X_AW_REAUTH.CONTEXT_OTC].includes(context)) {
                        // @ts-ignore
                        return askPassword(context, headers[X_AW_REAUTH_REQUIRED]).then(({input, resend = false}) => {
                            config.headers[X_AW_REAUTH_CONTEXT] = context;

                            if (input) {
                                config.headers[X_AW_REAUTH_INPUT] = input;
                            }

                            if (resend) {
                                config.headers[X_AW_REAUTH_INTENT] = 'resend';
                            }

                            return API(config);
                        });
                    }
                }
            }
        }

        return Promise.reject(rejection);
    },
);

// Global error interceptor
API.interceptors.response.use(undefined, (rejection) => {
    const {response, config} = rejection;

    if (config && config.globalError !== false) {
        if (response) {
            const {status, data} = response;

            if (status !== 304 && status > 0) {
                if (!_.isEmpty(httpErrors[status])) {
                    GlobalError.show(status);
                } else if (_.isObject(data) && _.has(data, 'error')) {
                    // @ts-ignore
                    const {error} = data;

                    GlobalError.showMessage(error);
                } else {
                    GlobalError.show(0);
                }
            }
        } else {
            GlobalError.show(0);
        }
    }

    // TODO: update all catch methods
    return Promise.reject(rejection);
});

export default API;
export {APP_VERSION, API_URL, BASE_URL, deviceUUID, getXSRFToken, setXSRFToken, getAPIHeaders};
