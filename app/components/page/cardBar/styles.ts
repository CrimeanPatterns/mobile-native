import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';

export default StyleSheet.create({
    containerBarDark: {
        borderBottomColor: DarkColors.border,
    },
    containerBarSkeleton: {
        flexDirection: 'row',
    },
    containerCard: {
        minWidth: isIOS ? 102 : 105,
        minHeight: 60,
        margin: 10,
    },
    card: {
        flex: 1,
        borderRadius: 8,
        shadowColor: Colors.grayDark,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 0.05,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: isIOS ? 18 : 14,
    },
    cardDark: {
        backgroundColor: isIOS ? DarkColors.grayDark : DarkColors.bgLight,
    },
    cardActive: {
        backgroundColor: Colors.blueDark,
    },
    cardActiveDark: {
        backgroundColor: DarkColors.blue,
    },
});
