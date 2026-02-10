import React from 'react';
import {Platform, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';

export const Separator = () => {
    const isDark = useDark();
    const borderColor = Platform.select({
        ios: isDark ? DarkColors.border : Colors.graySoft,
        android: isDark ? DarkColors.bg : Colors.gray,
    });

    if (isIOS) {
        return <View style={{height: 1, backgroundColor: borderColor}} />;
    }

    return <View style={{height: 5, marginTop: 20, backgroundColor: borderColor}} />;
};
