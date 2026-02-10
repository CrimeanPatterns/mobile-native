import {FormAccountHeader} from '@components/form/custom/accountHeader';
import {CurrencyBalance} from '@components/form/custom/currencyBalance';
import {FormFieldToggler} from '@components/form/custom/fieldToggler';
import {Separator} from '@components/form/custom/fieldToggler/separator';
import {resetByPath} from '@services/navigator';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import ExistingAccountError from '../../../components/accounts/edit/existingAccountError';
import {BaseThemedComponent} from '../../../components/baseThemed';
import Form, {IForm, stylesMaker, SubmitButton} from '../../../components/form';
import Spinner from '../../../components/spinner';
import {isAndroid, isIOS} from '../../../helpers/device';
import {PathConfig} from '../../../navigation/linking';
import AccountsListService from '../../../services/accountsList';
import API from '../../../services/api';
import Card from '../../../services/card';
import {Colors, DarkColors} from '../../../styles';
import {useTheme} from '../../../theme';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

function mapAgentAddLink(fields, onSuccess) {
    return fields.map((field) => {
        if (field.name === 'owner') {
            field.onLinkPress = (attrs, navigation) => {
                if (_.get(attrs, 'class') === 'js-add-new-person') {
                    navigation.navigate('AgentAdd', {onSuccess});
                }
            };
        }

        return field;
    });
}

class BaseAccountAdd extends BaseThemedComponent {
    form = React.createRef<IForm>();

    constructor(props) {
        super(props);

        this.onFormReady = this.onFormReady.bind(this);
        this.updateForm = this.updateForm.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.submit = this.submit.bind(this);

        this.state = {
            kind: null,
            displayName: null,
            version: 1,
            fields: null,
            errors: [],
            formExtension: null,
            logo: null,
        };
    }

