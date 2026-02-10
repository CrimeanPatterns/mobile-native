import _ from 'lodash';
import PropTypes from 'prop-types';

import BaseField from '../baseField';
import Text from '../text';

class BaseDate extends BaseField {
    static displayName = 'DateField';

    static propTypes = {
        ...Text.propTypes,
        onChangeValue: PropTypes.func,
        disabled: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    };

    static defaultProps = {
        ...Text.defaultProps,
    };

    constructor(props) {
        super(props);

        this._handleInnerRef = this._handleInnerRef.bind(this);
    }

    _handleInnerRef(ref) {
        const {innerRef = _.noop} = this.props;

        this._input = ref;
        innerRef(this._input);
    }

    _formatDatetime(datetime) {
        if (_.isNull(datetime)) {
            return null;
        }

        const date = new Date(datetime);

        if (!_.isNaN(date.getTime())) {
            return this.props.intl.formatDate(date, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
            });
        }

        return null;
    }

    normalizeDate = (datetime) => {
        let date = _.isNull(datetime) ? new Date() : new Date(datetime);

        if (_.isNaN(date.getTime())) {
            date = new Date();
        }

        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    };
}

export default BaseDate;
