import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors} from '../../styles';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 15,
        marginBottom: 20,
    },
    pageContainer: {
        backgroundColor: Colors.white,
    },
    pageContainerDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    title: {
        flex: 1,
    },
    text: {
        marginHorizontal: 15,
        marginBottom: 20,
    },
    image: {
        height: 300,
        marginBottom: 20,
        backgroundColor: Colors.gray,
    },
    imageDark: {
        backgroundColor: DarkColors.bgLight,
    },
    comments: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 35,
    },
    standardMarginBottom: {
        marginBottom: 15,
    },
    smallMarginBottom: {
        marginBottom: 5,
    },
    mediumMarginBottom: {
        marginBottom: 8,
    },
    largeMarginBottom: {
        marginBottom: 30,
    },
    smallMarginLeft: {
        marginLeft: 5,
    },
    mediumMarginLeft: {
        marginLeft: 10,
    },
    horizontalIndents: {
        marginHorizontal: 15,
    },
    aboutPost: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowFlexEnd: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    author: {
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: Colors.grayLight,
    },
    authorDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    aboutAuthor: {
        marginHorizontal: 15,
        marginVertical: 30,
    },
    socialNetworkIcon: {
        marginHorizontal: 10,
    },
});
