import {firebase} from '@react-native-firebase/analytics';

import API from '../services/api';
import {getFirstAppOpen} from '../services/session';

// eslint-disable-next-line camelcase
export const trackRef = ({ref, initialUrl: url, track_click = 1}) => {
    // eslint-disable-next-line camelcase
    const first_app_open = getFirstAppOpen();

    // eslint-disable-next-line no-param-reassign
    ref = String(ref);

    console.log('trackRef', {ref, first_app_open, track_click});
    // alert(`trackRef ${first_app_open}`);
    API.post('/ref', {ref, first_app_open, track_click});

    firebase.analytics().setUserProperties({
        ref,
    });

    firebase.analytics().logEvent(`openUrlWithRef_${ref}`, {ref, url});
};
