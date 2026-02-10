import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors} from '../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        // ???
        // ...Platform.select({
        //     android: {
        //         marginTop: 8,
        //     },
        // }),
    },
    containerDark: Platform.select({
        ios: {
            backgroundColor: Colors.black,
        },
        android: {
            backgroundColor: DarkColors.bg,
        },
    }),
    separator: Platform.select({
        ios: {
            height: 1,
            backgroundColor: Colors.gray,
        },
    }),
    separatorDark: Platform.select({
        ios: {
            backgroundColor: DarkColors.border,
        },
    }),
});

const notVerifiedStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    contentContainer: {
        padding: 0,
    },
    p: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    button: {
        marginVertical: 10,
    },
    buttonContainer: {
        flex: 1,
        paddingHorizontal: '15%',
    },
    buttonLabel: {
        color: Colors.white,
    },
});

const forbiddenStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    contentContainer: {
        flexGrow: 1,
    },
});

export {notVerifiedStyles, forbiddenStyles};
