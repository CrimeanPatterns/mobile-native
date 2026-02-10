import _ from 'lodash';
import PropTypes from 'prop-types';

import {Colors} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';

export default class BaseButton extends BaseThemedPureComponent {
    static displayName = 'Button';

    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        label: PropTypes.string.isRequired,
        mode: PropTypes.string,
        onPress: PropTypes.func,
        disabled: PropTypes.bool,
        loading: PropTypes.bool,
        color: PropTypes.string,
        pressedColor: PropTypes.string,
        customStyle: PropTypes.shape({
            button: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
                loading: PropTypes.object,
                pressed: PropTypes.object,
            }),
            label: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
                loading: PropTypes.object,
                pressed: PropTypes.object,
            }),
            contentContainer: PropTypes.shape({
                base: PropTypes.object.isRequired,
                disabled: PropTypes.object,
                loading: PropTypes.object,
                pressed: PropTypes.object,
            }),
        }),
        testID: PropTypes.string,
    };

    static defaultProps = {
        disabled: false,
        loading: false,
        color: Colors.blueDark,
    };

    constructor(props) {
        super(props);

        this.state = {
            label: null,
            disabled: null,
            loading: null,
            color: null,
            pressedColor: null,
            pressed: false,
        };

        this._onPressIn = this._onPressIn.bind(this);
        this._onPressOut = this._onPressOut.bind(this);
    }

    setLabel(label) {
        this.setState({label});
    }

    setDisabled(disabled) {
        this.setState({disabled});
    }

    setLoading(loading) {
        this.setState({loading});
    }

    setColor(color) {
        this.setState({color});
    }

    setPressedColor(pressedColor) {
        this.setState({pressedColor});
    }

    _onPressIn() {
        this.setState({pressed: true});
    }

    _onPressOut() {
        this.setState({pressed: false});
    }

    getAccessibilityState(disabled) {
        const states = {};

        states.disabled = disabled;

        return states;
    }

    getVars() {
        const {
            label: propLabel,
            mode: propMode,
            disabled: propDisabled,
            loading: propLoading,
            color: propColor,
            pressedColor: propPressedColor,
        } = this.props;
        const {label, mode, disabled, loading, color, pressedColor} = this.state;
        const callback = (o) => !_.isNil(o);

        return {
            label: _.find([label, propLabel], callback),
            mode: _.find([mode, propMode], callback),
            disabled: _.find([disabled, propDisabled], callback),
            loading: _.find([loading, propLoading], callback),
            color: _.find([color, propColor], callback),
            pressedColor: _.find([pressedColor, propPressedColor, color, propColor, Colors.blueDark], callback),
        };
    }
}
