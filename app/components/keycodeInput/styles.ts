import {StyleSheet} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    keyCode: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 20,
    },
    keyCodeInput: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontSize: 0.1,
    },
    keyCodeBoxPoint: {
        width: 20,
        position: 'relative',
        height: 20,
        marginHorizontal: 5,
    },
    keyCodeBoxLine: {
        position: 'relative',
        width: 20,
        height: 20,
        marginRight: 10,
    },
    keyCodeBarPoint: {
        position: 'absolute',
        backgroundColor: Colors.grayDark,
        borderRadius: 4,
        height: 8,
        width: 8,
        top: 5,
        left: 6,
    },
    keyCodeBarLine: {
        position: 'absolute',
        backgroundColor: Colors.grayDark,
        height: 2,
        width: 20,
        top: 18,
        left: 0,
    },
    keyCodeBarDark: {
        backgroundColor: Colors.white,
    },
    keyCodeText: {
        fontSize: 20,
        lineHeight: 20,
        height: 20,
        textAlign: 'center',
        width: 20,
        color: Colors.blue,
        fontFamily: Fonts.regular,
    },
    keyCodeTextDark: {
        color: DarkColors.blue,
    },
    separator: {
        marginRight: 20,
    },
});
