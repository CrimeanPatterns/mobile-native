import {Header} from '@react-navigation/elements';
import _ from 'lodash';
import {Dimensions, StatusBar} from 'react-native';

import {navigationRef} from '../services/navigator';
import {isAndroid, isIOS, isTablet} from './device';

export const LANDSCAPE = 'landscape';
export const PORTRAIT = 'portrait';

export const getHeaderHeight = () => {
    const orientation = getOrientation();

    return getAppBarHeight(orientation === LANDSCAPE);
};

// This does not include the new bar area in the iPhone X, so I use this when I need a custom headerTitle component
export const getHeaderSafeAreaHeight = () => {
    const orientation = getOrientation();

    if (isIOS && orientation === LANDSCAPE && !isTablet) {
        return 32;
    }

    // @ts-ignore
    return Header.HEIGHT;
};

export const getOrientation = () => {
    const {width, height} = Dimensions.get('window');

    return width > height ? LANDSCAPE : PORTRAIT;
};

export const getAppBarHeight = (isLandscape) => {
    if (isIOS) {
        return isLandscape && !isTablet ? 32 : 44;
    }

    // @ts-ignore
    return StatusBar.currentHeight + 56;
};

export const getMainColor = (defaultColor: string, isDark: boolean): string => {
    if (navigationRef.isReady()) {
        const options = navigationRef.getCurrentOptions();

        if (_.isUndefined(options) === false) {
            if (isAndroid) {
                // @ts-ignore
                if (_.isUndefined(options.mainColorDark) === false) {
                    // @ts-ignore
                    return isDark ? options.mainColorDark : options.mainColorLight;
                }

                // @ts-ignore
                if (_.isUndefined(options.tabBarColor) === false) {
                    if (isDark) {
                        // @ts-ignore
                        return options.tabBarActiveTintColor;
                    }
                    // @ts-ignore
                    return options.tabBarColor;
                }
            }

            // @ts-ignore
            return options?.headerStyle?.backgroundColor ?? defaultColor;
        }
    }
    return defaultColor;
};
