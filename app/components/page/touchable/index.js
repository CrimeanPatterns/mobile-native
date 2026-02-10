import React from 'react';
import {Platform, TouchableNativeFeedback, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {TouchableOpacity} from './opacity';

const ANDROID_VERSION_LOLLIPOP = 21;

// eslint-disable-next-line react/prop-types
const TouchableItem = React.forwardRef(({borderless = false, pressColor = 'rgba(0, 0, 0, .32)', style, children, ...rest}, forwardedRef) => {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (!isIOS && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
        return (
            <TouchableNativeFeedback
                {...rest}
                ref={forwardedRef}
                useForeground={TouchableNativeFeedback.canUseNativeForeground()}
                background={TouchableNativeFeedback.Ripple(pressColor, borderless)}>
                <View style={style}>{React.Children.only(children)}</View>
            </TouchableNativeFeedback>
        );
    }
    return (
        <TouchableOpacity ref={forwardedRef} style={style} {...rest}>
            {children}
        </TouchableOpacity>
    );
});

export {TouchableItem};
export {TouchableOpacity} from './opacity';
export {TouchableBackground} from './background';
