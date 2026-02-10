import API from '../api';

export default {
    /**
     * @param {String} accountId - account/coupon id
     * @param {number=} subAccountId - subAccount id
     * @param {Object=} data
     * @returns {AxiosPromise<any>}
     */
    add(accountId, subAccountId = null, data = null) {
        const type = accountId.substr(0, 1) === 'c' ? 'coupon' : 'account';
        const sourceId = parseInt(accountId.substr(1), 10);
        const parts = [type, sourceId];

        if (subAccountId) {
            parts.push(subAccountId);
        }

        const path = parts.join('/');

        if (!data) {
            return API.get(`/location/${path}/add`);
        }

        return API.put(`/location/${path}/add`, data);
    },

    /**
     * @param {number} locationId
     * @param {Object=} data
     * @returns {AxiosPromise<any>}
     */
    edit(locationId, data = null) {
        if (!data) {
            return API.get(`/location/edit/${locationId}`, {
                // multiple mounting
                // https://github.com/react-navigation/react-navigation/issues/2421
                globalError: false,
            });
        }

        return API.post(`/location/edit/${locationId}`, data);
    },

    /**
     * @param {number} locationId
     * @returns {AxiosPromise<any>}
     */
    remove(locationId) {
        return API.delete(`/location/delete/${locationId}`);
    },
};
