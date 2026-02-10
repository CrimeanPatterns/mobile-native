import {StyleSheet} from 'react-native';

import {isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    textDark: {
        color: Colors.white,
    },
    pageWhite: {
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isTablet ? DarkColors.bgLight : Colors.black,
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: '100%',
        backgroundColor: Colors.grayLight,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    pageTitle: {
        fontSize: 17,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontWeight: 'normal',
    },
    pageContent: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    pageButtonContainer: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9fa',
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    page: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    improve: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 40,
    },
    improveText: {
        fontSize: 17,
        lineHeight: 26,
        fontFamily: Fonts.regular,
        color: '#8a8f99',
    },
    pincodeTop: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pincodeText: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        minHeight: 15,
        color: Colors.grayDark,
    },
    keycode: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        width: 250,
        marginVertical: 20,
    },
    keycodeInput: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 15,
        backgroundColor: Colors.gray,
    },
    keycodeInputActive: {
        backgroundColor: Colors.grayDark,
    },
    keycodeInputActiveDark: {
        backgroundColor: DarkColors.blue,
    },
    keyboard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 36,
        width: 250,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 66,
        borderRadius: 33,
        marginTop: 10,
        height: 66,
    },
    buttonDark: {
        borderColor: DarkColors.border,
    },
    buttonNumber: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    buttonActive: {
        backgroundColor: Colors.gray,
    },
    buttonActiveDark: {
        backgroundColor: DarkColors.bg,
    },
    buttonRemoveActive: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: Fonts.regular,
        fontSize: 25,
        color: Colors.grayDark,
    },
    buttonTextActive: {
        color: Colors.grayDark,
    },
    buttonTextSmall: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: '#b3c2cc',
    },
    backspace: {
        color: '#b3c2cc',
    },
});
