import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    flex1: {flex: 1},
    segmentStatus: {
        width: 6,
    },
    segmentBlue: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    segmentStart: {
        marginTop: 25,
        position: 'relative',
    },
    segmentActionWrap: {
        flexDirection: 'row',
        height: '100%',
        marginLeft: 1,
    },
    segmentMore: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 68,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    notesIndicator: {
        position: 'absolute',
        right: 7,
        top: 6,
        height: 6,
        width: 6,
        borderRadius: 6,
        backgroundColor: DarkColors.red,
    },
    segmentShare: {
        marginHorizontal: 5,
        alignSelf: 'center',
    },
    segmentNoteWrap: {
        justifyContent: 'center',
    },
    segmentNote: {
        paddingHorizontal: 10,
    },
    segmentHasNotes: {
        backgroundColor: Colors.greenDark,
    },
    segmentHasNotesDark: {
        backgroundColor: '#20b562',
    },
    segmentEnd: {
        marginTop: 20,
    },
    segmentDate: {
        paddingLeft: 74,
        paddingVertical: 3,
    },
    segmentDateText: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    segmentDateTextDark: {
        color: DarkColors.gray,
    },
    segmentTitle: {
        flex: 1,
        position: 'relative',
        flexDirection: 'row',
        backgroundColor: Colors.green,
    },
    segmentTitleDark: {
        backgroundColor: DarkColors.green,
    },
    segmentTitleActive: {
        backgroundColor: Colors.greenDark,
    },
    segmentTitleWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    segmentTitleWrapText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        alignSelf: 'center',
        marginRight: 5,
    },
    segmentCircle: {
        alignSelf: 'center',
        marginHorizontal: 30,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.white,
    },
    segmentCircleDark: {
        backgroundColor: Colors.black,
    },
    segmentStartTriangle: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    segmentEndTriangle: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    segmentTitleText: {
        alignSelf: 'center',
        flex: 1,
        fontSize: 20,
        color: Colors.white,
        fontFamily: Fonts.bold,
        fontWeight: '500',
    },
    segmentTitleTextDark: {
        color: Colors.black,
    },
    segmentTitleTextSmall: {
        fontSize: 20,
    },
    date: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        marginTop: 28,
    },
    dateCol: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    dateCircle: {
        marginHorizontal: 30,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#9e9e9e',
    },
    dateCircleDark: {
        backgroundColor: DarkColors.text,
    },
    dateDetails: {
        paddingLeft: 74,
    },
    dateAgo: {
        fontSize: 20,
        lineHeight: 26,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    dateDay: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    segment: {
        position: 'relative',
        height: 68,
        marginTop: 8,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
    },
    segmentDark: {
        backgroundColor: DarkColors.bg,
    },
    segmentArrow: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    time: {
        flex: 1,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        width: 68,
        paddingLeft: 8,
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
    timeTextError: {
        color: Colors.red,
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
    },
    icon: {
        width: 50,
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
        backgroundColor: DarkColors.bgLight,
        borderColor: DarkColors.border,
    },
    layoverRight: {
        paddingRight: 15,
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    titleBlue: {
        fontSize: 24,
        fontFamily: Fonts.regular,
        color: Colors.green,
    },
    titleBlueDark: {
        color: DarkColors.green,
    },
    boldBlue: {
        fontSize: 15,
        fontFamily: Fonts.bold,
        color: Colors.green,
    },
    silver: {
        fontSize: 14,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    silverDark: {
        color: DarkColors.gray,
    },
    way: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    wayTo: {
        color: '#757575',
        marginHorizontal: 4,
    },
    place: {
        height: 40,
        backgroundColor: Colors.green,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 55,
    },
    dynamicPlace: {
        flex: 1,
        height: 40,
        backgroundColor: Colors.green,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 55,
        minWidth: 35,
        paddingHorizontal: 3,
    },
    placeDark: {
        backgroundColor: DarkColors.green,
    },
    placeText: {
        fontSize: 20,
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
    placeTime: {
        // flex: 1,
        height: 40,
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 10,
    },
    placeTimeText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.grayDark,
    },
    placeTimeRow: {
        width: 42,
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.7,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    overlayDark: {
        backgroundColor: DarkColors.bg,
    },
    deleted: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 68,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
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
    planName: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: 12,
    },
    indent: {
        marginLeft: 10,
    },
    textDark: {
        color: DarkColors.text,
    },
    blackText: {
        color: Colors.black,
    },
    middle: {
        width: 50,
        alignContent: 'center',
        alignItems: 'center',
    },
    dynamicMiddle: {
        flex: 1,
        maxWidth: 50,
        minWidth: 40,
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
        fontWeight: 'bold',
    },
    marginRight: {
        marginRight: 15,
    },
});
