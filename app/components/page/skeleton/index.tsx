import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';

type SkeletonProps = {
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    layout: {
        width: ViewStyle['width'];
        height: ViewStyle['height'];
        key: string;
        borderRadius?: number;
        [key: string]: unknown;
    }[];
};

export const Skeleton: React.FunctionComponent<React.PropsWithChildren<SkeletonProps>> = ({style, containerStyle: skeletonStyle, layout}) => {
    const isDark = useDark();
    const animationRef = useRef(new Animated.Value(0));
    const animationLoop = useRef<Animated.CompositeAnimation>();
    const backgroundColor = isDark ? DarkColors.bgLight : Colors.gray;
    const highlightColor = isDark ? DarkColors.border : Colors.white;
    const [layoutWidth, setLayoutWidth] = useState<number>(0);
    const [skeletonLayout] = layout;
    const {width, height, ...skeletonLayoutStyle} = skeletonLayout;

    useEffect(() => {
        animationLoop.current = Animated.timing(animationRef.current, {
            toValue: 2,
            delay: 400,
            duration: 1500,
            useNativeDriver: true,
        });
        animationRef.current.setValue(0);
        Animated.loop(animationLoop.current).start();
    }, []);

    return (
        <View
            accessible={false}
            onLayout={({nativeEvent}) => {
                setLayoutWidth(nativeEvent.layout.width);
            }}
            style={[
                styles.container,
                {
                    width: width,
                    height: height || 12,
                    backgroundColor,
                },
                style,
                skeletonLayoutStyle,
            ]}>
            <Animated.View
                style={[
                    styles.skeleton,
                    {
                        transform: [
                            {
                                translateX: animationRef.current.interpolate({
                                    inputRange: [0, 2],
                                    outputRange: [-layoutWidth * 2, layoutWidth * 2],
                                }),
                            },
                        ],
                    },
                    skeletonStyle,
                ]}>
                <LinearGradient
                    style={styles.skeleton}
                    colors={[backgroundColor, highlightColor, backgroundColor]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                />
            </Animated.View>
        </View>
    );
};

export default Skeleton;

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 2,
    },
    skeleton: {
        height: '100%',
    },
});
