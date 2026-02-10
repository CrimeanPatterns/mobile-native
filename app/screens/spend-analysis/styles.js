import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        minHeight: 80,
        paddingVertical: 20,
        backgroundColor: Colors.white,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    containerRow: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    titleCol: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 20,
    },
    title: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        textAlign: 'left',
        ...Platform.select({
            ios: {
                fontSize: 17,
            },
            android: {
                fontSize: 20,
            },
        }),
    },
    subText: {
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 12,
            },
            android: {
                fontSize: 14,
            },
        }),
    },
    headerMargin: {
        marginTop: 25,
    },
    helperSubTitle: {
        marginHorizontal: 16,
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        ...Platform.select({
            ios: {
                marginRight: 10,
                marginLeft: 15,
                width: 24,
            },
            android: {
                width: 50,
                marginRight: 20,
                paddingLeft: 16,
            },
        }),
    },
    iconOffset: {
        paddingTop: 8,
    },
    chartInfo: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.white,
    },
    chartInfoBlock: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        marginRight: 30,
    },
    chartInfoIcon: {
        width: 15,
        height: 15,
    },
    chartInfoText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        marginLeft: 6,
        ...Platform.select({
            ios: {
                fontSize: 11,
            },
            android: {
                fontSize: 12,
            },
        }),
    },
    bottomLink: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    bottomLinkWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10,
    },
    bottomLinkText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        lineHeight: 17,
        color: Colors.textGray,
    },
    bottomLinkArrow: {
        marginRight: -5,
        color: Colors.grayDarkLight,
    },
    bottomLinkArrowDark: {
        color: DarkColors.text,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingVertical: 25,
        paddingHorizontal: 15,
        alignItems: 'flex-start',
    },
    noFoundWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 15,
    },
    noFoundIcon: {
        lineHeight: 17,
    },
    noFoundText: {
        fontSize: 13,
        lineHeight: 17,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    spinner: {
        top: 10,
        alignSelf: 'center',
    },
    separator: {
        backgroundColor: Colors.grayDarkLight,
        height: 1,
    },
    separatorDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.gray,
            },
            android: {
                backgroundColor: DarkColors.border,
            },
        }),
    },
    borderBottom: {
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: Colors.grayDarkLight,
    },
    borderBottomDark: {
        borderBottomColor: DarkColors.border,
    },
    borderTop: {
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    borderTopDark: {
        borderTopColor: DarkColors.border,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
});
