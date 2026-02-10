import {Colors, DarkColors, Fonts} from '@styles/index';
import fromColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';

export default StyleSheet.create({
    indicator: {
        width: isIOS ? 36 : 26,
        height: isIOS ? 5 : 3,
        backgroundColor: isIOS ? Colors.gray : fromColor(Colors.black).alpha(0.15).rgb().toString(),
    },
    contentWrap: {
        marginHorizontal: 15,
        marginTop: 15,
        paddingBottom: 69,
        alignItems: 'center',
    },
    titleWrap: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 18,
        alignItems: 'center',
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: 20,
        fontWeight: '700',
        color: Colors.grayDark,
        marginBottom: 18,
        textAlign: 'center',
    },
    warningTitle: {
        marginBottom: 0,
    },
    titleDark: {
        color: Colors.white,
    },
    description: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 18,
        color: Colors.grayDark,
        textAlign: 'center',
    },
    androidDescription: {
        color: Colors.textGray,
    },
    descriptionDark: {
        color: Colors.white,
    },
    buttonText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
    },
    cancelText: {
        color: Colors.grayDark,
    },
    cancelTextDark: {
        color: Colors.white,
    },
    okText: {
        color: Colors.white,
    },
    buttonBlockWrap: {
        flexDirection: 'row',
    },
    buttonWrap: {
        flex: 1,
        height: 50,
        marginTop: 32,
        borderRadius: 6,
        overflow: 'hidden',
    },
    marginRight: {
        marginRight: 4,
    },
    button: {
        flex: 1,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    cancelButtonDark: {
        borderColor: DarkColors.border,
    },
    blueBlockWrap: {
        width: '100%',
        backgroundColor: fromColor(Colors.blue).alpha(0.1).rgb().toString(),
        marginBottom: 18,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 4,
    },
    blueBlockWrapDark: {
        backgroundColor: fromColor(DarkColors.blue).alpha(0.3).rgb().toString(),
    },
    subTitle: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: isIOS ? Colors.grayDark : Colors.blueDark,
    },
    subTitleDark: {
        color: Colors.white,
    },
    link: {
        color: isIOS ? Colors.blue : Colors.blueDark,
        fontWeight: '700',
        textDecorationLine: 'none',
    },
    linkDark: {
        color: DarkColors.blue,
    },
    warningButtonWrap: {
        width: '100%',
        height: 50,
        marginTop: 20,
        borderRadius: 6,
        overflow: 'hidden',
    },
    opacity: {
        opacity: 0.5,
    },
});
