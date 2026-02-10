import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    oauth: Platform.select({
        ios: {
            marginTop: 5,
            backgroundColor: Colors.white,
            borderColor: Colors.gray,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            marginVertical: 12,
            paddingLeft: 15,
        },
        android: {
            marginBottom: 5,
        },
    }),
    oauthDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    message: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingVertical: 8,
                borderColor: Colors.gray,
                borderBottomWidth: 1,
            },
            android: {
                paddingVertical: 22,
                paddingHorizontal: 16,
            },
        }),
    },
    borderDark: {
        ...Platform.select({
            ios: {
                borderColor: DarkColors.border,
            },
        }),
    },
    messageInfo: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        paddingLeft: isIOS ? 24 : 32,
        paddingRight: 15,
    },
    messageText: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                lineHeight: 17,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 12,
                lineHeight: 14,
                color: '#9e9e9e',
            },
        }),
    },
    messageBoldText: {
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontFamily: Fonts.bold,
                fontWeight: '500',
                fontSize: 15,
                lineHeight: 17,
            },
            android: {
                fontSize: 16,
                lineHeight: 18,
            },
        }),
    },
    textDark: {
        color: Colors.white,
    },
    iconContainer: {
        backgroundColor: Colors.white,
        width: 24,
        height: 24,
    },
    iconSuccess: {
        color: Colors.green,
    },
    iconSuccessDark: {
        color: DarkColors.green,
    },
    iconError: {
        color: Colors.red,
    },
    iconErrorDark: {
        color: DarkColors.red,
    },
    buttonWrap: {
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                paddingVertical: 20,
                paddingRight: 15,
            },
            android: {
                marginHorizontal: 16,
                paddingBottom: 30,
                borderColor: Colors.gray,
                borderBottomWidth: 1,
                justifyContent: 'center',
            },
        }),
    },
    button: {
        width: isIOS ? '100%' : 204,
        minHeight: 39,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isIOS ? Colors.blueDark : '#27557a',
    },
    buttonDark: {
        backgroundColor: isIOS ? DarkColors.blue : '#27557a',
    },
    authButton: {
        width: '100%',
        minHeight: 39,
        flexDirection: 'row',
        backgroundColor: isIOS ? Colors.blueDark : '#27557a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authButtonDark: {
        backgroundColor: isIOS ? DarkColors.blue : '#27557a',
    },
    buttonWide: {
        width: '100%',
        ...Platform.select({
            android: {
                width: 'auto',
                elevation: 2,
            },
        }),
    },
    buttonImage: {
        height: 39,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 11,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        textAlign: 'center',
    },
    //
    loading: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
    },
    loadingDark: {
        backgroundColor: Colors.black,
    },
    spinner: {
        top: 10,
        alignSelf: 'center',
    },

    // Capital One v2

    capitalOneButton: {
        flex: 1,
        width: '100%',
        minHeight: 40,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        paddingVertical: 16,
        paddingHorizontal: 10,
    },

    capitalOneButtonText: {
        alignSelf: 'center',
        fontSize: 20,
        fontFamily: 'Optimist-Normal',
    },
    capitalOneLabelContainer: {
        paddingTop: 15,
        paddingHorizontal: isIOS ? 15 : 16,
    },
    capitalOneLabel: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 13 : 12,
        lineHeight: 16,
        color: Colors.grayDark,
    },
    capitalOneLabelDark: {
        color: Colors.white,
    },
});
