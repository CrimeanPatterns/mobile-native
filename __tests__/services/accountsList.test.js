import AccountsList from '../../app/services/accountsList';
import API from '../../app/services/api';
import Session from '../../app/services/session';

jest.mock('../../app/services/api');

const accounts = {
    a3349451: {
        TableName: 'Account',
        ID: 3349451,
        Login: 'balance.comma',
        Balance: '3,222.11',
        TotalBalance: '3222.1101074219',
        ProviderCode: 'testprovider',
        Description: null,
        ExpirationDate: {
            ts: null,
            fmt: 'Unknown',
        },
        ProviderID: '636',
        UserName: 'Aleksey Anikin',
        UserID: 216310,
        DisplayName: 'Test Provider (Test)',
        LastBalance: '9,196',
        Kind: 1,
        IATACode: null,
        ShareUserAgentID: null,
        UserAgentID: null,
        SubAccountsArray: [
            {
                SubAccountID: '2806726',
                DisplayName: 'First subaccount',
                Balance: '504',
                LastBalance: '1,599',
                Kind: 1,
                LastChange: '-1,095',
                LastChangeRaw: -1095,
                Blocks: [
                    {
                        Kind: 'string',
                        Name: 'Account Owner',
                        Val: 'Aleksey Anikin',
                    },
                    {
                        Kind: 'balance',
                        Name: 'Balance',
                        Val: {
                            LastChange: '-1,095',
                            LastChangeRaw: -1095,
                            Balance: '504',
                            BalanceRaw: 504,
                        },
                    },
                    {
                        Kind: 'barcode',
                        Val: {
                            Linked: true,
                            Custom: true,
                            BarCodeData: 'BarCodeCustom.BarCodeData',
                            BarCodeType: 'BarCodeCustom.BarCodeType',
                        },
                        Visible: 'BarCodeCustom.BarCodeData',
                    },
                ],
                BalancePush: '504',
                BarCodeCustom: {
                    BarCodeData: null,
                    BarCodeType: null,
                },
            },
        ],
    },
    a3380128: {
        TableName: 'Account',
        ID: 3380128,
        Login: 'rucaptcha',
        Balance: '22,336.94 rub.',
        TotalBalance: '22336.939453125',
        ProviderCode: 'testprovider',
        Description: null,
        ExpirationDate: {
            ts: 1519171200,
            fmt: 'Feb 21, 2018',
        },
        ProviderID: '636',
        UserName: 'AwardWallet Developer',
        UserID: 216310,
        DisplayName: 'Test Provider (Test)',
        LastBalance: '30,798.42 rub.',
        Kind: 2,
        IATACode: null,
        ShareUserAgentID: null,
        UserAgentID: 205958,
    },
    a3788284: {
        TableName: 'Account',
        ID: 3788284,
        Login: '1.subaccount',
        Balance: '1',
        TotalBalance: '1600',
        ProviderCode: 'testprovider',
        Description: null,
        ExpirationDate: {
            ts: null,
            fmt: 'Unknown',
        },
        ProviderID: '636',
        UserName: 'Aleksey Anikin',
        UserID: 216310,
        DisplayName: 'Test Provider (Test)',
        LastBalance: 'n/a',
        Kind: 1,
        IATACode: null,
        ShareUserAgentID: null,
        UserAgentID: null,
    },
    c1234: {
        TableName: 'Coupon',
        ID: 1234,
        Login: 'Test',
        Balance: '',
        TotalBalance: '0',
        ProviderCode: null,
        Description: null,
        ExpirationDate: {
            ts: null,
            fmt: 'Unknown',
        },
        ParentAccount: 3788284,
        ProviderID: null,
        UserName: 'Aleksey Anikin',
        UserID: 216310,
        DisplayName: 'Test Provider (Test)',
        CouponType: 'Companion Ticket',
        LastBalance: 'n/a',
        Kind: 1,
        IATACode: null,
        ShareUserAgentID: null,
        UserAgentID: null,
    },
};
const providerKinds = [
    {
        Name: 'Airlines',
        KindID: 1,
    },
    {
        Name: 'Hotels',
        KindID: 2,
    },
    {
        Name: 'Credit Cards',
        KindID: 6,
    },
    {
        Name: 'Shopping',
        KindID: 7,
    },
    {
        Name: 'Rentals',
        KindID: 3,
    },
    {
        Name: 'Dining',
        KindID: 8,
    },
    {
        Name: 'Trains',
        KindID: 4,
    },
    {
        Name: 'Cruises',
        KindID: 10,
    },
    {
        Name: 'Surveys',
        KindID: 9,
    },
    {
        Name: 'Other',
        KindID: 5,
    },
    {
        KindID: 'custom',
        Name: 'Custom Account',
        Notice: 'Tracked Manually',
    },
    {
        KindID: 'coupon',
        Name: 'Vouchers / Gift Cards',
        Notice: 'Tracked Manually',
    },
];

