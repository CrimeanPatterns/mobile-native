import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    titleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    title: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 17 : 20,
    },
    titleDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    subTitle: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 17 : 20,
        color: isIOS ? Colors.grayDarkLight : Colors.grayDark,
    },
    subTitleDark: {
        color: DarkColors.text,
    },
});
