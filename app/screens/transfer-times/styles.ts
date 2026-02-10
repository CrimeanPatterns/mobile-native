import {StyleSheet} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors} from '../../styles';

export default StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});
