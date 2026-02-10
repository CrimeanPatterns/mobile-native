import {StyleSheet} from 'react-native';

import {Colors} from '../../../../styles';

export const borderRadius = 2;

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        position: 'absolute',
        borderRadius,
    },
    skeleton: {
        position: 'absolute',
    },
    iconGranted: {
        position: 'absolute',
        right: -3,
        bottom: -3,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.white,
    },
    iconGrantedDark: {
        backgroundColor: Colors.black,
    },
});
