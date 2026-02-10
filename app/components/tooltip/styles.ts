import formColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';

const sizeIcon = 16;
const sizeButton = sizeIcon + 15;

export default StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: sizeButton,
        height: sizeButton,
        borderRadius: sizeButton,
    },
    button: {
        width: sizeButton,
        height: sizeButton,
        borderRadius: sizeButton,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundStyle: {
        backgroundColor: 'rgba(0, 0, 0, .1)',
    },
    arrowSize: {
        width: 16,
        height: 10,
    },
    icon: {
        width: sizeIcon,
        height: sizeIcon,
        borderWidth: 1,
        borderColor: formColor(Colors.textGray).alpha(0.2).rgb().toString(),
        borderRadius: sizeIcon,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDark: {
        borderColor: formColor(isIOS ? Colors.grayDarkLight : DarkColors.grayLight)
            .alpha(0.2)
            .rgb()
            .toString(),
    },
    textIcon: {
        fontFamily: Fonts.bold,
        fontWeight: '800',
        fontSize: 11,
        color: Colors.grayDark,
    },
    popoverIcon: {
        marginTop: 3,
    },
    popover: {
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    popoverDark: {
        backgroundColor: DarkColors.border,
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.grayDark,
    },
    textDark: {
        color: Colors.white,
    },
});
