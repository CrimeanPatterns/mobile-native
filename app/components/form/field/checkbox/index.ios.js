import _ from 'lodash';
import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';

import {Colors, DarkColors} from '../../../../styles';
import Icon from '../../../icon';
import BaseCheckbox from './baseCheckbox';

export default class Checkbox extends BaseCheckbox {
    getStyles() {
        const {smallLabel, customStyle, name} = this.props;
        const baseStyles = super.getStyles();
        const styles = {
            ...baseStyles,
            container: {
                ...baseStyles.container,
                ...this.getStateStyles(customStyle, 'container'),
            },
            fieldContainer: {
                ...baseStyles.fieldContainer,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
                ...this.getStateStyles(customStyle, 'fieldContainer'),
            },
            checkboxContainer: {
                marginTop: 2,
                ...this.getStateStyles(customStyle, 'checkboxContainer'),
            },
            labelContainer: {
                flex: 1,
                paddingLeft: 18,
                ...(smallLabel ? {paddingTop: 4} : {}),
            },
            label: {
                ...baseStyles.label,
                fontSize: smallLabel ? 10 : 15,
                paddingHorizontal: 0,
            },
        };

        if (name === 'notrelated') {
            styles.container = {
                ...styles.container,
                marginHorizontal: 0,
            };
            styles.fieldContainer = {
                ...styles.fieldContainer,
                backgroundColor: 'transparent',
                borderColor: this.selectColor(Colors.graySoft, DarkColors.border),
                borderTopWidth: 1,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
            };
        }

        return styles;
    }

    render() {
        const {onChangeValue = _.noop, value, disabled, testID} = this.props;
        const colors = this.themeColors;
        const styles = this.getStyles();

        let color = value ? colors.blue : colors.grayDarkLight;

        if (disabled) {
            color = this.disabledColor;
        }

        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    testID={testID}
                    accessibilityStates={this.getAccessibilityState(disabled, value)}
                    disabled={disabled}
                    onPress={() => onChangeValue(!value)}
                    onPressIn={this._onTouchStart}
                    onPressOut={this._onTouchEnd}>
                    <View style={styles.fieldContainer}>
                        <View style={styles.checkboxContainer}>
                            <Icon
                                style={{
                                    backgroundColor: value ? 'white' : this.selectColor('white', DarkColors.bg),
                                    width: 17,
                                    height: 17,
                                }}
                                name={value ? 'square-success' : 'radio-button'}
                                color={color}
                                size={17}
                            />
                        </View>
                        <View style={styles.labelContainer}>{this.renderLabel(false, styles.label)}</View>
                    </View>
                </TouchableWithoutFeedback>
                {this.renderHint()}
                {this.renderError()}
            </View>
        );
    }
}
