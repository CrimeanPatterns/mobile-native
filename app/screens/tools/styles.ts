import formColor from 'color';
import {Platform, StyleSheet} from 'react-native';

import {isAndroid} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';

export default StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    contentContainer: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: Colors.white,
    },
    contentContainerDark: {
        backgroundColor: DarkColors.bgLight,
    },
    title: {
        alignItems: 'flex-end',
    },
    clear: {
        width: 40,
        height: 40,
        borderRadius: 20,
        margin: 5,
        overflow: 'hidden',
    },
    iconClear: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 25,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        backgroundColor: Colors.grayLight,
        marginRight: 10,
    },
    iconDark: {
        backgroundColor: DarkColors.border,
    },
    label: {
        fontSize: 18,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    labelDark: {
        color: DarkColors.text,
    },

    page: {
        backgroundColor: Colors.grayLight,
    },
    pageDark: {
        backgroundColor: isAndroid ? DarkColors.bg : DarkColors.bg,
    },
    gridRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 9,
        marginHorizontal: 15,
        shadowColor: Colors.grayDark,
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.05,
        shadowRadius: 40,
    },
    rowMarginBottom: {
        marginBottom: 15,
    },
    smallButtonWrap: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        paddingVertical: 15,
    },
    gridColumn: {
        marginTop: 16,
        marginBottom: 14,
        marginHorizontal: 15,
    },
    indentCardGridSmall: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textDark: {
        color: DarkColors.grayDark,
    },
    logoutWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                marginVertical: 28,
            },
            android: {
                flex: 1,
                flexGrow: 1,
                marginVertical: 10,
                paddingVertical: 18,
            },
        }),
    },
    logoutIcon: {
        opacity: 0.3,
        marginRight: 6,
    },
    logoutText: {
        fontSize: 14,
        fontWeight: isAndroid ? '700' : '600',
        color: formColor(Colors.grayDark).alpha(0.5).rgb().toString(),
        lineHeight: 18,
    },
    logoutTextDark: {
        color: formColor(Colors.white).alpha(0.5).rgb().toString(),
    },
});
