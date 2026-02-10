import {Platform, StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                marginTop: 10,
            },
        }),
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    rowDateInfo: {
        marginVertical: 10,
    },
    titleContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        paddingRight: isIOS ? 15 : 16,
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 15 : 16,
    },
    dateInfo: {
        fontSize: 13,
        color: Colors.grayDark,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    message: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        marginTop: isIOS ? 10 : 8,
        paddingVertical: isIOS ? 5 : 11,
        paddingHorizontal: isIOS ? 10 : 16,
    },
    hasBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    borderDark: {
        borderBottomColor: DarkColors.border,
    },
    text: {
        color: Colors.white,
        fontFamily: Fonts.regular,
        textDecorationLine: 'underline',
        fontSize: isIOS ? 12 : 14,
    },
    icon: isIOS
        ? {
              width: 24,
              marginRight: 10,
              flexDirection: 'row',
              justifyContent: 'center',
          }
        : {
              marginHorizontal: 16,
          },
});
