import {Platform} from 'react-native';

export default Platform.select({
    ios: require('./index.ios').default,
    android: require('./index.android').default,
});
