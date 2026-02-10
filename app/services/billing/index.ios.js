/* eslint-disable no-underscore-dangle */
import Translator from 'bazinga-translator';
import _ from 'lodash';
import {Alert, NativeEventEmitter} from 'react-native';
import StoreKit from 'react-native-storekit';

import API from '../api';
import EventEmitter from '../eventEmitter';

const TRANSACTION_STATE = {
    PURCHASING: 0,
    PURCHASED: 1,
    FAILED: 2,
    RESTORED: 3,
};
const _products = {};

class BillingService {
    constructor() {
        this.emitter = new NativeEventEmitter(StoreKit);
        this.onTransactionStateUpdate = this.onTransactionStateUpdate.bind(this);
    }

    /**
     * @param {string[]} products The product identifiers
     * Prepare module for purchase flow.
     */
    init(products) {
        this.transactionState = this.emitter.addListener('transactionState', this.onTransactionStateUpdate);
        this.restoredCompletedTransactions = this.emitter.addListener('restoredCompletedTransactions', this.onRestoredCompletedTransactions);

        StoreKit.addTransactionObserver();
        StoreKit.getPendingTransactions((transactions) => {
            if (_.isArray(transactions)) {
                transactions.map((transaction) => this.proccessTransaction(transaction));
            }
        });
        this.requestProducts(products);
    }

    /**
     * Request products
     * @param {string[]} products The product identifiers
     * @returns {Promise}
     */
    requestProducts = (products) => {
        // eslint-disable-next-line no-param-reassign
        products = products.map((product) => String(product));

        return new Promise((resolve, reject) => {
            StoreKit.requestProducts(products, (response) => {
                if (_.isArray(response)) {
                    response.forEach((product) => {
                        _products[product.identifier] = product;
                    });
                    resolve(_products);
                } else {
                    reject(response);
                }
            });
        });
    };

    requestSubscriptionProducts(products) {
        return this.requestProducts(products);
    }

    requestConsumableProducts(products) {
        return this.requestProducts(products);
    }

    /**
     * Get subscriptions
     * @returns {Object}
     */
    getSubscriptions = () => _products;

    /**
     * Get consumables
     * @returns {Object}
     */
    getConsumables = () => _products;

    /**
     * Purchase subscription
     * @param {string} productIdentifier The product ID
     */
    subscribe = (productIdentifier) => {
        StoreKit.purchase(productIdentifier, () => {
            EventEmitter.emit('billing:cancelled', productIdentifier);
        });
    };

    /**
     * Purchase consumable product
     * @param {string} productIdentifier The product ID
     */
    purchase = (productIdentifier) => {
        StoreKit.purchase(productIdentifier, () => {
            EventEmitter.emit('billing:cancelled', productIdentifier);
        });
    };

    onTransactionStateUpdate(transaction) {
        if (_.isObject(transaction)) {
            const {transactionState, productIdentifier, message} = transaction;

            if (transactionState === TRANSACTION_STATE.FAILED) {
                if (transaction.cancelled) {
                    EventEmitter.emit('billing:cancelled', productIdentifier);
                    return;
                }

                EventEmitter.emit('billing:error', {
                    errorMessage: message,
                });
            }

            if (transactionState === TRANSACTION_STATE.PURCHASING) {
                EventEmitter.emit('billing:purchase_start', productIdentifier);
            }

            if (transactionState === TRANSACTION_STATE.PURCHASED) {
                this.proccessTransaction(transaction)
                    .then((productIdentifier) => {
                        EventEmitter.emit('billing:purchased', productIdentifier);
                    })
                    .catch(() => {
                        EventEmitter.emit('billing:error', {
                            errorMessage: Translator.trans(
                                /** @Desc("Unfortunately the upgrade didn’t go through. Please verify that you are connected to the internet and try again.") */ 'alerts.errorUpgrade',
                                {},
                                'messages',
                            ),
                        });
                    });
            }
        }
    }

    onRestoredCompletedTransactions = (data) => {
        const {transactions} = data;

        if (_.isArray(transactions)) {
            const receipts = {};

            transactions.forEach((transaction) => {
                const {transactionIdentifier, transactionReceipt} = transaction;

                receipts[transactionIdentifier] = transactionReceipt;
            });

            StoreKit.receiptData((appStoreReceipt) => {
                API.post(
                    '/inAppPurchase/restore',
                    {
                        appStoreReceipt,
                        receiptForTransaction: receipts,
                    },
                    {
                        retry: 5,
                        timeout: 60000,
                        globalError: false,
                    },
                ).then(() => {
                    transactions.forEach((transaction) => {
                        const {transactionIdentifier} = transaction;

                        StoreKit.finishTransaction(transactionIdentifier);
                    });
                });
            });
        }
    };

    validator = (transaction) => {
        const {transactionIdentifier, appStoreReceipt, transactionReceipt} = transaction;

        return API.post(
            '/inAppPurchase/confirm',
            {
                type: 'ios-appstore',
                id: transactionIdentifier,
                appStoreReceipt,
                transactionReceipt,
            },
            {
                retry: 5,
                timeout: 60000,
                globalError: false,
            },
        );
    };

    proccessTransaction(transaction) {
        const {transactionIdentifier, productIdentifier} = transaction;

        return new Promise((resolve, reject) => {
            this.validator(transaction)
                .then(() => {
                    StoreKit.finishTransaction(transactionIdentifier);
                    resolve(productIdentifier);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    restore() {
        Alert.alert(
            'Subscription Verification',
            'We would like to verify if you have an active AwardWallet Plus subscription with Apple. For that, you will need to enter your Apple ID password when prompted (will be sent to Apple not to AwardWallet). Please note that you are not being charged anything during this process.',
            [
                {
                    text: Translator.trans('cancel', {}, 'messages'),
                    onPress: () => {
                        StoreKit.receiptData((appStoreReceipt) => {
                            API.post(
                                '/inAppPurchase/restore',
                                {
                                    appStoreReceipt,
                                    canceled: true,
                                },
                                {
                                    retry: 5,
                                    timeout: 60000,
                                },
                            );
                        });
                    },
                },
                {
                    text: 'Verify',
                    onPress: () => {
                        this.refreshReceipt(() => {
                            this.restoreCompletedTransactions();
                        });
                    },
                },
            ],
            {cancelable: false},
        );
    }

    /**
     * Check can payment
     * @returns {Promise<void>}
     */
    canMakePayments = () => StoreKit.canMakePayments();

    /**
     * Refresh AppStore receipt
     * @param {function} callback
     */
    refreshReceipt = (callback) => {
        StoreKit.refreshReceipt({}, callback);
    };

    /**
     * Restore completed transcations
     * @fires restoredCompletedTransactions
     */
    restoreCompletedTransactions = () => {
        StoreKit.restoreCompletedTransactions({});
    };

    /**
     * End module for purchase flow.
     */
    destroy() {
        if (this.transactionState) {
            this.transactionState.remove();
        }
        if (this.restoredCompletedTransactions) {
            this.restoredCompletedTransactions.remove();
        }
        StoreKit.removeTransactionObserver();
    }
}

export const Billing = new BillingService();
