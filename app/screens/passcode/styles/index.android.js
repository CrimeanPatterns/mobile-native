import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    pageWhite: {
        backgroundColor: Colors.white,
    },
    pageHeader: {
        width: '100%',
        height: 172,
        position: 'relative',
    },
    pageHeaderItem: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-end',
        paddingVertical: 16,
        paddingLeft: 72,
    },
    pageHeaderPane: {
        width: '100%',
    },
    pageTitle: {
        fontSize: 17,
        color: Colors.white,
        fontFamily: Fonts.bold,
        fontWeight: '500',
    },
    pageContent: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    page: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.blue,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
    },
    pageDark: {
        backgroundColor: DarkColors.bg,
    },
    improve: {
        flex: 1,
        paddingVertical: 75,
        paddingHorizontal: 35,
    },
    improveText: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
    },
    fingerprint: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    fingerprintBlock: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        minHeight: 50,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3974d4',
    },
    fingerprintBlockLocked: {
        backgroundColor: '#cb2f51',
    },
    fingerprintIcon: {
        marginRight: 10,
        color: Colors.white,
    },
    fingerprintWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: '90%',
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
        fontSize: 14,
        minHeight: 14,
        color: Colors.white,
        textAlign: 'center',
    },
    keycode: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        width: 240,
        marginVertical: 24,
    },
    keycodeInput: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 15,
        backgroundColor: '#a8c7fa',
    },
    keycodeInputDark: {
        backgroundColor: DarkColors.bgLight,
    },
    keycodeInputActive: {
        backgroundColor: Colors.white,
    },
    keycodeInputActiveDark: {
        backgroundColor: DarkColors.blue,
    },
    keyboard: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 36,
        width: 240,
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 64,
        borderRadius: 32,
        marginTop: 16,
        height: 64,
    },
    buttonDark: {
        borderColor: DarkColors.bgLight,
    },
    buttonNumber: {
        borderWidth: 1,
        borderColor: '#a8c7fa',
    },
    buttonActive: {
        backgroundColor: '#a8c7fa',
    },
    buttonRemoveActive: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: Fonts.regular,
        fontSize: 25,
        color: Colors.white,
    },
    buttonTextActive: {
        color: Colors.grayDark,
    },
    buttonTextSmall: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: '#a8c7fa',
    },
    backspace: {
        color: Colors.white,
    },
    textDark: {
        color: DarkColors.text,
    },
});
