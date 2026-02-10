import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../../styles';
import {IconColors} from '../../../../../styles/icons';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        height: 85,
        backgroundColor: Colors.grayLight,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    containerDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
                borderBottomWidth: 0,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    point: {
        width: 120,
        height: 120,
    },
    pointStart: {
        marginLeft: -80,
    },
    pointEnd: {
        marginRight: -80,
    },

    pointItem: {
        flex: 1,
        borderRadius: 120,
        justifyContent: 'center',
        backgroundColor: isIOS ? '#bec2cc' : '#9e9e9e',
        padding: 8,
    },
    pointItemDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.border,
    },
    pointItemActive: {
        backgroundColor: Colors.green,
    },
    pointItemActiveDark: {
        backgroundColor: DarkColors.green,
    },
    pointItemStart: {
        alignItems: 'flex-end',
    },
    pointText: {
        fontFamily: Fonts.bold,
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.white,
    },
    details: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        paddingLeft: 4,
        paddingRight: 4,
    },
    time: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 13,
        fontWeight: 'bold',
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textGreen: {
        color: Colors.green,
    },
    textGreenDark: {
        color: DarkColors.green,
    },
    bar: {
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: 3,
        marginVertical: 5,
        backgroundColor: isIOS ? Colors.borderGray : '#9e9e9e',
    },
    barDark: {
        backgroundColor: isIOS ? DarkColors.gray : DarkColors.border,
    },
    barActive: {
        position: 'absolute',
        top: 0,
        height: 3,
        alignSelf: 'flex-start',
        backgroundColor: Colors.green,
    },
    barActiveDark: {
        backgroundColor: DarkColors.green,
    },
    planeContainer: {
        position: 'absolute',
        top: isIOS ? -10 : -11,
    },
    plane: {
        position: 'absolute',
        color: IconColors.gray,
        transform: [{rotate: '45deg'}],
    },
    planeDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    timeGone: {
        position: 'absolute',
        top: 20,
        left: 0,
        alignItems: 'center',
    },
    timeLeft: {
        position: 'absolute',
        top: 20,
        right: 0,
        alignItems: 'center',
    },
});
