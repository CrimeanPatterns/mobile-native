import {Colors, DarkColors, Fonts} from '@styles/index';
import formColor from 'color';
import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';

export default StyleSheet.create({
    buttonBarWrap: {
        paddingHorizontal: 11,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.white,
        shadowColor: formColor(Colors.grayDark).alpha(0.05).rgb().toString(),
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        ...Platform.select({
            ios: {
                height: 54,
                paddingHorizontal: 18,
            },
            android: {
                height: 44,
                paddingHorizontal: 14,
            },
        }),
    },
    buttonWrap: {
        marginHorizontal: 4,
    },
    buttonDark: {
        backgroundColor: isIOS ? DarkColors.grayDark : DarkColors.bgLight,
    },
    label: {
        flex: 1,
        flexWrap: 'wrap',
        fontFamily: Fonts.regular,
        fontWeight: '600',
        marginLeft: 10,
        lineHeight: 14,
        justifyContent: 'flex-end',
        ...Platform.select({
            ios: {
                color: Colors.blue,
                paddingTop: 5,
                fontSize: 14,
            },
            android: {
                paddingTop: 2,
                color: Colors.blueDark,
                fontSize: 13,
            },
        }),
    },
    labelDark: {
        color: DarkColors.blue,
    },
    iconBackground: {
        height: 24,
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: isIOS ? Colors.blue : Colors.blueDark,
    },
    iconBackgroundDark: {
        backgroundColor: DarkColors.blue,
    },
    totalsMore: {
        ...Platform.select({
            ios: {
                marginLeft: 15,
            },
        }),
    },
});
