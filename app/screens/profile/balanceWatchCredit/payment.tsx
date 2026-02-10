import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {FormatNumberOptions, IntlShape, useIntl} from 'react-intl';
import {Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Config from 'react-native-config';
import HTML from 'react-native-render-html';

import {BaseThemedPureComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import Spinner from '../../../components/spinner';
import PaymentInvoice from '../../../components/subscription/invoice';
import {isAndroid, isIOS} from '../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../helpers/handleOpenUrl';
import {getMainColor} from '../../../helpers/header';
import {showBalanceWatchPleaseUpgradePopup} from '../../../helpers/popup';
import {getTouchableComponent} from '../../../helpers/touchable';
import {useProfileScreenReload} from '../../../hooks/profile';
import API from '../../../services/api';
import {Billing} from '../../../services/billing';
import EventEmitter, {EventSubscription} from '../../../services/eventEmitter';
import Storage from '../../../storage';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {useTheme} from '../../../theme';
import {ProfileStackParamList, ProfileStackScreenFunctionalComponent} from '../../../types/navigation';

const TouchableRow = getTouchableComponent(TouchableOpacity);

class BalanceWatchCreditsPayment extends BaseThemedPureComponent<
    {
        navigation: StackNavigationProp<ProfileStackParamList, 'BalanceWatchCreditsPayment'>;
        intl: IntlShape;
        reload: typeof useProfileScreenReload;
    },
    {
        UserID: number;
        isLoading: boolean;
        products: {[key: string]: unknown}[];
        count: number;
        product: {
            [key: string]: unknown;
            id: string;
        } | null;
        purchased: boolean;
        processing: boolean;
    }
> {
    private mounted = false;

    private listeners:
        | {
              purchased: EventSubscription;
              cancelled: EventSubscription;
              purchase_start: EventSubscription;
              error: EventSubscription;
          }
        | undefined;

    constructor(props) {
        super(props);

        this.addListeners = this.addListeners.bind(this);
        this.removeListeners = this.removeListeners.bind(this);
        this.onPurchased = this.onPurchased.bind(this);
        this.onCancelled = this.onCancelled.bind(this);
        this.onError = this.onError.bind(this);

        this.renderProduct = this.renderProduct.bind(this);
        this.tryPurchase = this.tryPurchase.bind(this);

        const {UserID} = Storage.getItem('profile');

        this.state = {
            UserID,
            isLoading: true,
            products: [],
            count: 0,
            product: null,
            purchased: false,
            processing: false,
        };
    }

    componentDidMount() {
        this.mounted = true;

        this.addListeners();
        this.getAvailableProducts();
    }

    componentWillUnmount() {
        this.mounted = false;

        this.removeListeners();
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    addListeners() {
        this.listeners = {
            purchase_start: EventEmitter.addListener('billing:purchase_start', this.onPurchaseStart),
            purchased: EventEmitter.addListener('billing:purchased', this.onPurchased),
            cancelled: EventEmitter.addListener('billing:cancelled', this.onCancelled),
            error: EventEmitter.addListener('billing:error', this.onError),
        };
    }

    removeListeners() {
        if (this.listeners) {
            Object.values(this.listeners).map((listener) => listener.remove());
        }
        this.listeners = undefined;
    }

    get mainColor() {
        return getMainColor(this.selectColor(Colors.gold, DarkColors.gold), this.isDark);
    }

    get submitButtonColor() {
        if (isIOS) {
            return this.isDark ? DarkColors.blue : Colors.blueDark;
        }

        return this.mainColor;
    }

    reload = () => {
        const {reload} = this.props;

        reload();
    };

    getProductPrice(product): number {
        if (isAndroid) {
            return product.oneTimePurchaseOfferDetails.priceAmountMicros / (1000 * 1000);
        }
        return product.price;
    }

    prepareProducts(products, consumables) {
        const {intl} = this.props;
        const idField = Platform.select({
            ios: 'identifier',
            android: 'productId',
        }) as string;
        const priceField = isAndroid ? 'oneTimePurchaseOfferDetails' : 'price';
        const oneCreditId = _.find(consumables, {count: 1});
        let oneCreditPrice;

        if (oneCreditId && oneCreditId.id) {
            const oneCreditDetails = _.find(products, {[idField]: oneCreditId.id});

            if (oneCreditDetails && oneCreditDetails[priceField]) {
                oneCreditPrice = this.getProductPrice(oneCreditDetails);
            }
        }

        if (!oneCreditPrice) {
            return [];
        }

        return _.orderBy(
            _.filter(
                Object.values(products).map((product) => {
                    const id = product[idField];
                    const actualPrice = parseFloat(this.getProductPrice(product));

                    if (!consumables[id]) {
                        return null;
                    }

                    let discount = Math.abs(1 - actualPrice / (oneCreditPrice * consumables[id].count));

                    if (discount >= 1) {
                        discount = 0;
                    }
                    const currencyOpts: FormatNumberOptions = {
                        style: 'currency',
                        currency: Platform.select({
                            ios: product.currencyCode,
                            android: product.currency,
                        }) as string,
                    };

                    return {
                        id,
                        desc: Translator.transChoice(
                            /** @Desc("%count% credit|%count% credits") */ 'credits-count',
                            consumables[id].count,
                            {count: consumables[id].count},
                            'mobile-native',
                        ),
                        price: intl.formatNumber(actualPrice, currencyOpts),
                        priceWithoutDiscount: intl.formatNumber(actualPrice / (1 - discount), currencyOpts),
                        discount,
                        discountAmount: intl.formatNumber(actualPrice / (1 - discount) - actualPrice, currencyOpts),
                        actualPrice,
                    };
                }),
                (o) => !_.isNull(o),
            ),
            ['actualPrice'],
        );
    }

    toggleLoader(loading = true) {
        if (!this.mounted) {
            return;
        }

        const {navigation} = this.props;

        navigation.setParams({loading});
    }

    onPurchaseStart = (...args) => {
        console.log('onPurchaseStart', ...args);
    };

    onPurchased(...args) {
        console.log('onPurchased', ...args);

        this.safeSetState(
            {
                purchased: true,
                processing: false,
            },
            () => {
                this.toggleLoader(false);
                this.reload();
                EventEmitter.emit('billing:bwc:purchased');
            },
        );
    }

    onCancelled(...args) {
        console.log('onCancelled', ...args);
        this.safeSetState(
            {
                product: null,
                purchased: false,
                processing: false,
            },
            () => {
                this.toggleLoader(false);
            },
        );
    }

    onError(data) {
        console.log('onError', data);
        if (_.isObject(data)) {
            const {errorMessage} = data;

            this.setError(errorMessage);
        }
        this.safeSetState(
            {
                product: null,
                purchased: false,
                processing: false,
            },
            () => {
                this.toggleLoader(false);
            },
        );
    }

    setError = (error) => {
        Alert.alert('', error, [{text: Translator.trans('button.ok', {}, 'messages')}], {
            cancelable: false,
        });
    };

    _getAvailableProducts = () =>
        API.get('/inAppPurchase/consumables', {
            retry: 5,
            timeout: 60000,
        });

    getAvailableProducts = async () => {
        const response = await this._getAvailableProducts();
        const {data} = response;

        if (_.isObject(data) && data.consumables) {
            const {consumables, count = 0} = data;
            const preparedConsumables = {};

            _.forEach(consumables, (consumable) => {
                preparedConsumables[consumable.id] = consumable;
            });

            try {
                const products = await Billing.requestConsumableProducts(consumables.map((consumable) => consumable.id));

                this.safeSetState({
                    isLoading: false,
                    products: this.prepareProducts(products, preparedConsumables),
                    count,
                });
            } catch (error) {
                if (_.isObject(error)) {
                    const {message: errorMessage} = error;

                    this.onError({errorMessage});
                }
            }
        }
    };

    tryPurchase(product) {
        const {Free} = Storage.getItem('profile');

        if (Free === true) {
            showBalanceWatchPleaseUpgradePopup();
            return;
        }

        let makePayment = false;

        this.safeSetState(
            (state) => {
                const {processing} = state;

                if (processing) {
                    return null;
                }

                makePayment = true;
                return {
                    ...state,
                    processing: true,
                    product,
                };
            },
            () => {
                const {UserID} = this.state;

                if (!makePayment) {
                    return;
                }

                this.toggleLoader(true);

                Billing.canMakePayments().then((canMakePayment) => {
                    if (canMakePayment) {
                        Billing.purchase(product.id, String(UserID));
                    } else {
                        this.safeSetState(
                            {
                                product: null,
                                purchased: false,
                                processing: false,
                            },
                            () => {
                                this.toggleLoader(false);
                            },
                        );
                    }
                });
            },
        );
    }

    renderProducts() {
        const {theme} = this.props;
        const {count, isLoading, products} = this.state;

        const desc = Translator.trans(
            /** @Desc("Balance Watch Credits allow you to schedule frequent updating of an account until we detect the desired change in balance. You can read more about this feature %link_on%here%link_off%.") */
            'balance-watch-desc',
            {
                link_on: '<a href="#faq" style="text-decoration: none">',
                link_off: '</a>',
            },
            'mobile-native',
        );
        const productsArr = Object.values(products);
        const styleTextDark = this.isDark && styles.textDark;

        return (
            <ScrollView
                style={[styles.scrollview, this.isDark && styles.pageDark]}
                contentContainerStyle={{flexGrow: 1}}
                contentInsetAdjustmentBehavior='automatic'>
                {isLoading && <Spinner androidColor={this.mainColor} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && (
                    <>
                        <View style={styles.container}>
                            <View style={[styles.row, this.isDark && styles.rowDark]}>
                                <View style={styles.rowItem}>
                                    <View style={styles.colLeft}>
                                        <Text style={[styles.text, styleTextDark]}>
                                            {`${Translator.trans(/** @Desc("Available Credits") */ 'available-credits', {}, 'mobile-native')}:`}
                                        </Text>
                                    </View>
                                    <View style={styles.colRight}>
                                        <Text style={[styles.boldText, styleTextDark]}>{count}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.container}>
                            <Text style={[styles.label, styleTextDark]}>
                                {Translator.trans(/** @Desc("Buy more") */ 'buy-more', {}, 'mobile-native')}
                            </Text>
                            <View style={[styles.row, this.isDark && styles.rowDark]}>{productsArr.map(this.renderProduct)}</View>
                            <HTML
                                key={`html_${theme}`}
                                containerStyle={{
                                    paddingHorizontal: 16,
                                    ...Platform.select({
                                        ios: {
                                            marginTop: 5,
                                        },
                                        android: {
                                            marginTop: 10,
                                        },
                                    }),
                                }}
                                tagsStyles={{
                                    a: {
                                        color: this.isDark ? DarkColors.blue : Colors.blue,
                                    },
                                }}
                                baseFontStyle={{
                                    fontFamily: Fonts.regular,
                                    lineHeight: 16,
                                    fontSize: 12,
                                    ...Platform.select({
                                        ios: {
                                            color: this.isDark ? Colors.white : Colors.grayDark,
                                        },
                                        android: {
                                            color: '#9e9e9e',
                                        },
                                    }),
                                }}
                                defaultTextProps={{
                                    selectable: false,
                                }}
                                source={{html: desc}}
                                onLinkPress={(_event, href) => {
                                    if (href === '#faq') {
                                        handleOpenUrlAnyway({url: `${Config.API_URL}/faqs#74`});
                                    }
                                }}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        );
    }

    renderProduct(product, i, products) {
        const last = i === products.length - 1;
        const colors = this.themeColors;
        const styleTextDark = this.isDark && styles.textDark;

        return (
            <React.Fragment key={`product_${i}`}>
                <TouchableRow
                    onPress={() => {
                        this.tryPurchase(product);
                    }}>
                    <View style={[styles.rowItem, styles.link]} pointerEvents='box-only'>
                        <View style={styles.colLeft}>
                            <Text style={[styles.text, styleTextDark]}>{product.desc}</Text>
                        </View>
                        <View style={styles.colRight}>
                            {product.discount > 0 && <Text style={[styles.text, styles.strike, styleTextDark]}>{product.priceWithoutDiscount}</Text>}
                            <Text style={[styles.boldText, styleTextDark]}>{product.price}</Text>
                        </View>
                        {isIOS && <Icon style={styles.arrowMore} name='arrow' color={colors.grayDarkLight} size={20} />}
                    </View>
                </TouchableRow>
                {last ? null : <View style={[styles.separator, this.isDark && styles.separatorDark]} />}
            </React.Fragment>
        );
    }

    renderInvoice() {
        const {navigation} = this.props;
        const {product} = this.state;
        // const product = {
        //     desc: 'test',
        //     discount: 50,
        //     priceWithoutDiscount: '1000',
        //     price: '500',
        //     discountAmount: 500,
        // };

        return <PaymentInvoice submitButtonColor={this.submitButtonColor} onContinue={() => navigation.goBack()} product={product} />;
    }

    render() {
        const {purchased} = this.state;

        if (!purchased) {
            return this.renderProducts();
        }

        return this.renderInvoice();
    }
}

const styles = StyleSheet.create({
    scrollview: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 12,
                backgroundColor: Colors.bgGray,
            },
            android: {
                paddingVertical: 24,
                backgroundColor: Colors.white,
            },
        }),
    },
    container: {
        ...Platform.select({
            ios: {
                marginVertical: 12,
            },
            android: {
                marginBottom: 24,
            },
        }),
    },
    row: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        borderColor: Colors.gray,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.white,
                marginTop: 5,
                paddingHorizontal: 16,
            },
            android: {
                marginTop: 10,
                marginLeft: 16,
                paddingRight: 16,
            },
        }),
    },
    rowDark: {
        borderColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    rowItem: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                minHeight: 46,
            },
            android: {
                minHeight: 56,
            },
        }),
    },
    link: {
        ...Platform.select({
            ios: {
                minHeight: 70,
            },
        }),
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
        marginRight: -16,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    colLeft: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    colRight: {
        maxWidth: '70%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    text: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                color: '#000',
            },
            android: {
                fontSize: 16,
                color: Colors.grayDark,
            },
        }),
    },
    boldText: {
        fontFamily: Fonts.bold,
        marginLeft: 8,
        ...Platform.select({
            ios: {
                fontSize: 15,
                fontWeight: 'bold',
                color: '#000',
            },
            android: {
                fontSize: 16,
                fontWeight: '500',
                color: Colors.gold,
            },
        }),
    },
    strike: {
        textDecorationLine: 'line-through',
    },
    label: {
        fontFamily: Fonts.regular,
        paddingHorizontal: 16,
        ...Platform.select({
            ios: {
                color: Colors.grayDark,
                fontSize: 12,
                textTransform: 'uppercase',
            },
            android: {
                fontSize: 20,
                lineHeight: 20,
                color: Colors.gold,
            },
        }),
    },
    arrowMore: {
        marginLeft: 10,
        marginRight: -6,
    },

    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
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
});

export const BalanceWatchCreditsPaymentScreen: ProfileStackScreenFunctionalComponent<'BalanceWatchCreditsPayment'> = ({navigation}) => {
    const theme = useTheme();
    const intl = useIntl();
    const reload = useProfileScreenReload();

    return <BalanceWatchCreditsPayment navigation={navigation} theme={theme} intl={intl} reload={reload} />;
};

BalanceWatchCreditsPaymentScreen.navigationOptions = ({route}) => {
    const options = {
        title: Translator.trans('cart.item.type.balancewatch-credit', {}, 'messages'),
    };

    if (route?.params?.loading) {
        // @ts-ignore
        options.headerTitle = () => <Spinner />;
    }
    return options;
};
