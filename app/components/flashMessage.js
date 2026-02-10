import {HeaderHeightContext} from '@react-navigation/elements';
import React, {useEffect, useRef} from 'react';
import RNFlashMessage from 'react-native-flash-message';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {isAndroid} from '../helpers/device';
import {ThemeColors, useTheme} from '../theme';

const FlashMessage = React.memo(() => {
    const theme = useTheme();
    const flashMessageRef = useRef(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        RNFlashMessage.setColorTheme({
            danger: ThemeColors[theme].red,
            success: ThemeColors[theme].green,
            warning: ThemeColors[theme].orange,
            info: ThemeColors[theme].blue,
        });
    }, [theme]);

    return (
        <HeaderHeightContext.Consumer>
            {(headerHeight) => (
                <RNFlashMessage
                    ref={flashMessageRef}
                    autoHide
                    hideStatusBar={false}
                    style={[isAndroid && {height: headerHeight, justifyContent: 'center'}]}
                    duration={3000}
                    statusBarHeight={insets.top}
                    position='top'
                />
            )}
        </HeaderHeightContext.Consumer>
    );
});

FlashMessage.displayName = 'FlashMessage';

export {FlashMessage};
