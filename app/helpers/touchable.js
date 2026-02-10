import {TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native';

import {isAndroid} from './device';

export function getTouchableComponent(fallBackComponent) {
    if (isAndroid) {
        return TouchableNativeFeedback;
    }
    return fallBackComponent || TouchableWithoutFeedback;
}

export function touchableBackground() {
    if (isAndroid) {
        return TouchableNativeFeedback.SelectableBackground();
    }
    return undefined;
}
