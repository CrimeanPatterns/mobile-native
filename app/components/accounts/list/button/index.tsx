import fromColor from 'color';
import React, {useCallback} from 'react';
import {StyleProp, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import {IconColors} from '../../../../styles/icons';
import {useDark} from '../../../../theme';
import Icon from '../../../icon';
import styles from './styles';

export type ButtonProps = {
    onPress: () => void;
    label?: string;
    labelColor?: string;
    color?: string;
    iconName?: string;
    iconColor?: string;
    size?: number;
    stylesButton?: StyleProp<ViewStyle>;
    stylesLabel?: StyleProp<TextStyle>;
    disabled?: boolean;
    testID?: string;
};

type IButton = React.FunctionComponent<ButtonProps>;

const Button: IButton = ({onPress, label, labelColor, color, iconName, iconColor, size = 24, stylesButton, stylesLabel, disabled, testID}) => {
    const isDark = useDark();

    const renderLabel = useCallback(
        () => (
            <>
                {iconName && <Icon name={iconName} color={iconColor || IconColors.gray} size={size} />}
                {label && (
                    <Text style={[styles.label, isDark && styles.labelDark, labelColor ? {color: labelColor} : null, stylesLabel]}>{label}</Text>
                )}
            </>
        ),
        [iconColor, iconName, isDark, label, labelColor, size, stylesLabel],
    );

    if (disabled) {
        return (
            <View
                testID={testID}
                style={[
                    styles.button,
                    isDark && styles.buttonDark,
                    color ? {backgroundColor: fromColor(color).alpha(0.3).rgb().string()} : null,
                    stylesButton,
                ]}>
                {renderLabel()}
            </View>
        );
    }

    return (
        <TouchableOpacity
            testID={testID}
            onPress={onPress}
            style={[styles.button, isDark && styles.buttonDark, color ? {backgroundColor: color} : null, stylesButton]}>
            {renderLabel()}
        </TouchableOpacity>
    );
};

export default Button;
