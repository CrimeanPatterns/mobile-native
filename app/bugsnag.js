import Bugsnag from '@bugsnag/react-native';

import {deviceUUID} from './services/api';

export const initBugsnag = () =>
    Bugsnag.start({
        onError(event) {
            if (!__DEV__) {
                event.addMetadata('extraData', {
                    deviceUuid: deviceUUID,
                });
            }
        },
    });

export {Bugsnag};
