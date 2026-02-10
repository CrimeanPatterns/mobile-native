import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: Platform.select({
        ios: {
            backgroundColor: Colors.black,
        },
        android: {
            backgroundColor: DarkColors.bg,
        },
    }),
    header: {
        paddingTop: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 2,
        borderBottomColor: isIOS ? Colors.grayDarkLight : Colors.gray,
    },
    headerDark: {
        borderBottomColor: DarkColors.border,
    },
    footer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    footerDark: {
        borderTopColor: DarkColors.border,
    },
    textDark: {
        fontFamily: Fonts.regular,
        color: isIOS ? Colors.white : DarkColors.text,
    },
    title: {
        marginTop: 20,
        marginBottom: 5,
        fontSize: 24,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    message: {
        marginTop: 20,
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    buttonDark: {
        borderColor: DarkColors.border,
    },
    buttonText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        marginLeft: 10,
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    customButton: {
        height: 50,
    },
});
