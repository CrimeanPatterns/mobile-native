import {StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 15,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    container: {
        alignItems: 'center',
        marginTop: 35,
    },
    footer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        fontFamily: Fonts.regular,
        textAlign: 'center',
        fontSize: 14,
        color: Colors.textGray,
    },
    textTitle: {
        fontSize: 25,
    },
    textLink: {
        fontFamily: Fonts.bold,
        color: Colors.blue,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textLinkDark: {
        color: DarkColors.blue,
    },
    strong: {
        fontWeight: 'normal',
    },
    button: {
        flex: 0,
        height: 50,
        marginBottom: 30,
    },
    buttonLabel: {
        fontSize: 16,
    },
    icon: {
        position: 'absolute',
    },
    manually: {
        marginBottom: 30,
    },
    copyKey: {
        marginTop: 20,
    },
});
