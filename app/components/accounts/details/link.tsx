import React, {ReactElement} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {TouchableBackground} from '../../page/touchable/background';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles, {
    accountDetailsActiveBackgroundColor,
    accountDetailsActiveBackgroundColorDark,
    accountDetailsRippleColor,
    accountDetailsRippleColorDark,
} from './styles';

export type AccountLinkItem = AccountBlockItem<
    AccountKind.link,
    {
        title: string;
        url: string;
        class?: 'silver' | 'silverFull' | 'blue';
    }
>;

class AccountLink extends AccountDetailsRow<AccountLinkItem> {
    onPress = (): void => {
        const {
            item: {
                Val: {url},
            },
        } = this.props;

        this.navigate(url);
    };

    get touchableBackgroundProps(): {
        rippleColor: string;
        activeBackgroundColor: string;
        style?: StyleProp<ViewStyle>;
    } {
        const {
            item: {
                Val: {class: colorType},
            },
        } = this.props;

        if (colorType === 'silverFull') {
            return {
                rippleColor: this.selectColor(Colors.grayDarkLight, DarkColors.border),
                activeBackgroundColor: this.selectColor(Colors.gray, DarkColors.bg),
                style: [{backgroundColor: Colors.grayLight}, this.isDark && {backgroundColor: DarkColors.bgLight}],
            };
        }

        return {
            rippleColor: this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark),
            activeBackgroundColor: this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark),
        };
    }

    get rowStyle(): StyleProp<ViewStyle> {
        return [styles.itemRow, styles.linkIndents];
    }

    renderLeftColumn(): ReactElement {
        const {
            item: {
                Val: {class: colorType},
            },
        } = this.props;

        if (colorType === 'blue') {
            return <Text style={[{marginRight: 10}, styles.text, styles.textBlue, this.isDark && styles.textBlueDark]}>{this.renderCaption()}</Text>;
        }

        return <View style={{marginRight: 10}}>{super.renderLeftColumn()}</View>;
    }

    renderArrow(): ReactElement | null {
        const {
            item: {
                Val: {class: colorType},
            },
        } = this.props;

        const color = colorType === 'blue' ? this.selectColor(Colors.blue, DarkColors.blue) : undefined;

        return super.renderArrow(color);
    }

    renderCaption(): string {
        const {
            item: {
                Val: {title},
            },
        } = this.props;

        return title;
    }

    renderRightColumn(): ReactElement | null {
        return isIOS ? this.renderArrow() : null;
    }

    renderContent(): ReactElement {
        return (
            <TouchableBackground onPress={this.onPress} {...this.touchableBackgroundProps}>
                {super.renderContent()}
            </TouchableBackground>
        );
    }
}

export default AccountLink;