describe('AccountsList', () => {
    beforeEach(() => {
        Session.setProperty('userId', 216310);
        AccountsList.set({accounts: {...accounts}}, providerKinds);
    });

    afterEach(() => {
        AccountsList.clear();
    });

    test('set accounts', () => {
        const temp = AccountsList.getAccounts();

        expect(Object.keys(temp)).toEqual(Object.keys(accounts));
    });

    test('get accounts list', () => {
        const accountsList = AccountsList.getList();

        expect(accountsList.map((item) => item.ID)).toEqual([3349451, 3788284, 1234, 3380128]);
    });

    test('get search accounts list', () => {
        const accountsList = AccountsList.getSearchList();

        expect(accountsList.map((item) => item.ID)).toEqual([3349451, 3788284, 1234, 3380128]);
    });

    test('get counters', () => {
        const counters = AccountsList.getCounters();

        expect(counters).toEqual({
            accounts: 3,
            errors: 0,
            totals: 27159.0495605469,
        });
    });

    test('get account', () => {
        const account = AccountsList.getAccount('a3349451');

        expect(account).toEqual(accounts.a3349451);
    });

    test('get sub-account', () => {
        const account = AccountsList.getAccount('a3349451', '2806726');

        expect(account).toEqual(accounts.a3349451.SubAccountsArray[0]);
    });

    test('remove account', () => {
        const deleteAccount = jest.spyOn(API, 'delete');

        AccountsList.deleteAccount('a3349451');
        expect(deleteAccount).toHaveBeenCalled();
        expect(AccountsList.getAccount('a3349451')).toBeUndefined();
    });

    test('add account', () => {
        AccountsList.deleteAccount('a3349451');
        expect(AccountsList.getAccount('a3349451')).toBeUndefined();
        expect(AccountsList.addAccount(null)).toBeUndefined();
        AccountsList.addAccount(accounts.a3349451);
        expect(AccountsList.getAccount('a3349451')).toEqual(accounts.a3349451);
    });

    test('set account', () => {
        expect(AccountsList.setAccount(null)).toBeUndefined();
        AccountsList.setAccount(accounts.a3349451);
        expect(AccountsList.getAccount('a3349451')).toEqual(accounts.a3349451);
    });

    test('set sub-account', () => {
        expect(AccountsList.setAccount(null, null)).toBeUndefined();
        AccountsList.setAccount(accounts.a3349451, accounts.a3349451.SubAccountsArray[0]);
        expect(AccountsList.getAccount('a3349451', '2806726')).toEqual(accounts.a3349451.SubAccountsArray[0]);
    });

    test('attach coupons', () => {
        const account = AccountsList.getAccount('a3788284');

        expect(account.SubAccountsArray[0].ID).toEqual(1234);
    });

    test('detach coupon from account', () => {
        const coupon = AccountsList.getAccount('c1234');

        AccountsList.detachCoupon(coupon);
        const account = AccountsList.getAccount('a3788284');

        expect(account.SubAccountsArray).toEqual([]);
    });

    test('detach coupon after account delete', () => {
        let account = AccountsList.getAccount('a3788284');

        expect(account.SubAccountsArray[0].ID).toEqual(1234);
        AccountsList.deleteAccount('c1234');
        account = AccountsList.getAccount('a3788284');
        expect(account.SubAccountsArray).toEqual([]);
    });

    test('attach coupon to account', () => {
        const coupon = AccountsList.getAccount('c1234');

        AccountsList.detachCoupon(coupon);
        let account = AccountsList.getAccount('a3788284');

        expect(account.SubAccountsArray).toEqual([]);
        AccountsList.attachCoupon(coupon);
        account = AccountsList.getAccount('a3788284');
        expect(account.SubAccountsArray[0].ID).toEqual(1234);
    });

    test('attach coupon after account add', () => {
        AccountsList.deleteAccount('c1234');
        const coupon = AccountsList.getAccount('c1234');

        expect(coupon).toBeUndefined();
        AccountsList.addAccount(accounts.c1234);
        const newCoupon = AccountsList.getAccount('c1234');

        expect(newCoupon).toBeDefined();
        expect(AccountsList.getAccount(`a${newCoupon.ParentAccount}`).SubAccountsArray[0].ID).toEqual(1234);
    });
});
