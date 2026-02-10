import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Keyboard, Platform, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {stylesMaker, SubmitButton} from '../../components/form';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import Auth from '../../services/http/auth';
import Session from '../../services/session';
import StorageSync from '../../services/storageSync';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

@withTheme
class SecurityQuestionsScreen extends BaseThemedPureComponent {
    static navigationOptions = ({route}) => ({
        title: route.params?.title,
    });

    form = React.createRef();

    constructor(props) {
        super(props);

        const {route} = props;
        const securityQuestions = route.params?.securityQuestions ?? {};

        this.state = {
            fields: securityQuestions.form.children,
            errors: [],
            formExtension: securityQuestions.form.jsProviderExtension,
            version: 1,
        };

        this._submit = this._submit.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    _setForm(data) {
        this.safeSetState((state) => {
            if (!_.isObject(data)) {
                return null;
            }

            const {error, errors, children, jsProviderExtension} = data;

            if (_.isString(error) && !_.isEmpty(error)) {
                return {
                    ...state,
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

    _loadData() {
        const {navigation} = this.props;

        StorageSync.forceUpdate().then(() => {
            Keyboard.dismiss();
            Session.setProperty('authorized', true);
            navigation.navigate('Inside', {reload: false});
        });
    }

    _submit(fields) {
        const {route} = this.props;
        const {request} = route.params;

        this.setLoading(true);

        Auth.login({...request, security_question: fields}).then(
            (response) => {
                const {data} = response;

                if (_.isObject(data)) {
                    if (data.success) {
                        this._loadData();
                    } else {
                        let errorMessage;

                        const {error: lockoutError, security_question} = data;

                        if (_.isString(lockoutError)) {
                            errorMessage = lockoutError;
                        }

                        if (_.isObject(security_question)) {
                            const {error, form} = security_question;

                            if (_.isString(error)) {
                                errorMessage = error;
                            }

                            if (form) {
                                this._setForm(form);
                            }
                        }

                        if (errorMessage) {
                            showMessage({
                                message: errorMessage,
                                type: 'danger',
                            });
                        }

                        this.setLoading(false);
                    }
                }
            },
            () => {
                this.setLoading(false);
            },
        );
    }

    setLoading(loading) {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    }

    _renderFooter() {
        const {theme} = this.props;

        return (
            <SubmitButton
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.selectColor(Colors.grayBlue, DarkColors.blue) : this.selectColor(Colors.blueDark, DarkColors.blue)}
                onPress={() => this.form.current?.submit()}
                label={Translator.trans('form.button.submit', {}, 'messages')}
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
                {isLoading && <Spinner androidColor={this.selectColor(Colors.blueDark, DarkColors.blue)} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && (
                    <Form
                        key={`form${version}`}
                        ref={this.form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        footerComponent={this._renderFooter}
                        onSubmit={this._submit}
                        fieldsStyles={!isIOS ? stylesMaker(Colors.blueDark) : undefined}
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
});

export {SecurityQuestionsScreen};
