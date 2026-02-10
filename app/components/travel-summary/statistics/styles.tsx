import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statisticsElement: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    ring: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
        height: 70,
        borderWidth: 4,
        borderRadius: 70,
    },
    value: {
        fontFamily: Fonts.regular,
        fontWeight: 'bold',
        fontSize: 28,
        paddingHorizontal: 5,
    },
    valueDark: {
        color: Colors.white,
    },
    label: {
        position: 'absolute',
        bottom: -12,
        borderWidth: 3,
        borderRadius: 6,
        alignItems: 'center',
    },
    labelValue: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        fontWeight: 'bold',
    },
    iconContainer: {
        position: 'absolute',
        minWidth: 32,
        height: 32,
        right: -10,
        top: -11,
        borderWidth: 3,
        borderRadius: 16,
        alignItems: 'center',
        alignContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontFamily: Fonts.regular,
        fontSize: 14,
        marginTop: 10,
        color: Colors.grayDark,
    },
    titleDark: {
        color: DarkColors.text,
    },
    icon: {
        lineHeight: 28,
    },
    changesContainer: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    changes: {
        fontFamily: Fonts.regular,
        fontWeight: 'bold',
        fontSize: 12,
    },
    hint: {
        position: 'absolute',
        textAlign: 'center',
        maxHeight: 15,
        bottom: 2,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Fonts.regular,
    },
});
