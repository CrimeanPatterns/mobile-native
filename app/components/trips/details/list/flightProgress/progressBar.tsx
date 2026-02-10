import {useLayout} from '@react-native-community/hooks';
import _ from 'lodash';
import React, {useMemo, useRef} from 'react';
import {Text, View} from 'react-native';
import Animated, {Easing, useAnimatedStyle, withTiming} from 'react-native-reanimated';

import {useDark} from '../../../../../theme';
import Icon from '../../../../icon';
import styles from './styles';

type FlightProgressBarProps = {
    progress: number;
    updateFrequency: number;
    timeGone?: string;
    timeLeft?: string;
};

type IFlightProgressBar = React.FunctionComponent<FlightProgressBarProps>;

const iconSize = 24;

const FlightProgressBar: IFlightProgressBar = ({progress, updateFrequency, timeGone, timeLeft}) => {
    const isDark = useDark();
    const {onLayout, width} = useLayout();
    const bias = useMemo((): number => width * (progress / 100), [progress, width]);
    const initialBias = useRef(0);

    if (width > 0 && initialBias.current === 0) {
        initialBias.current = bias;
    }

    const animatedStyleView = useAnimatedStyle((): {width: number} => {
        if (bias > initialBias.current) {
            return {
                width: withTiming(bias, {
                    duration: updateFrequency * 1000,
                    easing: Easing.linear,
                }),
            };
        }

        return {
            width: initialBias.current,
        };
    }, [bias]);

    const animatedStyleIcon = useAnimatedStyle(() => {
        if (bias > initialBias.current) {
            return {
                left: withTiming(bias - iconSize * (progress / 100), {
                    duration: updateFrequency * 1000,
                    easing: Easing.linear,
                }),
            };
        }

        return {
            left: Math.max(initialBias.current - iconSize * (progress / 100), 0),
        };
    }, [bias]);

    return (
        <View style={[styles.bar, isDark && styles.barDark]} onLayout={onLayout}>
            <Animated.View style={[styles.barActive, isDark && styles.barActiveDark, animatedStyleView]} />
            <Animated.View style={[styles.planeContainer, animatedStyleIcon]}>
                <Icon name='airline' style={[styles.plane, isDark && styles.planeDark]} size={iconSize} />
            </Animated.View>
            {_.isString(timeGone) && (
                <View style={styles.timeGone}>
                    <View style={styles.time}>
                        <Text style={[styles.text, styles.textGreen, isDark && styles.textGreenDark]}>{timeGone}</Text>
                    </View>
                </View>
            )}
            {_.isString(timeLeft) && (
                <View style={styles.timeLeft}>
                    <View style={styles.time}>
                        <Text style={[styles.text, isDark && styles.textDark]}>{timeLeft}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default FlightProgressBar;
