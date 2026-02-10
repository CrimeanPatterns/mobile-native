import formColor from 'color';
import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    flex1: {
        flex: 1,
    },
    segmentStatus: {
        width: 8,
        marginLeft: 2,
    },
    segmentBlue: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    segmentStart: {
        position: 'relative',
        justifyContent: 'center',
    },
    segmentActionWrap: {
        flexDirection: 'row',
        height: '100%',
        marginLeft: 5,
    },
    segmentShare: {
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    segmentNoteWrap: {
        justifyContent: 'center',
    },
    segmentNote: {
        paddingHorizontal: 10,
    },
    segmentHasNotes: {
        backgroundColor: formColor(Colors.deepBlue).alpha(0.5).rgb().toString(),
    },
    segmentHasNotesDark: {
        backgroundColor: DarkColors.blueDark,
    },
    notesIndicator: {
        position: 'absolute',
        right: 7,
        top: 6,
        height: 6,
        width: 6,
        borderRadius: 6,
        backgroundColor: Colors.green,
    },
    tripMore: {
        position: 'absolute',
        left: 0,
        height: 40,
        top: 0,
        paddingTop: 5,
        paddingLeft: 5,
    },
    segmentMore: {
        position: 'absolute',
        right: 10,
        top: 0,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    segmentMoreRight: {
        right: 30,
    },
    segmentEnd: {
        justifyContent: 'flex-end',
    },
    segmentDate: {
        paddingLeft: 70,
        paddingVertical: 3,
    },
    segmentCircle: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    segmentDateText: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    segmentDateTextDark: {
        color: Colors.white,
    },
    segmentTitle: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        backgroundColor: Colors.blue,
        height: 35,
        paddingLeft: 70,
        paddingRight: 10,
    },
    segmentTitleDark: {
        backgroundColor: DarkColors.blue,
    },
    segmentTitleActive: {
        backgroundColor: Colors.blueDark,
    },
    segmentTitleWrap: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    segmentTitleWrapText: {
        flex: 1,
        justifyContent: 'center',
    },
    segmentTitleEndWrapText: {
        alignItems: 'center',
    },
    segmentTitleSmall: {
        height: 30,
    },
    segmentStartTriangle: {
        position: 'absolute',
        left: 29,
        bottom: -6,
        width: 0,
        height: 0,
        borderTopColor: Colors.blue,
        borderTopWidth: 6,
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderLeftWidth: 6,
        borderLeftColor: 'transparent',
        zIndex: 99,
    },
    segmentStartTriangleDark: {
        borderTopColor: DarkColors.blue,
    },
    segmentStartTriangleActive: {
        borderTopColor: Colors.blueDark,
    },
    segmentEndTriangle: {
        position: 'absolute',
        left: 29,
        top: -6,
        width: 0,
        height: 0,
        borderBottomColor: Colors.blue,
        borderBottomWidth: 6,
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderLeftWidth: 6,
        borderLeftColor: 'transparent',
        zIndex: 99,
    },
    segmentEndTriangleDark: {
        borderBottomColor: DarkColors.blue,
    },
    segmentEndTriangleActive: {
        borderBottomColor: Colors.blueDark,
    },
    segmentTitleText: {
        fontSize: 20,
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
    segmentTitleTextSmall: {
        fontSize: 16,
    },
    date: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    dateInner: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    dateCol: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    dateCircle: {
        marginHorizontal: 28,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.grayDark,
    },
    dateCircleDark: {
        backgroundColor: Colors.white,
    },
    dateDetails: {
        paddingLeft: 70,
    },
    dateAgo: {
        fontSize: 20,
        lineHeight: 22,
        color: Colors.textGray,
        fontFamily: Fonts.regular,
    },
    dateDay: {
        marginTop: 2,
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    segment: {
        position: 'relative',
        marginTop: 8,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
    },
    segmentDark: {
        backgroundColor: Colors.black,
    },
    segmentTripAirportDark: {
        backgroundColor: DarkColors.bg,
    },
    segmentArrow: {
        color: Colors.grayDarkLight,
        marginRight: 9,
    },
    segmentArrowDark: {
        color: Colors.white,
    },
    time: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        maxWidth: 62,
        minWidth: 62,
        paddingLeft: 5,
    },
    timeContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    timeText: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: 20,
        lineHeight: 20,
    },
    smallTimeText: {
        fontSize: 14,
        lineHeight: 15,
    },
    timeTextThrough: {
        marginTop: -2,
        fontSize: 12,
        lineHeight: 12,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
        textDecorationLine: 'line-through',
    },
    timeZone: {
        marginTop: 3,
        fontSize: 9,
        lineHeight: 9,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    icon: {
        flex: 1,
        maxWidth: 50,
        minWidth: 32,
    },
    iconsegment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    details: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.grayLight,
        borderWidth: 1,
        borderColor: '#dadce2',
        paddingRight: 0,
    },
    detailsDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    detailsRight: {
        paddingRight: 0,
    },
    detailsDisabled: {
        borderColor: '#f6f6f6',
    },
    detailsDisabledDark: {
        borderColor: DarkColors.bg,
    },
    detailsPressed: {
        backgroundColor: '#dfe1e6',
    },
    detailsPressedDark: {
        backgroundColor: DarkColors.bgLight,
    },
    detailsDisabledPressedDark: {
        backgroundColor: DarkColors.gray,
    },
    info: {
        flex: 8,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: Colors.textGray,
        fontFamily: Fonts.regular,
    },
    titleBlue: {
        fontSize: 24,
        fontFamily: Fonts.regular,
        color: Colors.blue,
    },
    titleBlueDark: {
        color: DarkColors.blue,
    },
    boldBlue: {
        fontSize: 15,
        fontFamily: Fonts.bold,
        color: Colors.blue,
    },
    silver: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    silverDark: {
        color: DarkColors.text,
    },
    way: {
        flex: 1,
        maxWidth: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    wayTo: {
        color: '#757575',
        // marginHorizontal: 4
    },
    place: {
        height: 40,
        backgroundColor: Colors.blue,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
    },
    dynamicPlace: {
        flex: 1,
        height: 40,
        backgroundColor: Colors.blue,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 55,
        minWidth: 35,
        paddingHorizontal: 3,
    },
    placeDark: {
        backgroundColor: DarkColors.blue,
    },
    placeText: {
        fontSize: 20,
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
    placeTime: {
        flexWrap: 'nowrap',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10,
        maxWidth: '40%',
    },
    placeTimeRow: {
        width: 42,
    },
    placeTimeText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.textGray,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.7,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    overlayDark: {
        backgroundColor: Colors.black,
    },
    deleted: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    deletedDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    deletedSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: '#cc3d5f',
        position: 'relative',
        top: 11,
    },
    deletedSeparatorDark: {
        backgroundColor: DarkColors.red,
    },
    deletedLabel: {
        height: 20,
        backgroundColor: Colors.white,
        padding: 1,
    },
    deletedLabelDark: {
        backgroundColor: DarkColors.bg,
    },
    deletedLabelWrap: {
        borderWidth: 1,
        borderColor: '#cc3d5f',
        height: 18,
        width: 52,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deletedLabelWrapDark: {
        borderColor: DarkColors.red,
    },
    deletedLabelText: {
        color: '#cc3d5f',
        fontFamily: Fonts.regular,
        fontSize: 10,
    },
    deletedLabelTextDark: {
        color: DarkColors.red,
    },
    textDark: {
        color: Colors.white,
    },
    planName: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: 12,
    },
    indent: {
        marginLeft: 10,
    },
    middle: {
        width: 50,
        alignContent: 'center',
        alignItems: 'center',
    },
    dynamicMiddle: {
        flex: 1,
        maxWidth: 50,
        minWidth: 46,
        alignContent: 'center',
        alignItems: 'center',
    },
    duration: {
        marginTop: 5,
        fontFamily: Fonts.regular,
        fontSize: 10,
        lineHeight: 10,
        color: Colors.textGray,
    },
    durationDark: {
        color: DarkColors.text,
    },
    smallText: {
        fontSize: 10,
    },
    flexEnd: {
        alignItems: 'flex-end',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lounges: {
        alignItems: 'flex-end',
        marginRight: 5,
    },
    durationRow: {
        flexDirection: 'row',
        paddingVertical: 3,
    },
    durationMessage: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    durationMargin: {
        marginRight: 3,
    },
    durationMessageDark: {
        color: Colors.white,
    },
    textBold: {
        fontFamily: Fonts.bold,
    },
    marginRight: {
        marginRight: 15,
    },
});
