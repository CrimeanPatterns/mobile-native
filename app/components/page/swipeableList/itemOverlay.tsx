import React from 'react';
import {runOnJS, useDerivedValue} from 'react-native-reanimated';
import {useSwipeableItemParams} from 'react-native-swipeable-item';

export const SwipeableListItemOverlay: React.FunctionComponent<{index: number; onSwipeBegin: (index: number) => void}> = ({
    index,
    onSwipeBegin: _onSwipeBegin,
}) => {
    const swipeableItemParams = useSwipeableItemParams();

    useDerivedValue(() => {
        // @ts-ignore
        if (swipeableItemParams.isGestureActive.value && swipeableItemParams.percentOpenLeft.value === 0) {
            runOnJS(_onSwipeBegin)(index);
        }

        // @ts-ignore
    }, [swipeableItemParams.isGestureActive.value, swipeableItemParams.percentOpenLeft.value]);
    return null;
};
