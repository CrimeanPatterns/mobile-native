import React, {useMemo} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Skeleton from '../skeleton';
import {TouchableBackground} from '../touchable';
import styles from './styles';

type CardProps = {
    onPress: () => void;
    isActive?: boolean;
    disabled?: boolean;
    activeBackgroundColor?: string;
    rippleColor?: string;
    activeColor?: string;
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
};

type ICard = React.FunctionComponent<React.PropsWithChildren<CardProps>>;

const Card: ICard = ({
    onPress,
    isActive,
    disabled,
    activeBackgroundColor,
    rippleColor,
    activeColor,
    style: customStyles,
    containerStyle,
    children,
}) => {
    const isDark = useDark();
    const defaultColor = useMemo(() => {
        if (isDark) {
            return DarkColors.bgLight;
        }

        return isIOS ? Colors.gray : Colors.grayLight;
    }, [isDark]);

    return (
        <View style={[styles.containerCard, containerStyle && containerStyle]}>
            <TouchableBackground
                onPress={onPress}
                activeBackgroundColor={activeBackgroundColor || defaultColor}
                rippleColor={rippleColor || defaultColor}
                disabled={disabled}
                style={[
                    styles.card,
                    isDark && styles.cardDark,
                    isActive && styles.cardActive,
                    isActive && isDark && styles.cardActiveDark,
                    customStyles && customStyles,
                    isActive && activeColor && {backgroundColor: activeColor},
                ]}>
                {children}
            </TouchableBackground>
        </View>
    );
};

const DefaultLayoutSkeletonCard = {
    key: 'skeletonCard',
    width: 105,
    height: 60,
};

export type LayoutSkeletonCard = {
    key: string;
    width: number;
    height: number;
};

type SkeletonCardProps = {
    layout?: LayoutSkeletonCard;
};

type ISkeletonCard = React.FunctionComponent<SkeletonCardProps>;

const SkeletonCard: ISkeletonCard = ({layout = DefaultLayoutSkeletonCard}) => (
    <View style={[styles.containerCard]}>
        <Skeleton layout={[layout]} />
    </View>
);

export default Card;
export {SkeletonCard};
