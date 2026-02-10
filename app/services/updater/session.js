import _ from 'lodash';
import BackgroundTimer from 'react-native-background-timer';

import CentrifugeProvider from '../centrifuge';
import UpdaterRequest from './request';

let updater3k = true;
const constants = {
    failCount: 3,
    updateTimeout: 3000,
    failTimeout: 600 * 1000,
};

class UpdaterSession {
    constructor() {
        this.request = {
            ids: [],
            tickCallback: null,
            failCallback: null,
            trips: false,
        };

        this.messages = [];

        this.session = {
            /**
             * Updater state
             * false, 'start', 'update', 'fail', 'done'
             */
            state: false,
            /**
             * Session Key
             */
            key: null,
            /**
             * Unique start key -- disable parallel start
             */
            startKey: null,
            /**
             * Event queue index
             */
            queueIndex: null,
            /**
             * HTTP error counter
             */
            errorCount: 0,
            /**
             * Update timer
             */
            updateTimer: null,
            /**
             * Fail timer
             */
            failTimer: null,
            /**
             * Centrifuge subscription
             */
            subscription: null,
            messagesBuffer: [],
            gotHistory: false,
            client: null,
        };

        this.runBackgroundTask = this.runBackgroundTask.bind(this);
        this._start = this._start.bind(this);
        this._fail = this._fail.bind(this);
        this._update = this._update.bind(this);
    }

    resetSession() {
        BackgroundTimer.clearTimeout(this.session.updateTimer);
        BackgroundTimer.clearTimeout(this.session.failTimer);

        this.request = {
            ids: [],
            tickCallback: null,
            failCallback: null,
            trips: false,
        };
        this.messages = [];
        this.session = {
            state: false,
            key: null,
            startKey: null,
            queueIndex: null,
            errorCount: 0,
            updateTimer: null,
            failTimer: null,
            subscription: undefined,
            messagesBuffer: [],
            gotHistory: false,
            client: undefined,
        };
    }

    async getConnection() {
        if (!updater3k) {
            return Promise.resolve();
        }

        this.session.connection = await CentrifugeProvider.getConnectionAsync();
        this.session.client = CentrifugeProvider.getClientId();

        return Promise.resolve();
    }

    runBackgroundTask() {
        // console.log('runBackgroundTask');
        this.session.updateTimer = BackgroundTimer.setTimeout(this.runBackgroundTask, constants.updateTimeout);
    }

    async _start() {
        const {ids, trips, tickCallback} = this.request;

        if (this.session.state) {
            return;
        }

        this.session.state = 'start';

        try {
            await this.getConnection();
            const response = await UpdaterRequest.start({
                accounts: ids,
                trips,
                extensionAvailable: true,
                startKey: this.session.startKey,
                client: this.session.client,
            });
            const {data} = response;

            if (updater3k) {
                console.log('start socket updater', data, this.session.client);
            }

            if (!this.session.state || this.session.state !== 'start' || data.startKey !== this.session.startKey) {
                return;
            }

            this.session.startKey = null;
            this.session.key = data.key || false;

            if (this.session.key === false) {
                this._fail('updater fail');
            } else {
                this.session.state = 'update';
                this.session.queueIndex = tickCallback(data.events) || this.session.queueIndex;

                if (updater3k) {
                    this.runBackgroundTask();
                    this.subscribe(data.socketInfo.channel);
                } else {
                    this.session.updateTimer = BackgroundTimer.setTimeout(this._update, constants.updateTimeout);
                }

                this.setFailTimer();
            }
        } catch (error) {
            let response;

            if (_.isObject(error)) {
                response = error.response;
            }

            let returnCode = 0;

            if (_.isObject(response)) {
                const {status} = response;

                returnCode = status;
            }

            this.session.errorCount += 1;

            if (this.session.errorCount > constants.failCount) {
                this._fail(returnCode);
            } else {
                this.session.updateTimer = BackgroundTimer.setTimeout(() => {
                    this.session.state = false;
                    this._start();
                }, constants.updateTimeout);
            }
        }
    }

    async subscribe(channelName) {
        console.log('subscribe', channelName);
        this.session.subscription = this.session.connection.subscribe(channelName, this.onChannelMessage);
        const message = await this.session.subscription.history();

        console.log('history messages received', message);
        this.session.gotHistory = true;
        message.data.forEach((channelHistory) => {
            if (channelHistory.channel === channelName) {
                this.session.messagesBuffer = this.session.messagesBuffer.concat(channelHistory.data.reverse());
            }
        });
        if (this.session.messagesBuffer.length > 0) {
            this.session.messagesBuffer.sort((a, b) => a[0] - b[0]);
            this.onChannelMessage({data: this.session.messagesBuffer});
            this.session.messagesBuffer = [];
        }
    }

