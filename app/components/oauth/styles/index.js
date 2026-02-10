import {Platform, StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';
// import {CorporateColors} from '../../../styles/corporate';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.white,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: 1,
        ...Platform.select({
            ios: {
                borderColor: Colors.gray,
            },
            android: {
                borderColor: Colors.grayDarkLight,
            },
        }),
    },
    buttonDark: {
        backgroundColor: DarkColors.bgLight,
        ...Platform.select({
            ios: {
                borderColor: DarkColors.border,
            },
        }),
    },
    relative: {position: 'relative'},
    absolute: {position: 'absolute'},
    text: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.grayDark,
    },
    boldText: {
        fontFamily: Fonts.bold,
        color: '#757575',
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
            },
            android: {
                fontWeight: '500',
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    googleIcon: {
        position: 'absolute',
        flexDirection: 'row',
        flexWrap: 'wrap',
        left: 4,
        top: 3,
        width: 40,
        height: 40,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignContent: 'center',
    },
    googleIconDark: {
        backgroundColor: Colors.white,
    },
    iconContainer: {
        position: 'absolute',
        left: 7,
        top: 8,
        width: 32,
        height: 32,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    yahooIcon: {
        position: 'absolute',
        left: 7,
        top: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    yahooIconDark: {},
    appleIcon: {
        position: 'absolute',
        left: 7,
        top: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    appleIconDark: {},
});
