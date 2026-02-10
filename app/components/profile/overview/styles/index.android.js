import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    bgLight: {
        backgroundColor: Colors.white,
    },
    bgDark: {
        backgroundColor: DarkColors.bg,
    },
    badge: {
        backgroundColor: Colors.green,
        borderRadius: 2,
        padding: 2,
    },
    textBadge: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    textDark: {
        color: DarkColors.text,
    },
    emailSuccess: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
    },
    emailSuccessText: {
        fontSize: 13,
        marginLeft: 8,
        fontFamily: Fonts.regular,
        color: '#00a67c',
    },
    emailSuccessIcon: {
        marginTop: 5,
    },
    emailWarning: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.orange,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginTop: 16,
    },
    emailWarningCol: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    emailWarningText: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
    emailWarningDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        paddingHorizontal: 10,
    },
    title: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        marginTop: 34,
        paddingBottom: 15,
        marginLeft: 16,
    },
    titleText: {
        fontSize: 20,
        lineHeight: 20,
        color: Colors.gold,
        fontFamily: Fonts.regular,
    },
    firstRow: {
        borderTopColor: Colors.gray,
        borderTopWidth: 1,
    },
    container: {
        flex: 1,
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    containerWrap: {
        minHeight: 56,
        paddingLeft: 16,
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    containerWrapColumn: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerGray: {
        marginLeft: 0,
        paddingVertical: 0,
    },
    containerGrayWrap: {
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    caption: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
    },
    containerCaption: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    boldText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.gold,
    },
    smallText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: '#9e9e9e',
    },
    containerDetails: {
        flexWrap: 'nowrap',
        flexDirection: 'column',
    },
    containerDetailsRight: {
        flex: 1,
        paddingRight: 20,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    arrow: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    label: {
        marginTop: 24,
        marginBottom: 5,
        paddingHorizontal: 16,
    },
    labelText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 12,
    },
    silver: {
        marginLeft: 16,
        paddingTop: 24,
        paddingBottom: 12,
    },
    silverArrowLight: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    silverArrow: {
        width: 0,
        height: 0,
        opacity: 0,
    },
    silverText: {
        fontSize: 16,
        lineHeight: 16,
        fontFamily: Fonts.regular,
        color: Colors.gold,
    },
    tableRow: {
        flex: 1,
        minHeight: 52,
        flexDirection: 'row',
        paddingVertical: 2,
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
    },
    columnCaption: {
        maxWidth: '65%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        paddingRight: 10,
    },
    columnValue: {
        flex: 1,
        maxWidth: '65%',
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
        marginLeft: 16,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    warningLinkContainer: {
        backgroundColor: Colors.orange,
        padding: 16,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    warningLinkCol: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    warningLinkText: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: Fonts.regular,
    },
    containerDetailsRow: {
        flexDirection: 'row',
    },
});
