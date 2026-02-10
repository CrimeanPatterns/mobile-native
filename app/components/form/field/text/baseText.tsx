import _ from 'lodash';
import {ReactElement} from 'react';
import {KeyboardTypeOptions, TextInput} from 'react-native';

import BaseField from '../baseField';

type BaseTextProps = {
    testID?: string;
    attr: {
        keyboardType?: KeyboardTypeOptions;
        [key: string]: unknown;
    };
    onChangeValue(value: string): void;
    onBlur?(): void;
    onFocus?(): void;
    label: string;
    required: boolean;
    value: string | number;
    hint: ReactElement;
    disabled: boolean;
    editable?: boolean;
    secureTextEntry?: boolean;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
    clearButtonMode?: string;
    additionalHint?(...args: unknown[]): unknown;
    footerComponent?(...args: unknown[]): unknown;
    innerRef?(instance: TextInput): void;
    customStyle: {
        container?: {
            base: object;
            errored?: object;
            disabled?: object;
            focused?: object;
        };
        label?: {
            base: object;
            errored?: object;
            disabled?: object;
            focused?: object;
        };
        input?: {
            base: object;
            errored?: object;
            disabled?: object;
            focused?: object;
        };
        inputContainer?: {
            base: object;
            errored?: object;
            disabled?: object;
            focused?: object;
        };
        hint?: {
            base: object;
            errored?: object;
            disabled?: object;
            focused?: object;
        };
        errorContainer?: {
            base: object;
            disabled?: object;
            focused?: object;
        };
        error?: {
            base: object;
            disabled?: object;
            focused?: object;
        };
        primaryColor?: {
            base: string;
            errored?: string;
            disabled?: string;
            focused?: string;
        };
    };
};

export default class BaseText extends BaseField<BaseTextProps, {focused: boolean}> {
    static displayName = 'TextField';

    static defaultProps = {
        label: '',
        required: true,
        disabled: false,
        textContentType: 'none',
        innerRef: _.noop,
        onChangeValue: _.noop,
        onFocus: _.noop,
        onBlur: _.noop,
    };

    private _input: TextInput | undefined;

    constructor(props) {
        super(props);

        this.state = {
            focused: false,
        };

        this._handleRef = this._handleRef.bind(this);
        this._onChangeValue = this._onChangeValue.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }

    focus() {
        this._input?.focus();
    }

    isFocused() {
        const {focused} = this.state;

        return focused;
    }

    blur() {
        this._input?.blur();
    }

    _handleRef(ref: TextInput) {
        const {innerRef} = this.props;

        if (ref) {
            this._input = ref;
            innerRef?.(this._input);
        }
    }

    _onChangeValue(value: string) {
        const {onChangeValue} = this.props;

        onChangeValue(value);
    }

    _onFocus() {
        const {onFocus} = this.props;

        this.setState(
            {
                focused: true,
            },
            onFocus,
        );
    }

    _onBlur() {
        const {onBlur} = this.props;

        this.setState(
            {
                focused: false,
            },
            onBlur,
        );
    }

    getValue() {
        const {value} = this.props;

        return _.toString(value);
    }

    get keyboardType() {
        const {attr, keyboardType} = this.props;

        if (_.isNil(keyboardType) === false) {
            return keyboardType; // compatibility with email field
        }

        return attr?.keyboardType;
    }
}
