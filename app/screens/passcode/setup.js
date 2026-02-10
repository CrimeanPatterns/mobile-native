import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, Vibration, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Icon from '../../components/icon';
import ThemedModal from '../../components/page/modal';
import {TouchableOpacity} from '../../components/page/touchable/opacity';
import {isAndroid} from '../../helpers/device';
import EventEmitter from '../../services/eventEmitter';
import PasscodeService from '../../services/passcode';
import PrivacyScreen from '../../services/privacyScreen';
import {withTheme} from '../../theme';
import styles from './styles';

export const MAX_PINCODE_ATTEMPTS = 3;

class Button extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        number: PropTypes.any,
        onPress: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);

        this.state = {
            active: false,
        };
    }

    onPressIn() {
        this.setState({
            active: true,
        });
    }

    onPressOut() {
        this.setState({
            active: false,
        });
    }

    onPress = () => {
        const {onPress, number} = this.props;

        onPress(number);
    };

    render() {
        const {active} = this.state;
        const {number} = this.props;

        return (
            <TouchableOpacity
                testID={`button ${number}`}
                style={[
                    styles.button,
                    styles.buttonNumber,
                    this.isDark && styles.buttonDark,
                    active && styles.buttonActive,
                    this.isDark && active && styles.buttonActiveDark,
                ]}
                activeOpacity={1}
                onPress={this.onPress}
                onPressIn={this.onPressIn}
                onPressOut={this.onPressOut}>
                <Text style={[styles.buttonText, this.isDark && styles.textDark]}>{`${number}`}</Text>
            </TouchableOpacity>
        );
    }
}

const ThemedButton = withTheme(Button);

