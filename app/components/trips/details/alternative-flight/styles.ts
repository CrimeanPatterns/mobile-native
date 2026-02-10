import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    container: {
        paddingTop: 20,
        backgroundColor: Colors.grayLight,
    },
    containerDark: {
        backgroundColor: DarkColors.bgLight,
    },
    label: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        paddingHorizontal: 15,
        color: Colors.grayDark,
    },
    labelDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        marginTop: 5,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    rowDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: '100%',
        marginRight: 10,
        backgroundColor: isIOS ? Colors.grayLight : Colors.gray,
    },
    containerIconDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bgLight,
    },
    icon: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: isIOS ? Colors.grayDark : Colors.grayDarkLight,
    },
    iconDark: {
        color: isIOS ? Colors.grayDark : Colors.grayDarkLight,
    },
    textInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        height: '100%',
        paddingRight: 15,
        color: Colors.grayDark,
    },
    textInputDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    logo: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 40,
    },
});
