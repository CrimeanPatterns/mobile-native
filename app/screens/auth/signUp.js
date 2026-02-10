import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import Form, {stylesMaker, SubmitButton} from '../../components/form';
import {withRecaptcha} from '../../components/recaptcha';
import Spinner from '../../components/spinner';
import {isAndroid} from '../../helpers/device';
import API from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import {BaseSignIn} from './signIn/base';

@withRecaptcha
class SignUp extends BaseSignIn {
    static customFormTypes = {
        desc: {
            component: require('../../components/signUp/desc').default,
            simpleComponent: true,
        },
    };

    LOG_EVENT = 'SIGN_UP';

    _form = React.createRef();

    _submitButton = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            fields: null,
            errors: [],
            formExtension: null,
            version: 1,
        };

        this.setForm = this.setForm.bind(this);
        this.submit = this.submit.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.getForm();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    get submitButton() {
        if (this.mounted) {
            return this._submitButton.current;
        }

        return undefined;
    }

    get form() {
        if (this.mounted) {
            return this._form.current;
        }

        return undefined;
    }

    signIn(fn, action, askAccessMailbox) {
        return super.signIn(fn, this.OAUTH_ACTION_REGISTER, askAccessMailbox);
    }

    updateState({requiredPassword, error, login}) {
        const {navigation} = this.props;

        navigation.navigate('SignIn', {requiredPassword, error, login});
    }

    getForm() {
        API.get('/register').then(this.setForm);
    }

    setForm({data}) {
        if (_.isObject(data)) {
            const {authenticated} = data;

            if (authenticated) {
                return this.loadData();
            }

            return this.safeSetState((state) => {
                const {error, errors, children, jsProviderExtension} = data;

                if (_.isString(error) && !_.isEmpty(error)) {
                    return {
                        ...state,
                        fields: _.isArray(state.fields) ? state.fields : [],
                        errors: [error],
                    };
                }
                let version;
                let fields;
                let formErrors;
                let formExtension;

                if (_.isArray(children)) {
                    version = state.version + 1;
                    fields = children;
                    if (_.isArray(errors)) {
                        formErrors = errors;
                    }
                }
                if (_.isString(jsProviderExtension) || _.isArray(jsProviderExtension)) {
                    formExtension = jsProviderExtension;
                }

                return {
                    ...state,
                    version: version || state.version,
                    fields: fields || state.fields,
                    errors: formErrors || [],
                    formExtension: formExtension || state.formExtension,
                };
            });
        }

        return undefined;
    }

    async submit(fields) {
        this.setLoading(true);

        try {
            const recaptcha = this.form.getField('recaptcha');

            if (_.isObject(recaptcha)) {
                const {
                    attr: {key},
                } = recaptcha;

                fields.recaptcha_response = await this.requestRecaptcha(key);
            }

            const response = await API.post('/register', fields);

            if (_.isObject(response)) {
                const {data} = response;

                this.setLoading(false);

                if (_.isObject(data)) {
                    const {userId, connection} = data;

                    if (_.isFinite(userId)) {
                        this.loadData(connection);
                    } else {
                        this.setForm(response);
                    }
                }
            }
        } catch (e) {
            // nothing
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        if (this.submitButton) {
            this.submitButton.setLoading(loading);
        }
    }

    renderHeader = () => (
        <>
            <View style={styles.buttonContainer}>{this.renderOauthButton(true)}</View>
            {this.renderButtonSeparator()}
        </>
    );

    renderFooter() {
        const {fields} = this.state;
        const {theme} = this.props;

        if (_.isArray(fields) && fields.length === 0) {
            return null;
        }

        return (
            <SubmitButton
                testID='submit'
                ref={this._submitButton}
                color={Platform.select({
                    ios: this.selectColor(Colors.blueDark, DarkColors.blue),
                    android: this.selectColor(Colors.grayBlue, DarkColors.bgLight),
                })}
                onPress={() => this.form.submit()}
                label={Translator.trans('buttons.register', {}, 'messages')}
                raised
                theme={theme}
            />
        );
    }

    render() {
        const {fields, errors, formExtension, version} = this.state;
        const isLoading = !_.isArray(fields);

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {isLoading && <Spinner androidColor={this.selectColor(Colors.grayBlue, DarkColors.text)} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && (
                    <Form
                        key={`form${version}`}
                        ref={this._form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        headerComponent={this.renderHeader}
                        footerComponent={this.renderFooter}
                        onSubmit={this.submit}
                        customTypes={SignUp.customFormTypes}
                        fieldsStyles={isAndroid ? stylesMaker(this.selectColor(Colors.grayBlue, DarkColors.text)) : undefined}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    buttonContainer: {
        marginHorizontal: 50,
        marginTop: 25,
        alignContent: 'center',
    },
});

const SignUpScreen = ({navigation}) => {
    const theme = useTheme();

    return <SignUp navigation={navigation} theme={theme} />;
};

SignUpScreen.navigationOptions = () => ({
    title: Translator.trans('registration.title', {}, 'mobile'),
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

export {SignUpScreen};
