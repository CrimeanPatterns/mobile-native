import fromColor from 'color';
import _ from 'lodash';
import React from 'react';
import {Platform, Text, TouchableWithoutFeedback} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import {TextField} from 'react-native-material-textfield';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import util from '../../util';
import BaseChoice from './baseChoice';

export default class Choice extends BaseChoice {
    static propTypes = {
        ...BaseChoice.propTypes,
        ...TouchableWithoutFeedback.propTypes,
    };

    constructor(props) {
        super(props);

        this.getChoice = this.getChoice.bind(this);
        this.renderDropdownValue = this.renderDropdownValue.bind(this);
    }

    getChoice(value, choices) {
        const selectedItem = choices.find((item) => item != null && item.value === value);

        return selectedItem?.label || '';
    }

    renderDropdownValue(props) {
        return this.renderBase(props);
    }

    renderBase({title, value, renderAccessory, dropdownOffset, data, ...rest}) {
        const choice = this.getChoice(value, data);

        return (
            <TextField
                label=''
                labelHeight={dropdownOffset.top - Platform.select({ios: 1, android: 2})}
                {...rest}
                value={choice}
                editable={false}
                onChangeText={undefined}
                renderAccessory={renderAccessory}
                multiline={true}
            />
        );
    }

    render() {
        const {onChangeValue = _.noop, label, required, value, hint, disabled, disabledValue, error, choices, customStyle, ...rest} = this.props;

        const errored = !util.isEmpty(error);
        const styles = {
            container: {
                paddingHorizontal: 16,
                ..._.get(customStyle, 'container.base'),
                ...(errored ? _.get(customStyle, 'container.errored') : {}),
                ...(disabled ? _.get(customStyle, 'container.disabled') : {}),
            },
            label: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: fromColor(this.selectColor(Colors.black, DarkColors.text)).alpha(0.87).rgb().string(),
                ..._.get(customStyle, 'label.base'),
                ...(errored ? _.get(customStyle, 'label.errored') : {}),
                ...(disabled ? _.get(customStyle, 'label.disabled') : {}),
            },
            input: {
                color: fromColor(this.selectColor(Colors.black, DarkColors.text)).alpha(0.87).rgb().string(),
                fontSize: 16,
                ..._.get(customStyle, 'input.base'),
                ...(errored ? _.get(customStyle, 'input.errored') : {}),
                ...(disabled ? _.get(customStyle, 'input.disabled') : {}),
            },
            hint: {
                fontFamily: Fonts.regular,
                fontSize: 12,
                ..._.get(customStyle, 'hint.base'),
                ...(errored ? _.get(customStyle, 'hint.errored') : {}),
                ...(disabled ? _.get(customStyle, 'hint.disabled') : {}),
            },
            affix: {
                fontFamily: Fonts.regular,
            },
            item: {
                fontFamily: Fonts.regular,
            },
            overlay: {},
            picker: {
                backgroundColor: this.selectColor(Colors.white, DarkColors.border),
            },
        };
        const baseColor = fromColor(this.selectColor(Colors.black, DarkColors.text)).alpha(0.38).rgb().string();

        return (
            <Dropdown
                {...rest}
                renderBase={this.renderDropdownValue}
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
                tintColor='#1469c5'
                baseColor={disabled ? fromColor(this.selectColor(Colors.black, Colors.white)).alpha(0.12).rgb().string() : baseColor}
                label={[
                    label,
                    required && (
                        <Text key='required' style={{color: this.selectColor(Colors.red, DarkColors.red)}}>
                            {' '}
                            *
                        </Text>
                    ),
                ]}
                labelExtractor={(item) => {
                    if (_.isObject(item.attr) && _.isString(item.attr.name)) {
                        return item.attr.name;
                    }
                    return item.label;
                }}
                title={hint}
                error={error}
                errorColor={this.selectColor(Colors.red, DarkColors.red)}
                disabledLineType='dotted'
                animationDuration={0}
                disabled={disabled}
                containerStyle={styles.container}
                labelTextStyle={styles.label}
                titleTextStyle={styles.hint}
                affixTextStyle={styles.affix}
                value={disabled && !_.isUndefined(disabledValue) ? disabledValue : value}
                onChangeText={onChangeValue}
                itemColor={this.selectColor('rgba(0, 0, 0, .54)', fromColor(DarkColors.text).alpha(0.4).rgb().string())}
                selectedItemColor={this.selectColor(fromColor('#000').alpha(0.87).rgb().string(), DarkColors.text)}
                disabledItemColor={baseColor}
                itemCount={4}
                itemPadding={8}
                itemTextStyle={styles.item}
                dropdownOffset={{top: 32, left: 0}}
                dropdownMargins={{min: 8, max: 16}}
                data={choices}
                overlayStyle={styles.overlay}
                pickerStyle={styles.picker}
                shadeOpacity={0.12}
                rippleDuration={0}
                rippleOpacity={0}
                rippleCentered={false}
                useNativeDriver={false}
            />
        );
    }
}
