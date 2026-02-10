import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
// eslint-disable-next-line import/default
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// @ts-ignore
import IconBackground from '../../../assets/images/background.svg';
// @ts-ignore
import IconBackgroundDark from '../../../assets/images/background-dark.svg';
import {AnimatedIcon} from '../../../components/icon';
import {isIOS, isTablet} from '../../../helpers/device';
import {getHeaderHeight} from '../../../helpers/header';
import {useKeyboardWillShown} from '../../../hooks/keyboard';
import {Colors} from '../../../styles';
import {ColorSchemeDark, useTheme} from '../../../theme';
import {styles} from './styles';

const constants = {
    headerHeight: isTablet ? 0.15 : 0.25,
    maxLogo: 35,
    minLogo: 25,
};

export default ({otcRequired, children}) => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const dimensions = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const BackgroundComponent = isDark ? IconBackgroundDark : IconBackground;
    const headerMaxHeight = dimensions.height * constants.headerHeight + insets.top;
    const headerMinHeight = isTablet ? headerMaxHeight : getHeaderHeight() + insets.top;
    const headerScrollDistance = headerMaxHeight - headerMinHeight;
    const isFocused = useIsFocused();
    const keyboardShown = useKeyboardWillShown();
    const scrollView = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollY.value = e.contentOffset.y;
        },
    });
    const height = useDerivedValue(() =>
        interpolate(
            scrollY.value,
            [-1 * headerScrollDistance, 0, headerScrollDistance],
            [headerMaxHeight + Math.abs(scrollY.value), headerMaxHeight, headerMinHeight],
        ),
    );
    const headerAnimatedLogoStyle = useAnimatedStyle(() => {
        const fontSize = interpolate(height.value, [headerMinHeight, headerMaxHeight], [constants.minLogo, constants.maxLogo]);

        return {
            fontSize: isTablet ? constants.maxLogo : fontSize,
        };
    });
    const headerAnimatedStyle = useAnimatedStyle(() => ({
        height: height.value,
    }));

    useEffect(() => {
        if (isIOS && !isTablet && isFocused) {
            if (keyboardShown) {
                scrollView.current?.scrollTo({y: Math.min(100, headerMaxHeight - headerMinHeight), animated: true});
            } else {
                scrollView.current?.scrollTo({y: 0, animated: true});
            }
        }
    }, [isFocused, keyboardShown, scrollView, headerMaxHeight, headerMinHeight]);

    return (
        <>
            <>
                <View
                    style={[
                        StyleSheet.absoluteFillObject,
                        {position: 'absolute', height: dimensions.height, left: 0, right: 0},
                        styles.page,
                        isDark && styles.pageDark,
                    ]}
                />
                <Animated.View style={styles.backgroundImage}>
                    <BackgroundComponent style={{flex: 1}} preserveAspectRatio='xMinYMin slice' />
                </Animated.View>
            </>
            <Animated.View
                style={[
                    styles.header,
                    {
                        paddingTop: insets.top,
                    },
                    headerAnimatedStyle,
                ]}>
                <Animated.View style={[styles.logo]}>
                    <AnimatedIcon name='logo-monotone' style={headerAnimatedLogoStyle} color={Colors.white} />
                </Animated.View>
            </Animated.View>
            <Animated.ScrollView
                ref={scrollView}
                alwaysBounceVertical={false}
                keyboardShouldPersistTaps={otcRequired ? 'always' : 'handled'}
                keyboardDismissMode='none'
                style={styles.flex1}
                contentContainerStyle={{paddingTop: isTablet ? headerMinHeight : headerMaxHeight}}
                scrollEventThrottle={16}
                onScroll={scrollHandler}>
                {children}
            </Animated.ScrollView>
        </>
    );
};
