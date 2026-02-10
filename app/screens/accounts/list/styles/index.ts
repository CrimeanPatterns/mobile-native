import {Platform} from 'react-native';

const styles = Platform.select({
    ios: require('./styles.ios').default,
    android: require('./styles.android').default,
});

export default styles;
