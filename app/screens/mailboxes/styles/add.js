import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.bgGray,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    relative: {position: 'relative'},
    absolute: {position: 'absolute'},
    container: {
        paddingVertical: 20,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
                backgroundColor: Colors.grayLight,
            },
        }),
    },
    containerDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    buttonsWrap: {
        paddingTop: 20,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
                paddingTop: 25,
            },
        }),
    },
    buttonContainer: {
        marginVertical: 15,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        lineHeight: 16,
        color: Colors.grayDark,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    or: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingVertical: 24,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    orSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.gray,
    },
    orSeparatorDark: {
        backgroundColor: DarkColors.border,
    },
    orText: {
        paddingHorizontal: 15,
        ...Platform.select({
            ios: {
                marginTop: -6,
                lineHeight: 12,
                backgroundColor: Colors.bgGray,
            },
            android: {
                marginTop: -8,
                fontSize: 16,
                lineHeight: 16,
                backgroundColor: Colors.white,
            },
        }),
    },
    orTextDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
                color: Colors.white,
            },
            android: {
                backgroundColor: DarkColors.bg,
                color: DarkColors.text,
            },
        }),
    },
});

export default styles;
