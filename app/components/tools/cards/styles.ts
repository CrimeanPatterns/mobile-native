import {Platform, StyleSheet} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';

export const avatarSize = 76;
export const avatarColor = Colors.grayDarkLight;
export const avatarColorDark = isIOS ? DarkColors.gray : Colors.grayDarkLight;

export const GradientColors = {
    transferTimes: isIOS ? ['#125DA3', '#4684C4'] : ['#146AC4', '#72A6DC'],
    mileValue: isIOS ? ['#CC3D5E', '#FFAA33'] : ['#CC294E', '#FFAA33'],
    travelSummary: isIOS ? ['#4684C4', '#4DBFA2'] : ['#146AC4', '#33B896'],
    subscriptionPlus: isIOS ? ['#125DA3', '#4684C4'] : ['#146AC4', '#72A6DC'],
    bookings: isIOS ? ['#398C77', '#4DBFA2'] : ['#00A67C', '#66CAB0'],
    blog: isIOS ? ['#125DA3', '#4684C4'] : ['#146AC4', '#4285F4'],
    faqs: isIOS ? ['#CC3D5E', '#FFAA33'] : ['#CC294E', '#FFAA33'],
    notifications: isIOS ? ['#535457', '#999A9E'] : ['#757575', '#E0E0E0'],
    contactUs: isIOS ? ['#4684C4', '#4DBFA2'] : ['#00A67C', '#66CAB0'],
    aboutUs: isIOS ? ['#125DA3', '#4684C4'] : ['#4285F4', '#8EB6F8'],
    privacyNotice: isIOS ? ['#EB8800', '#FFD69C'] : ['#FFAA33', '#FFDDAD'],
    termsOfUse: isIOS ? ['#4DBFA2', '#FFAA33'] : ['#00A67C', '#FFAA33'],
    logout: isIOS ? ['#535457', '#999A9E'] : ['#757575', '#E0E0E0'],
};

export const GradientColorsDark = {
    transferTimes: isIOS ? ['#0984FF', '#6BB5FF'] : ['#0984FF', '#6BB5FF'],
    mileValue: isIOS ? ['#EA3C48', '#FF9F08'] : ['#EA3C48', '#FF9F08'],
    travelSummary: isIOS ? ['#0984FF', '#30D178'] : ['#0984FF', '#30D178'],
    subscriptionPlus: isIOS ? ['#0984FF', '#6BB5FF'] : ['#0984FF', '#6BB5FF'],
    bookings: isIOS ? ['#30D178', '#83E3AE'] : ['#30D178', '#83E3AE'],
    blog: isIOS ? ['#0984FF', '#6BB5FF'] : ['#0984FF', '#6BB5FF'],
    faqs: isIOS ? ['#EA3C48', '#FF9F08'] : ['#EA3C48', '#FF9F08'],
    notifications: isIOS ? ['#999A9E', '#DFE1E6'] : ['#3E3E3F', '#A7A9AC'],
    contactUs: isIOS ? ['#0984FF', '#30D178'] : ['#0984FF', '#30D178'],
    aboutUs: isIOS ? ['#0984FF', '#6BB5FF'] : ['#0984FF', '#6BB5FF'],
    privacyNotice: isIOS ? ['#FF9F08', '#FFC56B'] : ['#FF9F08', '#FFC56B'],
    termsOfUse: isIOS ? ['#30D178', '#FF9F08'] : ['#30D178', '#FF9F08'],
    logout: isIOS ? ['#999A9E', '#DFE1E6'] : ['#3E3E3F', '#A7A9AC'],
};

export const ToolsIconColors = {
    transferTimes: '#27A887',
    mileValue: '#FFAA33',
    bookings: '#6922FF',
    faqs: '#FF4848',
    contactUs: '#5DC7DE',
    aboutUs: '#0168CA',
    privacyNotice: '#FFA944',
    termsOfUse: '#FF4DCD',
};