    componentDidMount() {
        this.getForm();
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

    onFormReady(form) {
        if (_.isObject(this.formValues)) {
            _.each(this.formValues, (value, name) => {
                form.setValue(name, value);
            });
            this.formValues = null;
        }
    }

    setLogo(logo) {
        this.safeSetState({logo});
    }

    updateForm(result) {
        this.safeSetState({fields: null});
        this.getForm();
        this.formValues = result;
    }

    _getForm() {
        const {route} = this.props;
        const providerId = route.params?.providerId;

        return API.get(`/provider/${providerId}`);
    }

    getForm() {
        this._getForm().then((response) => {
            const {data} = response;

            if (_.isObject(data) && _.isObject(data.formData)) {
                const {DisplayName, Kind, logo} = data;

                if (logo) {
                    this.setLogo(logo);
                }
                this.setForm(data, DisplayName, Kind);
            }
        });
    }

    setForm(data, displayName, kind) {
        this.safeSetState((state) => {
            if (!_.isObject(data)) {
                return null;
            }

            const {existingAccountId, formData, error} = data;
            let fields;
            let formErrors;
            let formExtension;

            if (_.isObject(formData)) {
                if (_.isArray(formData.children)) {
                    fields = mapAgentAddLink(formData.children, this.updateForm);
                }
                if (_.isArray(formData.errors)) {
                    formErrors = formData.errors;
                }
                if (_.isString(formData.jsProviderExtension) || _.isArray(formData.jsProviderExtension)) {
                    formExtension = formData.jsProviderExtension;
                }
            }
            if (_.isString(error) && !_.isEmpty(error)) {
                formErrors = [error];
            }
            if (!_.isUndefined(existingAccountId)) {
                const {displayName: responseDisplayName, login, name} = data;

                formErrors = [
                    <ExistingAccountError
                        key='existing-account-error'
                        existingAccountId={parseInt(existingAccountId, 10)}
                        displayName={responseDisplayName}
                        login={login}
                        name={name}
                    />,
                ];
            }

            return {
                ...state,
                displayName: displayName || state.displayName,
                kind: kind || state.kind,
                version: state.version + 1,
                fields: fields || state.fields,
                errors: formErrors || [],
                formExtension: formExtension || state.formExtension,
            };
        });
    }

    attachCardImage = (fileName, accountId) =>
        new Promise((resolve) => {
            Card.moveFromTemp(fileName, accountId).finally(resolve);
        });

    attachCardImages(cardImages, account) {
        const promises = [];
        const accountId = account.TableName[0].toLowerCase() + account.ID;

        if (_.isObject(cardImages)) {
            for (const side in cardImages) {
                if (_.isObject(cardImages[side])) {
                    const {FileName: fileName} = cardImages[side];

                    if (!_.isEmpty(fileName)) {
                        promises.push(this.attachCardImage(fileName, accountId));
                    }
                }
            }
        }

        return new Promise((resolve) => {
            if (promises.length > 0) {
                Promise.all(promises).then(resolve);
            } else {
                resolve();
            }
        });
    }

    saveForm(fields) {
        const {route} = this.props;
        const providerId = route.params?.providerId;

        return API.post(`/provider/${providerId}`, fields);
    }

    submit(fields) {
        this.setLoading(true);

        this.saveForm(fields).then(
            (response) => {
                const {data} = response;

                if (_.isObject(data)) {
                    const {account, needUpdate} = data;

                    this.setLoading(false);

                    if (account) {
                        const accountId = account.TableName[0].toLowerCase() + account.ID;
                        const {cardImages} = fields;

                        AccountsListService.addAccount(account);

                        if (needUpdate === true) {
                            return this.navigate(accountId, needUpdate);
                        }

                        return this.attachCardImages(cardImages, account).then(() => {
                            console.log('attachCardImages, navigate');
                            this.navigate(accountId);
                        });
                    }

                    this.setForm(data);
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

    navigate(accountId, needUpdate) {
        const {navigation} = this.props;

        if (needUpdate) {
            return navigation.navigate('AccountUpdate', {ID: accountId, firstUpdate: true, backTo: 'AccountDetails'});
        }

        return resetByPath(PathConfig.AccountDetails, {ID: accountId});
    }

    renderFooter() {
        const {theme} = this.props;

        return (
            <SubmitButton
                theme={theme}
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                label={Translator.trans(/** @Desc("Add to AwardWallet") */ 'account-add', {}, 'mobile-native')}
                onPress={() => this.form.current?.submit()}
                raised
            />
        );
    }

    render() {
        const {version, fields, errors, formExtension} = this.state;
        const isLoading = !_.isArray(fields);
        const topBounceColor = Platform.select({
            ios: this.isDark ? DarkColors.bg : Colors.grayLight,
            android: this.isDark ? Colors.black : Colors.grayLight,
        });
        const bottomBounceColor = Platform.select({
            ios: undefined,
            android: this.isDark ? DarkColors.bgLight : Colors.white,
        });

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {isLoading && <Spinner style={{top: 10, alignSelf: 'center'}} androidColor={this.selectColor(Colors.blueDark, DarkColors.blue)} />}
                {!isLoading && fields.length > 0 && (
                    <Form
                        ref={this.form}
                        version={version}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        footerComponent={this.renderFooter}
                        onFormReady={this.onFormReady}
                        onSubmit={this.submit}
                        customTypes={{
                            currency_and_balance: CurrencyBalance,
                            field_toggler: FormFieldToggler,
                            separator: Separator,
                            accountHeader: FormAccountHeader,
                        }}
                        fieldsStyles={isAndroid ? stylesMaker(Colors.blueDark) : undefined}
                        topBounceColor={topBounceColor}
                        bottomBounceColor={bottomBounceColor}
                    />
                )}
            </View>
        );
    }
}

export const AccountAddScreen: AccountsStackScreenFunctionalComponent<'AccountAdd'> = ({navigation, route}) => {
    const theme = useTheme();

    // @ts-ignore
    return <BaseAccountAdd theme={theme} navigation={navigation} route={route} />;
};

AccountAddScreen.navigationOptions = () =>
    // const headerBackTitle = Translator.trans('buttons.back', {}, 'mobile');

    ({
        headerBackTitle: '',
        title: Translator.trans(/** @Desc("Adding an account") */ 'adding-an-account', {}, 'mobile-native'),
    });

export {BaseAccountAdd};
export {mapAgentAddLink};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
});
