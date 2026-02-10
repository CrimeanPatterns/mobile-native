import {ScrollViewHandlerContext} from '@components/ui/scrollView/context';
import {useContext} from 'react';
import {NativeScrollEvent} from 'react-native';
import {runOnJS, useAnimatedScrollHandler, useSharedValue} from 'react-native-reanimated';

export const useScrollHandler = (onScroll: ({nativeEvent}: {nativeEvent: NativeScrollEvent}) => void) => {
    const lastContentOffset = useSharedValue(0);
    const isScrolling = useSharedValue(false);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (onScroll) {
                runOnJS(onScroll)({nativeEvent: event});
            }
            lastContentOffset.value = event.contentOffset.y;
        },
        onBeginDrag: () => {
            isScrolling.value = true;
        },
        onEndDrag: () => {
            isScrolling.value = false;
        },
    });

    return {
        lastContentOffset,
        isScrolling,
        scrollHandler,
    };
};

export const useScrollEvent = () => {
    const context = useContext(ScrollViewHandlerContext);

    if (context === null) {
        throw "'useScrollEvent' cannot be used out of the ScrollViewHandlerContext!";
    }

    return context;
};
