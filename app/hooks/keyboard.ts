import {useIsFocused} from '@react-navigation/native';
import {useCallback, useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export const useKeyboardWillShown = (): boolean => {
    const [keyboardShown, setKeyboardShown] = useState(false);
    const isFocused = useIsFocused();
    const keyboardWillShow = useCallback(() => {
        setKeyboardShown(true);
    }, []);
    const keyboardWillHide = useCallback(() => {
        setKeyboardShown(false);
    }, []);

    useEffect(() => {
        const listeners = [
            Keyboard.addListener('keyboardWillChangeFrame', keyboardWillShow),
            Keyboard.addListener('keyboardWillHide', keyboardWillHide),
        ];

        return () => {
            listeners.map((listener) => listener.remove());
        };
    }, []);

    return isFocused && keyboardShown;
};
