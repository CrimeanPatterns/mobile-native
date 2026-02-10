import {useScrollHandler} from '@components/ui/scrollView/hooks/useScrollHandler';
import React, {forwardRef, useImperativeHandle} from 'react';
import {NativeScrollEvent, ScrollViewProps} from 'react-native';
import Animated, {useAnimatedRef} from 'react-native-reanimated';

import {ScrollViewHandlerProvider} from './context';

type AnimatedScrollViewProps = React.PropsWithChildren<
    {
        onScroll: ({nativeEvent}: {nativeEvent: NativeScrollEvent}) => void;
    } & Omit<ScrollViewProps, 'onScroll'>
>;

export const AnimatedScrollView = forwardRef<Animated.ScrollView, AnimatedScrollViewProps>(({children, onScroll, ...props}, ref) => {
    const scrollableRef = useAnimatedRef<Animated.ScrollView>();
    const {lastContentOffset, isScrolling, scrollHandler} = useScrollHandler(onScroll);

    useImperativeHandle(ref, () => scrollableRef.current!);

    return (
        <ScrollViewHandlerProvider
            value={{
                isScrolling,
                lastContentOffset,
            }}>
            <Animated.ScrollView ref={scrollableRef} onScroll={scrollHandler} {...props}>
                {children}
            </Animated.ScrollView>
        </ScrollViewHandlerProvider>
    );
});

export type AnimatedScrollView = typeof Animated.ScrollView;
