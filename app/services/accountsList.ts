import _ from 'lodash';
import {Platform} from 'react-native';

import uuid from '../helpers/uuid';
import {IDiscoveredAccount} from '../hooks/accounts';
import Storage from '../storage';
import {IAccount} from '../types/account';
import {IProviderKinds} from '../types/providerKinds';
import {orderBy} from '../vendor/angular-orderBy';
import Card from './card';
import EventEmitter from './eventEmitter';
import AccountApi from './http/account';
import {BarcodeNotification} from './notification/barcode';

function getAccountDisplayProps(account, subAccount) {
    if (subAccount) {
        const properties = {
            ID: account.ID,
            FID: account.FID,
            Blocks: subAccount.Blocks,
            PreviewBlocks: subAccount.PreviewBlocks,
            Access: subAccount.Access,
            SubAccountID: subAccount.SubAccountID,
            DisplayName: subAccount.DisplayName,
            Balance: subAccount.Balance,
            BalanceWatchEndDate: account.BalanceWatchEndDate,
            LastChangeRaw: subAccount.LastChangeRaw,
            LastChange: subAccount.LastChange,
            LastChangeDate: subAccount.LastChangeDate,
            ExpirationDate: subAccount.ExpirationDate,
            ExpirationState: subAccount.ExpirationState,
            ParentAccount: subAccount.ParentAccount,
            CouponType: subAccount.CouponType,
            ParentError: account.Error,
            ParentDisabled: account.Disabled,
        };

        if (subAccount.ParentAccount) {
            properties.FID = subAccount.FID;
            properties.Disabled = subAccount.Disabled;
            properties.Error = subAccount.Error;
        }

        return properties;
    }

    return {
        FID: account.FID,
        DisplayName: account.DisplayName,
        Blocks: account.Blocks,
        PreviewBlocks: account.PreviewBlocks,
        Access: account.Access,
        Autologin: account.Autologin,
        Login: account.Login,
        Balance: account.Balance,
        BalanceWatchEndDate: account.BalanceWatchEndDate,
        EliteStatus: account.EliteStatus,
        LastChangeRaw: account.LastChangeRaw,
        LastChange: account.LastChange,
        LastChangeDate: account.LastChangeDate,
        ExpirationDate: account.ExpirationDate,
        ExpirationState: account.ExpirationState,
        Disabled: account.Disabled,
        Error: account.Error,
        ParentAccount: account.ParentAccount,
        CouponType: account.CouponType,
        HasSubAccounts: _.isArray(account.SubAccountsArray) && _.isEmpty(account.SubAccountsArray) === false,
        MileValue: account.MileValue,
        ProviderCode: account.ProviderCode,
        Kind: account.Kind,
        Type: account.Type,
    };
}

class AccountsList {
    private providerKinds: IProviderKinds = {};
    private discoveredAccounts: IDiscoveredAccount[] = [];
    private notifications: {} = {};
    private userId: string | null = null;
    private accountsOptions: {} = {};
    private accounts: {[key: string]: IAccount} = {};
    private searchAccountsList: IAccount[] = [];
    private accountsList: IAccount[] = [];

    constructor() {
        this.clear = this.clear.bind(this);
        EventEmitter.addListener('logout', this.clear);
    }

    set({accounts, discoveredAccounts, providerKinds, userId, skipEvent = false, accountsOptions}) {
        this.setAccounts(accounts);
        this.setDiscoveredAccounts(discoveredAccounts);

        if (_.isArray(providerKinds)) {
            this.setProviderKinds(providerKinds);
        }
        if (_.isInteger(userId)) {
            this.userId = userId;
        }

        if (!skipEvent) {
            EventEmitter.emit('accountsList:update');
        }

        if (_.isObject(accountsOptions)) {
            this.accountsOptions = accountsOptions;
        }
    }

    save() {
        Storage.setItem('accounts', this.accounts);
    }

    getAccount(accountId: string, subAccountId: string) {
        if (_.isObject(this.accounts[accountId])) {
            let account = this.accounts[accountId];

            if (subAccountId && _.isArray(account.SubAccountsArray)) {
                account = account.SubAccountsArray.find(({SubAccountID}) => SubAccountID === subAccountId);
            }

            return account;
        }

        return undefined;
    }

    deleteAccount(accountId: string) {
        if (_.isObject(this.accounts[accountId])) {
            Card.removeAccountFolder(accountId);

            AccountApi.remove(this.accounts[accountId].TableName.toLowerCase(), this.accounts[accountId].ID);

            if (this.accounts[accountId].TableName === 'Coupon') {
                this.detachCoupon(this.accounts[accountId]);
            }

            delete this.accounts[accountId];

            if (this.notifications[accountId]) {
                delete this.notifications[accountId];
            }

            this.accountsList = [];
            this.searchAccountsList = [];
            this.save();

            EventEmitter.emit('accountsList:update');
        }
    }

