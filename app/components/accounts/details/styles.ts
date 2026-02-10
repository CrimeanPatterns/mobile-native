import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export const accountDetailsRippleColor = Colors.gray;
export const accountDetailsRippleColorDark = DarkColors.border;
export const accountDetailsActiveBackgroundColor = Colors.grayLight;
export const accountDetailsActiveBackgroundColorDark = DarkColors.bg;

export default StyleSheet.create({
    itemRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 52,
        paddingVertical: 2,
        paddingHorizontal: isIOS ? 15 : 16,
    },
    leftColumn: {
        minWidth: '30%',
        justifyContent: 'center',
        paddingRight: 10,
    },
    rightColumn: {
        flex: 1,
        maxWidth: '70%',
        alignItems: 'flex-end',
    },
    iconArrow: {
        marginLeft: 10,
        width: 16,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    linkTitle: {
        flex: 1,
        justifyContent: 'center',
        minHeight: 58,
        paddingVertical: 2,
        paddingHorizontal: isIOS ? 15 : 16,
        backgroundColor: Colors.grayLight,
    },
    linkTitleDark: {
        backgroundColor: DarkColors.bgLight,
    },
    barcode: {
        minHeight: 60,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        paddingVertical: 10,
        paddingHorizontal: isIOS ? 15 : 16,
    },
    flexEnd: {
        alignItems: 'flex-end',
    },
    marginLeft: {
        marginLeft: 5,
    },
    marginRight: {
        marginRight: 10,
    },
    marginTop: {
        marginTop: 20,
    },
    bgWhite: {
        backgroundColor: Colors.white,
    },
    flex1: {
        flex: 1,
    },

    text: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 15 : 16,
        color: isIOS ? Colors.textGray : Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textGray: {
        color: Colors.gray,
    },
    textGrayDark: {
        color: DarkColors.gray,
    },
    textBlue: {
        color: Colors.blue,
    },
    textBlueDark: {
        color: DarkColors.blue,
    },
    textBold: {
        fontFamily: isIOS ? Fonts.bold : Fonts.regular,
    },
    textLarge: {
        fontSize: isIOS ? 20 : 21,
    },
    textSmall: {
        fontSize: isIOS ? 13 : 14,
    },
    linkIndents: {
        paddingVertical: 7,
    },
});
