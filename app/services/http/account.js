import API from '../api';

function toUriString() {
    // eslint-disable-next-line prefer-rest-params
    return Array.from(arguments).join('/');
}

// eslint-disable-next-line no-unused-vars
function getForm(accountType, accountId, requestData) {
    // eslint-disable-next-line prefer-rest-params
    return API.get(toUriString.apply(this, arguments));
}

function saveForm(accountType, accountId, postData, requestData) {
    return API.put(
        toUriString.apply(
            this,
            [accountType, accountId, requestData].filter((item) => item),
        ),
        postData,
    );
}

function remove(accountType, accountId) {
    return API.delete(`/${accountType}/${accountId}`, {retry: 3});
}

function getLocalPasswordForm(accountId) {
    return API.get(`/account/localpassword/${accountId}`);
}

function saveLocalPasswordForm(accountId, postData) {
    return API.post(`/account/localpassword/${accountId}`, postData);
}

function getHistory({accountId, subAccountId, postData}) {
    let url = `/account/history/${accountId}`;

    if (subAccountId) {
        url += `/${subAccountId}`;
    }

    return API.post(url, postData);
}

function revealPassword(accountId) {
    return API.post(`/account/reveal-password/${accountId}`);
}

export default {
    getForm,
    saveForm,
    remove,
    getLocalPasswordForm,
    saveLocalPasswordForm,
    getHistory,
    revealPassword,
};