class PasscodeSetup extends BaseThemedPureComponent {
    static defaultProps = {
        length: 4,
        buttons: Array(9).fill(),
    };

    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        length: PropTypes.number,
        buttons: PropTypes.arrayOf(PropTypes.number),
    };

    static get initialState() {
        return {
            visible: false,
            code: '',
            previousCode: null,
            initialCode: null,
            title: 0,
            error: PasscodeSetup.pincodeFailText(),
        };
    }

    static pincodeFailText() {
        const attempts = PasscodeService.getPincodeAttempts();

        if (attempts > 0) {
            return Translator.transChoice('pincode.failed', attempts, {num: attempts}, 'mobile');
        }

        return null;
    }

    static get translations() {
        return [
            Translator.trans('pincode.setup.title', {}, 'mobile'),
            Translator.trans('pincode.title.re-enter', {}, 'mobile'),
            Translator.trans('pincode.title.current', {}, 'mobile'),
        ];
    }

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onRequestClose = this.onRequestClose.bind(this);
        this.clear = this.clear.bind(this);

        this.callbackSuccess = null;
        this.timeoutId = null;

        this.state = PasscodeSetup.initialState;
    }

    componentWillUnmount() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }
        this.callbackSuccess = null;
    }

    open(cb) {
        const initialCode = PasscodeService.getCode();

        if (_.isFunction(cb)) {
            this.callbackSuccess = cb;
        }

        // SystemNavigationBar.fullScreen(true);

        this.setState({
            initialCode,
            title: !initialCode ? 0 : 2,
            visible: true,
            error: PasscodeSetup.pincodeFailText(),
        });

        if (isAndroid) {
            PrivacyScreen.enable();
        }
    }

    close(code) {
        if (typeof code === 'string' && code.length > 0) {
            PasscodeService.setCode(code);
        }

        if (_.isFunction(this.callbackSuccess)) {
            this.callbackSuccess();
        }

        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }

        this.setState(PasscodeSetup.initialState, () => {
            this.callbackSuccess = null;
        });

        if (isAndroid) {
            PrivacyScreen.disable();
        }
    }

    onRequestClose() {
        this.close();
    }

    onPress = (value) => {
        const {code: currentCode, previousCode, initialCode} = this.state;
        const {length} = this.props;

        if (currentCode.length < length) {
            let code = currentCode + String(value);

            this.setState({code}, () => {
                if (code.length === 4) {
                    this.timeoutId = setTimeout(() => {
                        if (!initialCode) {
                            if (previousCode === code) {
                                this.close(code);
                            } else {
                                this.setState((state) => {
                                    let previousCode;
                                    let title;

                                    if (code.length === 4) {
                                        if (!state.previousCode) {
                                            previousCode = code;
                                            code = '';
                                            title = 1;

                                            return {
                                                ...state,
                                                previousCode,
                                                code,
                                                title,
                                            };
                                        }
                                        Vibration.vibrate(300);

                                        return {
                                            ...state,
                                            code: '',
                                            previousCode: '',
                                            title: 0,
                                        };
                                    }

                                    return null;
                                });
                            }
                        } else {
                            this.setState((state) => {
                                if (initialCode === code) {
                                    PasscodeService.resetPincodeAttempts();
                                    return {
                                        ...state,
                                        code: '',
                                        previousCode: '',
                                        initialCode: '',
                                        error: null,
                                        title: 0,
                                    };
                                }
                                Vibration.vibrate(300);

                                code = '';

                                const title = 2;
                                const attempts = PasscodeService.pincodeAttempt();
                                const error = PasscodeSetup.pincodeFailText();

                                if (attempts >= MAX_PINCODE_ATTEMPTS) {
                                    EventEmitter.emit('doLogout');
                                }

                                return {
                                    ...state,
                                    code,
                                    title,
                                    error,
                                };
                            });
                        }
                    }, 200);
                }
            });
        }
    };

    clear() {
        const {code} = this.state;

        if (code.length > 0) {
            this.setState((state) => ({
                ...state,
                code: state.code.slice(0, -1),
            }));
        }
    }

    getTitle() {
        const {title} = this.state;

        return PasscodeSetup.translations[title];
    }

    _renderCode() {
        const {code} = this.state;
        const {length} = this.props;
        const elements = [];
        let i = 0;

        while (i < length) {
            const active = code.length && i <= code.length - 1;

            elements.push(
                <View
                    style={[
                        styles.keycodeInput,
                        this.isDark && styles.keycodeInputDark,
                        active && styles.keycodeInputActive,
                        this.isDark && active && styles.keycodeInputActiveDark,
                    ]}
                    key={i}
                />,
            );

            i += 1;
        }

        return elements;
    }

    _renderButton = (item, index) => {
        // eslint-disable-next-line no-param-reassign
        index += 1;

        return <ThemedButton key={`button-${index}`} onPress={this.onPress} number={index} />;
    };

    renderCancelButton() {
        return (
            <TouchableOpacity style={[styles.button]} onPress={this.close}>
                <Text style={[styles.buttonTextSmall, this.isDark && styles.textDark]}>{Translator.trans('cancel', {}, 'messages')}</Text>
            </TouchableOpacity>
        );
    }

    renderClearButton() {
        return (
            <TouchableOpacity style={[styles.button, styles.buttonRemoveActive]} onPress={this.clear}>
                <Icon name='backspace' style={[styles.backspace, this.isDark && styles.textDark]} size={24} />
            </TouchableOpacity>
        );
    }

    renderButtons() {
        const {buttons} = this.props;

        return (
            <View style={styles.keyboard}>
                {buttons.map(this._renderButton)}
                {this.renderCancelButton()}
                <ThemedButton onPress={this.onPress} number={0} />
                {this.renderClearButton()}
            </View>
        );
    }

    renderCode() {
        const {code, error} = this.state;
        const title = this.getTitle();

        return (
            <View style={styles.pincodeTop}>
                <Text style={[styles.pincodeText, this.isDark && styles.textDark]} testID='passcode title' accessibilityLabel={title}>
                    {title}
                </Text>
                <View style={styles.keycode} testID='passcode code' accessibilityLabel={code}>
                    {this._renderCode()}
                </View>
                {!_.isNil(error) && (
                    <Text style={[styles.pincodeText, this.isDark && styles.textDark]} testID='passcode error' accessibilityLabel={error}>
                        {error}
                    </Text>
                )}
            </View>
        );
    }

    render() {
        const {visible} = this.state;

        if (visible) {
            return (
                <ThemedModal headerShown={false} visible onClose={this.onRequestClose}>
                    <SafeAreaProvider>
                        <SafeAreaView style={[styles.page, this.isDark && styles.pageDark]} edges={['bottom']}>
                            {this.renderCode()}
                            {this.renderButtons()}
                        </SafeAreaView>
                    </SafeAreaProvider>
                </ThemedModal>
            );
        }

        return null;
    }
}

const ThemedPasscodeSetup = withTheme(PasscodeSetup);
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedPasscodeSetup {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefPPasscodeSetup';

export default PasscodeSetup;
export {ForwardRefComponent as ThemedPasscodeSetup};
