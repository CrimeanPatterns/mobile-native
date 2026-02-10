import React, {PropsWithChildren, useCallback, useRef} from 'react';
import {I18nManager, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import {Colors} from '../../../styles';
import {useDark} from '../../../theme';

type AppleStyleSwipeableRowProps = {
    maxSwipeDistance: number;
    renderQuickActions: (close?: () => void) => React.ReactNode | null;
};

type IAppleStyleSwipeableRow = React.FunctionComponent<PropsWithChildren<AppleStyleSwipeableRowProps>>;

const AppleStyleSwipeableRow: IAppleStyleSwipeableRow = ({maxSwipeDistance, renderQuickActions, children}) => {
    const isDark = useDark();
    const swipeableRowRef = useRef<Swipeable>(null);
    const close = useCallback(() => {
        // @ts-ignore
        swipeableRowRef.current?.close();
    }, []);
    const renderRightActions = useCallback(() => {
        const slideoutView = renderQuickActions(close);

        if (!slideoutView) {
            return null;
        }

        return <View style={{width: maxSwipeDistance, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'}}>{slideoutView}</View>;
    }, [close, maxSwipeDistance, renderQuickActions]);

    return (
        <Swipeable
            ref={swipeableRowRef}
            friction={1}
            leftThreshold={10}
            rightThreshold={10}
            renderRightActions={renderRightActions}
            childrenContainerStyle={{backgroundColor: isDark ? Colors.black : Colors.white}}>
            {children}
        </Swipeable>
    );
};

export {AppleStyleSwipeableRow};
