import React, {useCallback} from 'react';
import {PressableProps, StyleProp, Text, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles, {GradientColors, GradientColorsDark, ToolsIconColors} from './styles';

export const GradientProps = {
    useAngle: true,
    angle: 45,
    angleCenter: {x: 0.5, y: 0.5},
};

export type TypeCardGrid =
    | 'transferTimes'
    | 'mileValue'
    | 'travelSummary'
    | 'subscriptionPlus'
    | 'bookings'
    | 'blog'
    | 'faqs'
    | 'notifications'
    | 'contactUs'
    | 'aboutUs'
    | 'privacyNotice'
    | 'termsOfUse'
    | 'logout';

type CardGridProps = {
    type: TypeCardGrid;
    onPress: (type: TypeCardGrid) => void;
    style?: StyleProp<ViewStyle>;
    styleCard?: StyleProp<ViewStyle>;
} & Omit<PressableProps, 'onPress'>;

type CardGridWideProps = {
    icon: string;
    name: string;
};

type ICardGrid = React.FunctionComponent<CardGridProps>;

type ICardGridWide = React.FunctionComponent<CardGridProps & CardGridWideProps>;

const BaseCardGrid: ICardGrid = ({type, onPress: customOnPress, style, styleCard, children, ...props}) => {
    const isDark = useDark();

    const onPress = useCallback(() => {
        customOnPress(type);
    }, [customOnPress, type]);

    return isIOS ? (
        <LinearGradient colors={isDark ? GradientColorsDark[type] : GradientColors[type]} style={[styles.gradientBorder, style]} {...GradientProps}>
            <TouchableBackground
                onPress={onPress}
                rippleColor={isDark ? DarkColors.border : Colors.grayLight}
                activeBackgroundColor={isDark ? DarkColors.bg : Colors.white}
                style={[styles.cardGrid, isDark && styles.cardGridDark, styleCard]}
                {...props}>
                {children}
            </TouchableBackground>
        </LinearGradient>
    ) : (
        <View style={[styles.gradientBorder, style]}>
            <TouchableBackground
                onPress={onPress}
                rippleColor={isDark ? DarkColors.border : Colors.grayLight}
                activeBackgroundColor={isDark ? DarkColors.bg : Colors.white}
                style={[styles.cardGrid, isDark && styles.cardGridDark, styleCard]}
                {...props}>
                {children}
            </TouchableBackground>
        </View>
    );
};

const CardGrid: ICardGridWide = ({type, onPress, icon, name, style}) => {
    const isDark = useDark();

    return (
        <View style={[{flex: 1, overflow: 'hidden', borderRadius: 8}, style]}>
            <TouchableBackground
                rippleColor={isDark ? DarkColors.border : Colors.grayLight}
                activeBackgroundColor={isDark ? DarkColors.bg : Colors.grayLight}
                onPress={onPress}
                style={[styles.simpleCardGridWrap, isDark && styles.simpleCardGridWrapDark]}>
                <View style={[styles.simpleCardGridIconWrap, isDark && styles.simpleCardGridIconWrapDark]}>
                    <Icon name={icon} size={20} color={ToolsIconColors[type]} />
                </View>
                <Text style={[styles.simpleCardGridText, isDark && styles.simpleCardGridTextDark]}>{name}</Text>
            </TouchableBackground>
        </View>
    );
};

const BlankCardGrid: React.FC = () => <View style={styles.blankCardGrid} />;

export default BaseCardGrid;
export {CardGrid, BlankCardGrid};
