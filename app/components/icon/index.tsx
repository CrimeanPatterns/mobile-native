import MaskedView from '@react-native-masked-view/masked-view';
import _ from 'lodash';
import React, {forwardRef, PropsWithChildren} from 'react';
import {LayoutChangeEvent, StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import LinearGradient, {LinearGradientProps} from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';

import Aircrafts from '../../assets/aircrafts';
import Icons from '../../assets/icons';
import {useDark} from '../../theme';
import styles from './styles';

type IconProps = {
    key?: string;
    ref?: React.Ref<Text>;
    name: keyof typeof Icons | keyof typeof Aircrafts;
    size?: number;
    style?: StyleProp<TextStyle>;
    color?: string;
    colorDark?: string;
    type?: string;
    onLayout?: (event: LayoutChangeEvent) => void;
};

type IIcon = React.FunctionComponent<PropsWithChildren<IconProps>>;

const Icon: IIcon = forwardRef(({name, size = 24, color, colorDark, type, style, children, onLayout = _.noop}, ref) => {
    const isDark = useDark();

    return (
        <Text
            ref={ref}
            allowFontScaling={false}
            style={[
                styles[type || 'icon'],
                {color: isDark ? colorDark || color : color},
                {fontSize: size, lineHeight: size},
                StyleSheet.flatten(style),
            ]}
            onLayout={onLayout}>
            {!type && Icons[name]}
            {type === 'aircraft' && Aircrafts[name]}
            {children}
        </Text>
    );
});

const AnimatedIcon: IIcon = ({name, size = 24, color, colorDark, type, style, children, onLayout = _.noop}) => {
    const isDark = useDark();

    return (
        <Animated.Text
            style={[styles[type || 'icon'], _.isString(color) && {color: isDark ? colorDark || color : color}, {fontSize: size}, style]}
            onLayout={onLayout}>
            {!type && Icons[name]}
            {type === 'aircraft' && Aircrafts[name]}
            {children}
        </Animated.Text>
    );
};

type GradientIconProps = LinearGradientProps & IconProps;

type IGradientIcon = React.FunctionComponent<GradientIconProps>;

const GradientIcon: IGradientIcon = ({name, size, colors, start, end, locations, useAngle, angleCenter, angle, style}) => (
    <MaskedView maskElement={<Icon name={name} size={size} color='black' />} style={style}>
        <LinearGradient colors={colors} start={start} end={end} locations={locations} useAngle={useAngle} angleCenter={angleCenter} angle={angle}>
            <Icon name={name} size={size} style={styles.gradientIcon} />
        </LinearGradient>
    </MaskedView>
);

export default Icon;
export {AnimatedIcon, GradientIcon};
