import {Platform} from 'react-native';

export default Platform.select({
    ios: require('./camera.ios').default,
    android: require('./camera.android').default,
});
