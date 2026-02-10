import {FormAccountHeader} from '@components/form/custom/accountHeader';
import {CurrencyBalance} from '@components/form/custom/currencyBalance';
import {FormFieldToggler} from '@components/form/custom/fieldToggler';
import {Separator} from '@components/form/custom/fieldToggler/separator';
import {Colors, DarkColors} from '@styles/index';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import ExistingAccountError from '../../../components/accounts/edit/existingAccountError';
import {BaseThemedComponent} from '../../../components/baseThemed';
import Form, {IForm, stylesMaker, SubmitButton} from '../../../components/form';
import Spinner from '../../../components/spinner';
import {isAndroid, isIOS} from '../../../helpers/device';
import AccountsListService from '../../../services/accountsList';
import EventEmitter, {EventSubscription} from '../../../services/eventEmitter';
import Account from '../../../services/http/account';
import {ColorScheme, useTheme} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import {mapAgentAddLink} from './add';

class BaseAccountEdit extends BaseThemedComponent<
    {
        theme: ColorScheme;
        navigation;
        route;
    },
    {
        version: number;
        fields: null;
        errors: never[];
        formExtension: null;
    }
> {
    private listeners: {
        storage: EventSubscription;
    };

    private mounted: boolean | undefined;

    private account: IAccount | undefined;

    private accountType: string | undefined;

    private accountId: number | undefined;

    private form = React.createRef<IForm>();

    private submitButton: any;

    private formValues;

    constructor(props) {
        super(props);

        // for extract-trans.js
        // @ts-ignore
        const trans = [
            Translator.trans('account.balancewatch.no-available'),
            Translator.trans('account.balancewatch.not-available'),
            Translator.trans('account.balancewatch.not-available-not-cancheck'),
            Translator.trans('account.balancewatch.not-available-account-disabled'),
            Translator.trans('please-upgrade'),
            Translator.trans('account.balancewatch.awplus-upgrade'),
            Translator.trans('account.balancewatch.credits-no-available-label'),
            Translator.trans('account.balancewatch.credits-no-available-notice'),
            Translator.trans('buy'),
            Translator.trans('button.upgrade'),
            Translator.trans('button.close'),
            Translator.trans('account.balancewatch.not-available-password-local'),
            Translator.trans('account.balancewatch.not-available-account-error'),
            Translator.trans('account.balancewatch.expected-number-miles'),
            Translator.trans('account.balancewatch.expected-number-miles-notice'),
            Translator.trans('account.balancewatch.transfer-requested'),
            Translator.trans('account.balancewatch.points-purchase'),
            Translator.trans('account.balancewatch.purchase-requested'),
        ];

        this.updateForm = this.updateForm.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.submit = this.submit.bind(this);
        this.onFormReady = this.onFormReady.bind(this);
        this.onFormProcessing = this.onFormProcessing.bind(this);
        this.updateAccount = this.updateAccount.bind(this);

        this.listeners = {
            storage: EventEmitter.addListener('billing:bwc:purchased', this.updateForm),
        };

        this.state = {
            version: 1,
            fields: null,
            errors: [],
            formExtension: null,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;

        this.account = this.getAccount();

        if (this.account) {
            this.accountType = this.account.TableName.toLowerCase();
            this.accountId = this.account.ID;

            if (this.account.Kind === 11) {
                this.accountType = 'document';
            }

            this.getForm(this.accountType, this.accountId);
        } else {
            navigation.goBack();
        }
    }

    componentWillUnmount() {
        this.form.current?.unsubscribe('onFormProcessing', this.onFormProcessing);
        this.mounted = false;
        Object.values(this.listeners).map((listener) => listener.remove());
    }

    safeSetState(...args) {
        if (this.mounted) {
            // @ts-ignore
            this.setState(...args);
        }
    }

    getAccount() {
        const {route} = this.props;
        const {ID} = route.params;

        return AccountsListService.getAccount(ID);
    }

    updateForm(result) {
        this.safeSetState({fields: null});
        this.getForm(this.accountType, this.accountId);
        this.formValues = result;
    }

    onFormReady(form: IForm) {
        const {route} = this.props;
        const scrollTo = route.params?.scrollTo;

        if (scrollTo) {
            form.scrollToField(scrollTo);
        }

        if (_.isObject(this.formValues)) {
            _.each(this.formValues, (value, name) => {
                form.setValue(name, value);
            });
            this.formValues = null;
        }

        form.subscribe('onFormProcessing', this.onFormProcessing);
    }

    onFormProcessing(_form: IForm, processing: boolean) {
        this.setLoading(processing);
    }

    getForm(accountType, accountId) {
        Account.getForm(accountType, accountId).then((response) => {
            const {data} = response;

            if (data && _.isObject(data.formData)) {
                this.setForm(data);
            }
        });
    }

    setForm(data) {
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
                    fields = fields.map((field) => {
                        if (field.name === 'TransferFromProvider') {
                            field.onSelect = (choice) => {
                                if (_.has(choice, 'additionalData.currency')) {
                                    this.form.current?.setValue('TransferProviderCurrency', _.get(choice, 'additionalData.currency'));
                                }
                            };
                        }

                        return field;
                    });
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
                const {displayName, login, name} = data;

                formErrors = [
                    <ExistingAccountError
                        key='existing-account-error'
                        existingAccountId={parseInt(existingAccountId, 10)}
                        displayName={displayName}
                        login={login}
                        name={name}
                    />,
                ];
            }

            return {
                ...state,
                version: state.version + 1,
                fields: fields || state.fields,
                errors: formErrors || [],
                formExtension: formExtension || state.formExtension,
            };
        });
    }

    async submit(fields) {
        const {navigation} = this.props;

        this.setLoading(true);

        try {
            const response = await Account.saveForm(this.accountType, this.accountId, fields);
            const {data} = response;

            if (_.isObject(data)) {
                const {account, needUpdate} = data;

                if (account) {
                    AccountsListService.setAccount(account);

                    if (needUpdate === true) {
                        return this.updateAccount();
                    }

                    return navigation.goBack();
                }

                this.setForm(data);
            }
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    }

    updateAccount() {
        const {navigation, route} = this.props;
        const {ID} = route.params;

        navigation.navigate('AccountUpdate', {ID});
    }

    renderFooter() {
        const {theme} = this.props;

        return (
            <SubmitButton
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                label={Translator.trans('buttons.save', {}, 'mobile')}
                onPress={() => this.form.current?.submit()}
                raised
                theme={theme}
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
                {!isLoading && fields && fields.length > 0 && (
                    <Form
                        version={version}
                        ref={this.form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        footerComponent={this.renderFooter}
                        onSubmit={this.submit}
                        onFormReady={this.onFormReady}
                        customTypes={{
                            currency_and_balance: CurrencyBalance,
                            field_toggler: FormFieldToggler,
                            separator: Separator,
                            accountHeader: FormAccountHeader,
                        }}
                        fieldsStyles={isAndroid ? stylesMaker(this.selectColor(Colors.blueDark, DarkColors.blue)) : undefined}
                        topBounceColor={topBounceColor}
                        bottomBounceColor={bottomBounceColor}
                    />
                )}
            </View>
        );
    }
}

export const AccountEditScreen: AccountsStackScreenFunctionalComponent<'AccountEdit'> = ({navigation, route}) => {
    const theme = useTheme();

    return <BaseAccountEdit theme={theme} navigation={navigation} route={route} />;
};

AccountEditScreen.navigationOptions = () => ({
    title: '',
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

export {BaseAccountEdit};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
});
