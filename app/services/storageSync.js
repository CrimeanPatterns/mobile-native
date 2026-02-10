import _ from 'lodash';
import {AppState} from 'react-native';

import Storage from '../storage';
import API from './api';
import EventEmitter from './eventEmitter';
import Session from './session';

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

const SEC_IN_MIN = 1000 * 60;
const SYNC_INTERVAL = 5;

class StorageSync {
    _intervalId = null;

    start() {
        this.stop();
        this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
        this.startInterval();
    }

    stop() {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
        }
        this.stopInterval();
    }

    startInterval() {
        this._intervalId = setInterval(() => this.isExpired() && this.forceUpdate(), SEC_IN_MIN * SYNC_INTERVAL);
    }

    stopInterval() {
        clearInterval(this._intervalId);
    }

    isExpired = () => Math.round((Date.now() - parseInt(Session.getProperty('timestamp'), 10)) / SEC_IN_MIN) >= SYNC_INTERVAL;

    forceUpdate = () =>
        new Promise((resolve, reject) => {
            API.get('/data/', {retry: 3, timeout: SEC_IN_MIN * 2, globalError: false}).then((response) => {
                if (_.isObject(response)) {
                    const {data} = response;

                    if (_.isObject(data)) {
                        Storage.multiSet(Object.entries(data));
                        Session.setProperty('timestamp', Date.now());
                        EventEmitter.emit('storage:loaded');
                        return resolve();
                    }
                }
                return reject();
            }, reject);
        });

    _handleAppStateChange = (nextAppState) => {
        if (appState.state.match(/inactive|background/) && nextAppState === 'active') {
            this.startInterval();
            if (this.isExpired()) {
                this.forceUpdate();
            }
        }

        if (nextAppState === 'background') {
            this.stopInterval();
        }

        appState.transitionTo(nextAppState);
    };
}

export default new StorageSync();
