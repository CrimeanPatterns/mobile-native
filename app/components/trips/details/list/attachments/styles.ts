import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../../styles';

export const style = StyleSheet.create({
    attachmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    fileName: {
        color: isIOS ? Colors.blue : Colors.green,
        fontSize: 16,
        lineHeight: 16,
        fontWeight: '400',
        fontFamily: Fonts.regular,
    },
    fileNameDark: {
        color: Colors.white,
    },
    caption: {
        fontSize: 13,
        lineHeight: 13,
        fontWeight: '400',
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        paddingTop: 9,
    },
    captionDark: {
        color: isIOS ? DarkColors.text : DarkColors.gray,
    },
    leftColumn: {
        width: 44,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middleColumn: {
        flex: 1,
        paddingVertical: 12,
    },
    rightColumn: {
        width: 54,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCancel: {
        position: 'absolute',
        top: 3,
    },
});
