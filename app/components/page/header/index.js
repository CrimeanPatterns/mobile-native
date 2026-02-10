import _ from 'lodash';
import React, {useCallback} from 'react';
import {Animated, Platform, StyleSheet, useWindowDimensions, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getDefaultNavigationOptions} from '../../../config/defaultHeader';
import {isIOS} from '../../../helpers/device';
import {useTheme} from '../../../theme';
import {useNavigationMainColor} from '../../../theme/navigator';
import Title from './title';

export const getDefaultHeaderHeight = (layout, statusBarHeight) => {
    const isLandscape = layout.width > layout.height;
    let headerHeight;

    if (Platform.OS === 'ios') {
        if (isLandscape && !Platform.isPad) {
            headerHeight = 32;
        } else {
            headerHeight = 44;
        }
    } else if (Platform.OS === 'android') {
        headerHeight = 56;
    } else {
        headerHeight = 64;
    }

    return headerHeight + statusBarHeight;
};

const Header = ({transparent = false, transparentHeaderColor = 'transparent', fullScreen = true, title, children, ...rest}) => {
    const theme = useTheme();
    const mainColor = useNavigationMainColor();
    const insets = useSafeAreaInsets();
    const dimensions = useWindowDimensions();
    const topInset = fullScreen ? insets.top : 0;
    const defaultHeight = getDefaultHeaderHeight(dimensions, topInset);

    const {headerStyle: baseHeaderStyle} = getDefaultNavigationOptions(theme);
    const {headerColor, headerStyle: customHeaderStyle, headerLeft, headerRight, headerTitleStyle, headerTitle} = rest;
    const headerStyle = {
        ...baseHeaderStyle,
        backgroundColor: headerColor || mainColor,
        ...customHeaderStyle,
        height: defaultHeight,
    };

    const transparentHeaderStyle = {
        ...headerStyle,
        backgroundColor: transparentHeaderColor,
        elevation: 0,
        zIndex: 100,
    };

    const renderHeaderLeft = useCallback(() => {
        if (_.isFunction(headerLeft)) {
            return headerLeft();
        }

        if (React.isValidElement(headerLeft)) {
            return headerLeft;
        }
        return null;
    }, [headerLeft]);

    const renderHeaderRight = useCallback(() => {
        if (_.isFunction(headerRight)) {
            return headerRight();
        }

        if (React.isValidElement(headerRight)) {
            return headerRight;
        }
        return null;
    }, [headerRight]);

    const renderTitle = useCallback(() => {
        // debugger;
        if (_.isString(title) && _.isFunction(headerTitle) === false) {
            return <Title title={title} style={headerTitleStyle} />;
        }

        if (_.isFunction(headerTitle)) {
            return headerTitle();
        }

        if (React.isValidElement(headerTitle)) {
            return headerTitle;
        }

        return null;
    }, [headerTitle, headerTitleStyle, title]);

    return (
        <Animated.View style={[styles.container, transparent && StyleSheet.absoluteFill, transparent ? transparentHeaderStyle : headerStyle]}>
            <View style={styles.appBar}>
                <View style={[StyleSheet.absoluteFill, styles.header, {top: topInset}]}>
                    <View style={styles.left}>{renderHeaderLeft()}</View>
                    <View style={[styles.title, _.isNil(headerLeft) && styles.titleWithoutLeftButton]}>{renderTitle()}</View>
                    {_.isNil(headerRight) === false && <View style={styles.right}>{renderHeaderRight()}</View>}
                </View>
            </View>
        </Animated.View>
    );
};

let platformContainerStyles;

if (Platform.OS === 'ios') {
    platformContainerStyles = {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#A7A7AA',
    };
} else {
    platformContainerStyles = {
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: StyleSheet.hairlineWidth,
        shadowOffset: {
            height: StyleSheet.hairlineWidth,
        },
        elevation: 4,
    };
}

const TITLE_OFFSET = isIOS ? 70 : 56;
const TITLE_OFFSET_WITHOUT_LEFT_BUTTON = isIOS ? 70 : 15;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        ...platformContainerStyles,
    },
    appBar: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
    },
    title: {
        bottom: 0,
        left: TITLE_OFFSET,
        right: TITLE_OFFSET,
        top: 0,
        position: 'absolute',
        alignItems: isIOS ? 'center' : 'flex-start',
        justifyContent: 'center',
    },
    titleWithoutLeftButton: {
        left: TITLE_OFFSET_WITHOUT_LEFT_BUTTON,
    },
    left: {
        left: 0,
        bottom: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        paddingLeft: isIOS ? 10 : 0,
    },
    right: {
        right: 0,
        bottom: 0,
        top: 0,
        position: 'absolute',
        justifyContent: 'center',
        paddingRight: isIOS ? 10 : 0,
    },
});

export default Header;
export {Header};
