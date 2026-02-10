import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {AppState, Keyboard, Text, Vibration, View} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import TouchID from 'react-native-touch-id';

import Icon from '../../components/icon';
import ThemedModal from '../../components/page/modal';
import {TouchableOpacity} from '../../components/page/touchable/opacity';
import {isIOS} from '../../helpers/device';
import EventEmitter from '../../services/eventEmitter';
import PasscodeService from '../../services/passcode';
import PrivacyScreen from '../../services/privacyScreen';
import {withTheme} from '../../theme';
import PasscodeSetup, {MAX_PINCODE_ATTEMPTS} from './setup';
import styles from './styles';

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

const ParentView = !isIOS ? View : SafeAreaView;

class PasscodeAccess extends PasscodeSetup {
    timeouts = {};

    timestamp = null;

    static get fingerprintErrors() {
        return {
            AuthenticationNotMatch: Translator.trans('fingerprint.auth-not-match', {}, 'mobile-native'),
            AuthenticationFailed: Translator.trans('fingerprint.device-locked', {}, 'mobile-native'),
            DeviceLocked: Translator.trans('fingerprint.device-locked', {}, 'mobile-native'),
        };
    }

    static get initialState() {
        return {
            ...PasscodeSetup.initialState,
            isSensorAvailable: true,
            sensorLockState: null,
            sensorError: null,
        };
    }

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.clear = this.clear.bind(this);
        this.logout = this.logout.bind(this);

        this.onFingerprintScannerError = this.onFingerprintScannerError.bind(this);
        this._handleAppStateChange = this._handleAppStateChange.bind(this);

        this.callbackSuccess = null;

