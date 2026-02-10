import {HeaderBackButton as NavigationHeaderBackButton, HeaderBackButtonProps} from '@react-navigation/elements';
import {useNavigation} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';

import Icons from '../../../assets/icons';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {useTheme} from '../../../theme';
import Icon from '../../icon';

type HeaderButtonProps = {
    ref?: React.Ref<View> | null;
    testID?: string;
    accessibilityLabel?: string;
    onPress: () => void;
    iconName?: keyof typeof Icons;
    title?: string;
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
    buttonImage?: (props: {tintColor: string}) => React.ReactNode;
    disabled?: boolean;
    disabledColor?: string;
    disabledColorDark?: string;
    color?: string;
    colorDark?: string;
    titleStyle?: Omit<HeaderBackButtonProps, 'labelStyle'>;
};

const HeaderButton: React.FunctionComponent<HeaderButtonProps> = React.forwardRef(
    (
        {
            accessibilityLabel,
            testID,
            style,
            disabled,
            color: customColor,
            colorDark: customColorDark,
            disabledColor: customDisabledColor,
            disabledColorDark: customDisabledColorDark,
            buttonImage,
            title,
            titleStyle,
            iconStyle,
            iconName,
            onPress,
        },
        ref,
    ) => {
        const theme = useTheme();
        const isDark = theme === 'dark';
        const tintColorIOS = isDark ? Colors.white : IconColors.gray;
        const tintColorAndroid = isDark ? DarkColors.text : Colors.white;
        const baseColor = isDark ? customColorDark : customColor;
        const color = baseColor ?? (isIOS ? tintColorIOS : tintColorAndroid);
        const disabledColorIOS = isDark ? DarkColors.gray : Colors.grayDarkLight;
        const disabledColorAndroid = isDark ? DarkColors.border : Colors.grayDarkLight;
        const baseDisabledColor = isDark ? customDisabledColorDark : customDisabledColor;
        const disabledColor = baseDisabledColor ?? (isIOS ? disabledColorIOS : disabledColorAndroid);

        const renderButtonIcon = useCallback(() => {
            if (_.isString(iconName)) {
                return (
                    <View style={styles.icon}>
                        <Icon name={iconName} size={24} color={disabled ? disabledColor : color} style={iconStyle} />
                    </View>
                );
            }

            return null;
        }, [color, disabled, disabledColor, iconName, iconStyle]);

        const backImage = useMemo(() => {
            if (_.isUndefined(buttonImage)) {
                return renderButtonIcon;
            }

            return buttonImage;
        }, [buttonImage, renderButtonIcon]);

        return (
            <View ref={ref} collapsable={false}>
                <NavigationHeaderBackButton
                    disabled={disabled}
                    label={title}
                    backImage={backImage}
                    tintColor={disabled ? disabledColor : color}
                    labelVisible={_.isString(title)}
                    labelStyle={titleStyle}
                    onPress={onPress}
                    accessibilityLabel={accessibilityLabel}
                    testID={testID}
                    style={style}
                />
            </View>
        );
    },
);

const HeaderLeftButton: React.FunctionComponent<HeaderButtonProps> = React.forwardRef((props, ref) => (
    <View ref={ref} style={styles.containerLeft} collapsable={false}>
        <HeaderButton {...props} />
    </View>
));

const HeaderRightButton: React.FunctionComponent<HeaderButtonProps> = React.forwardRef((props, ref) => (
    <View ref={ref} style={styles.containerRight} collapsable={false}>
        <HeaderButton {...props} />
    </View>
));

const HeaderBackButton: React.FunctionComponent<HeaderBackButtonProps> = ({label, onPress, ...props}) => {
    const headerBackTitle = label ?? Translator.trans('buttons.back', {}, 'mobile');
    const navigation = useNavigation();

    return (
        <View style={{marginLeft: -15}}>
            <NavigationHeaderBackButton
                onPress={onPress ?? navigation.goBack}
                labelStyle={{paddingLeft: 2}}
                label={headerBackTitle}
                labelVisible={isIOS}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerLeft: {
        marginLeft: -10,
    },
    containerRight: {
        marginRight: -10,
    },
    icon: !isIOS
        ? {
              height: 24,
              width: 24,
              margin: 3,
              backgroundColor: 'transparent',
          }
        : {},
});

export default HeaderButton;
export {HeaderLeftButton, HeaderRightButton, HeaderBackButton};
