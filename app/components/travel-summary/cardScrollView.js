import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CardScrollView = ({onScroll: _onScroll, children}) => {
    const [scrollPositionY, setScrollPositionY] = useState(null);
    const insets = useSafeAreaInsets();
    const onScroll = useCallback((event) => {
        const {
            contentOffset: {y},
        } = event.nativeEvent;

        setScrollPositionY(y);
    }, []);

    useEffect(() => {
        if (scrollPositionY === 0) {
            _onScroll();
        }
    }, [scrollPositionY, _onScroll]);

    return (
        <>
            <ScrollView
                onScrollBeginDrag={onScroll}
                scrollEventThrottle={1000}
                alwaysBounceVertical={false}
                contentInsetAdjustmentBehavior='automatic'>
                {children}
                <View style={{height: insets.bottom}} />
            </ScrollView>
        </>
    );
};

export {CardScrollView};
