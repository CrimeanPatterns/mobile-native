import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: isIOS ? 15 : 8,
    },
    text: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 15 : 12,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    icon: {
        marginRight: 20,
    },
});
