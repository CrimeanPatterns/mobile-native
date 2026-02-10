import {Platform} from 'react-native';

export default Platform.select({
    ios: require('./index.ios'),
    android: require('./index.android'),
});
