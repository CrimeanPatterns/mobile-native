import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    row: {
        backgroundColor: Colors.white,
    },
    rowDark: {
        backgroundColor: DarkColors.bg,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 52,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        paddingHorizontal: isIOS ? 15 : 16,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    containerNoBorder: {
        ...Platform.select({
            android: {
                borderBottomWidth: 0,
                paddingHorizontal: 0,
            },
        }),
    },
    containerTall: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: isIOS ? 80 : 60,
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.borderGray,
                borderBottomWidth: 2,
                paddingHorizontal: 15,
            },
        }),
    },
    containerTallDark: {
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
                borderBottomWidth: 1,
            },
        }),
    },
    containerIcon: {
        flexDirection: 'row',
        marginRight: 20,
        marginLeft: isIOS ? 0 : 16,
    },
    containerTitle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containerTitleBorder: {
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        paddingRight: 16,
    },
    textGray: {
        color: DarkColors.text,
    },
    title: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 22 : 20,
    },
    info: {
        fontSize: 12,
        color: '#a1a7b3',
        fontFamily: Fonts.regular,
    },
    subtitle: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 16,
                lineHeight: 16,
                color: '#8e9199',
            },
            android: {
                fontSize: 12,
                lineHeight: 12,
                color: '#9e9e9e',
            },
        }),
    },
    subTitleDark: {
        color: DarkColors.text,
    },
    smallTitle: {
        fontSize: 12,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.borderGray,
                borderBottomWidth: 2,
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            android: {
                backgroundColor: Colors.grayLight,
                paddingHorizontal: 16,
                paddingVertical: 12,
            },
        }),
    },
    smallTitleDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        padding: 25,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
    },
    noFoundText: {
        fontSize: 13,
        marginHorizontal: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});
