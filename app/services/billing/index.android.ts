import Translator from 'bazinga-translator';
import _ from 'lodash';
import * as IAP from 'react-native-iap';

import API from '../api';
import EventEmitter from '../eventEmitter';
import log from './log';

const PurchaseStateAndroid = {
    UNSPECIFIED_STATE: 0,
    PURCHASED: 1,
    PENDING: 2,
};

// eslint-disable-next-line no-underscore-dangle
const _subscriptions = {};

// eslint-disable-next-line no-underscore-dangle
const _consumables = {};

class BillingService {
    async init(products) {
        log('init', products);
        await IAP.initConnection();
        await this.getAvailablePurchases();
        await this.requestSubscriptionProducts(products);
    }

    getSubscriptions = () => _subscriptions;

    getConsumables = () => _consumables;

    getAvailablePurchases = async () => {
        await IAP.flushFailedPurchasesCachedAsPendingAndroid();
        const transactions = await IAP.getAvailablePurchases();

        log('getAvailablePurchases', transactions);
        if (_.isArray(transactions)) {
            transactions.forEach((transaction) => {
                if (_.isObject(transaction) && transaction.isAcknowledgedAndroid === false) {
                    this.validator(transaction);
                }
            });
        }
    };

    requestSubscriptionProducts = async (skus) => {
        const products = await IAP.getSubscriptions({skus: [...skus, 'android.test.purchased']});

        log('requestSubscriptionProducts', skus, products);

        if (_.isArray(products)) {
            products.forEach((subscription) => {
                _subscriptions[subscription.productId] = subscription;
            });
        }

        return products;
    };

    requestConsumableProducts = async (skus) => {
        const products = await IAP.getProducts({skus});

        log('requestConsumableProducts', skus, products);

        if (_.isArray(products)) {
            products.forEach((consumable) => {
                _consumables[consumable.productId] = consumable;
            });
        }

        return products;
    };

    subscribe = async (productId, profileId, offerToken) => {
        log('subscribe', productId, profileId);

        try {
            const response = await IAP.requestSubscription({
                sku: String(productId),
                obfuscatedAccountIdAndroid: String(profileId),
                obfuscatedProfileIdAndroid: String(profileId),
                subscriptionOffers: [{sku: productId, offerToken}],
            });

            if (response) {
                await this.proccessTransaction(response[0]);
            }
        } catch (e) {
            log('subscribe error', e);
            EventEmitter.emit('billing:cancelled', productId);
        }
    };

    purchase = async (productId, profileId) => {
        log('purchase', productId, profileId);

        try {
            const response = await IAP.requestPurchase({
                skus: [String(productId)],
                obfuscatedAccountIdAndroid: String(profileId),
                obfuscatedProfileIdAndroid: String(profileId),
            });

            await this.proccessTransaction(response[0]);
        } catch (e) {
            log('purchase error', e);
            EventEmitter.emit('billing:cancelled', productId);
        }
    };

    async validator(transactionDetails) {
        const {obfuscatedAccountIdAndroid, developerPayloadAndroid, ...restDetails} = transactionDetails;
        let developerPayload = developerPayloadAndroid;

        if (_.isEmpty(developerPayload) && _.isEmpty(obfuscatedAccountIdAndroid) === false) {
            developerPayload = JSON.stringify({UserID: obfuscatedAccountIdAndroid});
        }

        try {
            log('validate', transactionDetails);
            await API.post(
                '/inAppPurchase/confirm',
                {
                    type: 'android-playstore',
                    ...this._getTransactionProperties(restDetails),
                    developerPayload,
                },
                {
                    retry: 5,
                    timeout: 60000,
                    globalError: false,
                },
            );
        } finally {
            log('finish', {...transactionDetails, developerPayload});
            await IAP.finishTransaction({
                purchase: transactionDetails,
                developerPayloadAndroid: developerPayload,
                isConsumable: !transactionDetails.autoRenewingAndroid,
            });
        }
    }

    _getTransactionProperties = (transactionDetails) => {
        const {
            transactionId: id,
            purchaseToken,
            signatureAndroid: signature,
            transactionReceipt: receipt,
            developerPayloadAndroid: developerPayload,
        } = transactionDetails;

        return {
            id,
            purchaseToken,
            developerPayload,
            receipt,
            signature,
        };
    };

    async proccessTransaction(transactionDetails) {
        const {productId, purchaseStateAndroid} = transactionDetails;

        if (purchaseStateAndroid === PurchaseStateAndroid.PURCHASED) {
            try {
                await this.validator(transactionDetails);
                EventEmitter.emit('billing:purchased', productId);
            } catch (err) {
                EventEmitter.emit('billing:error', {
                    errorMessage: Translator.trans(
                        /** @Desc("Unfortunately the upgrade didn’t go through. Please verify that you are connected to the internet and try again.") */ 'alerts.errorUpgrade',
                        {},
                        'messages',
                    ),
                });
            }
        } else {
            EventEmitter.emit('billing:cancelled', productId);
        }
    }

    canMakePayments = () =>
        new Promise((resolve) => {
            resolve(true);
        });

    restore = _.noop;

    destroy = () => {
        IAP.endConnection();
    };
}

export const Billing = new BillingService();
