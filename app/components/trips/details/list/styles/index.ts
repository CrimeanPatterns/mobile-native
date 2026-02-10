import fromColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../../styles';

export const textColors = {light: Colors.grayDark, dark: isIOS ? Colors.white : DarkColors.text};

export const iconColors = Colors.grayDarkLight;
export const iconColorsDark = isIOS ? Colors.white : DarkColors.text;

export const arrowColorLight = Colors.grayDarkLight;
export const arrowColorDark = DarkColors.gray;

export const iconSize = 30;

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    warningWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: isIOS ? 15 : 22,
        paddingVertical: 10,
        borderRadius: 4,
        backgroundColor: fromColor(isIOS ? Colors.blueDarkLight : Colors.blue)
            .alpha(0.1)
            .rgb()
            .toString(),
    },
    warningWrapDark: {
        backgroundColor: fromColor(DarkColors.blue).alpha(0.3).rgb().toString(),
    },
    notesAndAttachmentsContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    notesAndAttachmentsContainerDark: {
        borderColor: DarkColors.border,
    },
    notesBlockContainer: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    containerFixedSmall: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        paddingVertical: 5,
    },
    containerSmall: {
        minHeight: 45,
        paddingVertical: 5,
    },
    containerLarge: {
        minHeight: 76,
        paddingVertical: 5,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    containerSilver: {
        backgroundColor: Colors.grayLight,
    },
    containerSilverDark: {
        backgroundColor: DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
    containerPadding0: {
        paddingRight: 0,
    },
    containerPaddingCompensation: {
        paddingRight: 15,
    },
    title: {
        height: 100,
    },
    group: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.grayLight,
        flexDirection: 'row',
    },
    groupDark: {
        backgroundColor: DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
    info: {
        flexDirection: 'row',
        maxWidth: '64%',
        alignItems: 'center',
    },
    details: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
    },
    offer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 15,
    },
    silverBlock: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        color: Colors.textGray,
        textAlign: 'center',
        minWidth: 17,
        minHeight: 17,
        paddingHorizontal: 5,
        paddingVertical: 2,
        marginLeft: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.borderGray,
    },
    silverBlockDark: {
        color: isIOS ? Colors.white : DarkColors.text,
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    blueBlock: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        minWidth: 26,
        paddingHorizontal: 5,
        paddingVertical: 1,
        marginLeft: 10,
        color: Colors.white,
        backgroundColor: isIOS ? Colors.blue : Colors.green,
    },
    blueBlockDark: {
        color: isIOS ? Colors.white : DarkColors.text,
        backgroundColor: isIOS ? DarkColors.blue : DarkColors.green,
    },
    place: {
        fontSize: 21,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        width: 65,
        paddingVertical: 2,
        marginRight: 10,
        color: Colors.white,
        backgroundColor: isIOS ? Colors.blue : Colors.green,
    },
    date: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        width: 65,
        height: 24,
        marginRight: 8,
        color: Colors.white,
        backgroundColor: isIOS ? Colors.blue : Colors.green,
    },
    accentDate: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        width: 65,
        height: 24,
        marginRight: 8,
        color: Colors.white,
        backgroundColor: Colors.red,
    },
    number: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        minWidth: 28,
        paddingHorizontal: 5,
        backgroundColor: isIOS ? Colors.blue : Colors.green,
    },
    numberDark: {
        backgroundColor: isIOS ? DarkColors.blue : DarkColors.green,
    },
    accentDateDark: {
        color: isIOS ? Colors.white : DarkColors.text,
        backgroundColor: DarkColors.red,
    },
    dateOld: {
        textDecorationLine: 'line-through',
        borderWidth: 1,
        color: Colors.grayDarkLight,
        borderColor: Colors.borderGray,
        backgroundColor: Colors.white,
    },
    headerWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center',
    },
    rightButtonWrap: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 4,
    },
    text: {
        fontSize: isIOS ? 15 : 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    textSmallest: {
        fontSize: 12,
    },
    textSmall: {
        fontSize: 14,
    },
    textMedium: {
        fontSize: 21,
        lineHeight: 27,
    },
    textLarge: {
        fontSize: 25,
    },
    textOld: {
        color: Colors.grayDarkLight,
        textDecorationLine: 'line-through',
    },
    textLink: {
        fontSize: 13,
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
        color: isIOS ? Colors.blue : Colors.green,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    textMargin: {
        marginLeft: 5,
    },
    textRight: {
        textAlign: 'right',
    },
    textCenter: {
        textAlign: 'center',
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textWhite: {
        color: Colors.white,
    },
    textGray: {
        color: Colors.grayDarkLight,
    },
    textGrayDark: {
        color: DarkColors.grayLight,
    },
    textBlue: {
        color: isIOS ? Colors.blue : Colors.green,
    },
    textBlueOnly: {
        color: Colors.blue,
    },
    textBlueDark: {
        color: isIOS ? DarkColors.blue : DarkColors.green,
    },
    textUnderline: {
        textDecorationLine: 'underline',
    },
    textDate: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        textAlign: 'right',
    },
    textTimezone: {
        fontSize: 9,
        fontFamily: Fonts.regular,
        lineHeight: 9,
        marginTop: 5,
        color: Colors.grayDarkLight,
    },
    timelineDetailsIconChanges: {
        margin: 5,
    },
    at: {
        fontSize: 21,
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        marginTop: 5,
        marginRight: 5,
    },
    atSmall: {
        fontSize: 17,
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        marginRight: 10,
    },
    atDark: {
        color: DarkColors.grayLight,
    },
    iconItem: {
        width: 40,
        alignItems: 'flex-start',
        position: 'relative',
    },
    iconWarning: {
        position: 'absolute',
        margin: 0,
        bottom: 0,
        right: 8,
    },
    dateItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 7,
    },
    on: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    onDate: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
    },
    onDateLeft: {
        marginRight: 30,
    },
    onDateRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flex1: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    alignItemsCenter: {
        alignItems: 'center',
    },
    marginLeft: {
        marginLeft: 10,
    },
    marginRight: {
        marginRight: 10,
    },
    marginTop: {
        marginTop: 10,
    },
    marginArrow: {
        marginLeft: 8,
    },
    wrap: {
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    separator: {
        height: 30,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
    arrowCompensation: {
        paddingRight: 9,
    },
    flexStart: {
        justifyContent: 'flex-start',
    },
    flexEnd: {
        alignItems: 'flex-end',
    },
    maxWidth: {
        maxWidth: '48%',
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    borderDark: {
        borderBottomColor: DarkColors.border,
    },
    openingHours: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    description: {
        paddingBottom: 10,
    },
    detailsIcon: {
        height: '100%',
        marginRight: 15,
    },
    marginIcon: {
        marginRight: 15,
    },
    status: {
        textAlign: 'right',
        marginTop: 5,
    },
    statusWidth: {
        width: 80,
        marginRight: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    headerTerminal: {
        marginTop: -10,
        paddingRight: 5,
    },
    headerTerminalCompensation: {
        paddingTop: 10,
    },
    openingHoursDeyWidth: {
        width: 100,
    },
    openingHoursDeyMargin: {
        marginRight: 20,
    },
    openingHoursTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dash: {
        height: 1,
        width: 8,
        backgroundColor: Colors.grayDark,
        marginHorizontal: 15,
    },
    dashDark: {
        backgroundColor: isIOS ? Colors.white : DarkColors.text,
    },
    skeletonStatus: {
        alignItems: 'center',
        marginRight: 5,
    },
    skeletonIcon: {
        marginVertical: 6,
    },
    informer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.green,
        borderRadius: 6,
        paddingTop: 10,
        paddingBottom: 12,
        paddingLeft: 17,
        paddingRight: 15,
    },
    informerDark: {
        backgroundColor: DarkColors.green,
    },
    informerIcon: {
        width: 20,
        height: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        backgroundColor: Colors.white,
    },
    informerIconText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.green,
    },
    informerIconTextDark: {
        color: DarkColors.green,
    },
    informerArrow: {
        height: 16,
        width: 16,
        position: 'absolute',
        transform: [{rotate: '45deg'}],
        left: 20,
        bottom: -6,
        backgroundColor: Colors.green,
        overflow: 'hidden',
    },
    informerArrowDark: {
        backgroundColor: DarkColors.green,
    },
    shadowInformerArrow: {
        transform: [{rotate: '45deg'}],
        height: 20,
        width: 20,
        bottom: -6,
        left: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    triangleCorner: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: 14,
        borderTopWidth: 14,
        borderTopLeftRadius: isIOS ? 6 : 0,
        borderRightColor: 'transparent',
        borderTopColor: Colors.gray,
        transform: [{rotate: '270deg'}],
    },
    triangleCornerDark: {
        borderTopColor: DarkColors.gray,
    },
    notesContainer: {
        backgroundColor: Colors.grayLight,
        flex: 1,
        paddingTop: 4,
        paddingBottom: 18,
        paddingHorizontal: 20,
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 6,
        borderColor: Colors.grayMild,
        borderBottomWidth: isIOS ? 1.5 : 0,
        borderLeftWidth: isIOS ? 1.5 : 0,
        borderRightWidth: isIOS ? 1.5 : 0,
    },
    notesContainerHeader: {
        height: 14,
        flex: 1,
        backgroundColor: Colors.grayLight,
        flexDirection: 'column',
        borderTopLeftRadius: 6,
        borderColor: Colors.grayMild,
        borderLeftWidth: isIOS ? 1.5 : 0,
        borderTopWidth: isIOS ? 1.5 : 0,
    },
    notesBorderDark: {
        borderColor: DarkColors.border,
    },
    notesBackgroundDark: {
        backgroundColor: DarkColors.bgLight,
    },
    containerWarningDark: {
        borderBottomWidth: 0,
        backgroundColor: DarkColors.bg,
    },
    aiIconWrap: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
});
