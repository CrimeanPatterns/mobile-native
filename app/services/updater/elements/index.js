import Translator from 'bazinga-translator';
import _ from 'lodash';

import UpdaterElementsCollection from './collection';

/**
 * @class UpdaterElement
 */
function UpdaterElement(id, data = {}) {
    let account = data;

    const updating = {
        id,
        process: false,
        state: false,
        unchecking: false,
        checkInBrowser: _.isUndefined(account.CheckInBrowser) === false ? Math.round(account.CheckInBrowser) > 0 : false,
        internalState: false,
        internalData: false,
        result: {
            lastBalance: 0,
            balance: 0,
            lastChange: 0,
            trips: 0,
            failCode: 0,
            failMessage: '',
            lastChangeRaw: 0,
            notice: {},
        },
        progressDuration: 0,
        setQueue() {
            updating.process = true;
            updating.state = 'queue';
            updating.unchecking = false;
        },
        setChecking(duration) {
            updating.progressDuration = duration;
            updating.state = 'checking';
        },
        setChanged(data) {
            updating.result.lastBalance = data.LastBalance;
            updating.result.balance = data.Balance;
            updating.result.lastChange = data.LastChange;
            updating.result.lastChangeRaw = data.LastChangeRaw;
            account = {...account, ...data};
            updating.state = 'changed';
            updating.unchecking = true;
        },
        setUnchanged(data) {
            if (updating.state !== 'changed') {
                updating.state = 'unchanged';
            }
            updating.result.balance = data.Balance;
            account = {...account, ...data};
            updating.unchecking = true;
        },
        setTripsFound(trips) {
            updating.result.trips = trips;
            if (updating.state !== 'unchanged') {
                updating.state = 'changed';
            }
            updating.unchecking = true;
        },
        setTripsNotFound() {
            if (updating.state !== 'changed') {
                updating.state = 'unchanged';
            }
            updating.unchecking = true;
        },
        setError(data) {
            account = {...account, ...data};
            if (data && data.Notice) {
                updating.result.notice = data.Notice;
            }
            updating.state = 'error';
        },
        setDisabled(data) {
            account = {...account, ...data};
            if (data && data.Disabled) {
                updating.result.notice = data.Disabled;
            }
            updating.state = 'disabled';
            updating.unchecking = true;
        },
        setFailed(message, code) {
            // eslint-disable-next-line no-param-reassign
            message = message || Translator.trans('award.account.list.updating.failed');
            updating.result.failCode = code || 0;
            updating.result.failMessage = message;
            updating.state = 'failed';
        },
        setDone() {
            updating.process = false;
            updating.state = 'done';
        },
        setEnd() {
            updating.reset();
        },
        reset() {
            updating.process = false;
            updating.state = false;
            updating.internalState = false;
            updating.internalData = false;
            updating.unchecking = false;
            updating.progressDuration = 0;
            updating.result.lastBalance = 0;
            updating.result.balance = 0;
            updating.result.lastChange = 0;
            updating.result.trips = 0;
            updating.result.failCode = 0;
            updating.result.failMessage = '';
            updating.result.lastChangeRaw = 0;
            updating.result.notice = {};
        },
        done() {
            if (['failed', 'error', 'changed', 'unchanged', 'disabled'].indexOf(updating.state) !== -1) {
                updating.setDone();
            }
        },
        setInternalState(state, data) {
            updating.internalState = state;
            updating.internalData = data;
        },
        getInternalState() {
            return updating.internalState;
        },
        getInternalData() {
            return updating.internalData;
        },
    };

    return updating;
}

class UpdaterElements {
    /**
     *
     * @type {Object.<(string|int), UpdaterElement>|UpdaterElement[]}
     */
    elements = {};

    /**
     *
     * @param id
     * @param {Object=} data
     * @returns {UpdaterElement}
     */
    bind(id, data = {}) {
        if (!this.elements[id]) {
            this.elements[id] = new UpdaterElement(id, data);
        }

        return this.elements[id];
    }

    getCollection(ids = []) {
        const ret = [];

        _.forEach(ids, (id) => ret.push(this.bind(id)));

        return new UpdaterElementsCollection(ret);
    }

    getUnchecking() {
        const ids = [];

        _.forEach(this.elements, (element, id) => {
            if (element.unchecking === true) {
                ids.push(id);
            }
        });

        return ids;
    }

    isAllDone() {
        let done = true;

        _.forEach(this.elements, (element) => {
            if (!(element.state === 'done' || element.state === false || element.state === '')) {
                done = false;
            }
        });

        return done;
    }

    reset() {
        this.elements = {};
    }

    resetService() {
        this.reset();
    }
}

export {UpdaterElement, UpdaterElements};
export default new UpdaterElements();
