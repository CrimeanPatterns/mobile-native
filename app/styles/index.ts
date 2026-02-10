import {Platform} from 'react-native';

export {CorporateColors} from './corporate';
export {IconColors} from './icons';

export const Colors = Platform.select({
    ios: require('./common.ios').Colors,
    android: require('./common.android').Colors,
});
export const DarkColors = Platform.select({
    ios: require('./common.ios').DarkColors,
    android: require('./common.android').DarkColors,
});
export const Fonts = Platform.select({
    ios: require('./common.ios').Fonts,
    android: require('./common.android').Fonts,
});
