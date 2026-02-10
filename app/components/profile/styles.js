import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
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
    info: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingVertical: 15,
                paddingHorizontal: 15,
                marginTop: 5,
                borderBottomColor: '#bec2cc',
                borderBottomWidth: 2,
            },
            android: {
                marginTop: 30,
                paddingHorizontal: 16,
            },
        }),
    },
    infoDark: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    picture: {
        width: 64,
        height: 64,
    },
    avatar: {
        ...Platform.select({
            ios: {
                color: '#dee0e6',
            },
            android: {
                color: Colors.grayDarkLight,
            },
        }),
    },
    details: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                marginLeft: 20,
            },
            android: {
                marginLeft: 16,
            },
        }),
    },
    name: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 19,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    email: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 13,
                color: Colors.grayDarkLight,
            },
            android: {
                fontSize: 12,
                color: '#9e9e9e',
            },
        }),
    },
    accountLevel: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 11,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 11,
                color: '#9e9e9e',
            },
        }),
    },
    accountLevelWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
        marginLeft: 16,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    separatorHide: {
        marginLeft: 0,
    },
    badge: {
        backgroundColor: Colors.grayDarkLight,
        color: Colors.white,
        paddingHorizontal: 3,
        marginLeft: 3,
    },
    badgeDark: {
        backgroundColor: Colors.white,
        color: Colors.black,
    },
});

const footerStyle = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        backgroundColor: Colors.grayLight,
        paddingHorizontal: 15,
    },
    item: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    title: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 15,
        marginLeft: 15,
    },
    copyright: {
        backgroundColor: Platform.select({ios: Colors.grayLight, android: Colors.white}),
        height: 80,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
    },
    copyrightDark: {
        backgroundColor: DarkColors.bgLight,
    },
    copyrightText: {
        color: '#bec2cc',
        textAlign: 'center',
        fontSize: 12,
        fontFamily: Fonts.regular,
    },
    quickActions: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        flexDirection: 'row',
    },
    quickActionsDark: {
        backgroundColor: DarkColors.bgLight,
    },
    swipeButton: {
        width: 70,
        paddingHorizontal: 5,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    swipeButtonText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
});

const searchListStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerDark: {
        borderTopColor: DarkColors.bgLight,
        borderTopWidth: 1,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    row: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    rowDark: {
        borderBottomColor: DarkColors.border,
    },
    name: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.textGray,
    },
    group: {
        paddingTop: 3,
        fontSize: 12,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
});

export {styles, footerStyle, searchListStyles};
