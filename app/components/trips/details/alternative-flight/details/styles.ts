import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    containerTitle: {
        paddingTop: 30,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textTitle: {
        flex: 1,
        marginRight: 10,
    },
    text: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textSmall: {
        fontSize: 12,
    },
    textLarge: {
        fontSize: 25,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    textMargin: {
        marginLeft: 4,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textBlue: {
        color: isIOS ? Colors.blue : Colors.green,
    },
    textBlueDark: {
        color: isIOS ? DarkColors.blue : DarkColors.green,
    },
    textBlock: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        color: Colors.white,
        backgroundColor: Colors.grayDark,
    },
    textBlockDark: {
        paddingVertical: 3,
        paddingHorizontal: 15,
        color: isIOS ? Colors.white : DarkColors.text,
        backgroundColor: DarkColors.gray,
    },

    checkbox: {
        marginRight: 10,
    },
    codeTime: {
        width: 65,
        borderWidth: 1,
        borderColor: isIOS ? Colors.blue : Colors.green,
    },
    codeTimeDark: {
        borderColor: isIOS ? DarkColors.blue : DarkColors.green,
    },
    code: {
        alignItems: 'center',
        paddingVertical: 2,
        backgroundColor: isIOS ? Colors.blue : Colors.green,
    },
    codeDark: {
        backgroundColor: isIOS ? DarkColors.blue : DarkColors.green,
    },
    time: {
        alignItems: 'center',
        paddingVertical: 2,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: Colors.grayDarkLight,
    },
    borderTopDark: {
        borderTopColor: Colors.border,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBlock: {
        flexDirection: 'row',
        marginTop: 10,
        marginLeft: 36,
    },
});
