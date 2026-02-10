import Translator from 'bazinga-translator';
import _ from 'lodash';
import {showMessage} from 'react-native-flash-message';

import Sound from '../helpers/sound';
import API from './api';
import Centrifuge from './centrifuge';
import EventEmitter from './eventEmitter';

function log(...args) {
    console.log(`[BOOKING]`, ...args);
}

function emit(eventName, ...args) {
    log(`emit ${eventName}`, ...args);
    EventEmitter.emit(eventName, ...args);
}

class Booking {
    dashboard = {};

    requests = new Map();

    subscriptions = new Map();

    onlineCallbacks = new Map();

    constructor() {
        this.destroy = this.destroy.bind(this);
        this.onChatMessage = this.onChatMessage.bind(this);

        EventEmitter.addListener('logout', this.destroy);
    }

    destroy() {
        log('destroy booking data, unsubscribe');
        this.dashboard = {};
        this.requests.clear();
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions.clear();
        this.onlineCallbacks.clear();
    }

    set({channel, dashboard, requests}, forceEvent = true) {
        log('set requests', channel, dashboard, requests);
        this.dashboard = dashboard;
        this._setRequests(requests, forceEvent);
        const centrifugeConnection = Centrifuge.getConnection();

        if (channel && !this.subscriptions.has('$bookinguser')) {
            this.subscriptions.set(
                '$bookinguser',
                centrifugeConnection.subscribe(channel, ({data}) => {
                    log('new message', data);
                    if (data && data.requestId) {
                        const messages = {};
                        const isMessageExists = this.existsMessage(data.requestId, data.messageId);

                        messages[data.messageId] = 0;
                        this.sync(data.requestId, messages, [data.messageId]).then(() => {
                            const clientInfo = Centrifuge.getClientInfo();

                            if (!clientInfo) {
                                return;
                            }

                            const chatData = {
                                ...data,
                                messageExists: isMessageExists,
                                ownerId: parseInt(clientInfo.user, 10),
                            };

                            this.onChatMessage(chatData);
                            emit('booking:chat:message', chatData);
                        });
                    }
                }),
            );
        }
    }

    sync(requestId, messages = {}, range = [], config = {}) {
        const markAsRead = _.isEmpty(messages) && _.isEmpty(range);

        log('start sync', {markAsRead});

        return new Promise((resolve, reject) => {
            if (!this.hasRequest(requestId)) {
                log('request not found');
                reject();
            }

            const request = this.getRequest(requestId);

            if (markAsRead && request.messages && request.messages.length > 0) {
                for (let i = 0, l = request.messages.length; i < l; i += 1) {
                    if (i === 0 || i === l - 1) {
                        range.push(request.messages[i].id);
                    }
                    messages[request.messages[i].id] = request.messages[i].internalDate || null;
                }
            }

            API.post(`/booking/request/${requestId}/sync/${markAsRead ? '1' : '0'}`, {messages}, config).then(
                (response) => {
                    log('sync result', response);
                    if (response.data && _.isObject(response.data) && response.data.success) {
                        if (this._merge(requestId, response.data.messages, true, range)) {
                            emit('booking:update');
                        }
                        resolve(response.data.messages);
                    } else {
                        reject();
                    }
                },
                () => reject(),
            );
        });
    }

    chunked(requestId, messageId, config = {}) {
        log('start chunked');

        return new Promise((resolve, reject) => {
            API.get(`/booking/request/${requestId}/chunk/${messageId}`, config).then(
                (response) => {
                    log('chunked result', response);
                    if (response.data && _.isObject(response.data) && response.data.messages) {
                        if (this._merge(requestId, response.data.messages)) {
                            emit('booking:update');
                        }
                        resolve();
                    } else {
                        reject();
                    }
                },
                () => reject(),
            );
        });
    }

    addMessage(requestId, message, config = {}) {
        log('start add message');

        return new Promise((resolve, reject) => {
            if (!this.hasRequest(requestId)) {
                log('request not found');
                reject();
            }

            const sendFailed = () => {
                showMessage({
                    message: Translator.trans('message.send.fail', {}, 'mobile'),
                    type: 'danger',
                });
            };

            API.put(`/booking/request/${requestId}/message/add`, {message}, config).then(
                (response) => {
                    log('add message result', response);
                    if (response.data && _.isObject(response.data) && response.data.success) {
                        response.data.message.new = true;
                        if (this._merge(requestId, [response.data.message])) {
                            emit('booking:update');
                        }
                        resolve();
                    } else {
                        sendFailed();
                        reject();
                    }
                },
                () => {
                    sendFailed();
                    reject();
                },
            );
        });
    }

