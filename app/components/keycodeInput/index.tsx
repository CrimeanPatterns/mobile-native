import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {StyleProp, Text, TextInput, TextStyle, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {useDark} from '../../theme';
import styles from './styles';

type IKeycodeInputProps = {
    value: string;
    onChange: (value: string) => void;
    onComplete: () => void;
    type?: 'point' | 'line';
    length?: number;
    autoFocus?: boolean;
    numeric?: boolean;
    alphaNumeric?: boolean;
    uppercase?: boolean;
    editable?: boolean;
    style?: StyleProp<TextStyle>;
    colorText?: string;
};

type IKeycodeInput = React.FunctionComponent<IKeycodeInputProps>;

const KeycodeInput: IKeycodeInput = ({
    value,
    onChange,
    onComplete,
    type = 'point',
    length = 6,
    autoFocus = true,
    numeric = true,
    alphaNumeric = true,
    uppercase = true,
    editable = true,
    style,
    colorText,
}) => {
    const isDark = useDark();
    // eslint-disable-next-line no-nested-ternary
    const keyboardType = numeric ? 'numeric' : isIOS ? 'ascii-capable' : 'default';

    const getValue = useCallback(
        (text) => {
            let value = text;

            if (uppercase) {
                value = value.toUpperCase();
            }

            if (alphaNumeric) {
                value = value.replace(/[^a-z0-9]/gi, '');
            }

            return value;
        },
        [alphaNumeric, uppercase],
    );

    const changeText = useCallback(
        async (text) => {
            const value = getValue(text);

            if (_.isFunction(onChange)) {
                await onChange(value);
            }

            if (value.length < length) {
                return;
            }

            if (_.isFunction(onComplete)) {
                onComplete();
            }
        },
        [getValue, length, onChange, onComplete],
    );

    const renderBoxPoint = useCallback(
        (vals, i) => (
            <View style={styles.keyCodeBoxPoint} key={i}>
                {_.isString(vals[i]) ? (
                    <Text style={[styles.keyCodeText, isDark && styles.keyCodeTextDark, colorText ? {color: colorText} : null]}>{vals[i]}</Text>
                ) : (
                    <View style={[styles.keyCodeBarPoint, isDark && styles.keyCodeBarDark]} />
                )}
            </View>
        ),
        [colorText, isDark],
    );

    const renderBoxLine = useCallback(
        (vals, i) => (
            <View style={[styles.keyCodeBoxLine, i === 2 && styles.separator]} key={i}>
                {_.isString(vals[i]) ? (
                    <Text style={[styles.keyCodeText, isDark && styles.keyCodeTextDark, colorText ? {color: colorText} : null]}>{vals[i]}</Text>
                ) : (
                    <View style={[styles.keyCodeBarLine, isDark && styles.keyCodeBarDark]} />
                )}
            </View>
        ),
        [colorText, isDark],
    );

    const renderBox = useMemo(
        () =>
            ({
                point: renderBoxPoint,
                line: renderBoxLine,
            }[type]),
        [renderBoxLine, renderBoxPoint, type],
    );

    const renderBoxes = useCallback(() => {
        const vals = value.split('');
        const elements: Element[] = [];

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < length; i++) {
            elements.push(renderBox(vals, i));
        }

        return elements;
    }, [length, renderBox, value]);

    return (
        <View style={styles.container}>
            <View style={[styles.keyCode, style]}>{renderBoxes()}</View>
            <TextInput
                editable={editable}
                style={styles.keyCodeInput}
                autoFocus={autoFocus}
                autoCorrect={false}
                autoCapitalize='characters'
                value={value}
                blurOnSubmit={false}
                keyboardType={keyboardType}
                maxLength={length}
                disableFullscreenUI
                clearButtonMode='never'
                spellCheck={false}
                returnKeyType='go'
                underlineColorAndroid='transparent'
                onChangeText={changeText}
                caretHidden
                allowFontScaling={false}
            />
        </View>
    );
};

export default KeycodeInput;
