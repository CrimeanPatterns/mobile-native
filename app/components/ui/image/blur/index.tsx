import {useDark} from '@theme/use-theme';
import React from 'react';
import {Image, ImageResizeMode, ImageSourcePropType, ImageURISource, Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {AnimatedStyle} from 'react-native-reanimated';

export const ImageBlurShadow: React.FunctionComponent<{
    style?: StyleProp<ViewStyle>;
    animatedShadowStyle?: AnimatedStyle<ViewStyle>;
    imageFadeDuration?: number;
    shadowFadeDuration?: number;
    source: ImageSourcePropType;
    imageWidth: number;
    imageHeight: number;
    shadowOffset: number;
    imageResizeMode?: ImageResizeMode;
    imageBorderRadius?: number;
    imageBorderTopLeftRadius?: number;
    imageBorderTopRightRadius?: number;
    imageBorderBottomLeftRadius?: number;
    imageBorderBottomRightRadius?: number;
    defaultProps?: ImageURISource | number;
    shadowBlurRadius?: number;
    shadowBackgroundColor: string;
}> = (props) => {
    const isDark = useDark();

    const {
        source,
        shadowBlurRadius,
        shadowFadeDuration,
        imageFadeDuration,
        defaultProps,
        imageBorderTopRightRadius,
        imageHeight,
        style,
        animatedShadowStyle,
        shadowOffset,
        imageBorderRadius,
        shadowBackgroundColor,
        imageBorderBottomLeftRadius,
        imageBorderTopLeftRadius,
        imageResizeMode,
        imageWidth,
        imageBorderBottomRightRadius,
    } = props;

    return (
        <View style={style}>
            <Image
                {...props}
                source={source}
                fadeDuration={imageFadeDuration}
                style={[
                    {
                        width: imageWidth,
                        height: imageHeight,
                        marginBottom: shadowOffset,
                        // marginTop: shadowOffset,
                        resizeMode: imageResizeMode,
                        borderRadius: imageBorderRadius,
                        borderTopLeftRadius: imageBorderTopLeftRadius,
                        borderTopRightRadius: imageBorderTopRightRadius,
                        borderBottomLeftRadius: imageBorderBottomLeftRadius,
                        borderBottomRightRadius: imageBorderBottomRightRadius,
                    },
                    styles.image,
                ]}
            />
            <Animated.View style={[{width: imageWidth}, styles.shadow_container]}>
                <Image
                    source={source}
                    defaultSource={defaultProps}
                    fadeDuration={shadowFadeDuration}
                    style={{
                        resizeMode: 'cover',
                        width: imageWidth,
                        height: imageHeight,
                    }}
                    blurRadius={shadowBlurRadius}
                />
                <Image
                    resizeMethod='auto'
                    source={isDark ? require('../../../../assets/blur--dark.png') : require('../../../../assets/blur.png')}
                    tintColor={shadowBackgroundColor}
                    style={{
                        width: '100%',
                        aspectRatio: imageWidth / imageHeight,
                        resizeMode: 'cover',
                        position: 'absolute',
                        height: Platform.OS === 'web' ? '55%' : undefined,
                        bottom: 0,
                        left: 0,
                    }}
                />
                <Animated.View style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, animatedShadowStyle]} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        zIndex: 1,
    },
    shadow_container: {
        position: 'absolute',
        bottom: 0,
        zIndex: 0,
    },
});

ImageBlurShadow.defaultProps = {
    imageWidth: 200,
    imageHeight: 200,
    shadowOffset: 44,
    shadowBlurRadius: 18,
    shadowBackgroundColor: '#ffffff',
};
