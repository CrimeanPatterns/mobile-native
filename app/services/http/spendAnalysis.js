import API from '../api';

export default {
    /**
     * Return spend analysis data {analysis, form}
     * @returns {AxiosPromise<any>}
     */
    get() {
        return API.get('/account/spent-analysis/merchants/data');
    },

    /**
     * Save settings for spend analysis
     * @returns {AxiosPromise<any>}
     */
    post(data, config) {
        return API.post('/account/spent-analysis/merchants/data', data, config);
    },

    /**
     * Get merchant details
     * @param {number} merchant
     * @param {object} formData
     * @returns {AxiosPromise<any>}
     */
    getByMerchant(merchant, formData) {
        return API.post(`/account/spent-analysis/merchants/transactions/${merchant}`, formData);
    },
};
