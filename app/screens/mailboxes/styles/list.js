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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        marginTop: 20,
        ...Platform.select({
            ios: {
                borderBottomWidth: 2,
                borderColor: '#bec2cc',
                paddingHorizontal: 15,
            },
            android: {
                borderBottomWidth: 1,
                borderColor: Colors.gray,
                paddingHorizontal: 16,
            },
        }),
    },
    titleDark: {
        borderColor: DarkColors.border,
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
            },
        }),
    },
    titleWrap: {
        flex: 1,
        paddingRight: 10,
    },
    titleText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 25,
            },
            android: {
                fontSize: 24,
            },
        }),
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
    addAccount: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.gray,
    },
    addAccountDark: {
        borderTopColor: DarkColors.border,
    },
    addAccountContainer: {
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.grayLight,
        height: 60,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAccountContainerDark: {
        borderColor: DarkColors.border,
        backgroundColor: DarkColors.bgLight,
    },
    addAccountText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
        marginLeft: 10,
    },
    spinner: {
        paddingTop: 10,
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                paddingTop: 0,
                top: 10,
            },
        }),
    },
    quickActions: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        flexDirection: 'row',
    },
    quickActionsDark: {
        backgroundColor: DarkColors.bgLight,
    },
    swipeButtonText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
});

export default styles;
