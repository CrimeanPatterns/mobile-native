import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {Colors} from '../../styles';
import {TextField} from '../form';

// Fix password generator
export class PlainTextField extends TextField {
    getPlainText() {
        return this.getValue();
    }

    renderBottomBorder() {
        return null;
    }

    renderPlainText() {
        const styles = this.getStyles();

        return <Text style={[styles.fieldText, {paddingTop: 2}]}>{this.getPlainText()}</Text>;
    }

    renderTextInput() {
        const {disabled, placeholder, editable} = this.props;

        if (!editable) {
            const styles = this.getStyles();
            const value = this.getValue();
            const isEmpty = _.isEmpty(value);
            const placeholderTextColor = disabled ? this.disabledColor : Colors.grayDark;

            return (
                <View style={[styles.fieldContainer, {height: 48}]}>
                    {isEmpty === false && this.renderPlainText()}
                    {isEmpty && <Text style={[styles.fieldText, {color: placeholderTextColor}]}>{placeholder}</Text>}
                </View>
            );
        }

        return super.renderTextInput();
    }
}
