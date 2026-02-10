import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
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
    chatUsers: {
        paddingBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        ...Platform.select({
            ios: {
                paddingHorizontal: 5,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    chatUsersItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 2,
        marginLeft: 12,
    },
    chatUsersOnline: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.green,
    },
    chatUsersOnlineDark: {
        backgroundColor: DarkColors.green,
    },
    chatUsersName: {
        fontSize: 14,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        marginLeft: 5,
    },
    chatUsersNameDark: {
        color: Colors.white,
    },
    footer: {
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                borderTopColor: Colors.gray,
                borderTopWidth: 1,
            },
            android: {
                backgroundColor: Colors.white,
                position: 'relative',
            },
        }),
    },
    footerDark: {
        borderTopColor: DarkColors.border,
        borderTopWidth: 1,
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    footerContainer: {
        paddingVertical: 5,
    },
    formContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                alignItems: 'center',
            },
            android: {
                paddingHorizontal: 16,
                alignItems: 'stretch',
            },
        }),
    },
    editContainer: {
        paddingLeft: 0,
    },
    clearButton: {
        width: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        maxHeight: 86,
        ...Platform.select({
            ios: {
                borderWidth: 1,
                borderColor: Colors.gray,
                height: 30,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 5,
            },
            android: {
                width: '100%',
                height: 44,
                backgroundColor: Colors.grayLight,
                paddingLeft: 16,
                paddingVertical: 8,
                marginBottom: 5,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
            },
        }),
    },
    inputDark: {
        borderColor: DarkColors.border,
        ...Platform.select({
            ios: {
                color: Colors.white,
                backgroundColor: DarkColors.bgLight,
            },
            android: {
                color: DarkColors.text,
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    send: {
        backgroundColor: Colors.grayLight,
        marginBottom: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    sendDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});
