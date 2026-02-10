import _ from 'lodash';

import {BaseThemedPureComponent} from '../../baseThemed';

type IRow = {
    reloadTimeline: () => void;
    setLoading: (boolean) => void;
    navigation: () => void;
};

class Row<P, S> extends BaseThemedPureComponent<IRow & P, S> {
    private mounted = false;

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(state, callback) {
        if (this.mounted) {
            this.setState(state, callback);
        }
    }

    setLoading(loading) {
        const {setLoading} = this.props;

        if (_.isFunction(setLoading)) {
            setLoading(loading);
        }
    }

    reloadTimeline() {
        const {reloadTimeline} = this.props;

        if (_.isFunction(reloadTimeline)) {
            reloadTimeline();
        }
    }
}

export default Row;
