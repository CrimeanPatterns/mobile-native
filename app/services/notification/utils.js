import _ from 'lodash';

import Storage from '../../storage';

const STORAGE_KEY = 'notification';
const storageData = {
    deviceId: null,
    token: null,
};
const NotificationEvents = {
    NOTIFICATION_OPENED: 'push:notification_opened',
    TOKEN_RECEIVED: 'push:token_received',
};

export default {
    /**
     * @param {Object} data
     */
    persistData(data) {
        const newData = {
            ...storageData,
            ...Storage.getItem(STORAGE_KEY),
            ...data,
        };

        this.log('persist data', newData);
        Storage.setItem(STORAGE_KEY, newData);
    },

    /**
     * @param {String} key
     */
    retrieveData(key) {
        const data = Storage.getItem(STORAGE_KEY);

        if (_.isObject(data)) {
            return _.get(data, key, null);
        }

        return null;
    },

    getDeviceId() {
        return this.retrieveData('deviceId');
    },

    getDeviceToken() {
        return this.retrieveData('token');
    },

    log(...args) {
        console.log('[NOTIFICATION]', ...args);
    },
};

export {NotificationEvents};
