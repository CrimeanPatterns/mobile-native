import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 80,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },
    name: {
        flex: 1,
    },
    value: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    providerIcon: {
        justifyContent: 'center',
        minHeight: 50,
    },
    login: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 12 : 14,
        color: Colors.grayDarkLight,
    },
    loginDark: {
        color: isIOS ? DarkColors.text : DarkColors.gray,
    },
    balance: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        color: Colors.blue,
    },
    balanceDark: {
        color: DarkColors.blue,
    },
    resizeMode: {
        resizeMode: 'contain',
    },
});
