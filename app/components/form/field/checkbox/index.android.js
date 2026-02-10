import fromColor from 'color';
import * as _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import util from '../../util';
import BaseCheckbox from './baseCheckbox';
import NativeCheckbox from './materialCheckbox';

export default class Checkbox extends BaseCheckbox {
    render() {
        const {onChangeValue = _.noop, label, required, value, hint, disabled, error, smallLabel, customStyle, testID} = this.props;

        const errored = !util.isEmpty(error);
        const baseColor = fromColor('#000').alpha(0.38).rgb().string();
        const disabledColor = fromColor('#000').alpha(0.12).rgb().string();
        const baseColorDark = fromColor('#fff').alpha(0.38).rgb().string();
        const disabledColorDark = fromColor('#fff').alpha(0.12).rgb().string();

        const styles = StyleSheet.create({
            container: {
                paddingVertical: 10,
                paddingHorizontal: 10,
                ..._.get(customStyle, 'container.base'),
                ...(errored ? _.get(customStyle, 'container.errored') : {}),
                ...(disabled ? _.get(customStyle, 'container.disabled') : {}),
            },
            widgetContainer: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingVertical: 4,
                ..._.get(customStyle, 'widgetContainer.base'),
                ...(errored ? _.get(customStyle, 'widgetContainer.errored') : {}),
                ...(disabled ? _.get(customStyle, 'widgetContainer.disabled') : {}),
            },
            checkboxContainer: {
                minWidth: 36,
                ..._.get(customStyle, 'checkboxContainer.base'),
                ...(errored ? _.get(customStyle, 'checkboxContainer.errored') : {}),
                ...(disabled ? _.get(customStyle, 'checkboxContainer.disabled') : {}),
            },
            labelContainer: {
                flex: 1,
                paddingLeft: 20,
                paddingTop: smallLabel ? 12 : 7,
            },
            label: {
                fontFamily: Fonts.regular,
                fontSize: smallLabel ? 10 : 16,
                marginBottom: 5,
                marginRight: 15,
                color: disabled ? disabledColor : this.selectColor(Colors.grayDark, DarkColors.text),
                ..._.get(customStyle, 'label.base'),
                ...(errored ? _.get(customStyle, 'label.errored') : {}),
                ...(disabled ? _.get(customStyle, 'label.disabled') : {}),
            },
            hint: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: disabled ? disabledColor : baseColor,
                ..._.get(customStyle, 'hint.base'),
                ...(errored ? _.get(customStyle, 'hint.errored') : {}),
                ...(disabled ? _.get(customStyle, 'hint.disabled') : {}),
            },
            hintDark: {
                color: disabled ? disabledColorDark : baseColorDark,
                ..._.get(customStyle, 'hintDark.base'),
                ...(errored ? _.get(customStyle, 'hint.errored') : {}),
                ...(disabled ? _.get(customStyle, 'hint.disabled') : {}),
            },
            errorContainer: {
                marginTop: 5,
                marginLeft: 8,
                ..._.get(customStyle, 'errorContainer.base'),
                ...(disabled ? _.get(customStyle, 'errorContainer.disabled') : {}),
            },
            errorLine: {
                borderColor: this.selectColor(Colors.red, DarkColors.red),
                borderStyle: 'solid',
                borderWidth: 1,
                marginBottom: 4,
            },
            error: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: this.selectColor(Colors.red, DarkColors.red),
                ..._.get(customStyle, 'error.base'),
                ...(disabled ? _.get(customStyle, 'error.disabled') : {}),
            },
        });
        const primaryColor = this.getPrimaryColor(customStyle, {errored, disabled});
        const hasHint = !errored && !smallLabel && !util.isEmpty(hint);

        return (
            <TouchableNativeFeedback testID={testID} disabled={disabled} onPress={() => onChangeValue(!value)}>
                <View style={styles.container} pointerEvents='auto'>
                    <View style={styles.widgetContainer}>
                        <View style={styles.checkboxContainer}>
                            <NativeCheckbox
                                checked={value}
                                onPress={() => onChangeValue(!value)}
                                color={primaryColor}
                                uncheckedColor={this.selectColor(Colors.grayDark, DarkColors.text)}
                                disabled={disabled}
                            />
                        </View>
                        <View style={styles.labelContainer}>
                            <Text key='label' style={styles.label}>
                                {[
                                    [
                                        label,
                                        required && (
                                            <Text key='required' style={{color: this.selectColor(Colors.red, DarkColors.red)}}>
                                                {' '}
                                                *
                                            </Text>
                                        ),
                                    ],
                                ]}
                            </Text>
                            {hasHint && (
                                <Text key='hint' style={[styles.hint, this.isDark && styles.hintDark]}>
                                    {hint}
                                </Text>
                            )}
                        </View>
                    </View>
                    {errored && (
                        <View style={styles.errorContainer}>
                            <View style={styles.errorLine} />
                            <Text style={styles.error}>{error}</Text>
                        </View>
                    )}
                </View>
            </TouchableNativeFeedback>
        );
    }
}
