import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    spinner: {
        top: 10,
        alignSelf: 'center',
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: Colors.gray,
        padding: 25,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
    },
    noFoundText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        marginLeft: 25,
        color: Colors.grayDark,
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
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    separatorDark: {
        borderBottomColor: DarkColors.border,
    },
    searchBar: {
        borderBottomWidth: 0,
    },
});
