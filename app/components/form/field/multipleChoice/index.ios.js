import React from 'react';
import {View} from 'react-native';

import {Colors} from '../../../../styles';
import Checkbox from '../checkbox';
import BaseMultipleChoice from './baseMultipleChoice';

export default class MultipleChoice extends BaseMultipleChoice {
    static displayName = 'MultipleChoiceField';

    render() {
        const {value, choices, customStyle, theme} = this.props;
        const colors = this.themeColors;
        const {container, fieldContainer} = this.getStyles();
        const styles = {
            container: {
                ...container,
            },
            fieldContainer: {
                ...fieldContainer,
                flex: 1,
                flexWrap: 'nowrap',
                paddingRight: 0,
                paddingLeft: 0,
                paddingVertical: 0,
                marginHorizontal: 0,
                marginVertical: 0,
            },
            separator: {
                height: 1,
                backgroundColor: colors.border,
                marginLeft: 16,
            },
            inactive: {
                color: Colors.gray,
            },
            checkboxContainer: {
                marginVertical: 0,
                marginHorizontal: 0,
            },
            checkboxFieldContainer: {
                marginTop: 0,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                // paddingTop: 10,
                // paddingBottom: 10,
                // paddingRight: 10,
                borderTopWidth: 0,
                borderBottomWidth: 0,
            },
        };
        const choicesLength = choices.length;

        return (
            <View style={styles.container}>
                {this.renderLabel()}
                <View style={styles.fieldContainer}>
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
                                fieldContainer: {
                                    base: {
                                        borderWidth: 0,
                                        borderTopWidth: 0,
                                        borderLeftWidth: 0,
                                        borderRightWidth: 0,
                                        borderBottomWidth: 0,
                                        marginHorizontal: 0,
                                        marginTop: 0,
                                    },
                                },
                                ...customStyle,
                            }}
                        />,
                        choicesLength !== i + 1 && <View key={`separator_${choice.name}`} style={styles.separator} />,
                    ])}
                </View>
                {this.renderHint()}
                {this.renderError()}
            </View>
        );
    }
}
