import formColor from 'color';
import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    cardBarWrap: {
        paddingHorizontal: 11,
    },
    card: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    cardWrap: {
        marginHorizontal: 4,
    },
    numberBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: Fonts.regular,
        color: formColor(Colors.grayDark).alpha(0.5).rgb().toString(),
        fontSize: isIOS ? 14 : 12,
    },
    titleDark: {
        color: formColor(Colors.white).alpha(0.5).rgb().toString(),
    },
    value: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        fontWeight: '700',
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    changesBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    changes: {
        fontFamily: Fonts.regular,
        fontSize: 14,
    },
    iconDB: {
        marginRight: 6,
    },
    iconArrowUp: {
        marginRight: 5,
    },
    iconArrowDown: {
        transform: [{rotate: '180deg'}],
        marginRight: 5,
    },
    plug: {
        height: 19,
    },
});
