import React, {ReactElement} from 'react';
import {Text} from 'react-native';

import {PathConfig} from '../../../navigation/linking';
import {navigateByPath} from '../../../services/navigator';
import {Colors, DarkColors} from '../../../styles';
import {TouchableBackground} from '../../page/touchable/background';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountUpgradeProps = AccountBlockItem<AccountKind.upgrade, string>;

class Upgrade extends AccountDetailsRow<AccountUpgradeProps> {
    navigate = (): void => {
        navigateByPath(PathConfig.SubscriptionPayment);
    };

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;

        return (
            <Text
                style={[styles.textBold, this.isDark && styles.textDark, styles.textBlue, this.isDark && styles.textBlueDark, {textAlign: 'right'}]}>
                {Val}
            </Text>
        );
    }

    render(): ReactElement {
        return (
            <>
                {this.renderTopSeparator()}
                <TouchableBackground
                    rippleColor={this.selectColor(Colors.gray, DarkColors.border)}
                    activeBackgroundColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                    accessibilityLabel={this.accessibilityLabel}
                    underlayColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                    onPress={this.navigate}>
                    {this.renderContent()}
                </TouchableBackground>
                {this.renderBottomSeparator()}
            </>
        );
    }
}

export default Upgrade;