        this.state = PasscodeAccess.initialState;
    }

    componentDidMount() {
        this.open();
        this.appStateSubscription = AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        Object.values(this.timeouts).map((timeout) => clearTimeout(timeout));

        if (!isIOS) {
            FingerprintScanner.release();
        }
        this.callbackSuccess = null;
        this.appStateSubscription.remove();
    }

    _handleAppStateChange(nextAppState) {
        if (appState.state === 'background' && nextAppState === 'active') {
            this.open();
        }

        if (nextAppState === 'background') {
            this.timestamp = Date.now();
            if (!isIOS) {
                const {sensorLockState} = this.state;

                if (sensorLockState === 'AuthenticationFailed') {
                    this.setState({sensorLockState: null});
                }
                clearTimeout(this.timeouts.unlockSensor);
                clearTimeout(this.timeouts.locked);
                FingerprintScanner.release();
            }
        }

        appState.transitionTo(nextAppState);
    }

    isLocked() {
        const initialCode = PasscodeService.getCode();
        const now = Date.now();
        const diff = Math.floor(Math.abs(now - this.timestamp) / 1000 / 60);

        return (!this.timestamp || diff >= 30) && !_.isEmpty(initialCode);
    }

    open(cb) {
        const {visible} = this.state;
        const initialCode = PasscodeService.getCode();

        Keyboard.dismiss();

        if (this.isLocked() || (!_.isEmpty(initialCode) && _.isFunction(cb))) {
            EventEmitter.emit('passcode:lock');

            if (_.isFunction(cb)) {
                this.callbackSuccess = cb;
            }

            this.setState(
                {
                    initialCode,
                    visible: true,
                    error: PasscodeSetup.pincodeFailText(),
                    title: 2, // enter your pincode
                    isSensorAvailable: true,
                    sensorLockState: null,
                    sensorError: null,
                },
                () => {
                    this.authenticateViaTouchID();
                },
            );

            if (!isIOS) {
                PrivacyScreen.enable();
            }
        } else if (!isIOS && visible) {
            this.authenticateViaTouchID();
        }
    }

    close(success) {
        Object.values(this.timeouts).map((timeout) => clearTimeout(timeout));

        if (!isIOS) {
            FingerprintScanner.release();
        }

        if (success) {
            if (_.isFunction(this.callbackSuccess)) {
                this.callbackSuccess();
            }
            // wait for close animation
            setTimeout(() => EventEmitter.emit('passcode:unlock'), 300);
        }

        this.setState(PasscodeAccess.initialState, () => {
            this.callbackSuccess = null;
        });

        if (!isIOS) {
            PrivacyScreen.disable();
        }
    }

    async authenticateViaTouchID() {
        if (isIOS) {
            const isSupported = await TouchID.isSupported();

            if (isSupported) {
                const authenticated = await TouchID.authenticate(Translator.trans('pincode.touchid', {}, 'mobile'), {fallbackLabel: ''});

                if (authenticated) {
                    this.close(true);
                }
            }
        } else {
            let isSensorAvailable = false;

            try {
                await FingerprintScanner.isSensorAvailable();
                isSensorAvailable = true;
            } catch (e) {
                this.onFingerprintScannerError(e);
            }

            if (isSensorAvailable) {
                this.setState({isSensorAvailable});
                const self = this;

                new Promise((resolve, reject) => {
                    // eslint-disable-next-line no-underscore-dangle
                    function _resolve() {
                        resolve();
                        clearTimeout(self.timeouts.unlockSensor);
                    }

                    self.timeouts.unlockSensor = setTimeout(() => {
                        reject();
                    }, 1000);
                    FingerprintScanner.authenticate({
                        onAttempt: (e) => {
                            self.onFingerprintScannerError(e);
                            _resolve();
                        },
                    })
                        .then(() => {
                            self.close(true);
                            _resolve();
                        })
                        .catch((e) => {
                            self.onFingerprintScannerError(e);
                            _resolve();
                        });
                }).catch(() => {
                    this.setState({
                        sensorLockState: null,
                    });
                });
            }
        }
    }

    onFingerprintScannerError(e) {
        console.log('fingerprint scanner error', e);

        if (_.isUndefined(PasscodeAccess.fingerprintErrors[e.name])) {
            this.setState({
                sensorError: null,
                isSensorAvailable: false,
                sensorLockState: null,
            });
            return;
        }
        switch (e.name) {
            case 'AuthenticationNotMatch':
                this.setState({
                    sensorError: PasscodeAccess.fingerprintErrors[e.name],
                    isSensorAvailable: true,
                    sensorLockState: null,
                });
                break;

            case 'AuthenticationFailed':
            case 'DeviceLocked':
                this.setState(
                    {
                        sensorError: null,
                        isSensorAvailable: true,
                        sensorLockState: e.name,
                    },
                    () => {
                        this.timeouts.locked = setTimeout(() => {
                            this.authenticateViaTouchID();
                        }, 10 * 1000);
                    },
                );
                break;
            default:
                break;
        }
    }

    logout() {
        EventEmitter.emit('doLogout');
        this.close();
    }

    onPress = (value) => {
        const {code: currentCode, initialCode} = this.state;
        const {length} = this.props;

        if (currentCode.length < length) {
            let code = currentCode + String(value);

            this.setState({code}, () => {
                if (code.length === 4) {
                    this.timeouts.onPress = setTimeout(() => {
                        if (initialCode === code) {
                            this.close(true);
                        } else {
                            this.setState((state) => {
                                let title;
                                let error;

                                if (initialCode !== code) {
                                    Vibration.vibrate(300);

                                    code = '';
                                    title = 2;

                                    const attempts = PasscodeService.pincodeAttempt();

                                    error = PasscodeSetup.pincodeFailText();

                                    if (attempts >= MAX_PINCODE_ATTEMPTS) {
                                        this.logout();
                                    }

                                    return {
                                        ...state,
                                        code,
                                        title,
                                        error,
                                        sensorError: null,
                                    };
                                }

                                return null;
                            });
                        }
                    }, 200);
                }
            });
        }
    };

    getTitle() {
        const {title} = this.state;

        return PasscodeSetup.translations[title];
    }

    renderCancelButton() {
        return (
            <TouchableOpacity style={[styles.button]} onPress={this.logout}>
                <Text style={styles.buttonTextSmall}>{Translator.trans('pincode.button.forgot', {}, 'mobile')}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const {visible, isSensorAvailable, sensorLockState} = this.state;
        const locked = !isIOS && ['DeviceLocked', 'AuthenticationFailed'].indexOf(sensorLockState) !== -1;

        if (visible) {
            return (
                <ThemedModal
                    statusBarTranslucent
                    headerShown={false}
                    presentationStyle='overFullScreen'
                    visible
                    onClose={_.noop}
                    onRequestClose={_.noop}>
                    <SafeAreaProvider>
                        <ParentView style={[styles.page, this.isDark && styles.pageDark]}>
                            {!isIOS && isSensorAvailable && (
                                <View style={[styles.fingerprint]}>
                                    <View style={[styles.fingerprintBlock, locked && styles.fingerprintBlockLocked]}>
                                        <Icon
                                            name={locked ? 'android-fingerprint-off' : 'android-fingerprint'}
                                            style={styles.fingerprintIcon}
                                            size={24}
                                        />
                                        <View style={styles.fingerprintWrap}>
                                            <Text style={styles.pincodeText}>
                                                {locked
                                                    ? PasscodeAccess.fingerprintErrors[sensorLockState]
                                                    : Translator.trans('fingerprint.confirm', {}, 'mobile')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {this.renderCode()}
                            {this.renderButtons()}
                        </ParentView>
                    </SafeAreaProvider>
                </ThemedModal>
            );
        }

        return null;
    }
}
const ThemedPasscodeAccess = withTheme(PasscodeAccess);
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedPasscodeAccess {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefPasscodeAccess';

export default ForwardRefComponent;
