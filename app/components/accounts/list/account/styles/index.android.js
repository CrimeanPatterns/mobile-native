import formColor from 'color';
import {StyleSheet} from 'react-native';

import {isTablet} from '../../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../../styles';

let additional;

const base = {
    textDark: {
        color: DarkColors.text,
    },
    grayText: {
        color: DarkColors.text,
    },
    whiteText: {
        color: Colors.white,
    },
    accountWrap: {
        backgroundColor: Colors.white,
    },
    accountWrapDark: {
        backgroundColor: DarkColors.bgLight,
    },
    subAccountWrap: {
        backgroundColor: Colors.bgGrayLight,
    },
    subAccountWrapDark: {
        backgroundColor: DarkColors.bg,
    },
    accountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        alignItems: 'center',
        height: 57,
    },
    subAccountRow: {
        height: 48,
    },
    actionButton: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    displayName: {
        fontFamily: Fonts.regular,
        fontWeight: '500',
        fontSize: 14,
        color: Colors.grayDark,
    },
    login: {
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: 12,
        color: formColor(Colors.textGray).alpha(0.5).rgb().toString(),
        lineHeight: 18,
    },
    balanceText: {
        fontFamily: Fonts.regular,
        flexDirection: 'row',
        fontWeight: '700',
        fontSize: 15,
        color: Colors.grayDark,
        lineHeight: 18,
    },
    balanceSubAccountText: {
        fontSize: 13,
    },
    balanceChange: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    balanceChangeText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDarkLight,
        marginLeft: 5,
    },
    subAccountColumn: {
        paddingLeft: 30,
    },
    accountColumn: {
        flex: 1,
        minWidth: '30%',
    },
    accountColumnBalance: {
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginLeft: 5,
        marginRight: 14,
        maxWidth: '60%',
    },
    balanceBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountStatus: {
        width: 15,
        marginRight: 2,
    },
    accountMore: {
        width: 0,
        opacity: 0,
        height: 0,
    },
    balanceBlockImage: {
        marginLeft: 5,
        backgroundColor: 'transparent',
    },
    balanceLastChange: {
        fontFamily: Fonts.regular,
        fontWeight: '400',
        fontSize: 12,
    },
    disabled: {
        color: Colors.grayDarkLight,
    },
    arrow: {
        top: -5,
        left: 23,
        width: 10,
        height: 10,
    },
    innerArrow: {
        borderTopWidth: 10,
        borderRightWidth: 10,
    },
    accleratedWrap: {
        flexDirection: 'row',
        backgroundColor: formColor(Colors.blueDarkLight).alpha(0.1).rgb().toString(),
        marginTop: 5,
        marginBottom: 10,
        marginHorizontal: 15,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 4,
        alignItems: 'center',
    },
    accleratedWrapDark: {
        backgroundColor: formColor(DarkColors.blue).alpha(0.15).rgb().toString(),
    },
    accleratedStatusIconWrap: {
        width: 15,
        height: 15,
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blue,
    },
    accleratedStatusIconWrapDark: {
        backgroundColor: DarkColors.blue,
    },
    accleratedTextWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    accleratedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    accleratedText: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: 12,
        lineHeight: 17,
    },
    accleratedTextDark: {
        color: Colors.white,
    },
    providerLogoWrap: {
        width: 30,
        height: 30,
        marginLeft: 14,
        marginRight: 11,
    },
    providerLogo: {
        flex: 1,
        width: 30,
        height: 30,
    },
    kindLogo: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    providerLogoBorder: {
        borderWidth: 1,
        borderColor: Colors.gray,
    },
    providerLogoDark: {
        borderColor: DarkColors.border,
    },
    accountStatusWrap: {
        position: 'absolute',
        top: -7,
        right: -7,
        width: 15,
        height: 15,
        borderWidth: 1,
        borderRadius: 100,
        borderColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusIcon: {
        alignSelf: 'center',
        fontSize: 9,
        color: Colors.white,
        fontWeight: '700',
    },
    gradientWrap: {
        flex: 1,
        position: 'absolute',
        width: 300,
        right: 0,
    },
    linearGradient: {
        flex: 1,
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 16,
    },
    loginWrap: {
        flexDirection: 'row',
    },
    couponType: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 6,
        lineHeight: 18,
        color: Colors.blueDark,
    },
    couponTypeDark: {
        color: DarkColors.blue,
    },
};

if (isTablet) {
    additional = {
        loginText: {
            fontFamily: Fonts.regular,
            fontSize: 13,
            color: Colors.grayDarkLight,
        },
        displayName: {
            ...base.displayName,
            fontSize: 17,
        },
        accountColumn: {
            ...base.accountColumn,
            minWidth: '30%',
            width: '30%',
            paddingRight: 10,
        },
        accountColumnBalance: {
            ...base.accountColumnBalance,
            width: '14%',
            maxWidth: '14%',
        },
        balanceText: {
            ...base.balanceText,
            fontSize: 17,
        },
        balanceChange: {
            ...base.balanceChange,
            opacity: 0,
            height: 0,
        },
        accountCaption: {
            width: '100%',
            height: 25,
            opacity: 1,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            alignItems: 'center',
            borderBottomColor: Colors.gray,
            borderBottomWidth: 1,
            paddingRight: 16,
        },
        accountCaptionDark: {
            borderBottomColor: DarkColors.border,
        },
        accountCaptionText: {
            fontSize: 12,
            fontFamily: Fonts.regular,
            color: '#8e9199',
        },
        accountColumnAccount: {
            width: '20%',
            height: '100%',
            opacity: 1,
            paddingRight: 10,
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'center',
        },
        accountColumnExpire: {
            width: '16%',
            height: '100%',
            opacity: 1,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            alignItems: 'center',
            paddingRight: 10,
        },
        accountColumnStatus: {
            width: '14%',
            height: '100%',
            opacity: 1,
            paddingRight: 10,
            flexDirection: 'column',
            justifyContent: 'center',
        },
        accountColumnStatusItem: {
            height: '100%',
            paddingVertical: 2,
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        accountStatusText: {
            fontFamily: Fonts.regular,
            color: Colors.textGray,
            fontSize: 17,
            marginTop: 12,
        },
        accountProgress: {
            width: 80,
            height: 3,
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
        },
        accountProgressLine: {
            height: 3,
            backgroundColor: '#bcbcbc',
            marginRight: 2,
        },
        accountProgressLineDark: {
            backgroundColor: DarkColors.text,
        },
        accountProgressLineActive: {
            backgroundColor: Colors.blue,
        },
        accountProgressLineActiveDark: {
            backgroundColor: DarkColors.blue,
        },
        accountExpireIcon: {
            marginRight: 5,
        },
        accountExpireText: {
            fontFamily: Fonts.regular,
            color: Colors.textGray,
            fontSize: 17,
        },
    };
}

export default StyleSheet.create({...base, ...additional});
