import Translator from 'bazinga-translator';
import _ from 'lodash';

// eslint-disable-next-line import/no-named-as-default
import UpdaterElements from './elements';
import UpdaterResults from './results';
import UpdaterSession from './session';

class Updater {
    constructor() {
        this.elements = null;
        this.trips = [];
        this.accounts = {};
        this.stateCallback = null;
        this.changedCallback = null;
        this.extensionCallback = null;
        this.questionAction = null;
        this.passwordAction = null;
        this.questionActionCancel = null;
        this.passwordActionCancel = null;

        this.fail = this.fail.bind(this);
        this.tick = this.tick.bind(this);
    }

    tick(events = []) {
        let lastIndex = false;
        const self = this;

        _.forEach(events, (event, index) => {
            let item;
            let {accountId} = event;
            const {
                type,
                code: failCode,
                message,
                trips,
                tripIds,
                accountData,
                increased,
                change,
                expectedDuration,
                label,
                displayName,
                question,
            } = event;
            const originAccountId = accountId;

            if (accountId) {
                accountId = `a${accountId}`;
                item = this.elements.getElement(accountId);

                if (item.getInternalState() === 'extension' && event.type !== 'extension') {
                    item.setInternalState(null);

                    if (_.isFunction(this.extensionFailCallback)) {
                        this.extensionFailCallback('server timeout');
                    }
                }
            }

            switch (type) {
                case 'debug':
                    if (accountId) {
                        console.log(`${accountId}: ${message}`);
                    } else {
                        console.log(message);
                    }
                    break;
                case 'start_progress':
                    item.setChecking(expectedDuration);
                    break;
                case 'trips_found':
                    item.setTripsFound(trips);
                    _.forEach(tripIds, (id) => {
                        self.trips.push(id);
                    });
                    break;
                case 'trips_not_found':
                    item.setTripsNotFound();
                    break;
                case 'updated':
                    item.setUnchanged(accountData);
                    this.accounts[accountId] = accountData;
                    break;
                case 'changed':
                    item.setChanged(accountData);
                    this.accounts[accountId] = accountData;
                    if (increased) {
                        UpdaterResults.incrementValue('increase', change);
                        UpdaterResults.incrementValue('increased');
                    } else {
                        UpdaterResults.incrementValue('decrease', change);
                        UpdaterResults.incrementValue('decreased');
                    }
                    UpdaterResults.setValue('total', UpdaterResults.getValue('decrease') + UpdaterResults.getValue('increase'));
                    break;
                case 'error':
                    item.setError(accountData);
                    this.accounts[accountId] = accountData;
                    break;
                case 'disabled':
                    item.setDisabled(accountData);
                    this.accounts[accountId] = accountData;
                    UpdaterResults.incrementValue('disabled');
                    break;
                case 'fail':
                    item.setFailed(message, failCode);
                    break;
                case 'extension': {
                    const extChecking = this.elements.findInternalState('extension');

                    if (extChecking.length()) {
                        if (accountId !== extChecking.first().id) {
                            item.setFailed();
                        }
                    } else {
                        item.setChecking(expectedDuration);
                        item.setInternalState('extension');
                        if (_.isFunction(this.extensionCallback)) {
                            this.extensionCallback(originAccountId, () => {
                                item.setFailed(Translator.trans('updater2.messages.fail.cannot-check'));
                                self.stat(); // needed for complete updating account, when aborted by taping close button
                            });
                        }
                    }
                    break;
                }
                case 'local_password':
                    item.setInternalState('password', {
                        label,
                        displayName,
                    });
                    break;
                case 'question':
                    item.setInternalState('question', {
                        question,
                        displayName,
                    });
                    break;
                default:
                    break;
            }
            lastIndex = index;
        });

        if (events) {
            if (this.accounts && Object.keys(this.accounts).length && this.changedCallback) {
                this.changedCallback(this.accounts);
                this.accounts = {};
            }

            this.stat();
            this.nextPopup();
        }

        return lastIndex;
    }

    fail(state, status) {
        this.elements.findCheckingState().setFailed();
        this.elements.findQueueState().setFailed();
        this.elements.setInternalState(false);

        if (this.questionActionCancel) {
            this.questionActionCancel();
        }

        if (this.passwordActionCancel) {
            this.passwordActionCancel();
        }

        if (this.stateCallback) {
            this.stateCallback('fail');
        }

        if (status === 'timeout' && _.isFunction(this.extensionFailCallback)) {
            this.extensionFailCallback('client timeout');
        }

        this.stat();
    }

