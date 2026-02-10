import {Colors, DarkColors, Fonts} from '@styles/index';
import {ColorSchemeDark, useTheme} from '@theme/use-theme';
import React from 'react';
import {Platform, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle} from 'react-native';

import Icons from '../../../../assets/icons';
import {isIOS} from '../../../../helpers/device';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable';

export type FormFieldTogglerButton = {
    icon: keyof typeof Icons;
    label: string;
    toggledLabel: string;
    toggled: boolean;
    fields: string[];
};

export const FormFieldTogglerButton: React.FunctionComponent<
    React.PropsWithChildren<{
        // toggled: boolean;
        style?: StyleProp<ViewStyle> | undefined;
        containerStyle?: StyleProp<ViewStyle> | undefined;
        onPress: () => void;
        label: string;
        // toggledLabel: string;
        iconStyle?: StyleProp<TextStyle> | undefined;
        labelContainerStyle?: StyleProp<ViewStyle> | undefined;
        labelStyle?: StyleProp<TextStyle> | undefined;
        // labelAnimation?: Pick<AnimatedProps<ViewProps>, 'entering' | 'exiting'>;
        icon: keyof typeof Icons;
    }>
> = ({style, containerStyle, onPress, label, iconStyle, labelContainerStyle, labelStyle, icon}) => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const borderColor = Platform.select({
        ios: isDark ? DarkColors.border : Colors.graySoft,
        android: isDark ? DarkColors.border : Colors.gray,
    });
    const labelColor = Platform.select({
        ios: isDark ? Colors.white : Colors.blue,
        android: isDark ? DarkColors.white : Colors.textGray,
    });

    return (
        <View style={[{flex: 1}, containerStyle]}>
            <TouchableBackground
                onPress={onPress}
                activeBackgroundColor={isDark ? DarkColors.bg : Colors.grayLight}
                style={[
                    styles.container,
                    {
                        borderColor: borderColor,
                    },
                    style,
                ]}>
                <Icon name={icon} color={Colors.blue} colorDark={DarkColors.blue} style={iconStyle} />
                <View style={[labelContainerStyle]}>
                    <Text
                        style={[
                            styles.label,
                            {
                                color: labelColor,
                            },
                            labelStyle,
                        ]}>
                        {label}
                    </Text>
                </View>
            </TouchableBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 11,
    },
    label: {
        textAlign: 'center',
        fontFamily: Fonts.regular,
        fontWeight: '700',
        fontSize: isIOS ? 12 : 11,
        lineHeight: 12,
    },
});
