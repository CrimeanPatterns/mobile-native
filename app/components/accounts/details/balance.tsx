import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Platform, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors} from '../../../styles';
import Icon from '../../icon';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles from './styles';

type AccountBalanceProps = AccountBlockItem<
    AccountKind.balance,
    {
        Balance: string;
        BalanceRaw: number;
        LastChange: string;
        LastChangeRaw: number;
        formLink?: string;
    }
>;

class AccountBalance extends AccountDetailsRow<AccountBalanceProps> {
    // eslint-disable-next-line class-methods-use-this
    get isTouchable(): boolean {
        return this.hasBalanceChart();
    }

    static isLastChangeDate(date: string | number | Date, duration = 24): boolean {
        const date1 = new Date(date);

        return Math.abs(Date.now() - date1.getTime()) / 3600000 < duration;
    }

    get accessibilityLabel(): string {
        const {
            item: {
                Name,
                Val: {Balance},
            },
        } = this.props;

        return `${Name} ${Balance}`;
    }

    onPress = (): void => {
        const {
            navigation,
            route,
            item: {
                Val: {formLink},
            },
        } = this.props;

        if (_.isString(formLink)) {
            this.navigate(formLink);
        } else {
            navigation.navigate('AccountBalanceChart', route.params);
        }
    };

    hasBalanceChart(): boolean {
        const {account} = this.props;

        if (_.isObject(account) && _.isBoolean(account.HasBalanceChart)) {
            return account.HasBalanceChart;
        }

        return false;
    }

    renderRightColumn(): ReactElement {
        const {
            item: {Val},
        } = this.props;
        const {Balance, LastChange, LastChangeRaw} = Val;
        const colors = this.themeColors;
        const iconStyle = {
            backgroundColor: this.selectColor(Colors.white, Colors.black),
            width: 24,
            height: 24,
        };

        return (
            <View style={styles.row}>
                <View style={styles.flexEnd}>
                    <Text
                        style={[styles.text, styles.textBold, this.isDark && styles.textDark]}
                        selectable
                        suppressHighlighting /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...Platform.select({
                            android: {
                                // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                                key: Math.random(),
                            },
                        })}>
                        {Balance}
                    </Text>
                    {_.isString(LastChange) && (
                        <Text
                            style={[
                                styles.text,
                                this.isDark && styles.textDark,
                                LastChangeRaw > 0 && {color: colors.green},
                                LastChangeRaw < 0 && {color: colors.blue},
                            ]}>
                            {LastChange}
                        </Text>
                    )}
                </View>
                <View style={styles.marginLeft}>
                    {LastChangeRaw > 0 && <Icon name='square-arrow' color={colors.green} size={24} style={iconStyle} />}
                    {LastChangeRaw < 0 && (
                        <Icon name='square-arrow' color={colors.blue} size={24} style={[iconStyle, {transform: [{rotate: '180deg'}]}]} />
                    )}
                </View>
                {isIOS && this.isTouchable && this.renderArrow()}
            </View>
        );
    }
}

class PreviewAccountBalance extends AccountBalance {
    renderArrow = (): null => null;
}

export default AccountBalance;
export {PreviewAccountBalance};
