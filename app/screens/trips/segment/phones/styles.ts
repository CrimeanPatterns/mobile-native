import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                paddingVertical: 20,
                paddingRight: 15,
            },
            android: {
                paddingRight: 16,
                paddingVertical: 22,
                marginBottom: 8,
            },
        }),
    },
    topDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    icon: {
        ...Platform.select({
            ios: {
                marginRight: 10,
                marginLeft: 15,
            },
            android: {
                width: 70,
                paddingLeft: 16,
            },
        }),
    },
    topDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    topTag: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 17,
                color: '#8e9199',
            },
            android: {
                fontSize: 20,
                color: Colors.grayDark,
            },
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                marginHorizontal: 8,
                marginBottom: 8,
                backgroundColor: Colors.white,
                elevation: 5,
                paddingHorizontal: 16,
                paddingVertical: 10,
            },
        }),
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    containerTitle: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    caption: {
        color: Colors.grayDark,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: isIOS ? 13 : 16,
    },
    country: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 13,
                color: Colors.blue,
            },
            android: {
                fontSize: 12,
                color: '#9e9e9e',
            },
        }),
    },
    phoneContainer: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    phone: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 18 : 20,
    },
    button: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                height: 45,
                padding: 10,
                backgroundColor: Colors.blueDark,
            },
            android: {
                height: 36,
                paddingHorizontal: 12,
                borderRadius: 2,
                elevation: 2,
                backgroundColor: Colors.green,
            },
        }),
    },
    buttonDark: {
        backgroundColor: isIOS ? DarkColors.blue : DarkColors.green,
    },
    buttonText: {
        color: Colors.white,
        marginLeft: 10,
        ...Platform.select({
            ios: {
                fontSize: 13,
                fontFamily: Fonts.regular,
            },
            android: {
                fontSize: 14,
                fontFamily: Fonts.bold,
                fontWeight: '500',
            },
        }),
    },
    buttonTextDark: {
        ...Platform.select({
            android: {
                color: Colors.black,
            },
        }),
    },
});
