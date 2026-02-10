import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.grayLight,
    },
    pageDark: {
        backgroundColor: DarkColors.bg,
    },
    blog: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        paddingHorizontal: 16,
        height: 43,
        backgroundColor: Colors.grayLight,
    },
    blogDark: {
        backgroundColor: DarkColors.bgLight,
        borderBottomColor: DarkColors.border,
    },
    newWrap: {
        backgroundColor: Colors.blueDark,
        marginRight: 9,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: 3,
    },
    newText: {
        color: Colors.white,
        fontWeight: '700',
    },
    blogLink: {
        flex: 1,
        color: Colors.blueDark,
        fontSize: 16,
        fontFamily: Fonts.regular,
        fontWeight: '700',
    },
    blogLinkDark: {
        color: DarkColors.blue,
    },
    arrowMore: {
        width: 0,
        height: 0,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
        padding: 25,
    },
    noFoundText: {
        fontSize: 13,
        marginLeft: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: DarkColors.bg,
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.black,
        fontSize: 16,
    },
    textDark: {
        color: DarkColors.text,
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    discoveredHeader: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.gray,
    },
    discoveredHeaderDark: {
        borderBottomColor: DarkColors.border,
    },
    actionButtonWrap: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    actionButton: {
        position: 'relative',
    },
});
