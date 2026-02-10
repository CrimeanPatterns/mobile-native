import _ from 'lodash';

/**
 * @class UpdaterElementsCollection
 */
function UpdaterElementsCollection(elements) {
    const self = {
        first() {
            return elements[0];
        },
        length() {
            return elements.length;
        },
        countStates() {
            const ret = {
                queue: 0,
                checking: 0,
                changed: 0,
                unchanged: 0,
                disabled: 0,
                error: 0,
                failed: 0,
                done: 0,
            };

            _.forEach(elements, (element) => {
                if (element.state && _.isUndefined(ret[element.state]) === false) {
                    let {state} = element;

                    if (['question', 'password'].indexOf(element.internalState) > -1) {
                        state = 'checking';
                    }
                    ret[state] += 1;
                }
            });
            return ret;
        },
        findState(state) {
            return new UpdaterElementsCollection(elements.filter((element) => element.state === state));
        },
        findInternalState(state) {
            return new UpdaterElementsCollection(elements.filter((element) => element.internalState === state));
        },
        findUpdated() {
            const updated = {};

            elements.forEach((element) => {
                if (['changed', 'unchanged', 'error', 'disabled', 'failed'].indexOf(element.state) > -1) {
                    if (!updated[element.state]) {
                        updated[element.state] = [];
                    }
                    updated[element.state].push({...element});
                }
            });

            return updated;
        },
        findQueueState() {
            return self.findState('queue');
        },
        findCheckingState() {
            return self.findState('checking');
        },
        findChangedState() {
            return self.findState('changed');
        },
        findUnchangedState() {
            return self.findState('unchanged');
        },
        findErrorState() {
            return self.findState('error');
        },
        findFailedState() {
            return self.findState('failed');
        },
        setInternalState(state) {
            _.forEach(elements, (element) => element.setInternalState(state));
        },
        setState(state) {
            const action = `set${state.charAt(0).toUpperCase()}${state.slice(1)}`;

            _.forEach(elements, (element) => {
                if (_.isFunction(element[action])) {
                    element[action]();
                }
            });
        },
        setQueue() {
            return self.setState('queue');
        },
        setChecking() {
            return self.setState('checking');
        },
        setChanged() {
            return self.setState('changed');
        },
        setUnchanged() {
            return self.setState('unchanged');
        },
        setError() {
            return self.setState('error');
        },
        setFailed() {
            return self.setState('failed');
        },
        setDone() {
            return self.setState('done');
        },
        setEnd() {
            return self.setState('end');
        },
        getElement(id) {
            return elements.find((element) => element.id === id);
        },
        getIds() {
            const ret = [];

            _.forEach(elements, (element) => {
                ret.push(element.id);
            });

            return ret;
        },
        isExtensionRequire() {
            const el = elements.filter((element) => element.checkInBrowser);

            return !!el.length;
        },
    };

    return self;
}

export default UpdaterElementsCollection;
