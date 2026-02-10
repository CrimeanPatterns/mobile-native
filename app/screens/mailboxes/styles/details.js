import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';

const styles = StyleSheet.create({
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
    title: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        paddingHorizontal: 16,
    },
    titleDark: {
        borderColor: DarkColors.border,
    },
    titleIcon: {
        color: Colors.grayDarkLight,
        marginTop: 2,
    },
    titleWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingLeft: 32,
    },
    titleText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 20,
    },
    container: {
        minHeight: 52,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        paddingHorizontal: 16,
    },
    containerDark: {
        backgroundColor: DarkColors.white,
        borderColor: DarkColors.border,
    },
    containerDetails: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    containerStatus: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
    },
    containerStatusText: {
        fontFamily: Fonts.bold,
        color: Colors.grayDark,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'right',
    },
    containerCaption: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        fontSize: 16,
    },
    containerCaptionDark: {
        color: DarkColors.grayLight,
    },
    containerStatusIcon: {
        paddingTop: 6,
    },
    textDark: {
        color: DarkColors.text,
    },
});

export default styles;
