import * as _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import Checkbox from '../checkbox';
import BaseMultipleChoice from './baseMultipleChoice';

export default class MultipleChoice extends BaseMultipleChoice {
    static displayName = 'MultipleChoiceField';

    render() {
        const {label, required, value, choices, disabled, customStyle, theme} = this.props;
        const colors = this.themeColors;
        const styles = {
            container: {
                paddingVertical: 10,
            },
            label: {
                fontFamily: Fonts.regular,
                color: this.selectColor(Colors.blueDark, DarkColors.blue),
                fontSize: 20,
                paddingRight: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                marginLeft: 16,
                marginTop: 10,
                borderColor: this.selectColor(Colors.gray, DarkColors.border),
            },
            widgetGroup: {
                flex: 1,
                flexDirection: 'column',
                flexWrap: 'nowrap',
            },
            separator: {
                height: 1,
                backgroundColor: colors.border,
            },
            checkboxContainer: {
                paddingHorizontal: 0,
                paddingLeft: 8,
                margin: 0,
            },
            checkboxWidgetContainer: {},
            required: {
                color: colors.red,
                fontFamily: Fonts.regular,
            },
            inactive: {
                color: Colors.gray,
            },
        };
        const choicesLength = choices.length;
        const primaryColor = this.getPrimaryColor(customStyle, {disabled});

        return (
            <View style={styles.container}>
                {_.isString(label) && (
                    <Text style={[styles.label, {color: primaryColor}]}>
                        {label}
                        {required && <Text style={styles.required}> *</Text>}
                    </Text>
                )}
                <View style={styles.widgetGroup}>
                    {choices.map((choice, i) => [
                        <Checkbox
                            theme={theme}
                            key={`checkbox_${choice.name}`}
                            onChangeValue={this._onChangeCallbacks[choice.name]}
                            label={choice.label}
                            required={false}
                            value={value.indexOf(choice.name) > -1}
                            customStyle={{
                                container: {
                                    base: styles.checkboxContainer,
                                },
                                label: {
                                    base: choice.inactive === true ? styles.inactive : {},
                                },
                                widgetContainer: {
                                    base: styles.checkboxWidgetContainer,
                                },
                                ...customStyle,
                            }}
                        />,
                        choicesLength !== i + 1 && <View key={`separator_${choice.name}`} style={styles.separator} />,
                    ])}
                </View>
            </View>
        );
    }
}