export default StyleSheet.create({
    cardGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        backgroundColor: isIOS ? Colors.grayLight : Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: isIOS ? 1 : 0,
    },
    blankCardGrid: {
        flex: 1,
        height: 65,
    },
    cardGridDark: {
        backgroundColor: DarkColors.bgLight,
    },
    cardGridBig: {
        height: 190,
    },
    cardGridBigAndroid: {
        paddingHorizontal: 0,
        height: 210,
    },
    gradientBorder: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: isIOS ? 0 : 5,
    },
    cardProfile: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 10,
    },
    avatarFrame: {
        width: avatarSize,
        height: avatarSize,
        borderWidth: 1,
        borderColor: avatarColor,
        borderRadius: avatarSize / 2,
        overflow: 'hidden',
    },
    avatarFrameDark: {
        borderColor: avatarColorDark,
    },
    avatarImage: {
        width: avatarSize,
        height: avatarSize,
        resizeMode: 'contain',
    },
    badge: {
        color: Colors.white,
        paddingHorizontal: 3,
        marginLeft: 3,
        backgroundColor: Colors.grayDarkLight,
    },
    badgeDark: {
        backgroundColor: DarkColors.grayLight,
        color: Colors.black,
    },
    profile: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    profileAvatar: {
        marginBottom: 19,
        alignItems: 'center',
    },
    cardTravelStatistics: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTravelStatisticsAndroid: {
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: Colors.grayLight,
    },
    cardTravelStatisticsAndroidDark: {
        borderColor: DarkColors.bg,
    },
    cardAWPlus: {
        height: 230,
    },
    travelSummary: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logout: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 65,
        paddingHorizontal: 10,
        marginTop: 25,
        backgroundColor: isIOS ? Colors.grayLight : Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.gray,
    },
    logoutDark: {
        backgroundColor: DarkColors.bgLight,
        borderColor: DarkColors.border,
    },
    logoutMarginBottomAndroid: {
        marginBottom: 90,
    },
    awPlus: {
        flex: 1,
        marginTop: 43,
        alignItems: 'center',
    },
    imageLogo: {
        maxWidth: '80%',
        marginBottom: 15,
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    bonus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    subscriptionBonusImage: {
        width: 18,
        height: 18,
        marginRight: 5,
    },
    profileStatusContainer: {
        position: 'absolute',
        bottom: -9,
        padding: 2,
        borderRadius: 4,
        backgroundColor: Colors.grayLight,
    },
    profileStatusContainerDark: {
        backgroundColor: DarkColors.bg,
    },
    profileStatusWrap: {
        paddingHorizontal: 5,
        borderRadius: 4,
    },
    regularProfileStatusWrap: {
        backgroundColor: isAndroid ? Colors.gray : '#ADB1B9',
    },
    regularProfileStatusWrapDark: {
        backgroundColor: isAndroid ? DarkColors.border : DarkColors.text,
    },
    plusProfileStatusWrap: {
        flexDirection: 'row',
        backgroundColor: isAndroid ? '#0070EB' : '#0168CA',
        paddingLeft: 0,
    },
    plusSmallProfileStatusWrap: {
        justifyContent: 'center',
        backgroundColor: isAndroid ? '#005ABC' : '#104F92',
        marginRight: 5,
        paddingLeft: 2,
        paddingRight: 3,
    },
    gradientWrap: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    buttonWrap: {
        ...Platform.select({
            ios: {
                paddingVertical: 6,
                paddingHorizontal: 15,
            },
            android: {
                overflow: 'hidden',
                marginHorizontal: 9,
                borderRadius: 100,
            },
        }),
    },
    statisticWrap: {
        marginTop: 13,
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    secondIconWrap: {
        position: 'absolute',
        left: 3,
        top: 3,
    },
    secondIcon: {
        position: 'absolute',
        left: 0,
    },
    text: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textTitle: {
        fontSize: 20,
    },
    textBold: {
        fontWeight: '700',
    },
    textSubtitle: {
        fontSize: 13,
    },
    textSmallSubtitle: {
        fontSize: 12,
        lineHeight: 18,
        color: Colors.grayDark,
        opacity: 0.5,
        marginTop: 6,
    },
    textSmallSubtitleDark: {
        color: Colors.white,
    },
    textSubscriptionBonus: {
        fontSize: 11,
        lineHeight: 18,
        color: Colors.white,
        fontWeight: '600',
    },
    textPlusMiddle: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        color: Colors.white,
        fontWeight: '400',
    },
    textPlusTitle: {
        fontSize: 20,
        lineHeight: 23,
        color: Colors.white,
        fontWeight: '700',
    },
    textProfileStatus: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 18,
        color: isAndroid ? Colors.grayDarkLight : Colors.white,
    },
    textSmall: {
        fontSize: 14,
    },
    textGray: {
        color: Colors.grayDarkLight,
    },
    textGrayDark: {
        color: isIOS ? DarkColors.text : DarkColors.grayLight,
    },
    textIndent: {
        flex: 1,
        marginLeft: 10,
    },
    flex1: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    marginBottom: {
        marginBottom: 10,
    },
    alignItems: {
        alignItems: 'center',
    },
    marginRight: {
        marginRight: 20,
    },
    simpleCardGridWrap: {
        flex: 1,
        height: 98,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    simpleCardGridWrapDark: {
        backgroundColor: isIOS ? DarkColors.grayDark : DarkColors.bgLight,
    },
    simpleCardGridIconWrap: {
        padding: 10,
        marginBottom: 12,
        backgroundColor: isIOS ? Colors.bgGray : Colors.grayLight,
        borderRadius: 100,
    },
    simpleCardGridIconWrapDark: {
        backgroundColor: DarkColors.bg,
    },
    simpleCardGridText: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        lineHeight: 14,
    },
    simpleCardGridTextDark: {
        color: Colors.white,
    },
    plusLogoWrap: {
        position: 'absolute',
        alignSelf: 'center',
        top: -9,
    },
    padding: {
        padding: 6,
    },
});
