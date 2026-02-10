import PropTypes from 'prop-types';

import BaseField from '../baseField';

export default class BaseChoice extends BaseField {
    static displayName = 'ChoiceField';

    static propTypes = {
        onChangeValue: PropTypes.func.isRequired,
        label: PropTypes.string,
        required: PropTypes.bool,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        hint: PropTypes.node,
        disabled: PropTypes.bool,
        disabledValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        error: PropTypes.string,
        choices: PropTypes.arrayOf(
            PropTypes.shape({
                value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                label: PropTypes.string,
            }),
        ).isRequired,
        customStyle: PropTypes.shape({
            container: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            label: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            input: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            hint: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            errorContainer: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
            }),
            error: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
            }),
        }),
    };

    static defaultProps = {
        required: true,
        disabled: false,
    };

    constructor(props) {
        super(props);

        // this.renderDropdownValue = this.renderDropdownValue.bind(this);
    }
}
