import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, TextInput, View} from 'react-native';

import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import Title from './details/title';
import styles from './styles';

type CustomProps = {
    type: string;
    price?: string;
    value: number;
    active: boolean;
    onChange: ({customValue: string}) => void;
};

type ICustom = React.FunctionComponent<CustomProps>;

const CustomValue: ICustom = ({type, active, price, onChange}) => {
    const isDark = useDark();
    const [textInput, setTextInput] = useState(price);
    const textInputRef = useRef<TextInput>(null);
    const label = Translator.trans('alternative-flight.custom-value.form-title', {}, 'mobile-native');

    const setFieldFocus = useCallback(() => {
        textInputRef.current?.focus();
    }, []);

    const onFocus = useCallback(() => {
        setTextInput(textInput || '');
    }, [textInput]);

    const onChangeText = useCallback((text) => {
        setTextInput(text);
    }, []);

    useEffect(() => {
        if (_.isString(textInput)) {
            onChange({customValue: textInput});
        }
    }, [textInput]);

    return (
        <>
            <Title
                type={type}
                name={Translator.trans(/** @Desc("Custom Value") */ 'alternative-flight.custom-value.title', {}, 'mobile-native')}
                checkbox={active}
                onPress={setFieldFocus}
            />
            <View
                style={[
                    styles.container,
                    {borderTopWidth: 1, borderTopColor: Colors.grayDarkLight},
                    isDark && styles.containerDark,
                    isDark && {borderTopColor: DarkColors.border},
                ]}>
                <Text style={[styles.label, isDark && styles.labelDark]}>{label.toUpperCase()}</Text>
                <View style={[styles.row, isDark && styles.rowDark]}>
                    <View style={[styles.containerIcon, isDark && styles.containerIconDark]}>
                        <Text style={[styles.icon, isDark && styles.iconDark]}>$</Text>
                    </View>
                    <TextInput
                        ref={textInputRef}
                        value={textInput}
                        onFocus={onFocus}
                        style={[styles.textInput, isDark && styles.textInputDark]}
                        keyboardType='number-pad'
                        onChangeText={onChangeText}
                    />
                </View>
            </View>
        </>
    );
};

export default CustomValue;
