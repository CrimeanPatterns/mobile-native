import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Colors, DarkColors} from '../../styles';
import {useDark} from '../../theme';

const propTypes = {
    style: PropTypes.object,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    isPressed: PropTypes.bool,
    activeBackgroundColor: PropTypes.string,
};
const defaultColor = Colors.gray;
const defaultColorDark = DarkColors.border;

const defaultBackgroundColor = Colors.white;
const defaultBackgroundColorDark = Colors.black;

const defaultActiveBackgroundColor = Colors.gray;
const defaultActiveBackgroundColorDark = DarkColors.bgLight;

const SeparatorArrow = React.memo(({style: customStyle, color, backgroundColor, isPressed, activeBackgroundColor}) => {
    const isDark = useDark();

    return (
        <View
            style={[
                styles.separator,
                styles.arrow,
                {borderColor: color || defaultColor},
                isDark && {borderColor: color || defaultColorDark},
                customStyle?.arrow,
            ]}>
            <View
                style={[
                    styles.innerArrow,
                    customStyle?.innerArrow,
                    {borderRightColor: backgroundColor || defaultBackgroundColor},
                    isPressed && {borderRightColor: activeBackgroundColor || defaultActiveBackgroundColor},
                    isDark && {borderRightColor: backgroundColor || defaultBackgroundColorDark},
                    isDark && isPressed && {borderRightColor: activeBackgroundColor || defaultActiveBackgroundColorDark},
                ]}
            />
        </View>
    );
});

SeparatorArrow.propTypes = {
    ...propTypes,
};

const SeparatorLine = React.memo(({style: customStyle, color}) => {
    const isDark = useDark();

    return (
        <View
            style={[
                styles.separator,
                styles.separatorLine,
                {borderColor: color || defaultColor},
                isDark && {borderColor: color || defaultColorDark},
                customStyle?.line,
            ]}
        />
    );
});

SeparatorLine.propTypes = {
    style: PropTypes.object,
    color: PropTypes.string,
};

const CrookedSeparator = React.memo(({...props}) => (
    <>
        <SeparatorLine {...props} />
        <SeparatorArrow {...props} />
    </>
));

CrookedSeparator.propTypes = {
    ...propTypes,
};

const styles = StyleSheet.create({
    separator: {
        position: 'absolute',
        zIndex: 2,
    },
    arrow: {
        top: -5,
        left: 32,
        height: 10,
        width: 10,
        transform: [{rotateZ: '45deg'}],
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },
    innerArrow: {
        position: 'absolute',
        top: -1,
        left: -1,
        borderStyle: 'solid',
        borderTopWidth: 10,
        borderRightWidth: 10,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
        backgroundColor: 'transparent',
    },
    separatorLine: {
        top: 0,
        width: '100%',
        borderBottomWidth: 1,
    },
});

export default CrookedSeparator;
export {SeparatorArrow, SeparatorLine};
