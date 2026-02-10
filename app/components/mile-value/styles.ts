import {StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';

export default StyleSheet.create({
    textTitle: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 12 : 11,
        color: Colors.grayDark,
    },
    textTitleDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textValue: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
        fontSize: 14,
        color: isIOS ? Colors.blue : Colors.gold,
    },
    textValueDark: {
        color: isIOS ? DarkColors.blue : DarkColors.gold,
    },
    textMessage: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.grayDarkLight,
    },
    textMessageDark: {
        color: DarkColors.text,
    },
    message: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 8,
        paddingBottom: 10,
    },
    arrow: {
        marginLeft: 5,
    },
});
