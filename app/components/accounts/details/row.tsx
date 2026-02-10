import {NavigationProp, RouteProp} from '@react-navigation/native';
import _ from 'lodash';
import React, {ReactElement} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../helpers/handleOpenUrl';
import {Colors, DarkColors} from '../../../styles';
import {ColorScheme} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackParamList} from '../../../types/navigation';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable';
import styles, {
    accountDetailsActiveBackgroundColor,
    accountDetailsActiveBackgroundColorDark,
    accountDetailsRippleColor,
    accountDetailsRippleColorDark,
} from './styles';

export enum AccountKind {
    row = 'row',
    accountNumber = 'accountNumber',
    balance = 'balance',
    barcode = 'barcode',
    card_images = 'card_images',
    date = 'date',
    disabled = 'disabled',
    expirationDate = 'expirationDate',
    login = 'login',
    notice = 'notice',
    storeLocations = 'storeLocations',
    string = 'string',
    warning = 'warning',
    mileValue = 'mileValue',
    upgrade = 'upgrade',
    balanceWatch = 'balanceWatch',
    eliteStatus = 'eliteStatus',
    link = 'link',
    links = 'links',
}

type Kind = keyof typeof AccountKind;

export type AccountBlockItem<K extends Kind, P> = {
    kind: K;
    Name: string;
    Val: P;
};

type BaseItem = {
    Name: string;
    Val: {
        formLink?: string;
    };
};

export type AccountDetailsMainProps = {
    theme: ColorScheme;
    index: number;
    navigation: NavigationProp<AccountsStackParamList, 'AccountDetails'>;
    route: RouteProp<AccountsStackParamList, 'AccountDetails'>;
    account: IAccount;
    parentAccount?: IAccount;
    hasBlock: (kind: Kind) => boolean;
    toggleMileValue: () => void;
};

export type AccountDetailsRowProps<I> = AccountDetailsMainProps & {
    item: BaseItem & I;
};

class AccountDetailsRow<I, P = Record<string, unknown>> extends BaseThemedPureComponent<AccountDetailsRowProps<I> & P, null> {
    get isTouchable(): boolean {
        return _.isString(this.props.item?.Val?.formLink);
    }

    static keyExtractor(item: {Kind: string}, index: number, _account?: IAccount): string {
        return `${item.Kind}-${index}`;
    }

    // eslint-disable-next-line class-methods-use-this
    get accessibilityLabel(): string | undefined {
        return undefined;
    }

    // eslint-disable-next-line class-methods-use-this
    get rightColumnStyle(): StyleProp<ViewStyle> {
        return styles.rightColumn;
    }

    // eslint-disable-next-line class-methods-use-this
    get leftColumnStyle(): StyleProp<ViewStyle> {
        return styles.leftColumn;
    }

    // eslint-disable-next-line class-methods-use-this
    get rowStyle(): StyleProp<ViewStyle> {
        return styles.itemRow;
    }

    // eslint-disable-next-line class-methods-use-this
    navigate(url: string): void {
        handleOpenUrlAnyway({url});
    }

    onPress = (): void => {
        const {item} = this.props;

        if (_.isString(item.Val?.formLink)) {
            this.navigate(item.Val.formLink);
        }
    };

    renderSeparator(): ReactElement {
        return <View style={[styles.separator, this.isDark && styles.separatorDark]} />;
    }

    renderTopSeparator(): ReactElement | null {
        return isAndroid ? this.renderSeparator() : null;
    }

    renderBottomSeparator(): ReactElement | null {
        return isIOS ? this.renderSeparator() : null;
    }

    renderArrow(color?: string): ReactElement | null {
        return <Icon style={[styles.iconArrow]} name='arrow' color={color || this.selectColor(Colors.grayDarkLight, DarkColors.gray)} size={20} />;
    }

    renderCaption(): string {
        const {
            item: {Name},
        } = this.props;

        return Name;
    }

    // eslint-disable-next-line class-methods-use-this
    renderRightColumn(): ReactElement | null {
        return null;
    }

    renderLeftColumn(): ReactElement {
        return <Text style={[styles.text, this.isDark && styles.textDark]}>{this.renderCaption()}</Text>;
    }

    renderContent(): ReactElement {
        return (
            <View style={this.rowStyle} accessible accessibilityLabel={this.accessibilityLabel}>
                <View style={this.leftColumnStyle}>{this.renderLeftColumn()}</View>
                <View style={this.rightColumnStyle}>{this.renderRightColumn()}</View>
            </View>
        );
    }

    renderTouchableContent(): ReactElement {
        return (
            <TouchableBackground
                rippleColor={this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark)}
                activeBackgroundColor={this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark)}
                onPress={this.onPress}>
                {this.renderContent()}
            </TouchableBackground>
        );
    }

    render(): ReactElement | null {
        return (
            <>
                {this.renderTopSeparator()}
                {this.isTouchable ? this.renderTouchableContent() : this.renderContent()}
                {this.renderBottomSeparator()}
            </>
        );
    }
}

export default AccountDetailsRow;
