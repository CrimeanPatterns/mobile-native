import {Picker} from '@react-native-picker/picker';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Dimensions, Keyboard, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import Icon from '../../../icon';
import BaseChoice from './baseChoice';

export default class Choice extends BaseChoice {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            modalVisible: false,
            touched: false,
            width: Dimensions.get('window').width,
        };

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.orientationDidChange = this.orientationDidChange.bind(this);
    }

    componentDidMount() {
        this.mounted = true;

        this.dimensionsListener = Dimensions.addEventListener('change', this.orientationDidChange);
    }

    componentWillUnmount() {
        this.mounted = false;

        this.dimensionsListener?.remove();
    }

    componentDidUpdate({value: prevValue}) {
        const {value} = this.props;

        if (prevValue !== value) {
            this.setState({value});
        }
    }

    showModal() {
        Keyboard.dismiss();
        this.setState({
            modalVisible: true,
        });
    }

    hideModal(onChange = true) {
        this.setState(
            {
                modalVisible: false,
            },
            () => onChange && this.changeValue(),
        );
    }

    onCancel() {
        this.hideModal(false);
    }

    onDone() {
        this.hideModal();
    }

    changeValue() {
        const {onChangeValue = _.noop} = this.props;
        const {value: stateValue} = this.state;

        onChangeValue(stateValue);
    }

    orientationDidChange(e) {
        const {width} = e.window;

        if (this.mounted) {
            this.setState({width});
        }
    }

    getChoice(value, choices) {
        for (const choice of choices) {
            if (choice.value === value) {
                return choice.label;
            }
        }

        return '';
    }

    renderPickerItem = ({label, value, attr}) => {
        const key = `picker-item-${label}`;

        return (
            <Picker.Item testID={key} key={`${key}-${value}`} label={_.isObject(attr) && _.isString(attr.name) ? attr.name : label} value={value} />
        );
    };

    onPickerValueChange = (value) => {
        this.setState({value});
    };

    getStyles() {
        const {width: SCREEN_WIDTH} = this.state;
        const colors = this.themeColors;
        const baseStyles = super.getStyles();

        return StyleSheet.create({
            ...baseStyles,
            modalBasicContainer: {
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
            },
            modalOverlayContainer: {
                flex: 1,
                width: SCREEN_WIDTH,
            },
            modalContainer: {
                width: SCREEN_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                backgroundColor: this.selectColor(Colors.gray, DarkColors.bgLight),
            },
            buttonView: {
                width: SCREEN_WIDTH,
                height: 40,
                borderTopWidth: 1,
                borderTopColor: colors.border,
                justifyContent: 'flex-end',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                backgroundColor: this.selectColor(Colors.bgGray, DarkColors.bg),
            },
            buttonViewLink: {
                height: 40,
                paddingHorizontal: 15,
                justifyContent: 'center',
                alignSelf: 'center',
            },
            buttonViewText: {
                fontSize: 15,
                fontFamily: Fonts.bold,
                color: colors.blue,
                marginLeft: 20,
                fontWeight: 'bold',
            },
            picker: {
                width: SCREEN_WIDTH,
            },
            pickerItem: this.isDark && {
                color: Colors.white,
            },
            fieldContainer: {
                ...baseStyles.fieldContainer,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 48,
                maxHeight: 160,
                paddingVertical: 6,
                paddingStart: 16,
                paddingEnd: 10,
            },
            dropdownArrow: {
                marginLeft: 5,
            },
        });
    }

    renderDropdownValue() {
        const {value: propValue, disabled, disabledValue, choices} = this.props;
        const {fieldText} = this.getStyles();

        return (
            <Text style={fieldText} ellipsizeMode='tail'>
                {this.getChoice(disabled && !_.isUndefined(disabledValue) ? disabledValue : propValue, choices)}
            </Text>
        );
    }

    renderDropdown() {
        const {testID, disabled} = this.props;
        const styles = this.getStyles();

        return (
            <TouchableWithoutFeedback
                testID={`picker-${testID}-dropdown`}
                disabled={disabled}
                onPress={this.showModal}
                onPressIn={this._onTouchStart}
                onPressOut={this._onTouchEnd}>
                <View style={styles.fieldContainer}>
                    {this.renderDropdownValue()}
                    <Icon style={styles.dropdownArrow} name='small-arrow' color={disabled ? this.disabledColor : Colors.grayDark} size={24} />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        const {testID, choices} = this.props;
        const {value, modalVisible} = this.state;
        const styles = this.getStyles();

        return (
            <View style={styles.container}>
                {this.renderLabel()}
                {this.renderDropdown()}
                <Modal testID={`picker-${testID}-modal`} animationType='slide' transparent visible={modalVisible}>
                    <View style={styles.modalBasicContainer}>
                        <View style={styles.modalOverlayContainer}>
                            <TouchableWithoutFeedback testID={`picker-${testID}-cancel`} onPress={this.onCancel}>
                                <View style={styles.modalOverlayContainer} />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.modalContainer}>
                            <View style={styles.buttonView}>
                                <TouchableOpacity
                                    accessibilityRole='button'
                                    accessibilityTraits='button'
                                    accessibilityComponentType='button'
                                    testID={`picker-${testID}-done`}
                                    onPress={this.onDone}
                                    style={styles.buttonViewLink}>
                                    <Text style={styles.buttonViewText}>{Translator.trans('done', {}, 'messages')}</Text>
                                </TouchableOpacity>
                            </View>
                            <Picker
                                testID={`picker-${testID}`}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                                selectedValue={value}
                                onValueChange={this.onPickerValueChange}>
                                {choices.map(this.renderPickerItem)}
                            </Picker>
                        </View>
                    </View>
                </Modal>
                {this.renderHint()}
                {this.renderError()}
            </View>
        );
    }
}
