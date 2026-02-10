import _ from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Switch as NativeSwitch} from 'react-native-paper';

import {Colors, DarkColors} from '../../../../styles';
import BaseSwitch from './baseSwitch';

const customLabelProps = {ellipsizeMode: 'tail', numberOfLines: 2};

export default class Switch extends BaseSwitch {
    onValueChange = () => {
        const {onChangeValue = _.noop, value} = this.props;

        onChangeValue(!value);
    };

    getClassStyles() {
        const {attr} = this.props;
        const styles = {
            simple: {
                fieldContainer: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    marginTop: 0,
                },
                container: {
                    paddingHorizontal: 0,
                    marginTop: 0,
                },
            },
        };

        return _.isObject(attr) && _.isString(attr.class) ? styles[attr.class] : {};
    }

    getStyles() {
        const baseStyles = this.getStylesObject();
        const styles = {
            ...baseStyles,
            fieldContainer: {
                ...baseStyles.fieldContainer,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 48,
                paddingVertical: 0,
            },
            containerRight: {
                flexWrap: 'nowrap',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingLeft: 5,
            },
            customLabel: {
                flex: 1,
                paddingHorizontal: 0,
                fontSize: 15,
            },
        };
        const classStyles = this.getClassStyles();

        return StyleSheet.create(_.merge(styles, classStyles));
    }

    render() {
        const {testID, label, value, disabled, disabledValue, labelUpperCase} = this.props;
        const colors = this.themeColors;
        const styles = this.getStyles();

        return (
            <View style={styles.container}>
                <View style={styles.fieldContainer}>
                    {this.renderLabel(labelUpperCase, styles.customLabel, customLabelProps)}
                    <View style={styles.containerRight}>
                        {this.renderIcons()}
                        <NativeSwitch
                            testID={testID}
                            accessible
                            accessibilityLabel={label}
                            accessibilityStates={this.getAccessibilityState(disabled, value)}
                            color={colors.green}
                            ios_backgroundColor={this.selectColor(Colors.white, DarkColors.bg)}
                            value={disabled && !_.isUndefined(disabledValue) ? disabledValue : value}
                            onValueChange={this.onValueChange}
                            disabled={disabled}
                        />
                    </View>
                </View>
                {this.renderHint()}
                {this.renderError()}
            </View>
        );
    }
}
