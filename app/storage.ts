import AsyncStorage from '@react-native-async-storage/async-storage';

import {Bugsnag} from './bugsnag';
import EventEmitter from './services/eventEmitter';

const storage = new Map();

const safeParseJson = (key, str) => {
    let outputStr;

    try {
        outputStr = JSON.parse(str);
    } catch (e) {
        Bugsnag.leaveBreadcrumb('safeParseJson, try', {key, str});
        outputStr = JSON.parse(JSON.stringify(str));
    }

    return outputStr;
};

const log = (...args) => {
    console.log('[STORAGE]', ...args);
};

const getItem = (key) =>
    new Promise((resolve) => {
        try {
            AsyncStorage.getItem(key)
                .then((value) => resolve([key, value]))
                .catch(() => resolve([key, null]));
        } catch (e) {
            resolve([key, null]);
        }
    });

/**
 * @class Storage
 */
class Storage {
    static prefix = 'AwardWallet@';

    constructor() {
        this.clear = this.clear.bind(this);
        EventEmitter.addListener('logout', this.clear);
    }

    async sync() {
        await this.loadKeys();
    }

    loadKeys = async () => {
        const keys = await AsyncStorage.getAllKeys();
        const keysValues = await Promise.all(keys.filter((key) => key.indexOf(Storage.prefix) > -1).map(getItem));

        keysValues.forEach(([key, value]) => {
            const storageKey = key.replace(Storage.prefix, '');

            storage.set(storageKey, safeParseJson(storageKey, value));
        });
    };

    /**
     * @desc Returns formatted key name.
     * @returns {String}
     * @private
     */
    getKey = (key) => Storage.prefix + key;

    /**
     * @method setItem
     * @desc Add a key-value pair to the async storage.
     * @param {String} key The identifier of the item.
     * @param {*} value The value of the item to add to the storage.
     */
    setItem(key, value) {
        storage.set(key, value);
        AsyncStorage.setItem(this.getKey(key), JSON.stringify(value));
    }

    /**
     * @method multiSet
     * @desc Add a key-value pairs to the async storage.
     * @param {Array} keyValues items to add to the storage.
     */
    multiSet(keyValues) {
        AsyncStorage.multiSet(
            keyValues
                .map(([key, value]) => {
                    if (key !== 'translationKeys') {
                        storage.set(key, value);
                        return [this.getKey(key), JSON.stringify(value)];
                    }

                    return null;
                })
                .filter((item) => item),
        );
    }

    /**
     * @method getItem
     * @desc Retrieve the item from the storage with the specified key.
     * @param {String} key The key of the item to retrieve.
     * @param {*} defaultValue The default value of the item to retrieve.
     * @returns {*} The value of the item in the storage with the specified key.
     */
    getItem = (key, defaultValue = null) => {
        if (storage.has(key)) {
            return storage.get(key);
        }

        return defaultValue;
    };

    /**
     * @method clear
     * @desc Clear the storage
     */
    clear() {
        const storageKeys = Array.from(storage.keys())
            .filter((key) => key !== 'synchronized')
            .map((key) => this.getKey(key));

        AsyncStorage.multiRemove(storageKeys);
        storage.clear();

        log('cleared');
    }
}

export default new Storage();
