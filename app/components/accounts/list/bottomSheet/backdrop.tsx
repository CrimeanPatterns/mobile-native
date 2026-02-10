import {TouchableOpacity} from '@components/page/touchable';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {Colors} from '@styles/index';
import {useColorTheme, useDark} from '@theme/use-theme';
import React, {useMemo} from 'react';
import Animated, {Extrapolation, interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {isIOS} from '../../../../helpers/device';

type BackdropProps = {
    onPress: () => void;
};

export const Backdrop: React.FC<BottomSheetBackdropProps & BackdropProps> = ({animatedIndex, style, onPress}) => {
    const isDark = useDark();
    const selectColor = useColorTheme();
    const opacity = isDark ? 0.8 : isIOS ? 0.3 : 0.2;
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [-1, 0], [0, opacity], Extrapolation.CLAMP),
    }));

    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: isIOS ? selectColor(Colors.grayDark, Colors.black) : Colors.black,
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle],
    );

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress} style={style}>
            <Animated.View style={containerStyle} />
        </TouchableOpacity>
    );
};
