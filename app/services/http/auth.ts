import CookieManager from '@react-native-cookies/cookies';
import _ from 'lodash';

import {isIOS} from '../../helpers/device';
import API from '../api';
import EventEmitter from '../eventEmitter';
import Session from '../session';
import StorageSync from '../storageSync';

function loginStatus() {
    return API.get<{authorized: boolean}>('/login_status');
}

function isLoginIn() {
    return new Promise((resolve, reject) => {
        if (Session.authorized() != null) {
            resolve(Session.authorized());
        } else {
            loginStatus()
                .then(
                    (response) => {
                        const {data} = response;

                        if (_.isObject(data) && data.authorized) {
                            Session.setProperty('authorized', data.authorized);
                            resolve(true);
                        } else {
                            Session.setProperty('authorized', false);
                            reject(false);
                        }
                    },
                    () => {
                        Session.setProperty('authorized', false);
                        reject(false);
                    },
                )
                .catch((e) => {
                    console.log(e);
                });
        }
    });
}

function login(user) {
    return new Promise((resolve, reject) => {
        loginStatus()
            .then((response) => {
                // eslint-disable-next-line no-eval
                const xScripted = eval(response.headers['x-scripted']);

                if (response.data && _.isObject(response.data)) {
                    return API.post(
                        '/login_check',
                        {...user, _remember_me: 1},
                        xScripted && {
                            headers: {
                                'x-scripted': xScripted,
                            },
                        },
                    ).then(resolve, reject);
                }
                return reject(response);
            })
            .catch(reject);
    });
}

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
async function _logout(impersonated = false) {
    try {
        await API.get('/logout', {globalError: false});
    } finally {
        if (!impersonated) {
            await CookieManager.clearAll();
            if (isIOS) {
                CookieManager.clearAll(true);
            }
        }
    }
}

async function logoutImpersonated() {
    Session.setProperty('impersonated', false);
    try {
        await _logout(true);
    } finally {
        StorageSync.forceUpdate();
    }
}

function logout() {
    return new Promise<void>((resolve, reject) => {
        if (Session.getProperty('impersonated') === true) {
            reject();
            logoutImpersonated();
            return;
        }
        _logout();
        EventEmitter.emit('logout');
        resolve();
    });
}

export default {
    loginStatus,
    isLoginIn,
    login,
    logout,
};
