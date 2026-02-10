import fromColor from 'color';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text as NativeText} from 'react-native';
import {TextField} from 'react-native-material-textfield';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import util from '../../util';
import BaseText from './baseText';

export default class Text extends BaseText {
    static propTypes = {
        ...BaseText.propTypes,
        renderAccessory: PropTypes.func,
    };

    getInputProps() {
        const {onChangeValue, label, required, hint, additionalHint, footerComponent, customStyle, ...rest} = this.props;

        return rest;
    }

    getTextFieldComponent() {
        return TextField;
    }

    render() {
        const {label, required, hint, disabled, error, additionalHint, footerComponent, customStyle} = this.props;
        const {focused} = this.state;
        const textInputProps = this.getInputProps();

        const errored = !util.isEmpty(error);
        const styles = {
            container: {
                paddingHorizontal: 16,
                ..._.get(customStyle, 'container.base'),
                ...(errored ? _.get(customStyle, 'container.errored') : {}),
                ...(disabled ? _.get(customStyle, 'container.disabled') : {}),
                ...(focused ? _.get(customStyle, 'container.focused') : {}),
            },
            label: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                ..._.get(customStyle, 'label.base'),
                ...(errored ? _.get(customStyle, 'label.errored') : {}),
                ...(disabled ? _.get(customStyle, 'label.disabled') : {}),
                ...(focused ? _.get(customStyle, 'label.focused') : {}),
            },
            input: {
                color: fromColor(this.selectColor(Colors.black, DarkColors.text)).alpha(0.87).rgb().string(),
                fontSize: 16,
                ..._.get(customStyle, 'input.base'),
                ...(errored ? _.get(customStyle, 'input.errored') : {}),
                ...(disabled ? _.get(customStyle, 'input.disabled') : {}),
                ...(focused ? _.get(customStyle, 'input.focused') : {}),
            },
            hint: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                ..._.get(customStyle, 'hint.base'),
                ...(errored ? _.get(customStyle, 'hint.errored') : {}),
                ...(disabled ? _.get(customStyle, 'hint.disabled') : {}),
                ...(focused ? _.get(customStyle, 'hint.focused') : {}),
            },
            affix: {
                fontFamily: Fonts.regular,
            },
        };
        const primaryColor = this.getPrimaryColor(customStyle, {errored, disabled, focused});
        const requiredText = ` *`;
        const baseColor = this.selectColor(Colors.black, DarkColors.text);
        const errorColor = this.selectColor(Colors.red, DarkColors.red);
        const TextField = this.getTextFieldComponent();

        return (
            <TextField
                {...textInputProps}
                keyboardType={this.keyboardType}
                renderAdditionalHint={additionalHint}
                renderFooterComponent={footerComponent}
                textColor={styles.input.color}
                fontSize={styles.input.fontSize}
                titleFontSize={styles.hint.fontSize}
                labelFontSize={styles.label.fontSize}
                labelHeight={32}
                labelPadding={4}
                inputContainerPadding={8}
                lineWidth={0.5}
                activeLineWidth={2}
                disabledLineWidth={1}
                tintColor={primaryColor}
                baseColor={disabled ? fromColor(baseColor).alpha(0.12).rgb().string() : fromColor(baseColor).alpha(0.38).rgb().string()}
                label={[
                    label,
                    required && (
                        <NativeText key='required' style={{color: errorColor}}>
                            {requiredText}
                        </NativeText>
                    ),
                ]}
                title={hint}
                errorColor={errorColor}
                disabledLineType='dotted'
                animationDuration={225}
                containerStyle={styles.container}
                labelTextStyle={styles.label}
                titleTextStyle={styles.hint}
                affixTextStyle={styles.affix}
                value={this.getValue()}
                onChangeText={this._onChangeValue}
                onFocus={this._onFocus}
                onBlur={this._onBlur}
                ref={this._handleRef}
            />
        );
    }
}
