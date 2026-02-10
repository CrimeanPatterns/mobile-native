import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import {Pressable, StyleSheet} from 'react-native';

const TouchableOpacity = React.forwardRef(({children, style, activeOpacity, disabled, ...rest}, forwardedRef) => {
    const pressableStyle = useMemo(() => {
        if (_.isFunction(style) === false) {
            return ({pressed}) => [
                {
                    opacity: pressed || disabled === true ? activeOpacity : 1,
                },
                _.isArray(style) ? StyleSheet.flatten(style) : style,
            ];
        }

        return style;
    }, [activeOpacity, disabled, style]);

    return (
        <Pressable ref={forwardedRef} style={pressableStyle} disabled={disabled} {...rest}>
            {children}
        </Pressable>
    );
});

TouchableOpacity.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any,
    activeOpacity: PropTypes.number,
    disabled: PropTypes.bool,
};

TouchableOpacity.defaultProps = {
    activeOpacity: 0.2,
};

TouchableOpacity.displayName = 'TouchableOpacity';

export {TouchableOpacity};
