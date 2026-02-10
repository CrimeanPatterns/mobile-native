import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {stylesMaker, SubmitButton} from '../../components/form';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import API from '../../services/api';
import EventEmitter from '../../services/eventEmitter';
import Session from '../../services/session';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

@withTheme
class PasswordRecoveryScreen extends BaseThemedPureComponent {
    static navigationOptions = () => ({
        title: Translator.trans('recoverypassword.title', {}, 'mobile'),
    });

    form = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            fields: null,
            errors: [],
            formExtension: null,
            successMessage: null,
            submitLabel: null,
            version: 1,
        };

        this._submit = this._submit.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this._getForm();
        if (Session.authorized()) {
            EventEmitter.emit('doLogout', {silent: true});
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getFormUrl() {
        const {route} = this.props;
        const userId = route?.params?.userId;
        const hash = route?.params?.hash;
        let url = '/recover';

        if (_.isString(userId) && _.isString(hash)) {
            url += `/change/${userId}`;
            url += `/${hash}`;
        }

        return url;
    }

    _getForm() {
        const url = this.getFormUrl();

        API.get(url).then((response) => {
            const {data} = response;

            this._setForm(data);
        });
    }

    _setForm(data) {
        this.safeSetState((state) => {
            if (!_.isObject(data)) {
                return null;
            }

            const {success, message, error, form} = data;
            const rest = {
                fields: _.isArray(state.fields) ? state.fields : [],
            };

            if (success === true) {
                return {
                    ...state,
                    ...rest,
                    errors: [],
                    successMessage: message,
                };
            }
            if (_.isString(error) && !_.isEmpty(error)) {
                return {
                    ...state,
                    ...rest,
                    errors: [error],
                    successMessage: null,
                };
            }
            if (_.isObject(form)) {
                const {children, errors, jsProviderExtension, submitLabel} = form;
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
                    successMessage: null,
                    errors: formErrors || [],
                    formExtension: formExtension || state.formExtension,
                    submitLabel,
                };
            }

            return null;
        });
    }

    _submit(fields) {
        const url = this.getFormUrl();

        this.setLoading(true);

        API.post(url, fields).then(
            (response) => {
                this.setLoading(false);
                this._setForm(response.data);
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
        const {fields, submitLabel} = this.state;
        const {theme} = this.props;

        if (_.isArray(fields) && fields.length === 0) {
            return null;
        }

        return (
            <SubmitButton
                testID='submit'
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.selectColor(Colors.grayBlue, DarkColors.blue) : this.selectColor(Colors.blueDark, DarkColors.blue)}
                onPress={() => this.form.current?.submit()}
                label={submitLabel || Translator.trans('recoverypassword.buttons.submit', {}, 'mobile')}
                raised
                theme={theme}
            />
        );
    }

    render() {
        const {fields, errors, formExtension, successMessage, version} = this.state;
        const isLoading = !_.isArray(fields);

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {isLoading && <Spinner androidColor={this.selectColor(Colors.grayBlue, DarkColors.blue)} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && (
                    <Form
                        key={`form${version}`}
                        ref={this.form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        successMessage={successMessage}
                        footerComponent={this._renderFooter}
                        onSubmit={this._submit}
                        fieldsStyles={!isIOS ? stylesMaker(Colors.grayBlue) : undefined}
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
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});

export {PasswordRecoveryScreen};
