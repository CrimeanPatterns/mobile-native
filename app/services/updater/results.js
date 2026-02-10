class UpdaterResults {
    constructor() {
        this.counters = {
            all: 0,
            checking: 0,
            error: 0,
            success: 0,
            disabled: 0,
            increased: 0,
            decreased: 0,
            increase: 0,
            decrease: 0,
            total: 0,
            trips: 0,
            progress: 0,
            updated: 0,
        };
        this.defaultCounters = {...this.counters};
    }

    reset() {
        this.counters = {...this.defaultCounters};
    }

    setValue(counter, value) {
        this.counters[counter] = value;
    }

    getValue(counter) {
        return this.counters[counter];
    }

    incrementValue(counter, value = 1) {
        this.counters[counter] += value;
    }

    decrementValue(counter, value = 1) {
        this.counters[counter] -= value;
    }

    getResults() {
        return this.counters;
    }
}

export default new UpdaterResults();
