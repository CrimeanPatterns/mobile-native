import _ from 'lodash';
import React from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import Animated, {StretchInY, StretchOutY} from 'react-native-reanimated';

import {Colors, DarkColors} from '../../../../styles';
import Icon from '../../../icon';
import BaseText from './baseText';

export default class Text extends BaseText {
    clearValue = () => {
        this._onChangeValue('');
    };

    getInputProps() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {clearButtonMode, disabled, editable, attr, ...rest} = this.props;

        return rest;
    }

    getStyles() {
        const {multiline} = this.props;
        const styles = super.getStyles();
        const height = 46; // 48 (46 + 2 (border))
        const multilineStyles = !multiline ? {height, maxHeight: height} : {minHeight: height, maxHeight: 144, paddingTop: 15};

        return {
            ...styles,
            fieldContainer: {
                ...styles.fieldContainer,
                ...multilineStyles,
                paddingVertical: 0,
                borderBottomWidth: 0,
            },
        };
    }

    renderClearButton() {
        const {clearButtonMode} = this.props;
        const {focused} = this.state;
        const value = this.getValue();

        if (_.isNil(clearButtonMode) === false && value.length > 0 && focused) {
            return (
                <View style={{position: 'absolute', right: 10, top: 18}}>
                    <TouchableOpacity onPress={this.clearValue}>
                        <Icon name='clear' color={this.themeColors.blue} />
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    }

    renderTextInput() {
        const {testID, disabled, editable = true} = this.props;
        const styles = this.getStyles();
        const textInputProps = this.getInputProps();

        return (
            <View style={{position: 'relative'}}>
                <TextInput
                    accessible
                    testID={testID}
                    keyboardType={this.keyboardType}
                    {...textInputProps}
                    placeholderTextColor={disabled ? this.disabledColor : Colors.grayDark}
                    editable={!disabled && editable}
                    style={[styles.fieldContainer, styles.fieldText]}
                    value={this.getValue()}
                    onChangeText={this._onChangeValue}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    ref={this._handleRef}
                />
                {this.renderClearButton()}
            </View>
        );
    }

    renderBottomBorder() {
        const {focused} = this.state;
        const colors = this.themeColors;
        const errored = this.hasError();

        return (
            <View style={{height: 2, backgroundColor: errored ? colors.red : this.selectColor(Colors.gray, DarkColors.border)}}>
                {focused && (
                    <Animated.View
                        key='border'
                        entering={StretchInY.duration(300)}
                        exiting={StretchOutY.duration(300)}
                        style={{backgroundColor: colors.blue, height: 2}}
                    />
                )}
            </View>
        );
    }

    render() {
        const {additionalHint, footerComponent} = this.props;
        const styles = this.getStyles();

        return (
            <View style={styles.container}>
                {this.renderLabel()}
                {this.renderTextInput()}
                {this.renderBottomBorder()}
                {_.isFunction(additionalHint) && additionalHint()}
                {this.renderHint()}
                {this.renderError()}
                {_.isFunction(footerComponent) && footerComponent()}
            </View>
        );
    }
}
