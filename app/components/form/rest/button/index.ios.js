import fromColor from 'color';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {Colors, Fonts} from '../../../../styles';
import Spinner from '../../../spinner';
import BaseButton from './baseButton';

class Button extends BaseButton {
    static defaultProps = {
        ...BaseButton.defaultProps,
        pressedColor: '#5582bf',
    };

    render() {
        const {customStyle, testID, onPress = _.noop} = this.props;
        const {pressed} = this.state;
        const {color, label, disabled, loading, pressedColor} = this.getVars();
        const isDisabled = disabled || loading;

        const styles = StyleSheet.create({
            button: {
                marginHorizontal: 5,
                ...(isDisabled
                    ? {
                          backgroundColor: '#1466b3',
                      }
                    : {
                          backgroundColor: color,
                      }),
                ..._.get(customStyle, 'button.base'),
                ...(isDisabled ? _.get(customStyle, 'button.disabled') : {}),
                ...(loading ? _.get(customStyle, 'button.loading') : {}),
                ...(pressed && !isDisabled
                    ? {
                          backgroundColor: pressedColor,
                          ..._.get(customStyle, 'button.pressed'),
                      }
                    : {}),
            },
            label: {
                textAlign: 'center',
                paddingHorizontal: 35,
                height: 48,
                lineHeight: 48,
                fontSize: 13,
                fontFamily: Fonts.regular,
                ...(isDisabled
                    ? {
                          color: fromColor(color).isLight() ? '#5c93cc' : '#5c93cc',
                      }
                    : {
                          color: fromColor(color).isLight() ? Colors.black : Colors.white,
                      }),
                ..._.get(customStyle, 'label.base'),
                ...(isDisabled ? _.get(customStyle, 'label.disabled') : {}),
                ...(loading ? _.get(customStyle, 'label.loading') : {}),
                ...(pressed && !isDisabled
                    ? {
                          color: fromColor(pressedColor).isLight() ? Colors.black : Colors.white,
                          ..._.get(customStyle, 'label.pressed'),
                      }
                    : {}),
            },
            spinner: {
                position: 'absolute',
                left: 7,
                top: 0,
                right: 0,
                bottom: 0,
                justifyContent: 'center',
                alignItems: 'flex-start',
            },
            contentContainer: {
                ..._.get(customStyle, 'contentContainer.base'),
                ...(isDisabled ? _.get(customStyle, 'contentContainer.disabled') : {}),
                ...(loading ? _.get(customStyle, 'contentContainer.loading') : {}),
                ...(pressed && !isDisabled ? _.get(customStyle, 'contentContainer.pressed') : {}),
            },
        });

        return (
            <TouchableOpacity
                testID={testID}
                accessibilityLabel={label}
                accessibilityRole='button'
                accessibilityComponentType='button'
                accessibilityTraits='button'
                accessibilityState={this.getAccessibilityState(isDisabled)}
                disabled={isDisabled}
                onPress={onPress}
                activeOpacity={pressedColor ? 1 : 0.8}
                onPressIn={this._onPressIn}
                onPressOut={this._onPressOut}>
                <View style={[styles.button, styles.contentContainer]}>
                    {loading && (
                        <View style={styles.spinner}>
                            <Spinner size={22} color='#0974d9' />
                        </View>
                    )}
                    <Text style={styles.label} disabled={isDisabled}>
                        {label}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default Button;