    setAccount(account, subAccount) {
        if (
            _.isObject(account) &&
            _.isUndefined(account.ID) === false &&
            _.isObject(this.accounts[account.TableName[0].toLowerCase() + account.ID])
        ) {
            if (_.isObject(subAccount)) {
                for (const i in account.SubAccountsArray) {
                    if (account.SubAccountsArray[i]) {
                        if (account.SubAccountsArray[i].SubAccountID === subAccount.SubAccountID) {
                            account.SubAccountsArray[i] = subAccount;
                        }
                    }
                }
            }

            return this.addAccount(account);
        }

        return undefined;
    }

    setAccountProperties(accountId, subAccountId, properties) {
        const account = this.getAccount(accountId);
        let subAccount;

        if (subAccountId) {
            subAccount = this.getAccount(accountId, subAccountId);
        }

        for (const key in properties) {
            if (_.isUndefined(properties[key]) === false) {
                if (subAccount) {
                    subAccount[key] = properties[key];
                } else {
                    account[key] = properties[key];
                }
            }
        }

        return this.setAccount(account, subAccount);
    }

    addAccount(account: IAccount) {
        if (_.isObject(account) && _.isUndefined(account.ID) === false) {
            const key = account.TableName[0].toLowerCase() + account.ID;

            if (account.TableName === 'Coupon') {
                this.attachCoupon(account);
            }

            if (_.isArray(this.discoveredAccounts)) {
                const index = this.discoveredAccounts.findIndex(({id}) => id === account.ID);

                if (index > -1) {
                    this.discoveredAccounts.splice(index, 1);
                }
            }

            this.accounts[key] = {...account};
            this.notifications[key] = this.getAccountBarcodeNotifications(account);
            this.accountsList = [];
            this.searchAccountsList = [];

            this.save();
            this.attachCoupons();

            EventEmitter.emit('accountsList:update');

            return this.accounts[key];
        }

        return undefined;
    }

    attachCoupons() {
        for (const accountKey in this.accounts) {
            if (_.isObject(this.accounts[accountKey])) {
                if (this.accounts[accountKey].TableName === 'Coupon') {
                    this.attachCoupon(this.accounts[accountKey]);
                }
            }
        }
    }

    attachCoupon(coupon) {
        if (_.isObject(coupon) && coupon.TableName === 'Coupon') {
            this.detachCoupon(coupon);

            if (coupon.ParentAccount) {
                const parentAccount = this.accounts[`a${coupon.ParentAccount}`];
                let linked = false;

                if (parentAccount) {
                    parentAccount.SubAccountsArray = parentAccount.SubAccountsArray || [];

                    for (let i = 0; i < parentAccount.SubAccountsArray.length; i += 1) {
                        if (parentAccount.SubAccountsArray[i].ParentAccount && parentAccount.SubAccountsArray[i].ID === coupon.ID) {
                            parentAccount.SubAccountsArray[i] = coupon;
                            linked = true;

                            continue;
                        }
                    }
                    if (!linked) {
                        parentAccount.SubAccountsArray.push(coupon);
                    }
                }
            }
        }
    }

    detachCoupon(coupon) {
        if (_.isObject(coupon) && coupon.TableName === 'Coupon') {
            const prevAccount = this.accounts[`c${coupon.ID}`];

            if (prevAccount && prevAccount.ParentAccount) {
                const parentAccount = this.accounts[`a${prevAccount.ParentAccount}`];

                if (parentAccount && _.isArray(parentAccount.SubAccountsArray)) {
                    for (let i = 0; i < parentAccount.SubAccountsArray.length; i += 1) {
                        if (parentAccount.SubAccountsArray[i].ID === coupon.ID) {
                            parentAccount.SubAccountsArray.splice(i, 1);

                            continue;
                        }
                    }
                }
            }
        }
    }

    setAccounts(accounts: {[key: string]: IAccount}) {
        if (_.isObject(accounts)) {
            this.accounts = accounts;
            this.accountsList = [];
            this.searchAccountsList = [];
            this.attachCoupons();
            this.buildNotifications();
        }
    }

    getAccounts = () => this.accounts;

    getList() {
        if (_.isEmpty(this.accountsList)) {
            this.accountsList = this.orderAccounts(this.accounts);
        }
        return this.accountsList;
    }

    getSearchList() {
        if (this.searchAccountsList.length < 1) {
            this.searchAccountsList = this.orderAccounts(this.accounts, true);
        }
        return this.searchAccountsList;
    }

