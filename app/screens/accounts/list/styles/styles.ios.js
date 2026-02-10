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
        backgroundColor: Colors.grayLight,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        height: 42,
    },
    blogDark: {
        backgroundColor: DarkColors.bg,
        borderBottomColor: Colors.black,
    },
    newWrap: {
        backgroundColor: Colors.blue,
        marginRight: 9,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 3,
    },
    newWrapDark: {
        backgroundColor: DarkColors.blue,
    },
    newText: {
        color: Colors.white,
        fontWeight: '700',
    },
    blogLink: {
        flex: 1,
        color: Colors.blue,
        fontSize: 13,
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    blogLinkDark: {
        color: DarkColors.blue,
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
    noFoundText: {
        fontSize: 13,
        marginHorizontal: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.black,
        fontSize: 15,
    },
    textDark: {
        color: Colors.white,
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    animatedButtonContainer: {
        position: 'absolute',
        zIndex: 1,
        margin: 10,
        padding: 5,
        right: 0,
        bottom: 0,
    },
    actionButton: {
        position: 'absolute',
        zIndex: 1,
        margin: 10,
        padding: 5,
        right: 0,
        bottom: 0,
    },
});
