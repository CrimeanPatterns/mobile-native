import {StyleSheet} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors} from '../../../../styles';

export default StyleSheet.create({
    list: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    listDark: {
        backgroundColor: Colors.black,
    },
    footer: {
        height: isIOS ? 50 : 0,
    },
});
