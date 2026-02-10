import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    page: {
        backgroundColor: Colors.grayLight,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    safeZone: {
        paddingBottom: 58,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 58,
        paddingHorizontal: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        backgroundColor: Colors.white,
        borderRadius: 10,
    },
    containerDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        alignItems: 'flex-end',
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    name: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.grayDark,
    },
    accounts: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.blue,
        marginLeft: 5,
    },
    accountsDark: {
        color: DarkColors.blue,
    },
    totals: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    mileValue: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.green,
    },
    mileValueDark: {
        color: DarkColors.green,
    },
    text: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        marginLeft: 5,
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});
