import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: isIOS ? Colors.grayLight : Colors.white,
    },
    modalDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    message: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.grayDark,
        marginHorizontal: 15,
        marginTop: 30,
        marginBottom: 15,
    },
    messageDark: {
        color: Colors.white,
    },
    hint: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        bottom: 1,
        height: 46,
        width: 46,
        backgroundColor: Colors.grayMild,
    },
    hintDark: {
        backgroundColor: DarkColors.bgLight,
    },
    hintText: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    hintTextDark: {
        color: Colors.white,
    },
});
