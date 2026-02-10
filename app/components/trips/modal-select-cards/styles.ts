import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    list: {
        backgroundColor: Colors.bgGray,
    },
    listDark: {
        backgroundColor: DarkColors.bg,
    },
    header: {
        marginTop: 30,
        marginHorizontal: 15,
        marginBottom: 15,
    },
    headerAndroid: {
        backgroundColor: Colors.grayLight,
    },
    headerAndroidDark: {
        backgroundColor: DarkColors.bgLight,
    },
    scrollViewWrap: {
        backgroundColor: isIOS ? Colors.bgGray : Colors.grayLight,
    },
    scrollViewWrapDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    autoDetectWrap: {
        flexDirection: 'row',
        marginHorizontal: 15,
        paddingVertical: 9,
        marginBottom: 10,
        backgroundColor: Colors.white,
        borderRadius: 6,
        alignItems: 'center',
    },
    autoDetectWrapDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
    autoDetectText: {
        fontSize: isIOS ? 13 : 12,
        lineHeight: isIOS ? 18 : 15,
        flex: 1,
        fontFamily: Fonts.regular,
        color: isIOS ? Colors.grayDark : Colors.textGray,
    },
    autoDetectTextDark: {
        color: Colors.white,
    },
    switchWrap: {
        width: 40,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    awLogo: {
        width: 26,
        height: 26,
        marginHorizontal: 14,
    },
    label: {
        flex: 1,
        justifyContent: 'center',
        marginVertical: 15,
    },
    footer: {
        height: isIOS ? 50 : 0,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },

    row: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        minHeight: 65,
        backgroundColor: Colors.white,
    },
    rewDark: {
        backgroundColor: DarkColors.bg,
    },
    checkbox: {
        justifyContent: 'center',
        marginRight: 15,
    },
    image: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        marginRight: 15,
    },
    spinnerDark: {
        color: DarkColors.grayDark,
    },
    iconCard: {
        width: 63,
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textDark: {
        color: Colors.white,
    },
});