    getAccountsOptions() {
        return this.accountsOptions;
    }

    getAccountBarcodeNotifications = (account) => {
        let notifications = [];

        function createNotifications(properties) {
            const {account} = properties;
            const {subAccount} = properties;
            const {barcode} = properties;

            const excludedTypes = Platform.select({
                ios: ['DATA_MATRIX'],
                android: [],
            });

            const notifications = [];
            const locations = subAccount ? subAccount.Locations : account.Locations;

            if (excludedTypes.indexOf(barcode.BarCodeType) < 0) {
                for (let i = 0, l = locations.length; i < l; i += 1) {
                    const notification = new BarcodeNotification(properties, locations[i]);

                    if (notification) {
                        notifications.push(notification);
                    }
                }
            }

            return notifications;
        }

        if (account) {
            let barcode;

            if (account.BarCodeCustom && account.BarCodeCustom.BarCodeData) {
                barcode = account.BarCodeCustom;
            } else if (account.BarCodeParsed && account.BarCodeParsed.BarCodeData) {
                barcode = account.BarCodeParsed;
            }

            if (account.Locations && barcode) {
                notifications = createNotifications({account, barcode});
            }

            if (_.isArray(account.SubAccountsArray)) {
                for (let j = 0, k = account.SubAccountsArray.length, subAccount, subAccountBarcode; j < k; j += 1) {
                    subAccount = account.SubAccountsArray[j];

                    if (subAccount.BarCodeCustom && subAccount.BarCodeCustom.BarCodeData) {
                        subAccountBarcode = subAccount.BarCodeCustom;
                    } else if (subAccount.BarCodeParsed && subAccount.BarCodeParsed.BarCodeData) {
                        subAccountBarcode = subAccount.BarCodeParsed;
                    }

                    if (subAccount.Locations && subAccountBarcode) {
                        notifications = notifications.concat(
                            createNotifications({
                                account,
                                subAccount,
                                barcode: subAccountBarcode,
                            }),
                        );
                    }
                }
            }
        }

        return notifications;
    };

    buildNotifications() {
        this.notifications = {};

        if (this.accounts) {
            for (const key in this.accounts) {
                if (_.isObject(this.accounts[key])) {
                    this.notifications[key] = this.getAccountBarcodeNotifications(this.accounts[key]);
                }
            }
        }
    }

    getAccountsNotifications() {
        return [].concat.apply(
            [],
            Object.keys(this.notifications).map((k) => this.notifications[k]),
        );
    }

    setDiscoveredAccounts(discoveredAccounts: IDiscoveredAccount[]) {
        if (_.isArray(discoveredAccounts)) {
            this.discoveredAccounts = discoveredAccounts;
        }
    }

    getDiscoveredAccounts() {
        return this.discoveredAccounts;
    }

    setProviderKinds(providerKinds) {
        if (providerKinds) {
            const obj = {};

            _.forEach(providerKinds, (provider, index) => {
                obj[provider.KindID] = {...provider};
                obj[provider.KindID].index = index;
            });

            this.providerKinds = obj;
        }
    }

    getProviderKinds = () => this.providerKinds;

    orderAccounts(accounts, search = false): IAccount[] {
        let orderedAccounts;
        const ownerID = this.userId;

        const userIdOrder = (item) => {
            const userID = item.UserID;
            const userAgentID = item.UserAgentID === null ? null : item.UserAgentID;

            if (userAgentID === null && userID === ownerID) {
                return -1;
            }
            if (item.FamilyName) {
                return item.FamilyName.toLowerCase();
            }
            return item.UserName.toLowerCase();
        };

        orderedAccounts = Object.values(accounts);

        if (!search) {
            orderedAccounts = orderBy(orderedAccounts, [
                (item) => {
                    if (_.isObject(this.providerKinds[item.Kind])) {
                        return parseInt(String(this.providerKinds[item.Kind].index), 10);
                    }
                    return 0;
                },
                userIdOrder,
                'DisplayName',
            ]);
        } else {
            orderedAccounts = orderBy(orderedAccounts, [userIdOrder, 'DisplayName']);
        }

        return orderedAccounts;
    }

