import {Platform} from 'react-native';

export const Billing = Platform.select({
    ios: require('./index.ios').Billing,
    android: require('./index.android').Billing,
});
