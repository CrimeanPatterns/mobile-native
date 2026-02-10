import {useHeaderHeight} from '@react-navigation/elements';
import React from 'react';
import {KeyboardAvoidingView as BaseKeyboardAvoidingView} from 'react-native';

const KeyboardAvoidingView = ({children, style}) => {
    const headerHeight = useHeaderHeight();

    return (
        <BaseKeyboardAvoidingView style={[{flex: 1}, style]} behavior='padding' keyboardVerticalOffset={headerHeight - 5}>
            {children}
        </BaseKeyboardAvoidingView>
    );
};

export default KeyboardAvoidingView;
