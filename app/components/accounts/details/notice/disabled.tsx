import React, {ReactElement} from 'react';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import Icon from '../../../icon';
import {AccountBlockItem, AccountKind} from '../row';
import {AccountNotice} from './index';

type AccountDisabledProps = AccountBlockItem<AccountKind.disabled, Record<string, never>>;

class AccountDisabled extends AccountNotice<AccountDisabledProps> {
    get baseColor(): string {
        const colors = this.themeColors;

        return colors.orange;
    }

    get titleColor(): string {
        return isIOS ? this.selectColor(Colors.textGray, Colors.white) : this.selectColor(Colors.grayDark, DarkColors.text);
    }

    // eslint-disable-next-line class-methods-use-this
    get messageIcon(): string {
        return 'warning';
    }

    renderIcon = (): ReactElement => {
        const size = isIOS ? 13 : 20;

        return <Icon name={this.messageIcon} color={this.baseColor} size={size} style={{width: size, height: size}} />;
    };

    onLinkPress = (): void => {
        const {navigation, route} = this.props;

        // @ts-ignore
        if (route.name === 'AccountUpdate') {
            navigation.goBack(); // close modal
        }
        navigation.navigate('AccountEdit', {...route.params, ...{scrollTo: 'disabled'}});
    };
}

export default AccountDisabled;
