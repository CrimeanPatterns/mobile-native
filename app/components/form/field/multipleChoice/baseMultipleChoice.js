import * as _ from 'lodash';
import PropTypes from 'prop-types';

import BaseField from '../baseField';
import BaseCheckbox from '../checkbox/baseCheckbox';

export default class BaseMultipleChoice extends BaseField {
    static displayName = 'BaseMultipleChoice';

    static propTypes = {
        onChangeValue: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        customStyle: BaseCheckbox.propTypes.customStyle,
        required: PropTypes.bool,
        value: PropTypes.array,
        choices: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                label: PropTypes.string,
                inactive: PropTypes.bool,
            }),
        ).isRequired,
        primaryColor: PropTypes.shape({
            base: PropTypes.string.isRequired,
            errored: PropTypes.string,
            disabled: PropTypes.string,
        }),
    };

    static defaultProps = {
        required: false,
        value: [],
    };

    constructor(props) {
        super(props);

        this._prepareCallbacks(props);
    }

    componentDidUpdate({choices: prevChoices}) {
        if (prevChoices !== this.props.choices) {
            this._prepareCallbacks(this.props);
        }
    }

    _prepareCallbacks(props) {
        this._onChangeCallbacks = {};

        _.forEach(props.choices, (choice) => {
            this._onChangeCallbacks[choice.name] = this._onChangeValue.bind(this, choice.name);
        });
    }

    _onChangeValue(name, newValue) {
        const {onChangeValue, value} = this.props;
        const changedValue = [...value];
        const i = changedValue.indexOf(name);

        if (newValue) {
            if (i === -1) {
                changedValue.push(name);
            }
        } else if (i > -1) {
            changedValue.splice(i, 1);
        }

        onChangeValue(changedValue);
    }
}
