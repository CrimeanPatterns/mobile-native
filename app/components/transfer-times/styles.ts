import {StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';

const subheaderHeight = 40;
const subheaderHeightColor = Colors.grayLight;
const subheaderHeightColorDark = DarkColors.bg;

export default StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 52,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    header: {
        paddingHorizontal: 15,
        paddingTop: 30,
        paddingBottom: 10,
    },
    title: {
        fontSize: 25,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    titleDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    program: {
        flex: 1,
        marginRight: 10,
    },
    duration: {
        alignItems: 'flex-end',
    },
    tip: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    tipDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    info: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: Colors.grayLight,
    },
    infoDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    infoMessage: {
        flex: 1,
        marginLeft: 10,
    },
    subheader: {
        height: subheaderHeight,
        backgroundColor: subheaderHeightColor,
    },
    subheaderDark: {
        backgroundColor: subheaderHeightColorDark,
    },
    subTitle: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    subTitleDark: {
        color: DarkColors.text,
    },
    text: {
        fontSize: 15,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    textSmall: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textLink: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
        textDecorationLine: 'none',
    },
});

export {subheaderHeight, subheaderHeightColor, subheaderHeightColorDark};
