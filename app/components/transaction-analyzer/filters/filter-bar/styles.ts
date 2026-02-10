import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    container: {
        overflow: 'hidden',
        minWidth: isIOS ? 102 : 105,
        maxWidth: isIOS ? 160 : 168,
        borderRadius: 10,
        margin: 10,
    },
    title: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 12 : 11,
    },
    titleDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    filterValue: {
        color: Colors.black,
        fontFamily: Fonts.regular,
        marginTop: 5,
        fontSize: isIOS ? 10 : 11,
    },
    filterValueDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textActive: {
        color: Colors.white,
    },
    textActiveDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textChanged: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
        color: isIOS ? Colors.blueDark : Colors.chetwodeBlue,
    },
    textChangedDark: {
        color: isIOS ? DarkColors.blueDark : DarkColors.chetwodeBlue,
    },
    textActiveChanged: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
});