    unsubscribe() {
        if (this.session.subscription) {
            console.log('unsubscribing from channel');
            this.session.subscription.unsubscribe();
            this.session.subscription.removeAllListeners();
            this.session.subscription = null;
        }
    }

    onChannelMessage = (message) => {
        console.log('onChannelMessage', message.data);
        if (this.session.gotHistory) {
            const events = [];

            message.data.forEach((value) => {
                events.push(value[1]);
            });
            this.session.queueIndex = this.request.tickCallback(events) || this.session.queueIndex;
            if (events.length > 0) {
                this.setFailTimer();
            }
        } else {
            this.session.messagesBuffer = this.session.messagesBuffer.concat(message.data);
        }
    };

    setFailTimer() {
        BackgroundTimer.clearTimeout(this.session.failTimer);
        this.session.failTimer = BackgroundTimer.setTimeout(() => {
            this._fail('timeout');
        }, constants.failTimeout);
    }

    async _update() {
        const {tickCallback} = this.request;
        const sendMessages = [];

        if (this.session.key === null || !this.session.state || this.session.state === 'fail') {
            return;
        }

        sendMessages.push(...this.messages);

        try {
            const response = await UpdaterRequest.getEvents(
                {key: this.session.key, eventIndex: this.session.queueIndex},
                {
                    messages: sendMessages,
                },
            );

            const {data} = response;
            const changed = Object.keys(data || {}).length;

            if (!this.session.state || this.session.state !== 'update') {
                return;
            }

            this.session.queueIndex = tickCallback(data) || this.session.queueIndex;
            if (!updater3k) {
                this.session.updateTimer = BackgroundTimer.setTimeout(this._update, constants.updateTimeout);
            }
            this.messages = this.messages.filter((message) => sendMessages.indexOf(message) === -1);

            if (changed > 0) {
                this.setFailTimer();
            }
        } catch (error) {
            let response;

            if (_.isObject(error)) {
                // eslint-disable-next-line prefer-destructuring
                response = error.response;
            }

            let returnCode = 0;

            if (_.isObject(response)) {
                const {status} = response;

                returnCode = status;
            }

            this.session.errorCount += 1;

            if (this.session.errorCount > constants.failCount) {
                this._fail(returnCode);
            } else {
                this.session.updateTimer = BackgroundTimer.setTimeout(this._update, constants.updateTimeout);
            }
        }
    }

    _fail(status) {
        const {failCallback} = this.request;

        BackgroundTimer.clearTimeout(this.session.updateTimer);
        BackgroundTimer.clearTimeout(this.session.failTimer);

        this.session.updateTimer = null;
        this.session.failTimer = null;
        this.session.state = 'fail';

        failCallback(this.session.state, status);
    }

    done() {
        BackgroundTimer.clearTimeout(this.session.updateTimer);
        BackgroundTimer.clearTimeout(this.session.failTimer);

        this.session.updateTimer = null;
        this.session.failTimer = null;
        this.session.state = 'done';

        this.unsubscribe();
    }

    start(ids, tick, fail, trips = false) {
        if (this.isUpdating() || !_.isArray(ids) || !ids.length) {
            return;
        }

        this.resetSession();

        this.session.startKey = Math.round((Math.random() + 1) * 1000000);
        // eslint-disable-next-line no-param-reassign
        ids = ids.map((id) => parseInt(id.replace(/[^0-9]/g, ''), 10));

        this.request.ids = ids;
        this.request.tickCallback = tick;
        this.request.failCallback = fail;
        this.request.trips = trips;

        this._start();
    }

    stop() {
        this.done();
        this.session.state = false;
    }

    isUpdating() {
        return !!this.session.state;
    }

    sendMessage(action, id, data) {
        // eslint-disable-next-line no-param-reassign
        id = parseInt(id.replace(/[^0-9]/g, ''), 10);
        if (!id) {
            return;
        }

        this.messages.push({
            action,
            id,
            data,
        });
    }

    add(ids) {
        if (!_.isArray(ids) || !ids.length) {
            return;
        }
        // eslint-disable-next-line no-param-reassign
        ids = ids.map((id) => parseInt(id.replace(/[^0-9]/g, ''), 10));
        _.forEach(ids, (id) => this.sendMessage('add', id));
        if (updater3k) {
            this._update();
        }
    }

    setAnswer(id, answer) {
        this.sendMessage('setAnswer', id, answer);
        if (updater3k) {
            this._update();
        }
    }

    setPassword(id, password) {
        this.sendMessage('setPassword', id, password);
        console.log('setPassword', password);

        if (updater3k) {
            this._update();
        }
    }

    getState() {
        return this.session.state;
    }

    getKey() {
        return this.session.key;
    }
}

export default new UpdaterSession();

export const setUpdater3kEnabled = (enabled) => {
    updater3k = enabled;
};
