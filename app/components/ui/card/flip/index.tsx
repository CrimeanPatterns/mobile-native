import {GestureFlipViewProvider} from '@components/ui/card/flip/context';
import _ from 'lodash';
import React, {ForwardedRef, forwardRef, useImperativeHandle} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {interpolate, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring} from 'react-native-reanimated';

type GestureFlipViewProps = React.PropsWithChildren<{width: number; height: number; onFlip: (cardFace: number) => void}>;

export type GestureFlipView = {
    flipLeft: () => void;
    flipRight: () => void;
};

export const GestureFlipView = forwardRef((props: GestureFlipViewProps, ref: ForwardedRef<GestureFlipView>) => {
    const {children, width, height, onFlip} = props;
    const cardFace = useSharedValue(0); // index between [0, 1]
    const posX = useSharedValue(0);
    const startTouchX = useSharedValue(0);
    const startCardPos = useSharedValue(0);
    const rotateYFront = useSharedValue(0);
    const rotateYBack = useSharedValue(0);
    const velocity = useSharedValue(0);
    const time = useSharedValue(0);
    const gesture = Gesture.Pan()
        .onBegin((event) => {
            startTouchX.value = event.x;
            startCardPos.value = posX.value;
        })
        .onUpdate((event) => {
            const x = (event.x - startTouchX.value) / width + startCardPos.value;

            velocity.value = ((x - posX.value) * width) / (Date.now() - time.value);
            time.value = Date.now();
            posX.value = x;
        })
        .onFinalize((event) => {
            let value = Math.round(posX.value);
            const swipeDirection = event.x - startTouchX.value; // negative is right, positive is left
            const snappingDirection = value - posX.value;
            // it was a successful swipe if the snapping direction and the swipe direction are the same
            const wasSuccessful = (snappingDirection > 0 && swipeDirection > 0) || (snappingDirection < 0 && swipeDirection < 0);

            if (!wasSuccessful) {
                // check if the velocity is enough to go to the next card
                if (Math.abs(velocity.value) > 0.5) {
                    value = Math.round(posX.value + Math.sign(velocity.value));
                }
            }

            cardFace.value = Math.abs(value) % 2;
            startCardPos.value = value;
            startTouchX.value = 0;
            posX.value = withSpring(value);
            time.value = Date.now();
            velocity.value = 0;
        });
    const flip = (direction = 1) => {
        const value = posX.value + direction;

        posX.value = withSpring(value);
        cardFace.value = Math.abs(value) % 2;
    };

    const frontStyle = useAnimatedStyle(
        () => ({
            transform: [{perspective: 2000}, {rotateY: `${rotateYFront.value}deg`}],
        }),
        [],
    );

    const backStyle = useAnimatedStyle(
        () => ({
            transform: [{perspective: 2000}, {rotateY: `${rotateYBack.value}deg`}],
        }),
        [],
    );

    useAnimatedReaction(
        () => cardFace.value,
        () => {
            runOnJS(onFlip)(cardFace.value);
        },
    );

    useAnimatedReaction(
        () => posX.value,
        (value, previous) => {
            if (value !== previous) {
                rotateYFront.value = interpolate(value, [0, 0.5], [0, 90]);
                rotateYBack.value = interpolate(value, [0, -0.5], [-180, -270]);
            }
        },
    );

    useImperativeHandle(ref, () => ({
        flipLeft: () => flip(),
        flipRight: () => flip(-1),
    }));

    if (_.isArray(children)) {
        return (
            <GestureFlipViewProvider
                value={{
                    cardFace,
                    flipValue: posX,
                    startValue: startCardPos,
                    width,
                    height,
                }}>
                <GestureDetector gesture={gesture}>
                    <View style={{flex: 1}}>
                        {/* Front */}
                        <Animated.View
                            pointerEvents={cardFace.value === 0 ? 'auto' : 'none'}
                            style={[
                                {
                                    backfaceVisibility: children.length === 1 ? 'visible' : 'hidden',
                                },
                                frontStyle,
                            ]}>
                            {children[0]}
                        </Animated.View>
                        {/* Back */}
                        {_.isNil(children[1]) === false && (
                            <Animated.View
                                pointerEvents={cardFace.value === 1 ? 'auto' : 'none'}
                                style={[
                                    {
                                        backfaceVisibility: 'hidden',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                    },
                                    backStyle,
                                ]}>
                                {children[1]}
                            </Animated.View>
                        )}
                    </View>
                </GestureDetector>
            </GestureFlipViewProvider>
        );
    }
    return null;
});
