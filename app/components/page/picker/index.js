import fromColor from 'color';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import ReactNativePickerModule from 'react-native-picker-module';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.theme === nextProps.theme &&
    prevProps.value === nextProps.value &&
    prevProps.title === nextProps.title &&
    prevProps.items === nextProps.items &&
    prevProps.onValueChange === nextProps.onValueChange &&
    prevProps.cancelButton === nextProps.cancelButton &&
    prevProps.confirmButton === nextProps.confirmButton &&
    prevProps.itemColor === nextProps.itemColor;

const Picker = React.memo(({forwardedRef, ...rest}) => {
    const isDark = useDark();
    const underlayColor = isDark ? DarkColors.bgLight : Colors.grayLight;

    return (
        <ReactNativePickerModule
            ref={forwardedRef}
            {...rest}
            buttonUnderlayColor={underlayColor}
            itemColor={isDark ? Colors.white : Colors.black}
            customStyles={isDark ? darkStyles : lightStyles}
        />
    );
}, propsAreEqual);

Picker.displayName = 'Picker';
Picker.propTypes = {
    forwardedRef: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    items: PropTypes.array,
    onValueChange: PropTypes.func,
    cancelButton: PropTypes.string,
    confirmButton: PropTypes.string,
    itemColor: PropTypes.string,
};
Picker.defaultProps = {
    pickerRef: () => {},
};

const ForwardedRefPicker = React.forwardRef((props, forwardedRef) => <Picker {...props} forwardedRef={forwardedRef} />);

ForwardedRefPicker.displayName = 'ForwardedRefPicker';

export default ForwardedRefPicker;

const lightStyles = {};
/* eslint-disable react-native/no-unused-styles */
const darkStyles = StyleSheet.create({
    titleText: {
        color: DarkColors.text,
    },
    cancelButtonText: {
        color: '#007aff',
    },
    cancelButtonView: {
        backgroundColor: DarkColors.bg,
    },
    confirmButtonText: {
        color: DarkColors.blue,
    },
    confirmButtonView: {
        backgroundColor: DarkColors.bg,
    },
    content: {
        backgroundColor: DarkColors.bg,
    },
    pickerItem: {
        color: Colors.white,
    },
    separator: {
        borderTopColor: fromColor(DarkColors.border).alpha(0.2).rgb().string(),
    },
});
