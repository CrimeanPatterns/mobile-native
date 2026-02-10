import BottomSheet from '@gorhom/bottom-sheet';
import _ from 'lodash';
import React, {forwardRef, useCallback, useImperativeHandle, useRef} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {triggerHapticFeedback} from '../../../helpers/haptic';
import {CardCarousel} from '../carousel';

export const getScreenPercentage = (screenHeight: number, height: number) => `${parseInt(String((height * 100) / screenHeight), 10)}%`;

const BottomSheetSummary = forwardRef<BottomSheet>(({data, onScrollIndexChanged, renderItem}, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();
    const dimensions = useWindowDimensions();
    const snapPoints = [
        getScreenPercentage(dimensions.height, Math.max(80, 55 + insets.bottom)),
        getScreenPercentage(dimensions.height, Math.max(285, 250 + insets.bottom)),
        data.length === 1 ? '85%' : '75%',
    ];
    const onPageSelected = (position) => {
        triggerHapticFeedback('impactLight');

        return onScrollIndexChanged(position);
    };
    const renderContent = useCallback(() => {
        if (_.isEmpty(data)) {
            return null;
        }

        return (
            <View style={styles.content}>
                <CardCarousel onScrollIndexChanged={onPageSelected} data={data} renderItem={renderItem} />
            </View>
        );
    }, [data, onPageSelected, renderItem]);

    // @ts-ignore
    useImperativeHandle(ref, () => bottomSheetRef.current, []);

    if (data.length === 1) {
        return (
            <BottomSheet
                key={'bottom-sheet-empty'}
                snapPoints={['10%', '35%', '80%']}
                index={2}
                backgroundComponent={() => null}
                handleComponent={() => null}
                enableContentPanningGesture
                animateOnMount={true}>
                {renderContent()}
            </BottomSheet>
        );
    }

    return (
        <BottomSheet
            key={'bottom-sheet'}
            ref={bottomSheetRef}
            index={1}
            backgroundComponent={() => null}
            handleComponent={() => null}
            enableContentPanningGesture
            animateOnMount={true}
            snapPoints={snapPoints}>
            {renderContent()}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    content: {
        height: '100%',
        zIndex: 99,
    },
    container: {
        zIndex: 999,
        height: 400,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    page: {
        height: '100%',
    },
    inner: {
        marginHorizontal: 20,
        height: '100%',
    },
});

export {BottomSheetSummary};
