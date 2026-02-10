import React from 'react';
import {View} from 'react-native';

interface IScrollViewBackgroundLayer {
    topBounceColor?: string;
    bottomBounceColor?: string;
}

export function ScrollViewBackgroundLayer({topBounceColor, bottomBounceColor}: IScrollViewBackgroundLayer) {
    return (
        <View
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1, // appear under the scrollview
            }}>
            <View style={{flex: 1, backgroundColor: topBounceColor || 'transparent'}} />
            <View style={{flex: 1, backgroundColor: bottomBounceColor || 'transparent'}} />
        </View>
    );
}
