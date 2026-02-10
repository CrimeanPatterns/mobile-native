import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.grayLight,
    },
    buttonDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bgLight,
    },
    label: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        marginLeft: 10,
        color: Colors.grayDark,
    },
    labelDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});
