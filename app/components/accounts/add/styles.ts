import fromColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export const rippleColor = Colors.gray;
export const rippleColorDark = DarkColors.border;
export const activeBackgroundColor = Colors.grayLight;
export const activeBackgroundColorDark = DarkColors.bg;

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 52,
        paddingHorizontal: isIOS ? 15 : 16,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    containerDark: {
        backgroundColor: DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
    providerLogoWrap: {
        width: 30,
        height: 30,
        marginRight: 15,
    },
    providerLogo: {
        flex: 1,
        width: 30,
        height: 30,
    },
    kindLogo: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerLogoBorder: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    providerLogoDark: {
        borderColor: DarkColors.border,
    },
    containerIcon: {
        marginRight: 20,
    },
    containerTitle: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 17 : 16,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textGray: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 16 : 12,
        lineHeight: isIOS ? 16 : 12,
        color: isIOS ? Colors.grayDarkLight : '#9e9e9e',
    },
    textGrayDark: {
        color: Colors.grayDarkLight,
    },
    containerStatus: {
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginRight: isIOS ? 20 : 0,
        marginLeft: 10,
    },
    status: {
        color: Colors.green,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: isIOS ? 13 : 12,
    },
    statusDark: {
        color: DarkColors.green,
    },
    listIndex: {
        fontWeight: 'bold',
        color: Colors.white,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    separatorDark: {
        borderBottomColor: DarkColors.border,
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row',
    },
    lonelyContainerItem: {
        marginVertical: 15,
    },
    point: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        width: 20,
        backgroundColor: Colors.blue,
    },
    pointDark: {
        backgroundColor: DarkColors.blue,
    },
    pointText: {
        fontWeight: 'bold',
        color: Colors.white,
    },
    marginPoint: {
        marginRight: 10,
    },
    linkButtonWrap: {
        alignItems: 'center',
        left: -15,
        marginBottom: 15,
    },
    lonelyLinkButtonWrap: {
        left: 0,
    },
    linkButton: {
        width: 150,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blueDark,
    },
    linkButtonDark: {
        backgroundColor: DarkColors.blueDark,
    },
    linkButtonText: {
        fontWeight: 'bold',
        color: Colors.white,
    },
    linkButtonVoted: {
        backgroundColor: isIOS ? fromColor(Colors.gray).alpha(0.7).rgb().string() : Colors.grayLight,
    },
    linkButtonVotedDark: {
        backgroundColor: isIOS ? DarkColors.border : DarkColors.bgLight,
    },
    linkRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingRight: 15,
    },
    link: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.blue,
    },
    linkDark: {
        color: DarkColors.blue,
    },
    customAccount: {
        paddingLeft: 0,
    },
});