    editMessage(requestId, messageId, message, config = {}) {
        log('start edit message');

        return new Promise((resolve, reject) => {
            if (!this.hasRequest(requestId)) {
                log('request not found');
                reject();
            }

            const updateFailed = () => {
                showMessage({
                    message: Translator.trans('message.update.fail', {}, 'mobile'),
                    type: 'danger',
                });
            };

            API.post(`/booking/request/${requestId}/message/edit/${messageId}`, {message}, config).then(
                (response) => {
                    log('edit message result', response);
                    if (response.data && _.isObject(response.data) && response.data.success) {
                        if (this._merge(requestId, [response.data.message])) {
                            emit('booking:update');
                        }
                        resolve();
                    } else {
                        updateFailed();
                        reject();
                    }
                },
                () => {
                    updateFailed();
                    reject();
                },
            );
        });
    }

    removeMessage(requestId, messageId, config = {}) {
        log('start remove message');

        return new Promise((resolve, reject) => {
            if (!this.hasRequest(requestId)) {
                log('request not found');
                reject();
            }

            const removeFailed = () => {
                showMessage({
                    message: Translator.trans('message.delete.fail', {}, 'mobile'),
                    type: 'danger',
                });
            };

            API.delete(`/booking/request/${requestId}/message/delete/${messageId}`, config).then(
                (response) => {
                    log('remove message result', response);
                    if (response.data && _.isObject(response.data) && response.data.success) {
                        if (this._merge(requestId, [], true, [messageId])) {
                            emit('booking:update');
                        }
                        resolve();
                    } else {
                        removeFailed();
                        reject();
                    }
                },
                () => {
                    removeFailed();
                    reject();
                },
            );
        });
    }

    resend(requestId, config = {}) {
        log('start resend verification');

        return new Promise((resolve, reject) => {
            if (!this.hasRequest(requestId)) {
                log('request not found');
                return reject();
            }

            API.post(`/booking/request/${requestId}/resend`, {}, config).then(
                (response) => {
                    log('resend verification result', response);
                    if (response.data && _.isObject(response.data) && response.data.success) {
                        resolve();
                    } else {
                        reject();
                    }
                },
                () => {
                    reject();
                },
            );
        });
    }

    async verify(requestId, confNo) {
        log('start verification', requestId, confNo);

        if (!this.hasRequest(requestId)) {
            log('request not found');
            return Promise.reject('request not found');
        }

        const response = await API.get(`/booking/request/${requestId}/confirm/${confNo}`);

        if (response.data?.success) {
            log('send verification result, success');
            return Promise.resolve(true);
        }

        return Promise.reject(false);
    }

    getAmount = () => this.dashboard.active;

    hasRequest(requestId) {
        return this.requests.has(parseInt(requestId));
    }

    getRequest(requestId) {
        return this.requests.get(parseInt(requestId));
    }

    getRequests = () => Array.from(this.requests.values());

    getRequestMessages(requestId) {
        if (this.hasRequest(requestId)) {
            return this.getRequest(requestId).messages || [];
        }

        return [];
    }

    existsMessage(requestId, messageId) {
        const messages = this.getRequestMessages(requestId);

        if (messages.length > 0) {
            for (let i = 0; i < messages.length; i += 1) {
                if (messages[i].id === messageId) {
                    return true;
                }
            }
        }

        return false;
    }

    markAsRead(requestId) {
        let notify = false;
        const request = this.getRequest(requestId);
        const messages = this.getRequestMessages(requestId);

        log('mark as read');

        if (request && messages.length > 0) {
            for (let i = 0, l = messages.length; i < l; i += 1) {
                if (messages[i].readed === false) {
                    notify = true;
                }
                request.messages[i].readed = true;
            }
            request.newMessage = false;
            if (notify) {
                emit('booking:update');
            }
        }
    }

    getUnread = () => {
        const requests = this.getRequests();
        let requestId;

        if (requests && requests.length > 0) {
            _.forEach(requests, (request) => {
                if (request.newMessage) {
                    requestId = request.id;
                }
            });
        }

        return requestId;
    };

    _updatePresence(action, requestId, message, channels) {
        const clientInfo = Centrifuge.getClientInfo();
        const request = this.getRequest(requestId);
        const joined = message.data.user;
        const subscription = this.subscriptions.get(channels.$abrequestonline);

        log('start update presence', action, requestId, subscription, message);

        subscription?.presence().then(({data}) => {
            const users = [];

            _.forEach(data, (user) => {
                const {default_info: info, user: userId} = user;
                const {username: infoUserName} = info;
                let username;

                if (request && userId === request.contactUid) {
                    username = request.contactName;
                } else {
                    username = infoUserName;
                }

                if (!info.impersonated && clientInfo && userId !== clientInfo.user && users.indexOf(username) === -1) {
                    users.push(username);
                }
            });

            if (action === 'leave' || (action === 'join' && users.length > 0)) {
                emit(`booking:chat:${action}`, {
                    requestId,
                    users,
                    new: joined !== clientInfo.user,
                });
            }
        });
    }

