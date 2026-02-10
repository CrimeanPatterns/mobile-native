import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert} from 'react-native';

import {Button} from '../../../components/form';
import {HeaderLeftButton} from '../../../components/page/header/button';
import {SubscriptionPlus} from '../../../components/subscription/awplus';
import {isAndroid, isIOS} from '../../../helpers/device';
import API from '../../../services/api';
import {Billing} from '../../../services/billing';
import EventEmitter, {EventSubscription} from '../../../services/eventEmitter';
import StorageSync from '../../../services/storageSync';
import Storage from '../../../storage';
import {Colors} from '../../../styles';
import {useTheme} from '../../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../../types/navigation';

const log = (...args) => {
    console.log('<SubscriptionPayment/>', ...args);
};

class SubscriptionPayment extends SubscriptionPlus {
    static propTypes = {
        ...SubscriptionPlus.propTypes,
        reload: PropTypes.func,
    };

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

        this.safeSetState = this.safeSetState.bind(this);

        this.onPurchased = this.onPurchased.bind(this);
        this.onCancelled = this.onCancelled.bind(this);
        this.onError = this.onError.bind(this);

        this.setProduct = this.setProduct.bind(this);
        this.purchase = this.purchase.bind(this);

        const {products, UserID} = Storage.getItem('profile');
        const productsObj = {};

        products.forEach((product) => {
            productsObj[product.id] = product;
        });

        this.state = {
            isLoading: true,
            product: null,
            products: productsObj,
            purchased: false,
            UserID,
        };
    }

    componentDidMount() {
        this.mounted = true;

        this.listeners = {
            purchase_start: EventEmitter.addListener('billing:purchase_start', this.onPurchaseStart),
            purchased: EventEmitter.addListener('billing:purchased', this.onPurchased),
            cancelled: EventEmitter.addListener('billing:cancelled', this.onCancelled),
            error: EventEmitter.addListener('billing:error', this.onError),
        };

        this.init();
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.listeners) {
            Object.values(this.listeners).map((listener) => listener.remove());
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    async init() {
        this.setLoading(true);
        try {
            const response = await this.getAvailableProduct();

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data) && data.productId) {
                    const {productId} = data;

                    try {
                        await Billing.requestSubscriptionProducts([productId]);
                        this.setProduct(productId);
                        this.setLoading(false);
                    } catch (error) {
                        if (_.isObject(error)) {
                            const {message: errorMessage} = error;

                            this.onError({errorMessage});
                        }
                    }
                }
            }
        } catch (e) {
            log('init', e);
        }
    }

    getProductPrice(product, subscriptionOffer) {
        if (_.isObject(product)) {
            if (isIOS) {
                // @ts-ignore
                return product.localizedPrice;
            }
            if (isAndroid && subscriptionOffer) {
                return subscriptionOffer.pricingPhases.pricingPhaseList[0].formattedPrice;
            }
        }

        return null;
    }

    getPurchaseButtonLabel(product, subscriptionOffer) {
        const price = this.getProductPrice(product, subscriptionOffer);

        if (price) {
            return Translator.trans(/** @Desc("Subscribe for %price% per year") */ 'subscription.subscribe', {price}, 'mobile-native');
        }

        return Translator.trans(/** @Desc("Loading...") */ 'loading', {}, 'mobile-native');
    }

    onPurchaseStart = (...args) => {
        this.setLoading(true);
        log('onPurchaseStart', ...args);
    };

    onPurchased(...args) {
        log('onPurchased', ...args);

        this.setLoading(false);
        this.safeSetState({purchased: true});

        StorageSync.forceUpdate();

        this.success();
    }

    onCancelled(...args) {
        log('onCancelled', ...args);
        this.setLoading(false);
    }

    onError(data) {
        log('onError', data);
        if (_.isObject(data)) {
            const {errorMessage} = data;

            this.setError(errorMessage);
        }
        this.setLoading(false);
    }

    setProduct(productId) {
        const products = Billing.getSubscriptions();

        if (_.isObject(products[productId])) {
            this.safeSetState({
                product: products[productId],
                isLoading: false,
            });
        }
    }

    setError = (error) => {
        this.alert(error);
    };

    success = () => {
        this.alert(Translator.trans('alerts.alreadyUpgraded'), this.close);
    };

    alert = (message, onClose) => {
        const button = {text: Translator.trans('button.ok', {}, 'messages'), onPress: onClose};

        Alert.alert('', message, [button], {
            cancelable: false,
        });
    };

    getAvailableProduct = () =>
        API.get('/inAppPurchase/product', {
            retry: 5,
            timeout: 60000,
        });

    async purchase(productId, offerToken) {
        const {UserID} = this.state;

        if (!productId) {
            return;
        }

        this.setLoading(true);

        log('purchase', {productId, offerToken});

        try {
            await Billing.canMakePayments();
            await Billing.subscribe(productId, String(UserID), offerToken);
        } finally {
            this.setLoading(false);
        }
    }

    _renderPaymentButton() {
        const {product} = this.state;
        const {theme} = this.props;

        const subscriptionOffer = product?.subscriptionOfferDetails?.[0];

        return (
            <Button
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                onPress={() => this.purchase(isIOS ? product?.identifier : product?.productId, subscriptionOffer?.offerToken)}
                label={this.getPurchaseButtonLabel(product, subscriptionOffer)}
                color={Colors.white}
                customStyle={{
                    label: {
                        base: {
                            color: Colors.blueDark,
                        },
                        loading: {
                            color: Colors.white,
                        },
                    },
                }}
                theme={theme}
            />
        );
    }
}

export const SubscriptionPaymentScreen: ProfileStackScreenFunctionalComponent<'SubscriptionPayment'> = ({navigation, route}) => {
    const theme = useTheme();

    // @ts-ignore
    return <SubscriptionPayment theme={theme} navigation={navigation} route={route} />;
};

SubscriptionPaymentScreen.navigationOptions = ({navigation}) => ({
    presentation: 'modal',
    title: 'AwardWallet Plus',
    headerTintColor: Colors.white,
    headerStyle: {
        backgroundColor: Colors.deepBlue,
    },
    headerLeft: () => <HeaderLeftButton testID='close' iconName='android-clear' color={Colors.white} onPress={() => navigation.goBack()} />,
});

export {SubscriptionPayment};
