import PropTypes from 'prop-types';

import BaseField from '../baseField/index';

export default class BaseCheckbox extends BaseField {
    static displayName = 'CheckboxField';

    static propTypes = {
        onChangeValue: PropTypes.func.isRequired,
        label: PropTypes.string,
        required: PropTypes.bool,
        value: PropTypes.bool,
        hint: PropTypes.node,
        disabled: PropTypes.bool,
        error: PropTypes.string,
        smallLabel: PropTypes.bool,
        customStyle: PropTypes.shape({
            container: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            widgetContainer: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            label: PropTypes.shape({
                base: PropTypes.object.isRequired,
                errored: PropTypes.object,
                disabled: PropTypes.object,
            }),
            checkboxContainer: PropTypes.shape({
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
            primaryColor: PropTypes.shape({
                base: PropTypes.string.isRequired,
                errored: PropTypes.string,
                disabled: PropTypes.string,
            }),
        }),
    };

    static defaultProps = {
        required: true,
        value: false,
        disabled: false,
        smallLabel: false,
    };

    // eslint-disable-next-line class-methods-use-this
    getAccessibilityState(disabled, selected) {
        const states = [];

        if (disabled) {
            states.push('disabled');
        }

        if (selected) {
            states.push('selected');
        }

        return states;
    }
}
