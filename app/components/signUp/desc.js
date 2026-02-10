import React, {useCallback} from 'react';
import {Platform, StyleSheet} from 'react-native';
import HTML from 'react-native-render-html';

import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme} from '../../theme';

const Desc = React.memo(({value, forwardRef}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';

    const onLinkPress = useCallback((evt, href) => {
        handleOpenUrl({url: href});
    }, []);

    return (
        <HTML
            ref={forwardRef}
            containerStyle={[styles.container, isDark && styles.containerDark]}
            tagsStyles={{
                a: {
                    color: !isDark ? Colors.blue : DarkColors.blue,
                    textDecorationLine: 'none',
                    ...Platform.select({
                        ios: {
                            fontFamily: Fonts.bold,
                            fontWeight: '500',
                        },
                        android: {
                            fontFamily: Fonts.regular,
                        },
                    }),
                },
                rawtext: {
                    color: Platform.select({
                        ios: isDark ? Colors.white : Colors.grayDark,
                        android: isDark ? DarkColors.text : Colors.grayDark,
                    }),
                },
            }}
            baseFontStyle={baseFontStyle}
            defaultTextProps={{
                selectable: false,
            }}
            source={{html: value}}
            onLinkPress={onLinkPress}
        />
    );
});

const baseFontStyle = {
    fontSize: Platform.select({ios: 12, android: 13}),
    fontFamily: Fonts.regular,
};

const styles = StyleSheet.create({
    container: Platform.select({
        ios: {
            backgroundColor: Colors.white,
            borderTopWidth: 1,
            borderTopColor: Colors.gray,
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
            paddingHorizontal: 15,
            paddingVertical: 12,
            marginVertical: 12,
        },
        android: {
            paddingHorizontal: 16,
            marginVertical: 20,
        },
    }),
    containerDark: {
        backgroundColor: Colors.black,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
        borderTopColor: DarkColors.border,
        borderBottomColor: DarkColors.border,
    },
});

export default React.forwardRef((props, forwardRef) => <Desc {...props} forwardRef={forwardRef} />);
