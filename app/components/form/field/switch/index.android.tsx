import fromColor from 'color';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {Switch as NativeSwitch} from 'react-native-paper';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import util from '../../util';
import BaseSwitch from './baseSwitch';

export default class Switch extends BaseSwitch {
    getStyles() {
        const {disabled, customStyle} = this.props;

        const baseStyles = this.getStylesObject();
        const baseColor = fromColor('#000').alpha(0.38).rgb().string();
        const disabledColor = fromColor('#000').alpha(0.12).rgb().string();
        const baseColorDark = fromColor('#fff').alpha(0.38).rgb().string();
        const disabledColorDark = fromColor('#fff').alpha(0.12).rgb().string();

        return StyleSheet.create({
            ...baseStyles,
            container: {
                paddingVertical: 10,
                paddingHorizontal: 16,
                ..._.get(customStyle, 'container.base'),
                ...(disabled ? _.get(customStyle, 'container.disabled') : {}),
            },
            widgetContainer: {
                flexDirection: 'row',
                alignItems: 'center',
            },
            labelContainer: {
                flex: 1,
                paddingBottom: 11,
                flexDirection: 'row',
            },
            containerRight: {
                flexWrap: 'nowrap',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            label: {
                fontFamily: Fonts.regular,
                fontSize: 16,
                marginBottom: 5,
                color: disabled ? disabledColor : '#212121',
                ..._.get(customStyle, 'label.base'),
                ...(disabled ? _.get(customStyle, 'label.disabled') : {}),
            },
            labelDark: {
                color: disabled ? disabledColorDark : Colors.white,
            },
            hint: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: disabled ? disabledColor : baseColor,
                ..._.get(customStyle, 'hint.base'),
                ...(disabled ? _.get(customStyle, 'hint.disabled') : {}),
            },
            hintDark: {
                color: disabled ? disabledColorDark : baseColorDark,
            },
        });
    }

    render() {
        const {onChangeValue = _.noop, value, hint, disabled, disabledValue, labelUpperCase, customStyle} = this.props;
        const styles = this.getStyles();
        const primaryColor = this.getPrimaryColor(customStyle, {disabled});
        const hasHint = !util.isEmpty(hint);
        const activity = disabled && !_.isUndefined(disabledValue) ? disabledValue : value;
        const content = (
            <View style={styles.container} pointerEvents='box-only'>
                <View style={styles.labelContainer}>
                    {this.renderLabel(labelUpperCase, this.isDark ? styles.labelDark : styles.label)}
                    <View
                        style={{
                            flex: 0.5,
                        }}>
                        {this.renderIcons()}
                        <NativeSwitch
                            thumbColor={activity ? primaryColor : this.selectColor(Colors.gray, DarkColors.border)}
                            trackColor={{
                                false: fromColor(this.selectColor(Colors.gray, DarkColors.border)).alpha(0.6).rgb().string(),
                                true: fromColor(primaryColor).alpha(0.6).rgb().string(),
                            }}
                            value={activity}
                            onValueChange={() => onChangeValue(!value)}
                            disabled={disabled}
                        />
                    </View>
                </View>
                {hasHint && (
                    <View style={{flexDirection: 'row'}}>
                        <Text key='hint' style={[styles.hint, this.isDark && styles.hintDark]}>
                            {hint}
                        </Text>
                    </View>
                )}
            </View>
        );

        if (!disabled) {
            return <TouchableNativeFeedback onPress={() => onChangeValue(!value)}>{content}</TouchableNativeFeedback>;
        }

        return content;
    }
}
