import API from '../services/api';
import {getFirstAppOpen} from '../services/session';

// eslint-disable-next-line camelcase
export const trackEmtr = (id, url) => {
    // eslint-disable-next-line camelcase
    const first_app_open = getFirstAppOpen();

    console.log('trackEmtr', {id, url, first_app_open});
    // alert(`trackRef ${first_app_open}`);
    API.post('/track', {id, url, first_app_open});
};
