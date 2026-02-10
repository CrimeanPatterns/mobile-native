import DateTimePicker from '@react-native-community/datetimepicker';
import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {useIntl} from 'react-intl';
import {Keyboard, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';
import Icon from '../../../icon';
import {TouchableOpacity} from '../../../page/touchable/opacity';
import BaseDate from './baseDate';

class BaseDateTime extends BaseDate {
    constructor(props) {
        super(props);

        this.state = {
            value: this.normalizeDate(props.value),
            modalVisible: false,
            touched: false,
        };

        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.onDone = this.onDone.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    static propTypes = {
        ...BaseDate.propTypes,
        width: PropTypes.number.isRequired,
    };

    static defaultProps = {
        onChangeValue: _.noop,
        disabled: false,
    };

    showModal() {
        Keyboard.dismiss();
        this.setState({
            modalVisible: true,
        });
    }

    hideModal() {
        this.setState({
            modalVisible: false,
        });
    }

    onCancel() {
        this.hideModal();
    }

    onDone() {
        const {value} = this.state;

        this.hideModal();
        this.changeValue(value.toISOString());
    }

    onClear() {
        this.hideModal();
        this.changeValue(null);
    }

    changeValue(value) {
        const {onChangeValue = _.noop} = this.props;

        onChangeValue(value);
    }

    onDateChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {testID, value: propValue, disabled, width: SCREEN_WIDTH} = this.props;
        const {value, modalVisible} = this.state;
        const colors = this.themeColors;
        const baseStyles = this.getStyles();

        const styles = StyleSheet.create({
            ...baseStyles,
            fieldContainer: {
                ...baseStyles.fieldContainer,
                paddingVertical: 0,
                paddingHorizontal: 0,
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                paddingLeft: 14,
            },
            fieldIcon: {
                paddingRight: 18,
            },
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
                fontWeight: 'bold',
            },
            picker: {
                width: SCREEN_WIDTH,
            },
        });

        const field = (
            <Pressable testID={testID} disabled={disabled} onPress={this.showModal} onPressIn={this._onTouchStart} onPressOut={this._onTouchEnd}>
                <View style={[styles.fieldContainer, {height: 48, maxHeight: 48}]}>
                    <Icon
                        style={styles.fieldIcon}
                        name='date'
                        size={24}
                        color={disabled ? this.disabledColor : this.selectColor(Colors.grayDark, colors.text)}
                    />
                    <Text style={styles.fieldText} numberOfLines={1} ellipsizeMode='tail'>
                        {this._formatDatetime(propValue)}
                    </Text>
                </View>
            </Pressable>
        );

        return (
            <View style={styles.container}>
                {this.renderLabel()}
                {field}
                {modalVisible && (
                    <Modal animationType='slide' transparent visible>
                        <View style={styles.modalBasicContainer}>
                            <View style={styles.modalOverlayContainer}>
                                <Pressable onPress={this.onCancel} style={styles.modalOverlayContainer}>
                                    <View style={styles.modalOverlayContainer} />
                                </Pressable>
                            </View>
                            <View style={styles.modalContainer}>
                                <View style={styles.buttonView}>
                                    <TouchableOpacity testID='datepicker-done' style={styles.buttonViewLink} onPress={this.onDone}>
                                        <Text style={styles.buttonViewText}>{Translator.trans('done', {}, 'messages')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.buttonViewLink} onPress={this.onClear}>
                                        <Text style={styles.buttonViewText}>{Translator.trans('clear', {}, 'mobile')}</Text>
                                    </TouchableOpacity>
                                </View>
                                <DateTimePicker
                                    style={styles.picker}
                                    value={value}
                                    onChange={this.onDateChange}
                                    mode='date'
                                    display='spinner'
                                    timeZoneOffsetInMinutes={0}
                                />
                            </View>
                        </View>
                    </Modal>
                )}
                {this.renderHint()}
                {this.renderError()}
            </View>
        );
    }
}

const DateTime = React.forwardRef((props, ref) => {
    const {width} = useWindowDimensions();
    const intl = useIntl();

    return <BaseDateTime {...props} intl={intl} ref={ref} width={width} />;
});

export default DateTime;
