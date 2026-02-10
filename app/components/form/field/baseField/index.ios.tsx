import fromColor from 'color';
import _ from 'lodash';
import React, {ReactElement} from 'react';
import {StyleSheet, Text} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';
import util from '../../util';

type BaseFieldProps = {
    testID?: string;
    hint?: ReactElement;
    disabled: boolean;
    label: string;
    required: boolean;
    error?: string;
    customStyle: any;
};

type BaseFieldState = {
    touched?: boolean;
    focused: boolean;
};

export default class BaseField<P extends BaseFieldProps, S extends BaseFieldState> extends BaseThemedPureComponent<P, S> {
    static defaultProps = {
        disabled: false,
    };

    static getPrimaryColor(customStyle, disabled: boolean) {
        if (disabled && _.get(customStyle, 'primaryColor.disabled')) {
            return _.get(customStyle, 'primaryColor.disabled');
        }

        return _.get(customStyle, 'primaryColor.base', Colors.blueDark);
    }

    constructor(props) {
        super(props);

        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        this.state = {
            touched: false,
            focused: false,
        } as S;
    }

    _onTouchStart() {
        this.setState({
            touched: true,
        });
    }

    _onTouchEnd() {
        this.setState({
            touched: false,
        });
    }

    get textColor() {
        return fromColor(Colors.black).alpha(0.87).rgb().string();
    }

    get disabledColor() {
        return fromColor(this.selectColor(Colors.black, DarkColors.gray))
            .alpha(this.isDark ? 0.5 : 0.12)
            .rgb()
            .string();
    }

    getPrimaryColor(customStyle, disabled: boolean) {
        return BaseField.getPrimaryColor(customStyle, disabled);
    }

    hasError() {
        const {error} = this.props;

        return !util.isEmpty(error);
    }

    hasHint() {
        const {hint} = this.props;

        return !util.isEmpty(hint);
    }

    get backgroundColor() {
        return this.selectColor(Colors.grayLight, DarkColors.grayDark);
    }

    getStateStyles(customStyles, property: string) {
        const {disabled} = this.props;
        const {focused} = this.state;
        const errored = this.hasError();
        const states = [
            ['base', true],
            ['errored', errored],
            ['disabled', disabled],
            ['focused', focused],
        ];
        let styles = {};

        if (_.isObject(customStyles)) {
            states.forEach(([state, cond]) => {
                const style = cond && _.get(customStyles, `${property}.${state}`);

                if (_.isObject(style)) {
                    styles = {...styles, ...style};
                }
            });
        }

        return styles;
    }

    getStylesObject() {
        const {customStyle, disabled} = this.props;
        const {touched, focused} = this.state;
        const colors = this.themeColors;
        const errorText = {
            color: colors.red,
        };
        const errored = this.hasError();

        return {
            container: {
                marginVertical: 12,
                marginHorizontal: 15,
                ...(focused ? {zIndex: 1} : {}),
                ...this.getStateStyles(customStyle, 'container'),
            },
            label: {
                fontFamily: Fonts.regular,
                color: disabled ? this.disabledColor : this.selectColor(Colors.grayDark, DarkColors.text),
                fontSize: 12,
                paddingRight: 16,
                ...this.getStateStyles(customStyle, 'label'),
            },
            fieldText: {
                fontSize: 15,
                color: disabled ? this.disabledColor : this.selectColor(this.textColor, Colors.white),
                fontFamily: Fonts.regular,
                ...this.getStateStyles(customStyle, 'fieldText'),
                ...(errored ? {color: colors.red} : {}),
            },
            fieldContainer: {
                marginTop: 5,
                borderColor: disabled ? this.disabledColor : this.selectColor(Colors.graySoft, DarkColors.grayDark),
                borderTopWidth: 1,
                borderBottomWidth: 2,
                borderBottomColor: this.selectColor(Colors.gray, DarkColors.border),
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                paddingVertical: 15,
                paddingLeft: 18,
                paddingRight: 12,
                backgroundColor: this.backgroundColor,
                ...(errored ? {borderBottomWidth: 2, borderBottomColor: colors.red} : {}),
                ...(touched ? {backgroundColor: this.selectColor(Colors.grayMild, DarkColors.bgLight)} : {}),
                ...this.getStateStyles(customStyle, 'fieldContainer'),
            },
            hint: {
                color: disabled ? this.disabledColor : fromColor(this.selectColor(Colors.grayDark, DarkColors.text)).alpha(0.6).rgb().string(),
                fontSize: 12,
                marginBottom: errored ? 0 : 5,
                marginTop: 5,
                fontFamily: Fonts.regular,
                ...this.getStateStyles(customStyle, 'hint'),
            },
            error: {
                ...errorText,
                marginVertical: 5,
                paddingRight: 12,
                fontSize: 12,
                ...this.getStateStyles(customStyle, 'error'),
            },
            required: {
                color: disabled ? this.disabledColor : colors.red,
                fontFamily: Fonts.regular,
                ...(errored ? errorText : {}),
            },
        };
    }

    getStyles() {
        return StyleSheet.create(this.getStylesObject());
    }

    _renderLabel(label: string, required = false, upperCase = true, style?, props?) {
        const {label: styleLabel, required: styleRequired} = this.getStyles();

        return (
            <Text style={[styleLabel, style]} {...props}>
                {upperCase ? label.toUpperCase() : label}
                {required && <Text style={styleRequired}> *</Text>}
            </Text>
        );
    }

    renderLabel(upperCase = true, style?, props?) {
        const {label, required} = this.props;

        return _.isString(label) && this._renderLabel(label, required, upperCase, style, props);
    }

    renderHint() {
        const {testID, hint} = this.props;
        const {hint: style} = this.getStyles();

        return (
            this.hasHint() && (
                <Text testID={`${testID} hint`} accessibilityLabel={_.isString(hint) ? hint : undefined} style={style}>
                    {hint}
                </Text>
            )
        );
    }

    renderError() {
        const {testID, error} = this.props;
        const {error: style} = this.getStyles();

        return (
            this.hasError() && (
                <Text testID={`${testID} error`} accessibilityLabel={_.isString(error) ? error : undefined} style={style}>
                    {error}
                </Text>
            )
        );
    }
}
