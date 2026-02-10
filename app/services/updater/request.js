import _ from 'lodash';

import API from '../api';

function start(postData) {
    return API.post(`/account/update2`, postData, {globalError: false, retry: false});
}

function getEvents({key, eventIndex}, postData) {
    if (_.isNil(eventIndex)) {
        return API.post(`/account/update2/${key}`, postData, {globalError: false, retry: false});
    }
    return API.post(`/account/update2/${key}/${eventIndex}`, postData, {globalError: false, retry: false});
}

export default {
    start,
    getEvents,
};
