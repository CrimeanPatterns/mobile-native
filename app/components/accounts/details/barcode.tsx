import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Dimensions, Text, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {IAccount} from '../../../types/account';
import Barcode from '../../barcode';
import {BarcodeType} from '../../barcode/types';
import {TouchableBackground} from '../../page/touchable/background';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from './row';
import styles, {
    accountDetailsActiveBackgroundColor,
    accountDetailsActiveBackgroundColorDark,
    accountDetailsRippleColor,
    accountDetailsRippleColorDark,
} from './styles';

let expressions;

type AccountBarcodeProps = AccountBlockItem<
    AccountKind.barcode,
    {
        BarCodeData: string;
        BarCodeType: BarcodeType;
        Custom: boolean;
        Linked: boolean;
    }
> & {
    Visible: string;
};

class AccountBarcode extends AccountDetailsRow<AccountBarcodeProps> {
    static keyExtractor(item: {Kind: string}, index: number, account: IAccount): string {
        if (account && _.isObject(account.BarCodeCustom)) {
            return `${item.Kind}-${index}-${Object.values(account.BarCodeCustom).join('-')}`;
        }
        return `${item.Kind}-${index}`;
    }

    static isVisible(exp: string, account: IAccount): boolean {
        if (!expressions) {
            expressions = require('angular-expressions');
        }

        const evaluate = expressions.compile(exp);

        return evaluate(account);
    }

    getAccountProperties(item: AccountBarcodeProps) {
        const {account} = this.props;
        const properties = {};

        for (const prop in item.Val) {
            if (Object.prototype.hasOwnProperty.call(item.Val, prop)) {
                if (['Linked', 'Custom'].indexOf(prop) === -1) {
                    properties[prop] = _.get(account, item.Val[prop]);
                }
            }
        }

        return properties as {BarCodeData: string; BarCodeType: BarcodeType};
    }

    isVisible(exp: string): boolean {
        const {account} = this.props;

        return AccountBarcode.isVisible(exp, account);
    }

    navigateBarcode = (): void => {
        const {navigation, route} = this.props;

        // @ts-ignore
        navigation.navigate('AccountDetailsBarcode', route.params);
    };

    navigateStoreLocations = (): void => {
        const {
            account: {FID, SubAccountID},
            navigation,
        } = this.props;

        navigation.navigate('StoreLocations', {
            accountId: FID,
            subId: SubAccountID,
        });
    };

    render(): ReactElement | null {
        const {item, hasBlock, account} = this.props;
        const properties = this.getAccountProperties(item);
        const {width} = Dimensions.get('window');

        if (_.isString(item.Visible)) {
            if (!this.isVisible(item.Visible)) {
                return null;
            }
        }

        if (properties && properties.BarCodeData) {
            return (
                <>
                    {this.renderTopSeparator()}
                    <View style={styles.bgWhite}>
                        <TouchableBackground
                            rippleColor={this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark)}
                            activeBackgroundColor={this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark)}
                            onPress={this.navigateBarcode}>
                            <View style={styles.barcode} pointerEvents='box-only'>
                                <Barcode
                                    value={properties.BarCodeData}
                                    format={properties.BarCodeType}
                                    height={60}
                                    width={Math.min(width * 0.8, 400)}
                                />
                            </View>
                        </TouchableBackground>
                    </View>
                    {this.renderBottomSeparator()}
                    {!hasBlock(AccountKind.storeLocations) && account.Kind !== 11 && (
                        <>
                            <TouchableBackground
                                rippleColor={this.selectColor(accountDetailsRippleColor, accountDetailsRippleColorDark)}
                                activeBackgroundColor={this.selectColor(accountDetailsActiveBackgroundColor, accountDetailsActiveBackgroundColorDark)}
                                onPress={this.navigateStoreLocations}>
                                <View style={styles.itemRow} pointerEvents='box-only'>
                                    <Text
                                        style={[
                                            styles.text,
                                            isAndroid && styles.textBlue,
                                            this.isDark && styles.textDark,
                                            this.isDark && isAndroid && styles.textBlueDark,
                                        ]}>
                                        {Translator.trans('store-location.provide', {}, 'mobile')}
                                    </Text>

                                    {isIOS && this.renderArrow()}
                                </View>
                            </TouchableBackground>
                            {this.renderSeparator()}
                        </>
                    )}
                </>
            );
        }

        return null;
    }
}

export default AccountBarcode;
