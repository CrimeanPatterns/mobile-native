import {Platform} from 'react-native';

export const PlainTextField = Platform.select({
    ios: require('./textField.ios').PlainTextField,
    android: require('./textField.android').PlainTextField,
});