    displayList(accounts: IAccount[] = [], discoveredAccounts: IDiscoveredAccount[], search = false) {
        const rows: {
            component: string;
            key: string;
            props?: {[key: string]: any};
        }[] = [];
        const providerKindsIds = Object.keys(this.providerKinds);

        if (_.isArray(discoveredAccounts) && !_.isEmpty(discoveredAccounts)) {
            rows.push({
                component: 'DiscoveredTitle',
                key: `discovered-title`,
            });
            (search ? discoveredAccounts : discoveredAccounts.slice(0, 5)).forEach((row) => {
                const {id, provider, login, email} = row;

                rows.push({
                    component: 'DiscoveredAccountRow',
                    key: `discovered-account-${id}`,
                    props: {
                        id,
                        provider,
                        login,
                        email,
                    },
                });
            });
            if (discoveredAccounts.length > 5) {
                rows.push({
                    component: 'DiscoveredReviewMore',
                    key: `discovered-review-more`,
                });
            }
        }
        // eslint-disable-next-line no-param-reassign
        accounts = accounts.filter((account) => !account.ParentAccount && providerKindsIds.includes(String(account.Kind)));

        if (accounts && accounts.length) {
            for (let i = 0, l = accounts.length, account; i < l; i += 1) {
                account = accounts[i];
                if (i === 0 || (i > 0 && account.Kind !== accounts[i - 1].Kind)) {
                    if (!search) {
                        if (_.isObject(this.providerKinds[account.Kind]) && _.isObject(this.providerKinds[account.Kind].ad)) {
                            rows.push({
                                component: 'CardOffer',
                                props: this.providerKinds[account.Kind].ad,
                                key: `card-offer.${account.Kind}`,
                            });
                        }
                        rows.push({
                            component: 'Title',
                            key: `title.${account.ID}.${account.Kind}`,
                            props: {
                                name: this.providerKinds[account.Kind].Name,
                                kind: account.Kind,
                                isFirst: rows.length === 0,
                            },
                        });
                    }
                    if (i === 0 || (search && rows.length < 1)) {
                        rows.push({
                            component: 'SubTitle',
                            key: `${account.ID}.header`,
                        });
                    }
                }

                if (
                    i === 0 ||
                    (search && rows.length < 2) ||
                    (accounts[i - 1] && (account.UserAgentID || account.UserID) !== (accounts[i - 1].UserAgentID || accounts[i - 1].UserID)) ||
                    (!search && account.Kind !== accounts[i - 1].Kind)
                ) {
                    rows.push({
                        component: 'UserTitle',
                        props: {
                            userName: account.UserName,
                            familyName: account.FamilyName,
                        },
                        key: `user-title.${account.ID}`,
                    });
                    rows.push({
                        component: 'Account',
                        props: {
                            account: getAccountDisplayProps(account),
                            hasArrow: true,
                        },
                        key: `account.${account.TableName[0] + account.ID}`,
                    });
                } else {
                    rows.push({
                        component: 'Account',
                        props: {
                            account: getAccountDisplayProps(account),
                        },
                        key: `account.${account.TableName[0] + account.ID}`,
                    });
                }

                if (_.isArray(account.SubAccountsArray) && _.isEmpty(account.SubAccountsArray) === false) {
                    account.SubAccountsArray.forEach((subAccount, index) => {
                        let key = `subaccount.${account.ID}.`;

                        if (!subAccount.ParentAccount) {
                            key += subAccount.SubAccountID || uuid();
                        } else {
                            key += subAccount.TableName[0].toLowerCase() + subAccount.ID;
                        }
                        rows.push({
                            component: 'Account',
                            props: {
                                account: getAccountDisplayProps(account, subAccount),
                                hasArrow: index === 0,
                                isSubAccount: true,
                            },
                            key,
                        });
                    });
                }
            }
        }

        return rows;
    }

    getCounters() {
        const counters = {
            errors: 0,
            totals: 0,
            lastChangeTotals: 0,
            mileValue: 0,
            lastChangeMileValue: 0,
            accounts: 0,
        };

        if (_.isObject(this.accounts)) {
            Object.values(this.accounts).forEach((account) => {
                if (_.isObject(account)) {
                    if (!_.isUndefined(account.TotalBalance)) {
                        counters.totals += parseFloat(account.TotalBalance) || 0;
                    }

                    if (_.isNumber(account.LastChangeRaw)) {
                        counters.lastChangeTotals += account.LastChangeRaw;
                    }

                    if (_.isNumber(account.TotalUSDCash)) {
                        counters.mileValue += account.TotalUSDCash;
                    }

                    if (_.isNumber(account.TotalUSDCashChange)) {
                        counters.lastChangeMileValue += account.TotalUSDCashChange;
                    }

                    if (!account.ParentAccount) {
                        counters.accounts += 1;
                    }

                    if (account.Error) {
                        counters.errors += 1;
                    }
                }
            });
        }

        _.forEach(counters, (counter, key) => {
            counters[key] = Math.floor(counter);
        });

        return counters;
    }

    clear() {
        this.accountsList = [];
        this.searchAccountsList = [];
        this.discoveredAccounts = [];
        this.accounts = {};
        this.providerKinds = {};
        this.notifications = {};
        this.userId = null;
    }
}

export default new AccountsList();
