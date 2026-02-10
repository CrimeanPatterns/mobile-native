import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {stylesMaker, SubmitButton} from '../../components/form';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import {getMainColor} from '../../helpers/header';
import API from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

class AgentAdd extends BaseThemedPureComponent {
    static navigationOptions = () => ({
        title: Translator.trans('agents.title'),
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    form = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            fields: null,
            errors: [],
            formExtension: null,
            version: 1,
            submitLabel: null,
        };

        this.submit = this.submit.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.getForm();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    setLoading = (loading) => {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    };

    getForm() {
        API.get('/agent/add').then((response) => {
            const {data} = response;

            if (_.isObject(data)) {
                this.setForm(data);
            }
        });
    }

    setForm(data) {
        const {navigation, route} = this.props;
        const onSuccess = route.params?.onSuccess;

        if (!_.isObject(data)) {
            return;
        }

        const {success, result, submitLabel, error, errors, children, jsProviderExtension} = data;

        if (success === true) {
            if (_.isFunction(onSuccess)) {
                onSuccess(result);
            }
            if (this.mounted) {
                navigation.goBack();
            }
        } else {
            this.safeSetState((state) => {
                let version;
                let fields;
                let formErrors;
                let formExtension;
                const formSubmitLabel = submitLabel || Translator.trans('buttons.save', {}, 'mobile');

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
                if (_.isString(error) && !_.isEmpty(error)) {
                    formErrors = [error];
                }

                return {
                    ...state,
                    version: version || state.version,
                    fields: fields || state.fields,
                    errors: formErrors || [],
                    formExtension: formExtension || state.formExtension,
                    submitLabel: formSubmitLabel,
                };
            });
        }
    }

    submit(fields) {
        this.setLoading(true);

        API.post('/agent/add', fields).then(
            (response) => {
                this.setLoading(false);
                this.setForm(response.data);
            },
            () => {
                this.setLoading(false);
            },
        );
    }

    get mainColor() {
        return getMainColor(this.selectColor(Colors.gold, DarkColors.gold), this.isDark);
    }

    renderFooter() {
        const {submitLabel} = this.state;
        const {theme} = this.props;

        return (
            <SubmitButton
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.mainColor : undefined}
                onPress={() => this.form.current?.submit()}
                label={submitLabel}
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
                {isLoading && <Spinner androidColor={this.mainColor} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && fields.length > 0 && (
                    <Form
                        key={`form${version}`}
                        ref={this.form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        footerComponent={this.renderFooter}
                        onSubmit={this.submit}
                        fieldsStyles={isAndroid ? stylesMaker(this.mainColor) : undefined}
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
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
});

export default withTheme(AgentAdd);
