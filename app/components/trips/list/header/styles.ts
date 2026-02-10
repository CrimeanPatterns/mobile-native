import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    topAction: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    pastTravel: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginTop: 15,
        paddingHorizontal: isIOS ? 23 : 25,
    },
    pastTravelText: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.textGray,
        marginLeft: isIOS ? 22 : 25,
    },
    top: {
        flex: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: isIOS ? Colors.grayLight : Colors.white,
        elevation: 5,
    },
    topDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: DarkColors.bg,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.gray,
    },
    hitSlop: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
    },
    travelSummary: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    travelSummaryDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
});
