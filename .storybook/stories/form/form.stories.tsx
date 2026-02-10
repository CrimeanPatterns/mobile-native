import Form from '../../../app/components/form';
import BaseSubmitButton from '../../../app/components/form/rest/submitButton';

const formResponse = require('../../json/form/testprovider.json');
const formCustomAccountResponse = require('../../json/form/custom-account.json');
const formSignUpResponse = require('../../json/form/register.json');

export default {
    title: 'Form',
    component: Form,
    args: {},
};

export const AccountEdit = {
    title: 'Form/AccountEdit',
    component: Form,
    args: {
        theme: 'light',
        fields: formResponse.formData.children,
        footerComponent: () => <BaseSubmitButton label={'Add to AwardWallet'} />,
        formExtension: [...formResponse.formData.jsProviderExtension, require('./formExtension').FormExtension],
    },
};

export const CustomAccount = {
    title: 'Form/CustomAccount',
    component: Form,
    args: {
        theme: 'light',
        fields: formCustomAccountResponse.formData.children,
        footerComponent: () => <BaseSubmitButton label={'Add to AwardWallet'} />,
        formExtension: [...formCustomAccountResponse.formData.jsProviderExtension, require('./formExtension').FormExtension],
    },
};

export const Register = {
    title: 'Form/Register',
    component: Form,
    args: {
        theme: 'light',
        fields: formSignUpResponse.children,
    },
};
