import _ from 'lodash';
import {getBuildNumber} from 'react-native-device-info';

import Storage from '../storage';
import EventEmitter from './eventEmitter';

const first_app_open = true;

const ask_mailbox_scan = undefined;
const properties = {
    authorized: null,
    etag: '',
    timestamp: null,
    pause: null,
    pincode: null,
    'pincode-skipped': false,
    'pincode-attempts': 0,
    developer: false,
    impersonated: false,
    push: {},
    'locations-total': 0,
    'locations-tracked': 0,
    'location-permissions-request-ts': 0,
    'location-permissions-request-ts-2': 0,
    'keychain-token': false,
    ask_mailbox_scan,
    first_app_open,
    data_version: 0,
} as const;

type Properties = typeof properties;

const currentVersion = String(getBuildNumber());

class SessionStorage {
    private properties: Properties;

    constructor() {
        this.properties = {...properties};
        this.destroy = this.destroy.bind(this);

        EventEmitter.addListener('logout', this.destroy);
    }

    sync() {
        const properties = Storage.getItem('session') as Properties;

        if (_.isObject(properties)) {
            this.properties = properties;
        }

        this.clearPerformedKeys();
    }

    clearPerformedKeys() {
        const dataVersion = this.getProperty('data_version') || '1';

        if (currentVersion.localeCompare(dataVersion, undefined, {numeric: true, sensitivity: 'base'}) > 0) {
            this.setProperty('data_version', currentVersion);
            this.setProperty('notifications-intro-performed', false);
            this.setProperty('location-intro-performed', false);
            this.setProperty('intro-performed', 0);
            this.setProperty('passcode-intro-performed', false);
        }
    }

    authorized() {
        const {authorized} = this.properties;

        return authorized;
    }

    getProperty(name) {
        return this.properties[name];
    }

    setProperty(name, value) {
        this.properties[name] = value;

        Storage.setItem('session', this.properties);
    }

    destroy() {
        const {first_app_open, ask_mailbox_scan} = this.properties;

        this.properties = {...properties, first_app_open, ask_mailbox_scan};

        Storage.setItem('session', this.properties);
    }
}

const session = new SessionStorage();

export default session;

export const setFirstAppOpen = (val) => session.setProperty('first_app_open', val);
export const getFirstAppOpen = () => session.getProperty('first_app_open');
