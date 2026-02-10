import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import AccountDisplayName from '../../../components/accounts/details/displayName';
import Barcode from '../../../components/barcode';
import {BaseThemedComponent} from '../../../components/baseThemed';
import {Button} from '../../../components/form';
import HeaderButton from '../../../components/page/header/button';
import {isAndroid} from '../../../helpers/device';
import {useAccount} from '../../../hooks/account';
import BarcodeManager from '../../../services/barcode';
import NotificationManager from '../../../services/notification';
import {BarcodeNotification} from '../../../services/notification/barcode';
import Storage from '../../../storage';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ColorScheme, useTheme} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import ScanBarcode from '../../barcode/scan';

const buttonCustomStyle = {
    base: {
        marginHorizontal: 0,
        width: '100%',
        ...Platform.select({
            android: {
                height: 45,
                paddingVertical: 4,
            },
        }),
    },
};

class AccountDetailsBarcode extends BaseThemedComponent<{
    theme: ColorScheme;
    navigation: StackNavigationProp<AccountsStackParamList, 'AccountDetailsBarcode'>;
    route: RouteProp<AccountsStackParamList, 'AccountDetailsBarcode'>;
    account: IAccount;
    parentAccount?: IAccount;
}> {
    _scanBarcode = React.createRef();

    constructor(props) {
        super(props);

        this.onBarCodeRead = this.onBarCodeRead.bind(this);
        this.removeBarcode = this.removeBarcode.bind(this);
        this.testPush = this.testPush.bind(this);
    }

    componentDidMount() {
        const {account, navigation} = this.props;

        if (account) {
            if (this.isCustom() && this.hasAccess()) {
                navigation.setParams({removeBarcode: this.removeBarcode});
            }
        }
    }

    get scanBarcode() {
        return this._scanBarcode.current;
    }

    isCustom() {
        const {account, route} = this.props;
        const {type} = route.params;

        if ((!type || type !== 'parsed') && account.BarCodeCustom && account.BarCodeCustom.BarCodeData) {
            return true;
        }

        return false;
    }

    get isQR() {
        const {account} = this.props;

        return account.BarcodeType === 'qrcode';
    }

    hasAccess() {
        const {parentAccount} = this.props;
        let {
            account: {Access},
        } = this.props;

        if (_.isObject(parentAccount)) {
            Access = parentAccount.Access;
        }

        return _.isObject(Access) && Access.edit;
    }

    getBarcode() {
        const {account} = this.props;

        if (account) {
            const {BarCodeCustom, BarCodeParsed} = account;

            if (this.isCustom()) {
                return BarCodeCustom;
            }

            return BarCodeParsed;
        }

        return undefined;
    }

    onBarCodeRead(barcode) {
        const {data: BarCodeData, type: BarCodeType} = barcode;
        const {navigation, route} = this.props;
        const {ID, SubAccountID} = route.params;

        BarcodeManager.save(
            {
                Id: ID,
                subId: SubAccountID,
            },
            {
                BarCodeData,
                BarCodeType,
            },
        );

        if (this.isCustom() === false) {
            navigation.replace('AccountDetailsBarcode', {...route.params, type: 'custom'});
        }
    }

    removeBarcode() {
        const {navigation, route} = this.props;
        const {ID, SubAccountID} = route.params;
        const message = {
            qrcode: Translator.trans('delete-qrcode', {}, 'mobile-native'),
            barcode: Translator.trans('delete.barcode', {}, 'mobile'),
        };

        Alert.alert(
            Translator.trans('alerts.text.confirm', {}, 'messages'),
            this.isQR ? message.qrcode : message.barcode,
            [
                {
                    text: Translator.trans('cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => {
                        BarcodeManager.remove(
                            {
                                Id: ID,
                                subId: SubAccountID,
                            },
                            {
                                BarCodeData: null,
                                BarCodeType: null,
                            },
                        );
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    testPush() {
        const {account, parentAccount} = this.props;
        const barcode = this.getBarcode();
        let properties = {
            account,
            barcode,
        };

        if (_.isNil(parentAccount) === false) {
            properties = {
                // @ts-ignore
                account: parentAccount,
                subAccount: account,
                barcode,
            };
        }

        const notification = new BarcodeNotification(properties, {});

        NotificationManager.createGeoNotifications([
            {
                notification: {
                    ...Platform.select({
                        android: {
                            id: 0,
                        },
                        ios: {
                            id: 'test',
                        },
                    }),
                    ...notification.notification,
                },
                trigger: {
                    type: 'timeInterval',
                    timeInterval: {
                        interval: 5,
                        repeats: false,
                    },
                },
            },
        ]);
    }

    renderHeader = () => {
        const {account, theme} = this.props;

        return (
            _.isObject(account) && <AccountDisplayName theme={theme} title={account.DisplayName} styles={{container: {justifyContent: 'center'}}} />
        );
    };

    renderBarcode = () => {
        const {account} = this.props;
        const barcode = this.getBarcode();
        const {width} = Dimensions.get('window');

        return (
            <>
                {barcode && (
                    <View style={styles.barcode}>
                        <View style={{backgroundColor: this.isDark ? Colors.white : Colors.grayLight}}>
                            <Barcode value={barcode.BarCodeData} format={barcode.BarCodeType} height={60} width={width * 0.8} />
                        </View>
                        {['QR_CODE', 'AZTECCODE', 'DATA_MATRIX'].indexOf(barcode.BarCodeType) === -1 && (
                            <Text
                                style={[styles.barcodeTitle, this.isDark && styles.textDark]}
                                numberOfLines={Platform.select({ios: 1, android: 2})}
                                adjustsFontSizeToFit
                                minimumFontScale={0.5}
                                suppressHighlighting
                                selectable>
                                {barcode.BarCodeData}
                            </Text>
                        )}
                    </View>
                )}
                {_.isObject(account) && !barcode && (
                    <Text
                        style={[styles.barcodeTitle, this.isDark && styles.textDark]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        suppressHighlighting
                        selectable>
                        {account.Number || account.Login}
                    </Text>
                )}
            </>
        );
    };

    renderButtons = () => {
        const {theme} = this.props;
        const barcode = this.getBarcode();
        const {impersonate} = Storage.getItem('profile');
        const buttonColor = Platform.select({
            ios: this.selectColor('#1466b3', DarkColors.blue),
            android: this.selectColor(Colors.blueDark, DarkColors.blue),
        });
        const label = {
            qrcode: Translator.trans(/** @Desc("Scan New QR Code")  */ 'scan-qrcode', {}, 'mobile-native'),
            barcode: Translator.trans('scan-barcode', {}, 'mobile'),
        };

        return (
            <>
                {impersonate === true && _.isObject(barcode) && (
                    <Button theme={theme} onPress={() => this.testPush()} label='Test' raised customStyle={buttonCustomStyle} color={buttonColor} />
                )}
                {this.hasAccess() && (
                    <Button
                        theme={theme}
                        onPress={() => this.scanBarcode.open()}
                        label={this.isQR ? label.qrcode : label.barcode}
                        raised
                        customStyle={buttonCustomStyle}
                        color={buttonColor}
                    />
                )}
            </>
        );
    };

    render() {
        return (
            <>
                <SafeAreaView style={[styles.page, this.isDark && styles.pageDark]}>
                    <View style={styles.container}>
                        {this.renderHeader()}
                        {this.renderBarcode()}
                        {this.renderButtons()}
                    </View>
                </SafeAreaView>
                <ScanBarcode type={this.isQR ? 'qrcode' : 'barcode'} ref={this._scanBarcode} onBarCodeRead={this.onBarCodeRead} />
            </>
        );
    }
}

export {AccountDetailsBarcode};

export const AccountDetailsBarcodeScreen: AccountsStackScreenFunctionalComponent<'AccountDetailsBarcode'> = ({navigation, route}) => {
    const {ID, SubAccountID} = route.params;
    const {account, parentAccount} = useAccount(ID, SubAccountID);
    const theme = useTheme();

    return <AccountDetailsBarcode theme={theme} navigation={navigation} route={route} account={account} parentAccount={parentAccount} />;
};

AccountDetailsBarcodeScreen.navigationOptions = ({route}) => {
    const removeBarcode = route.params.removeBarcode ?? false;
    let headerRight;

    if (_.isFunction(removeBarcode)) {
        headerRight = <HeaderButton title={Translator.trans('card-pictures.label.remove', {}, 'messages')} onPress={removeBarcode} />;

        if (isAndroid) {
            headerRight = <HeaderButton iconName='android-delete_outline' onPress={removeBarcode} />;
        }
    }

    return {
        title: '',
        headerRight: () => headerRight,
    };
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: Colors.grayLight,
        flex: 1,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
    },
    barcodeTitle: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        color: Colors.blue,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        fontSize: Platform.select({
            ios: 50,
            android: 25,
        }),
    },
    textDark: {
        color: DarkColors.blue,
    },
});