    subscribe(requestId, channels) {
        const connection = Centrifuge.getConnection();

        if (connection) {
            log('subscribe', requestId, channels);

            if (!this.onlineCallbacks.has(channels.$abrequestonline)) {
                this.onlineCallbacks.set(channels.$abrequestonline, {
                    join: (mess) => {
                        this._updatePresence('join', requestId, mess, channels);
                    },
                    leave: (mess) => {
                        this._updatePresence('leave', requestId, mess, channels);
                    },
                });
            }
            this.subscriptions.set(channels.$booker, connection.subscribe(channels.$booker));
            this.subscriptions.set(
                channels.$abrequestonline,
                connection.subscribe(channels.$abrequestonline, this.onlineCallbacks.get(channels.$abrequestonline)),
            );
        }
    }

    unsubscribe(channels) {
        log('unsubscribe', channels);
        if (channels) {
            if (this.subscriptions.has(channels.$abrequestonline)) {
                this.subscriptions.get(channels.$abrequestonline).unsubscribe();
            }
            if (this.subscriptions.has(channels.$booker)) {
                this.subscriptions.get(channels.$booker).unsubscribe();
            }
        } else {
            this.subscriptions.forEach((subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    _setRequests(requests, forceEvent = true) {
        if (!_.isArray(requests)) {
            return;
        }

        const newRequests = new Map();
        let updated = false;

        _.forEach(requests, (request) => {
            newRequests.set(request.id, request);
        });

        if (this.requests.size > 0) {
            this.requests.forEach((request, requestId) => {
                if (newRequests.has(requestId)) {
                    updated = updated || this._merge(requestId, newRequests.get(requestId).messages, false, false);
                    newRequests.get(requestId).messages = request.messages;
                }
            });
        }

        log('set requests', newRequests.entries());
        this.requests = newRequests;

        if (forceEvent || updated) {
            emit('booking:update');
        }
    }

    _merge(requestId, messages, removeNonExsist, range) {
        let request;
        let updated = false;

        if (this.hasRequest(requestId)) {
            request = this.getRequest(requestId);
            if (removeNonExsist && range) {
                for (let i = 0, removeMessage = true; i < request.messages.length; i += 1) {
                    removeMessage = true;
                    if (messages.length > 0) {
                        for (let j = 0, k = messages.length; j < k; j += 1) {
                            if (request.messages[i].id === messages[j].id) {
                                removeMessage = false;
                                break;
                            }
                        }
                    }
                    if (removeMessage) {
                        // remove if message.id in range [firstMessageId, lastMessageId]
                        if (
                            (range[0] && !range[1] && request.messages[i].id === range[0]) ||
                            (request.messages[i].id >= range[0] && request.messages[i].id <= range[1])
                        ) {
                            updated = true;
                            // remove
                            request.messages.splice(i, 1);
                            i -= 1;
                        }
                    }
                }
            }
            if (messages.length > 0) {
                for (let i = 0; i < messages.length; i += 1) {
                    for (let j = 0, k = request.messages.length; j < k; j += 1) {
                        if (messages[i].id === request.messages[j].id) {
                            if (
                                !messages[i].internalDate || // some messages are unversioned
                                messages[i].internalDate > request.messages[j].internalDate
                            ) {
                                request.messages[j] = messages[i];
                                updated = true;
                            }
                        } else if (!messages[i].hidden) {
                            // get position to insert message
                            if (
                                messages[i].id > request.messages[j].id &&
                                (j === k - 1 || (j < k - 1 && messages[i].id < request.messages[j + 1].id))
                            ) {
                                request.messages.splice(j + 1, 0, messages[i]); // insert after
                                updated = true;
                            } else if (
                                messages[i].id < request.messages[j].id &&
                                (j === 0 || (j > 0 && messages[i].id > request.messages[j - 1].id))
                            ) {
                                request.messages.splice(j, 0, messages[i]); // insert before
                                updated = true;
                            }
                        }
                    }
                    // todo: check boolean
                    if (!request.newMessage && messages[i].readed === false) {
                        request.newMessage = true;
                    }
                }
                if (request.messages[request.messages.length - 1].requestUpdateDate) {
                    request.lastUpdateDate = request.messages[request.messages.length - 1].requestUpdateDate;
                }
            }
        }

        log('merge result', updated);

        return updated;
    }

    onChatMessage(data) {
        log('on chat message', data);
        if (
            !(data && data.requestId && data.messageId) || // data integrity checks
            data.action !== 'add' || // skip changes and removals
            data.uid === data.ownerId || // show notifications only from other users
            !!data.messageExists // message have been existed before socket event, notification should have been created before
        ) {
            return;
        }

        if (data.notify && this.existsMessage(data.requestId, data.messageId)) {
            log('play sound new message');
            Sound.play('new_message.mp3');
        }
    }
}

export default new Booking();
