import {StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import styles from '../../screens/passcode/styles';
import {Colors, DarkColors, Fonts} from '../../styles';

const dot = {width: 10, height: 10, borderRadius: 5, marginLeft: 8, marginRight: 8};
const introColors = {
    buttonColor: isIOS ? Colors.blueDark : Colors.blueDark,
    buttonColorDark: isIOS ? DarkColors.blue : DarkColors.blue,
    icon: isIOS ? Colors.grayDark : Colors.blueDark,
    iconDark: isIOS ? Colors.white : DarkColors.blue,
};

export default StyleSheet.create({
    ...styles,
    container: {},
    containerInner: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        marginVertical: 25,
    },
    content: {
        paddingHorizontal: 15,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        height: '45%',
        justifyContent: 'center',
    },
    imageContainer: {
        position: 'absolute',
        top: isIOS ? 40 : 56,
        bottom: 0,
        left: 0,
        right: 0,
    },
    swiper: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    swiperDark: {
        backgroundColor: DarkColors.bg,
    },
    paginationSwiper: {
        minHeight: 30,
        position: 'relative',
        bottom: 0,
    },
    paginationSwiperDark: {
        backgroundColor: DarkColors.bg,
    },
    dot: {
        ...dot,
        backgroundColor: isIOS ? Colors.grayDark : Colors.gray,
    },
    activeDot: {
        ...dot,
        backgroundColor: Colors.blueDark,
    },
    dotDark: {
        backgroundColor: DarkColors.grayLight,
    },
    activeDotDark: {
        backgroundColor: DarkColors.blue,
    },
    title: {
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: 18,
        color: Colors.grayDark,
        textAlign: 'center',
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: '700',
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});

export {introColors};
