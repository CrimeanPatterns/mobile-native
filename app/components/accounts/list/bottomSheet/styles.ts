import {Colors, DarkColors} from '@styles/index';
import fromColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';

export default StyleSheet.create({
    accountCounterWrap: {
        flex: 1,
        paddingHorizontal: 21,
        paddingTop: 19,
        paddingBottom: 12,
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 8,
        shadowColor: fromColor(Colors.grayDark).alpha(0.05).rgb().toString(),
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
    },
    accountCounterWrapDark: {
        backgroundColor: DarkColors.bgLight,
        shadowOpacity: 0,
    },
    largeText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.grayDark,
    },
    middleText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 18,
        color: fromColor(Colors.grayDark).alpha(0.5).rgb().toString(),
    },
    blueButtonText: {
        color: Colors.white,
        fontWeight: isIOS ? '500' : '600',
    },
    whiteText: {
        color: Colors.white,
    },
    whiteOpacityText: {
        color: fromColor(Colors.white).alpha(0.5).rgb().toString(),
    },
    textGray: {
        color: fromColor(Colors.textGray).alpha(0.5).rgb().toString(),
        fontWeight: '600',
    },
    progressWrap: {
        marginBottom: 14,
    },
    awLogoWrap: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 12,
        right: 12,
        width: 76,
        height: 76,
        borderRadius: 76,
        backgroundColor: Colors.grayLight,
    },
    awLogoWrapDark: {
        backgroundColor: Colors.white,
    },
    awLogo: {
        alignSelf: 'center',
        width: 50,
    },
    smallText: {
        fontSize: 13,
        lineHeight: 18,
        color: fromColor(Colors.grayDark).alpha(0.5).rgb().toString(),
        textAlign: 'center',
    },
    counterWrap: {
        flexDirection: 'row',
        marginBottom: 32,
    },
    outdatedUpdateButtonWrap: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: Colors.blue,
        borderRadius: 8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    outdatedUpdateButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outdatedUpdateButtonWrapDark: {
        borderColor: DarkColors.blue,
    },
    outdatedUpdateButtonText: {
        fontSize: 14,
        lineHeight: 18,
        color: Colors.blue,
        fontWeight: isIOS ? '500' : '600',
    },
    outdatedUpdateButtonTextDark: {
        color: Colors.white,
    },
    buttonWrap: {
        width: '100%',
        height: 50,
        marginBottom: 8,
        borderRadius: 6,
        overflow: 'hidden',
    },
    blueButton: {
        flex: 1,
        backgroundColor: isIOS ? Colors.deepBlue : Colors.blueDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    blueButtonDark: {
        backgroundColor: DarkColors.blue,
    },
    cancelButton: {
        marginTop: 2,
        paddingVertical: 16,
        paddingHorizontal: 10,
    },
    bottomSheetHandle: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: Colors.grayLight,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    bottomSheetHandleDark: {
        backgroundColor: DarkColors.bg,
    },
    bottomSheetIndicator: {
        width: isIOS ? 36 : 26,
        height: isIOS ? 5 : 3,
        borderRadius: 36,
        backgroundColor: isIOS ? Colors.gray : fromColor(Colors.black).alpha(0.15).rgb().toString(),
    },
    bottomSheetIndicatorDark: {
        backgroundColor: fromColor(Colors.white).alpha(0.15).rgb().toString(),
    },
    bottomSheetContentWrap: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 30,
        backgroundColor: Colors.grayLight,
    },
    bottomSheetContentWrapDark: {
        backgroundColor: DarkColors.bg,
    },
});
