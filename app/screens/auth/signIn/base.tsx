import {firebase} from '@react-native-firebase/analytics';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, AppState, Text, View} from 'react-native';
import {AppEventsLogger} from 'react-native-fbsdk-next';

import {BaseThemedPureComponent} from '../../../components/baseThemed';
import {signInComplete} from '../../../components/oauth';
import AolButton, {signInAol} from '../../../components/oauth/aol';
import AppleButton, {signInApple} from '../../../components/oauth/apple';
import GoogleButton, {signInGoogle} from '../../../components/oauth/google';
import MicrosoftButton, {signInMicrosoft} from '../../../components/oauth/microsoft';
import YahooButton, {signInYahoo} from '../../../components/oauth/yahoo';
import {isIOS} from '../../../helpers/device';
import {PathConfig} from '../../../navigation/linking';
import {navigateByPath} from '../../../services/navigator';
import Session from '../../../services/session';
import StorageSync from '../../../services/storageSync';
import {styles} from './styles';

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

const setMailboxScan = (value) => Session.setProperty('ask_mailbox_scan', value);
const getMailboxScan = () => Session.getProperty('ask_mailbox_scan');

const confirmAccessMailbox = (always = false) => {
    const hasPermission = getMailboxScan();

    if (isIOS) {
        if (hasPermission !== false || always) {
            return Promise.resolve(true);
        }

        return Promise.resolve(false);
    }

    if (always) {
        return new Promise((resolve) => {
            Alert.alert(
                '',
                Translator.trans('scan-mailbox-question'),
                [
                    {
                        text: Translator.trans('button.no', {}, 'messages'),
                        onPress: () => {
                            resolve(false);
                        },
                    },
                    {
                        text: Translator.trans('button.yes', {}, 'messages'),
                        onPress: () => {
                            resolve(true);
                        },
                    },
                ],
                {cancelable: false},
            );
        });
    }

    const scan = getMailboxScan();

    if (scan === undefined) {
        return confirmAccessMailbox(true);
    }

    return Promise.resolve(scan);
};

class BaseSignIn extends BaseThemedPureComponent<
    {navigation: unknown; recaptcha: unknown},
    {login: string; password: string; recaptcha: string; loading: boolean; error?: string}
> {
    LOG_EVENT = 'LOGIN';

    OAUTH_ACTION_LOGIN = 'login';

    OAUTH_ACTION_REGISTER = 'register';

    private mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            password: '',
            recaptcha: '',
            loading: false,
            error: undefined,
        };

        this.onRecaptchaComplete = this.onRecaptchaComplete.bind(this);
        this.clearRecaptcha = this.clearRecaptcha.bind(this);
    }

    safeSetState(...args) {
        if (this.mounted) {
            // @ts-ignore
            this.setState(...args);
        }
    }

    showAlert = (message) =>
        new Promise((resolve) => {
            Alert.alert(
                '',
                message,
                [
                    {
                        text: Translator.trans('button.ok', {}, 'messages'),
                        onPress: resolve,
                    },
                ],
                {cancelable: false},
            );
        });

    setError = async (error) => {
        // fix issue https://github.com/facebook/react-native/issues/10471
        this.safeSetState({error});
        await this.showAlert(error);
        this.safeSetState({error: null});
    };

    async loadData(connection) {
        const {navigation} = this.props;

        await StorageSync.forceUpdate();

        if (this.LOG_EVENT === 'SIGN_UP') {
            firebase.analytics().logSignUp({method: 'email'});
            // @ts-ignore
            AppEventsLogger.logEvent(AppEventsLogger.AppEvents.CompletedRegistration, {
                // @ts-ignore
                [AppEventsLogger.AppEventParams.RegistrationMethod]: 'email',
            });
        } else {
            firebase.analytics().logLogin({method: 'email'});
        }

        Session.setProperty('authorized', true);

        if (_.isFinite(connection)) {
            navigateByPath(PathConfig.ConnectionEdit, {
                id: connection,
            });
        } else {
            navigation.reset({
                index: 0,
                routes: [{name: 'Inside', params: {reload: false}}],
            });
        }
    }

    async requestRecaptcha(siteKey) {
        const {recaptcha} = this.props;

        return new Promise((resolve, reject) => {
            recaptcha.open(siteKey, resolve, reject);
        });
    }

    onRecaptchaComplete(recaptcha) {
        if (_.isEmpty(recaptcha) === false) {
            this.safeSetState({recaptcha}, this.submit);
        }
    }

    clearRecaptcha() {
        this.safeSetState({
            recaptcha: '',
        });
    }

    setLoading(loading) {
        this.safeSetState({loading});
    }

    updateState({login, requiredPassword, error}) {
        this.safeSetState({login, requiredPassword, error});
    }

    signIn(fn, action, askAccessMailbox = true) {
        return async () => {
            let mailbox = false;

            if (askAccessMailbox) {
                mailbox = await confirmAccessMailbox(action === this.OAUTH_ACTION_REGISTER);
                setMailboxScan(mailbox);
            }

            const requireConfig = {
                action,
                mailbox,
            };

            const {success, ...rest} = await fn(requireConfig);
            let procced = success;

            if (!procced) {
                const response = await signInComplete(rest);
                const {data} = response;

                if (_.isObject(data)) {
                    const {success, requiredPassword, email: login, error} = data;

                    procced = success;

                    if (login) {
                        this.safeSetState({login});
                    }

                    if (!error) {
                        this.setLoading(true);
                    }

                    if (!procced) {
                        this.updateState({requiredPassword, login, error});
                    }
                }
            }

            if (procced) {
                await this.loadData();
            }
        };
    }

    signInGoogle = this.signIn(signInGoogle);

    signInMicrosoft = this.signIn(signInMicrosoft);

    signInAol = this.signIn(signInAol);

    signInYahoo = this.signIn(signInYahoo);

    signInApple = this.signIn(signInApple, this.OAUTH_ACTION_LOGIN, false);

    renderButtonSeparator = () => (
        <View style={styles.or}>
            <View style={styles.leftLineSeparator} />
            <Text style={[styles.textSeparator, this.isDark && styles.textDark]}>
                {Translator.trans('menu.invite.invite-link-or', {}, 'menu').toUpperCase()}
            </Text>
            <View style={styles.rightLineSeparator} />
        </View>
    );

    renderOauthButton = (signUp = false) => (
        <View style={styles.oauthButton}>
            <View style={styles.oauthButton}>
                <GoogleButton signUp={signUp} onPress={this.signInGoogle} />
            </View>
            <View style={styles.oauthButton}>
                <MicrosoftButton signUp={signUp} onPress={this.signInMicrosoft} />
            </View>
            <View style={styles.oauthButton}>
                <YahooButton signUp={signUp} onPress={this.signInYahoo} />
            </View>
            <View style={styles.oauthButton}>
                <AolButton signUp={signUp} onPress={this.signInAol} />
            </View>
            {AppleButton.isSupported && (
                <View style={styles.oauthButton}>
                    <AppleButton signUp={signUp} onPress={this.signInApple} />
                </View>
            )}
        </View>
    );
}

export {BaseSignIn, confirmAccessMailbox};
