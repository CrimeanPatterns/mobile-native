import {StyleSheet} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import AccountDetailsRow from './row';
import styles from './styles';

class AccountSubTitle extends AccountDetailsRow<{}> {
    get rowStyle() {
        return [styles.itemRow, customStyles.rowStyle, this.isDark && customStyles.rowStyleDark];
    }
}

export default AccountSubTitle;

const customStyles = StyleSheet.create({
    rowStyle: {
        minHeight: 42,
        backgroundColor: Colors.grayLight,
    },
    rowStyleDark: {
        backgroundColor: DarkColors.bgLight,
    },
});
