import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Pressable, StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';

const TouchableBackground = ({children, style, activeBackgroundColor, backgroundColor, rippleColor, ...rest}) => {
    let pressableStyle = style;

    if (_.isFunction(style) === false) {
        pressableStyle = ({pressed}) => [
            _.isArray(style) ? StyleSheet.flatten(style) : style,
            backgroundColor && {
                backgroundColor,
            },
            pressed &&
                activeBackgroundColor &&
                (!rippleColor || isIOS) && {
                    backgroundColor: activeBackgroundColor,
                },
        ];
    }

    return (
        <Pressable android_ripple={_.isString(rippleColor) ? {color: rippleColor} : null} style={pressableStyle} {...rest}>
            {children}
        </Pressable>
    );
};

TouchableBackground.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
    activeBackgroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    rippleColor: PropTypes.string,
    disabled: PropTypes.bool,
};

TouchableBackground.displayName = 'TouchableBackground';

export {TouchableBackground};
