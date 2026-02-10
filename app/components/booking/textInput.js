import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {TextInput, View} from 'react-native';

import {isAndroid, isIOS} from '../../helpers/device';
import styles from '../../screens/bookings/messages/styles';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import {Button} from '../form';
import Icon from '../icon';
import {TouchableItem, TouchableOpacity} from '../page/touchable';

const inputHeight = isIOS ? 30 : 44;

function isEmptyMessage(message) {
    return !(_.trim(message).length > 0);
}

@withTheme
class BookingTextInput extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onChange: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        message: PropTypes.string,
        isEditMode: PropTypes.bool,
        closeEditMode: PropTypes.func,
        disabled: PropTypes.bool,
    };

    messageInput = React.createRef();

    state = {
        height: inputHeight,
    };

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onContentSizeChange = (event) => {
        const {
            nativeEvent: {
                contentSize: {height},
            },
        } = event;

        this.setState({height: Math.max(height, inputHeight)});
    };

    focus() {
        if (this.messageInput && this.messageInput.current) {
            this.messageInput.current.focus();
        }
    }

    onSubmit() {
        const {message, onSubmit} = this.props;

        if (isEmptyMessage(message) === false) {
            onSubmit();
        }
    }

    render() {
        const {message, disabled, onChange, isEditMode, closeEditMode} = this.props;
        const {height} = this.state;
        const isDisabled = isEmptyMessage(message) || disabled;
        const colorIcon = this.selectColor(Colors.black, Colors.white);
        const colorLabelBase = this.selectColor(Colors.blue, DarkColors.blue);
        const colorLabelDisabled = this.selectColor(Colors.grayDark, DarkColors.text);

        return (
            <View style={[styles.formContainer, isEditMode && styles.editContainer]}>
                {isEditMode && (
                    <View style={styles.clearButton}>
                        {isIOS && (
                            <TouchableOpacity onPress={closeEditMode}>
                                <Icon name='android-clear' color={colorIcon} size={18} />
                            </TouchableOpacity>
                        )}
                        {isAndroid && (
                            <TouchableItem borderless onPress={closeEditMode}>
                                <Icon name='android-clear' color={colorIcon} size={18} />
                            </TouchableItem>
                        )}
                    </View>
                )}
                <TextInput
                    ref={this.messageInput}
                    enablesReturnKeyAutomatically
                    autoCorrect={false}
                    blurOnSubmit={false}
                    value={message}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={4}
                    placeholder={Translator.trans('textarea.placeholder', {}, 'booking')}
                    placeholderTextColor={this.selectColor(Colors.gray, DarkColors.text)}
                    style={[styles.input, this.isDark && styles.inputDark, {height}]}
                    onContentSizeChange={this.onContentSizeChange}
                />
                {isIOS && (
                    <Button
                        onPress={this.onSubmit}
                        customStyle={{
                            ...buttonStyle,
                            label: {
                                base: {
                                    ...buttonStyle.label.base,
                                    color: colorLabelBase,
                                },
                                disabled: {
                                    color: colorLabelDisabled,
                                },
                            },
                        }}
                        label={Translator.trans('send.btn', {}, 'booking')}
                        disabled={isDisabled}
                    />
                )}
                {isAndroid && (
                    <View style={[styles.send, this.isDark && styles.sendDark]}>
                        <TouchableItem disabled={isDisabled} onPress={this.onSubmit} borderless>
                            <Icon
                                name='android-send'
                                color={
                                    isDisabled ? this.selectColor(Colors.gray, DarkColors.text) : this.selectColor(Colors.orange, DarkColors.orange)
                                }
                                size={24}
                            />
                        </TouchableItem>
                    </View>
                )}
            </View>
        );
    }
}

export default React.forwardRef((props, forwardedRef) => React.createElement(BookingTextInput, {forwardedRef, ...props}));

const buttonStyle = {
    button: {
        base: {
            backgroundColor: 'transparent',
            marginHorizontal: 15,
        },
        pressed: {
            backgroundColor: 'transparent',
        },
    },
    label: {
        base: {
            fontSize: 15,
            paddingHorizontal: 0,
            height: 'auto',
            lineHeight: 15,
        },
        pressed: {
            color: Colors.grayDark,
        },
        loading: {
            color: 'transparent',
        },
    },
};
