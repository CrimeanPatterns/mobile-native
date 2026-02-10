import {isTablet} from '../helpers/device';
import Storage from '../storage';
import EventEmitter from './eventEmitter';

const SETTINGS_KEY = 'settings';

const defaultUserSettings = {
    sound: true,
    vibrate: true,
    mpDisableAll: false,
    mpBookingMessages: true,
    mpCheckins: true,
    mpRetailCards: true,
};

function isVibrationSupported() {
    return !isTablet;
}

class UserSettings {
    constructor() {
        this.load();
    }

    load() {
        const cache = Storage.getItem(SETTINGS_KEY);

        if (!cache) {
            this.settings = {
                ...defaultUserSettings,
            };
        } else {
            this.settings = {
                ...defaultUserSettings,
                ...cache,
            };
        }

        Storage.setItem(SETTINGS_KEY, this.settings);
    }

    has(name) {
        return typeof this.settings[name] !== 'undefined';
    }

    get(name) {
        return this.settings[name];
    }

    set(name, value) {
        this.extend({[name]: value});
    }

    extend(settings) {
        const changed = {};
        let fireEvent = false;

        // eslint-disable-next-line no-restricted-syntax
        for (const settingName of Object.keys(this.settings)) {
            changed[settingName] = false;
            if (typeof settings[settingName] !== 'undefined' && this.settings[settingName] !== settings[settingName]) {
                changed[settingName] = true;
                fireEvent = true;
            }
        }

        this.settings = {
            ...this.settings,
            ...settings,
        };
        Storage.setItem(SETTINGS_KEY, this.settings);

        if (fireEvent) {
            EventEmitter.emit('userSettings:update', changed);
        }
    }

    isMpDisableAll() {
        return this.settings.mpDisableAll;
    }

    isMpEnabled(name) {
        const {settings} = this;

        return !settings.mpDisableAll && typeof settings[name] !== 'undefined' && settings[name];
    }

    isSoundEnabled() {
        return this.settings.sound;
    }
}

export default new UserSettings();

export {isVibrationSupported, defaultUserSettings};