    stat() {
        const counts = this.elements.countStates();
        let success = counts.changed + counts.unchanged + counts.disabled;

        UpdaterResults.setValue('trips', this.trips.length);
        UpdaterResults.setValue('error', counts.error + counts.failed);

        if (success > UpdaterResults.getValue('all') - UpdaterResults.getValue('error')) {
            success = UpdaterResults.getValue('all') - UpdaterResults.getValue('error');
        }

        UpdaterResults.setValue('success', success);
        UpdaterResults.setValue('checking', counts.checking + success + UpdaterResults.getValue('error'));
        UpdaterResults.setValue('updated', success + UpdaterResults.getValue('error'));
        UpdaterResults.setValue('progress', ((success + UpdaterResults.getValue('error')) / UpdaterResults.getValue('all')) * 100);

        if (UpdaterResults.getValue('progress') === 100) {
            if (this.stateCallback) {
                this.stateCallback('done');
            }

            this.stop();
        } else if (this.stateCallback) {
            this.stateCallback('progress');
        }
    }

    _nextPopup() {
        let item;

        if (this.elements.findInternalState('password').length()) {
            item = this.elements.findInternalState('password').first();
            if (this.passwordAction) {
                this.passwordAction(item.id, item.getInternalData());
            } else {
                this.cancelPassword(item.id);
                this.nextPopup();
            }
        } else if (this.elements.findInternalState('question').length()) {
            item = this.elements.findInternalState('question').first();
            if (this.questionAction) {
                this.questionAction(item.id, item.getInternalData());
            } else {
                this.cancelQuestion(item.id);
                this.nextPopup();
            }
        }
    }

    start(ids, stateFunc, changedFunc, extensionFunc, extensionFailFunc) {
        if (UpdaterSession.isUpdating()) {
            return;
        }

        UpdaterElements.resetService();

        this.elements = UpdaterElements.getCollection(ids);
        this.elements.setQueue();

        UpdaterResults.reset();
        UpdaterResults.setValue('all', this.elements.length());

        this.trips = [];
        this.accounts = {};
        this.stateCallback = stateFunc;
        this.changedCallback = changedFunc;
        this.extensionCallback = extensionFunc;
        this.extensionFailCallback = extensionFailFunc;

        UpdaterSession.start(ids, this.tick, this.fail, true);
    }

    stop() {
        UpdaterSession.done();

        this.elements.findQueueState().setDone();
        this.elements.findCheckingState().setDone();
        this.elements.setInternalState(false);
    }

    end() {
        UpdaterSession.stop();
        UpdaterResults.reset();

        this.trips = [];
        this.accounts = {};
        this.stateCallback = null;
        this.changedCallback = null;
        this.extensionCallback = null;
        this.extensionFailCallback = null;

        if (this.elements) {
            this.elements.setEnd();
        }
    }

    getCounters = () => UpdaterResults.getResults();

    getAccounts() {
        return this.accounts;
    }

    getAccount(id) {
        return this.accounts[id];
    }

    getCollection() {
        return this.elements;
    }

    getTrips() {
        return this.trips;
    }

    isUpdating = () => UpdaterSession.isUpdating();

    getState = () => UpdaterSession.getState();

    getKey = () => UpdaterSession.getKey();

    cancelQuestion(id) {
        if (!this.isUpdating()) {
            return;
        }

        const item = this.elements.getElement(id);

        if (item && item.getInternalState() === 'question') {
            item.setInternalState(false);
            item.setError();
        }

        this.stat();
    }

    cancelPassword(id) {
        if (!this.isUpdating()) {
            return;
        }

        const item = this.elements.getElement(id);

        if (item && item.getInternalState() === 'password') {
            item.setInternalState(false);
            item.setFailed(Translator.trans('updater2.messages.fail.password-missing'));
        }

        this.stat();
    }

    doneQuestion(id, answer) {
        if (!this.isUpdating()) {
            return;
        }

        const item = this.elements.getElement(id);

        if (item && item.getInternalState() === 'question') {
            item.setInternalState(false);
            item.setQueue();
            UpdaterSession.setAnswer(id, answer);
        }

        this.stat();
    }

    donePassword(id, password) {
        if (!this.isUpdating()) {
            return;
        }

        const item = this.elements.getElement(id);

        if (item && item.getInternalState() === 'password') {
            item.setInternalState(false);
            item.setQueue();
            UpdaterSession.setPassword(id, password);
        }

        this.stat();
    }

    setQuestionAction(action, cancel) {
        this.questionAction = action;
        this.questionActionCancel = cancel;
    }

    setPasswordAction(action, cancel) {
        this.passwordAction = action;
        this.passwordActionCancel = cancel;
    }

    nextPopup() {
        if (!this.isUpdating()) {
            return;
        }

        this._nextPopup();
    }
}

export default new Updater();
