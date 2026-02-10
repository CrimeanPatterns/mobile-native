import Clipboard from '@react-native-clipboard/clipboard';
import {useDeviceOrientation} from '@react-native-community/hooks';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {AppState, NativeEventSubscription, Text, TouchableOpacity, View} from 'react-native';
import HTML from 'react-native-render-html';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Button} from '../../../components/form';
import KeycodeInput from '../../../components/keycodeInput';
import {HeaderMenuButton} from '../../../components/page';
import {withRecaptcha} from '../../../components/recaptcha';
import {PasswordField} from '../../../components/signIn/passwordField';
import {PlainTextField} from '../../../components/signIn/textField';
import {isIOS} from '../../../helpers/device';
import Auth from '../../../services/http/auth';
import * as NavigatorService from '../../../services/navigator';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {useTheme} from '../../../theme';
import {OutsideStackScreenFunctionalComponent} from '../../../types/navigation';
import AnimatedSignInContent from './animatedSignInContent';
import {BaseSignIn} from './base';
import {buttonDarkStyle, buttonDarkStyleWhite, buttonStyle, buttonStyleWhite, inputStyle, styles} from './styles';

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

@withRecaptcha
class SignIn extends BaseSignIn {
    private mounted = false;

    private state: any;

    private appStateSubscription: NativeEventSubscription | undefined;

    private readonly passwordRef: React.RefObject<PasswordField>;

    private focusSubscription: (() => void) | undefined;

    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.onRecaptchaComplete = this.onRecaptchaComplete.bind(this);
        this.clearRecaptcha = this.clearRecaptcha.bind(this);
        this.onChangeLogin = this.onChangeLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeOTC = this.onChangeOTC.bind(this);
        this.loadData = this.loadData.bind(this);

        this.state = {
            ...this.state,
            _otc: '',
            label: null,
            hint: null,
            notice: null,
            otcField: null,
            otcRequired: false,
            editable: false,
        };

        this.passwordRef = React.createRef();
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;
        this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);

        // TODO: issue https://github.com/facebook/react-native/issues/20887
        // https://github.com/react-navigation/react-navigation/issues/5151

        setTimeout(() => this.safeSetState({editable: true}), 250);

        this.focusSubscription = navigation.addListener('focus', () => {
            const {route} = this.props;
            const error = route.params?.error;
            const login = route.params?.login;
            const requiredPassword = route.params?.requiredPassword ?? false;

            return this.updateState({error, login, requiredPassword});
        });
        // test code from email
        /* if (__DEV__) {
            const expirationDate = new Date(Date.now() + 3.6e+6);

            if (isIOS) {
                CookieManager.set({
                    name: 'TestIpAddress',
                    value: '1',
                    domain: 'awardwallet.com',
                    origin: 'awardwallet.com',
                    path: '/',
                    version: '1',
                    expiration: expirationDate.toISOString()
                }, false).then((res) => {
                    console.log('CookieManager.set =>', expirationDate, res);
                });
            } else {
                CookieManager.setFromResponse(
                    'https://awardwallet.com',
                    'TestIpAddress=0; path=/; expires=' + expirationDate.toUTCString() + '; secure; HttpOnly');
            }
        } */
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
        }
        if (this.focusSubscription) {
            this.focusSubscription();
        }
    }

    updateState = async ({error, login, requiredPassword}) => {
        if (_.isString(error)) {
            await this.setError(error);
        }

        if (_.isString(login)) {
            this.onChangeLogin(login);
        }

        if (requiredPassword === true) {
            this.passwordFieldFocus();
        }
    };

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    passwordFieldFocus = () => {
        this.passwordRef.current.focus();
    };

    handleAppStateChange(nextAppState) {
        const {otcRequired} = this.state;

        if (appState.state === 'background' && nextAppState === 'active' && otcRequired) {
            this.getClipboardOTC();
        }
        appState.transitionTo(nextAppState);
    }

    async getClipboardOTC() {
        const {error} = this.state;
        let hasContent = true;

        if (isIOS) {
            // Check if there is a content in clipboard without triggering PasteBoard notification for iOS 14+
            hasContent = await Clipboard.hasString();
        }

        if (hasContent) {
            const passcode = await Clipboard.getString();

            if (_.isNil(error)) {
                if (_.isString(passcode)) {
                    const code = passcode.replace(/[^0-9]/, '');

                    if (code === passcode.replace(' ', '') && code.length === 6) {
                        this.onChangeOTC(code);
                        if (isIOS) {
                            this.submit();
                        }
                    }
                }
            }
        }
    }

    async requestRecaptcha(siteKey) {
        try {
            const recaptcha = await super.requestRecaptcha(siteKey);

            this.onRecaptchaComplete(recaptcha);
        } catch {
            this.clearRecaptcha();
        }
    }

    signIn(fn, action, askAccessMailbox) {
        return super.signIn(fn, this.OAUTH_ACTION_LOGIN, askAccessMailbox);
    }

    async submit() {
        const {navigation} = this.props;
        const {login, password, otcField, _otc, recaptcha} = this.state;
        const request = {recaptcha};

        if (login.length < 1 || password.length < 1) {
            return;
        }

        this.setLoading(true);

        request.login_password = {
            login,
            pass: password,
        };

        if (_otc && otcField) {
            request[otcField] = _otc;
        }

        try {
            const response = await Auth.login(request);

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    const {success, error, recaptcha, login_password, one_time_code_by_app, one_time_code_by_email, security_question} = data;

                    if (success) {
                        await this.loadData();
                    } else {
                        if (_.isObject(recaptcha)) {
                            const {key, required, error} = recaptcha;

                            if (error) {
                                this.clearRecaptcha();
                            }

                            if (required) {
                                this.requestRecaptcha(key);
                            }
                        }

                        if (_.isObject(login_password)) {
                            const {error} = login_password;

                            if (error) {
                                this.setError(error);
                            }

                            this.safeSetState({
                                password: '',
                            });
                        }

                        if (_.isObject(one_time_code_by_app) || _.isObject(one_time_code_by_email)) {
                            let property = 'one_time_code_by_app';

                            if (_.isObject(one_time_code_by_email)) {
                                property = 'one_time_code_by_email';
                            }

                            const {error, label, hint, notice} = data[property];

                            if (error) {
                                this.setError(error);
                            }

                            this.safeSetState(
                                {
                                    label,
                                    hint,
                                    notice,
                                    otcField: property,
                                    otcRequired: true,
                                    _otc: '',
                                },
                                this.getClipboardOTC,
                            );
                        }

                        if (_.isObject(security_question)) {
                            navigation.navigate('SecurityQuestions', {
                                request,
                                securityQuestions: security_question,
                                title: security_question.notice,
                            });
                        }

                        if (_.isString(error)) {
                            this.setError(error);
                        }
                    }
                }
            }
        } catch (e) {
            //
        } finally {
            this.setLoading(false);
        }
    }

    onChangeLogin(login) {
        this.safeSetState({login});
    }

    onChangePassword(password) {
        this.safeSetState({password});
    }

    onChangeOTC(_otc) {
        return new Promise((resolve) => this.safeSetState({_otc}, resolve));
    }

    onLinkPress = (event, href) => {
        if (href === '#/terms') {
            NavigatorService.navigate('Terms');
        }

        if (href === '#/privacy') {
            NavigatorService.navigate('PrivacyNotice');
        }
    };

    renderInputFields = () => {
        const {theme, orientation} = this.props;
        const {login, password, editable} = this.state;

        return (
            <View style={[styles.formTop, this.isDark && styles.formTopDark]}>
                <View style={[styles.formColumn, orientation.landscape && styles.formColumnLandscape]} />
                <View style={[styles.formInner, orientation.landscape && styles.landscape]}>
                    <PlainTextField
                        theme={theme}
                        editable={editable}
                        testID='login-field'
                        autoCompleteType='email'
                        importantForAutofill='yes'
                        keyboardType='email-address'
                        returnKeyType='next'
                        enablesReturnKeyAutomatically
                        textContentType='emailAddress'
                        autoCorrect={false}
                        value={login}
                        onChangeValue={this.onChangeLogin}
                        customStyle={inputStyle}
                        required={false}
                        autoCapitalize='none'
                        blurOnSubmit={false}
                        placeholder={(isIOS && Translator.trans('login.email', {}, 'messages')) || ''}
                        label={Translator.trans('login.email', {}, 'messages')}
                        onSubmitEditing={this.passwordFieldFocus}
                    />
                    {isIOS && this.renderSeparator()}
                    <PasswordField
                        theme={theme}
                        editable={editable}
                        testID='password-field'
                        autoCompleteType='password'
                        importantForAutofill='yes'
                        ref={this.passwordRef}
                        returnKeyType='go'
                        autoCorrect={false}
                        enablesReturnKeyAutomatically
                        textContentType='password'
                        value={password}
                        onChangeValue={this.onChangePassword}
                        customStyle={inputStyle}
                        required={false}
                        autoCapitalize='none'
                        placeholder={(isIOS && Translator.trans('login.pass', {}, 'messages')) || ''}
                        label={Translator.trans('login.pass', {}, 'messages')}
                        secureTextEntry
                        onSubmitEditing={this.submit}
                    />
                </View>
                <View style={[styles.formColumn, orientation.landscape && styles.formColumnLandscape]}>{isIOS && this.renderSeparator()}</View>
            </View>
        );
    };

    renderLoginButton = () => {
        const {theme, orientation} = this.props;
        const {login, password, loading} = this.state;

        return (
            <View style={[styles.buttonsContainer, orientation.landscape && styles.landscape]}>
                <Button
                    theme={theme}
                    testID='login'
                    label={Translator.trans('sign-in.button', {}, 'messages')}
                    customStyle={this.isDark ? buttonDarkStyle : buttonStyle}
                    raised
                    onPress={this.submit}
                    loading={loading}
                    disabled={login.length < 1 || password.length < 1}
                    pressedColor='#5582bf'
                />
            </View>
        );
    };

    renderForgotPassword = () => {
        const {navigation} = this.props;

        return (
            <View style={styles.bottomContainerWrap}>
                <TouchableOpacity
                    testID='forgot-password'
                    hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={[styles.silverLink, this.isDark && styles.textSilverDark]}>
                        {Translator.trans('login.bottom.forgot', {}, 'messages')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    renderRegistrationButton = () => {
        const {theme, navigation} = this.props;

        return (
            <Button
                theme={theme}
                testID='register'
                mode='outlined'
                label={Translator.trans('login.button.register', {}, 'messages')}
                customStyle={this.isDark ? buttonDarkStyleWhite : buttonStyleWhite}
                raised
                onPress={() => navigation.navigate('SignUp')}
                pressedColor={Colors.grayLight}
            />
        );
    };

    renderKeyCode = () => {
        const {orientation} = this.props;
        const {notice, hint, _otc, editable} = this.state;

        return (
            <View style={[styles.keyCodeContainer, orientation.landscape && styles.landscape]}>
                <Text style={[styles.keyCodeLabel, this.isDark && styles.textDark]}>{notice}</Text>
                <KeycodeInput alphaNumeric={false} editable={editable} value={_otc} onChange={this.onChangeOTC} onComplete={this.submit} />
                <Text style={[styles.keyCodeHint, this.isDark && styles.textDark]}>{hint}</Text>
            </View>
        );
    };

    renderAgreement = () => {
        const agreement = Translator.trans('sign-in.agreement', {
            link1_on: "<a href='#/terms'>",
            link1_off: '</a>',
            link2_on: "<a href='#/privacy'>",
            link2_off: '</a>',
        });

        return (
            <HTML
                source={{html: agreement}}
                onLinkPress={this.onLinkPress}
                containerStyle={containerStyle}
                baseFontStyle={{...baseFontStyle, color: this.selectColor(Colors.grayDark, DarkColors.text)}}
                tagsStyles={{
                    a: {...tagsStyles, color: this.selectColor(Colors.grayDark, DarkColors.text)},
                }}
            />
        );
    };

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    render() {
        const {navigation, orientation} = this.props;
        const {otcRequired} = this.state;
        const style = [styles.page, this.isDark && styles.pageDark];

        return (
            <AnimatedSignInContent otcRequired={otcRequired} navigation={navigation}>
                <SafeAreaView style={style} edges={['bottom']}>
                    <View style={styles.form}>
                        {!otcRequired && this.renderInputFields()}
                        {otcRequired && this.renderKeyCode()}
                        {this.renderLoginButton()}
                        {otcRequired && <View style={[{minHeight: 500, width: '100%'}, ...style]} />}
                        {!otcRequired && (
                            <View style={[styles.formBottom, orientation.landscape && styles.landscape]}>
                                {this.renderForgotPassword()}
                                {this.renderButtonSeparator()}
                                {this.renderOauthButton()}
                                {this.renderAgreement()}
                                {this.renderRegistrationButton()}
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </AnimatedSignInContent>
        );
    }
}

const SignInScreen: OutsideStackScreenFunctionalComponent<'SignIn'> = ({navigation, route}) => {
    const theme = useTheme();
    const orientation = useDeviceOrientation();

    return (
        // @ts-ignore
        <SignIn orientation={orientation} theme={theme} navigation={navigation} route={route} />
    );
};

SignInScreen.navigationOptions = ({navigation}) => ({
    headerTransparent: true,
    headerStyle: {},
    title: Translator.trans('sign-in.button', {}, 'messages'),
    headerTitle: () => <></>,
    headerLeft: () => <HeaderMenuButton onPress={navigation.toggleDrawer} color={Colors.white} />,
});

export {SignInScreen};

const containerStyle = {
    marginHorizontal: 15,
    marginBottom: 30,
    alignItems: 'center',
};
const baseFontStyle = {
    fontFamily: Fonts.regular,
    fontSize: 12,
};
const tagsStyles = {
    fontFamily: Fonts.bold,
    textDecorationLine: 'none',
    fontWeight: 'bold',
};
