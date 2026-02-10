import {getPathFromState as getPathFromStateDefault, getStateFromPath as getStateFromPathDefault, LinkingOptions} from '@react-navigation/native';
import _ from 'lodash';
import url from 'url';

import {isAndroid, isIOS} from '../helpers/device';
import {API_URL} from '../services/api';
import Session from '../services/session';
import {RootStackParamList} from '../types/navigation';

const UNAUTHORIZED_PATH_PREFIX = '/unauthorized';
const getUnauthorizedPath = (path) => `${UNAUTHORIZED_PATH_PREFIX}/${path.slice(1)}`;
const commonScreens = {
    AboutUs: '/page/about',
    PrivacyNotice: '/page/privacy',
    ContactUs: '/contact',
    FAQs: '/faqs',
    Terms: '/page/terms',
};
const unAuthorizedCommonScreens = {
    AboutUs: getUnauthorizedPath('/page/about'),
    PrivacyNotice: getUnauthorizedPath('/page/privacy'),
    ContactUs: getUnauthorizedPath('/contact'),
    FAQs: getUnauthorizedPath('/faqs'),
    Terms: getUnauthorizedPath('/page/terms'),
};

export const PathConfig = {
    ...commonScreens,
    SignIn: '/signIn',
    SignUp: '/register',
    MileValue: '/point-mile-values/:programName?',
    TransferTimes: '/mile-transfer-times',
    PurchaseTimes: '/mile-purchase-times',
    TravelSummary: '/travel-summary/:period?/:owner?',
    // Bookings
    Bookings: '/awardBooking/requests',
    BookingDetails: '/awardBooking/view/:requestId',
    // Trips
    Timeline: '/timeline',
    TimelineSegment: '/m/timeline/:userAgentId/:id/',
    TimelineSegmentDetails: '/m/timeline/:userAgentId/:id/details',
    TimelineSegmentFlights: '/m/timeline/:userAgentId/:id/flights',
    TimelineShare: '/timeline/shared/:sharedKey',
    TimelineNote: '/timeline/note/:planId',
    // Profile
    Profile: '/user/profile',
    StoreLocationsList: '/profile/location/list',
    ProfileEdit: '/profile/:formLink',
    ForgotPassword: '/m/password-recovery',
    PasswordRecovery: '/m/password-recovery/:userId/:hash',
    AgentAdd: '/agents/add',
    Connections: '/user/connections',
    ConnectionEdit: '/user/connections/edit/:id', // original route /user/connections/:id
    ConnectionShare: '/share/:id',
    ConnectionInvite: '/invite/:shareCode',
    MailboxAdd: '/mailboxes/add',
    Mailboxes: '/mailboxes/:updateId?',
    SubscriptionCancel: '/m/subscription/cancel/:platform',
    UserDelete: '/user/delete',
    BalanceWatchCreditsPayment: '/user/pay/balancewatch-credit',
    SubscriptionPayment: '/user/pay',
    TwoFactorAuthentication: '/user/settings/2fact/setup',
    // Accounts
    AccountsList: '/account/list',
    AccountAddListProvider: '/m/accounts/add/:kindId',
    AccountsAdd: '/account/select-provider',
    AccountScanAdd: '/m/account/scan-add',
    AccountsTotals: '/m/accounts/totals',
    // Account
    AccountAdd: '/account/add/:providerId',
    AccountDetails: '/account/:ID/:SubAccountID?/details',
    AccountUpdate: '/account/:ID/:SubAccountID?/update',
    AccountEdit: '/account/:ID/:SubAccountID?/edit',
    AccountHistory: '/account/:ID/:SubAccountID?/history',
    AccountDetailsBarcode: '/account/:ID/:SubAccountID?/barcode',
    AccountDetailsPhones: '/account/:ID/:SubAccountID?/phones',
    Covid19: '/covid19',
    // Cards
    SpendAnalysis: '/spend-analysis',
    MerchantLookup: '/merchants',
    MerchantReverse: '/merchant-reverse',
    MerchantOffer: '/merchants/:nameToUrl',
    TransactionAnalyzer: '/transactions',
    // Tools
    Tools: '/tools',
    // Blog
    Blog: '/blog',
    BlogPageRedirect: '/blog/r/:rTagId',
    BlogAuthorPage: '/blog/author/*',
    BlogSearch: '/blog/search/:search',
    BlogPage: '/blog/*',
} as const;

const AccountLinkingConfig = {
    initialRouteName: 'AccountDetails',
    path: '/account/:ID/:SubAccountID?',
    screens: {
        AccountDetails: 'details',
        AccountDetailsBarcode: 'barcode',
        AccountDetailsPhones: 'phone',
        AccountEdit: 'edit',
        AccountHistory: 'history',
        AccountUpdate: 'update',
        Covid19: {
            path: PathConfig.Covid19,
            exact: true,
        },
    },
};

const TripLinkingConfig = {
    initialRouteName: 'TimelineSegmentDetails',
    path: PathConfig.TimelineSegment,
    screens: {
        TimelineSegmentDetails: 'details',
        TimelineSegmentFlights: 'flights',
    },
};

export const LinkingConfig: LinkingOptions<RootStackParamList>['config'] = {
    screens: {
        Outside: {
            screens: {
                Main: {
                    initialRouteName: 'SignIn',
                    screens: {
                        SignIn: PathConfig.SignIn,
                        SignUp: PathConfig.SignUp,
                        ForgotPassword: PathConfig.ForgotPassword,
                        PasswordRecovery: PathConfig.PasswordRecovery,
                        MerchantLookup: getUnauthorizedPath(PathConfig.MerchantLookup),
                        MerchantOffer: getUnauthorizedPath(PathConfig.MerchantOffer),
                        TimelineShare: getUnauthorizedPath(PathConfig.TimelineShare),
                        ConnectionInvite: getUnauthorizedPath(PathConfig.ConnectionInvite),
                        ...unAuthorizedCommonScreens,
                    },
                },
            },
        },
        Inside: {
            initialRouteName: 'Main',
            screens: {
                Main: {
                    initialRouteName: 'AccountsTab',
                    screens: {
                        AccountsTab: {
                            initialRouteName: 'AccountsList',
                            screens: {
                                AccountsList: PathConfig.AccountsList,
                                AccountAddListProvider: PathConfig.AccountAddListProvider,
                                AccountsAdd: PathConfig.AccountsAdd,
                                AccountAdd: PathConfig.AccountAdd,
                                AccountScanAdd: PathConfig.AccountScanAdd,
                                ...(isAndroid
                                    ? {
                                          Account: AccountLinkingConfig,
                                      }
                                    : {}),
                            },
                        },
                        TripsTab: {
                            initialRouteName: 'Timeline',
                            // @ts-ignore
                            screens: {
                                Timeline: PathConfig.Timeline,
                                ...(isAndroid
                                    ? {
                                          Trip: TripLinkingConfig,
                                      }
                                    : {}),
                            },
                        },
                        CardsTab: {
                            initialRouteName: 'CardsMain',
                            screens: {
                                CardsMain: {
                                    initialRouteName: 'SpendAnalysis',
                                    screens: {
                                        SpendAnalysis: PathConfig.SpendAnalysis,
                                        TransactionAnalyzer: PathConfig.TransactionAnalyzer,
                                        MerchantLookup: PathConfig.MerchantLookup,
                                    },
                                },
                                MerchantReverse: PathConfig.MerchantReverse,
                                MerchantOffer: PathConfig.MerchantOffer,
                            },
                        },
                        BlogTab: {
                            initialRouteName: 'Blog',
                            screens: {
                                Blog: {
                                    path: PathConfig.Blog,
                                    exact: true,
                                },
                                BlogPage: PathConfig.BlogPage,
                                BlogSearch: PathConfig.BlogSearch,
                                BlogPageRedirect: PathConfig.BlogPageRedirect,
                                BlogAuthorPage: PathConfig.BlogAuthorPage,
                            },
                        },
                        ToolsTab: {
                            initialRouteName: 'Tools',
                            screens: {
                                Tools: PathConfig.Tools,
                                MileValue: PathConfig.MileValue,
                                Profile: {
                                    initialRouteName: 'Profile',
                                    screens: {
                                        Profile: PathConfig.Profile,
                                        StoreLocationsList: PathConfig.StoreLocationsList,
                                        ProfileEdit: {
                                            path: PathConfig.ProfileEdit,
                                            parse: {
                                                formLink: (formLink: string): string => `/profile/${formLink}`,
                                            },
                                            stringify: {
                                                formLink: (formLink: string): string => formLink.replace(/^\/profile\//, ''),
                                            },
                                        },
                                        Connections: PathConfig.Connections,
                                        ConnectionEdit: PathConfig.ConnectionEdit,
                                        ConnectionInvite: PathConfig.ConnectionInvite,
                                        ConnectionShare: PathConfig.ConnectionShare,
                                        AgentAdd: PathConfig.AgentAdd,
                                        Mailboxes: PathConfig.Mailboxes,
                                        MailboxAdd: PathConfig.MailboxAdd,
                                        SubscriptionCancel: PathConfig.SubscriptionCancel,
                                        UserDelete: PathConfig.UserDelete,
                                        BalanceWatchCreditsPayment: PathConfig.BalanceWatchCreditsPayment,
                                        TwoFactorAuthentication: PathConfig.TwoFactorAuthentication,
                                    },
                                },
                                TransferTimes: {
                                    screens: {
                                        Transfer: PathConfig.TransferTimes,
                                        Purchase: PathConfig.PurchaseTimes,
                                    },
                                },
                                Bookings: {
                                    initialRouteName: 'BookingRequests',
                                    screens: {
                                        BookingRequests: PathConfig.Bookings,
                                        BookingDetails: {
                                            path: PathConfig.BookingDetails,
                                            initialRouteName: 'Messages',
                                            screens: {
                                                Details: 'details',
                                                Messages: 'messages',
                                            },
                                        },
                                    },
                                },
                                ...commonScreens,
                            },
                        },
                    },
                },
                ModalScreens: {
                    screens: {
                        TravelSummary: PathConfig.TravelSummary,
                        SubscriptionPayment: PathConfig.SubscriptionPayment,
                        TimelineNote: PathConfig.TimelineNote,
                    },
                },
                TripsShare: {
                    screens: {
                        TimelineShare: PathConfig.TimelineShare,
                    },
                },
                ...(isIOS
                    ? {
                          Account: AccountLinkingConfig,
                          Trip: TripLinkingConfig,
                      }
                    : {}),
            },
        },
    },
};

export const NavigationLinkingOptions: LinkingOptions<RootStackParamList> = {
    // @ts-ignore
    prefixes: [API_URL],
    config: LinkingConfig,
    getStateFromPath: (path, options) => {
        const {query} = url.parse(path, true);
        const authorized = Session.authorized();
        const params = path.split('/');

        if (_.startsWith(path, '/user/change-password-feedback/') && params.length === 5) {
            const userId = params[3];
            const hash = params[4];

            return getStateFromPathDefault(`/m/password-recovery/${userId}/${hash}`, options);
        }

        if (_.startsWith(path, '/restore')) {
            return getStateFromPathDefault('/m/password-recovery', options);
        }

        if (_.startsWith(path, '/m/terms') || _.startsWith(path, '/m/privacy')) {
            const newPath = path.replace(/^\/m\//, '/page/');

            if (!authorized) {
                return getStateFromPathDefault(getUnauthorizedPath(newPath), options);
            }
            return getStateFromPathDefault(newPath, options);
        }

        if (!authorized) {
            if (_.startsWith(path, '/timeline/shared/') || _.startsWith(path, '/timeline/shared-plan/')) {
                if (_.startsWith(path, '/timeline/shared-plan/')) {
                    return getStateFromPathDefault(getUnauthorizedPath(path.replace('/shared-plan/', '/shared/')), options);
                }
                return getStateFromPathDefault(getUnauthorizedPath(path), options);
            }
            if (_.startsWith(path, '/m/timeline/shared/') && _.isString(params[4])) {
                return getStateFromPathDefault(getUnauthorizedPath(`/timeline/shared/${params[4]}`), options);
            }
            if (Object.values(commonScreens).find((screen) => path.startsWith(screen))) {
                return getStateFromPathDefault(getUnauthorizedPath(path), options);
            }
            if (_.startsWith(path, '/invite/')) {
                return getStateFromPathDefault(getUnauthorizedPath(path), options);
            }
            if (_.startsWith(path, '/m/merchants') || _.startsWith(path, '/merchants')) {
                const url = path.replace('/m/', '/');

                return getStateFromPathDefault(getUnauthorizedPath(url), options);
            }
        } else {
            if (_.startsWith(path, '/register') && _.isString(query?.code)) {
                return getStateFromPathDefault(`/profile/useCoupon?code=${query.code}`, options);
            }

            if (['/m/pay', '/cart/paypal/change-payment'].indexOf(path) > -1 || _.startsWith(path, '/cart/change-payment/')) {
                return getStateFromPathDefault(PathConfig.SubscriptionPayment, options);
            }

            if (['/m/accounts/add', '/account/add.php'].indexOf(path) > -1) {
                return getStateFromPathDefault(PathConfig.AccountsAdd, options);
            }

            if (_.startsWith(path, '/account/list/') && !_.isEmpty(query)) {
                const {account, coupon} = query;
                let ID;

                if (_.isString(account)) {
                    ID = `a${account}`;
                }

                if (_.isString(coupon)) {
                    ID = `c${coupon}`;
                }

                if (_.isString(ID)) {
                    return getStateFromPathDefault(`/account/${ID}/edit`, options);
                }
            }

            if (_.startsWith(path, '/m/account/details/')) {
                if (_.isString(params[5])) {
                    return getStateFromPathDefault(`/account/${params[4]}/${params[5]}/details`, options);
                }
                return getStateFromPathDefault(`/account/${params[4]}/details`, options);
            }

            if (_.startsWith(path, '/m/account/edit/')) {
                return getStateFromPathDefault(`/account/${params[4]}/edit`, options);
            }

            if (_.startsWith(path, '/m/account/history/') || _.startsWith(path, '/account/history/')) {
                let ID;
                let SubAccountID;

                if (_.startsWith(path, '/account/history/') && params.length >= 4) {
                    ID = `a${params[3]}`;
                    if (params[4]) {
                        SubAccountID = params[4];
                    }
                }

                if (_.startsWith(path, '/m/account/history/') && params.length >= 5) {
                    ID = params[4];
                    if (params[5]) {
                        SubAccountID = params[5];
                    }
                }

                if (_.isString(ID)) {
                    if (!SubAccountID) {
                        return getStateFromPathDefault(`/account/${ID}/history`, options);
                    }
                    return getStateFromPathDefault(`/account/${ID}/${SubAccountID}/history`, options);
                }
            }

            if (
                (_.startsWith(path, '/m/account/add/') && params.length === 5) ||
                (_.startsWith(path, '/account/add/') && params.length === 4) ||
                (_.startsWith(path, '/document/add/') && params.length === 4)
            ) {
                let providerId;

                if (_.startsWith(path, '/account/add/') || _.startsWith(path, '/document/add/')) {
                    providerId = params[3];
                } else {
                    providerId = params[4];
                }

                return getStateFromPathDefault(_.replace(PathConfig.AccountAdd, ':providerId', providerId), options);
            }

            if (_.startsWith(path, '/coupon/') || _.startsWith(path, '/account/edit/') || _.startsWith(path, '/document/edit/')) {
                if (path === '/coupon/add') {
                    return getStateFromPathDefault(_.replace(PathConfig.AccountAdd, ':providerId', 'coupon'), options);
                }

                if ((_.startsWith(path, '/coupon/edit') || _.startsWith(path, '/document/edit')) && params.length === 4) {
                    return getStateFromPathDefault(`/account/c${params[3]}/edit`, options);
                }

                if (_.startsWith(path, '/account/edit/')) {
                    return getStateFromPathDefault(`/account/a${params[3]}/edit`, options);
                }
            }

            if (path === '/m/booking') {
                return getStateFromPathDefault(PathConfig.Bookings, options);
            }

            if (_.startsWith(path, '/m/booking/') && params.length === 5) {
                return getStateFromPathDefault(_.replace(PathConfig.BookingDetails, ':requestId', params[3]), options);
            }

            if (_.startsWith(path, '/timeline/shared-plan/')) {
                return getStateFromPathDefault(path.replace('/shared-plan/', '/shared/'), options);
            }

            if (_.startsWith(path, '/m/timeline/shared/') && _.isString(params[4])) {
                return getStateFromPathDefault(`/timeline/shared/${params[4]}`, options);
            }

            if (_.startsWith(path, '/m/timeline/') && params.length === 7) {
                const userAgentId = params[3];
                const routeName = {
                    details: 'TimelineSegmentDetails',
                    flights: 'TimelineSegmentFlights',
                };

                if (routeName[params[6]]) {
                    return getStateFromPathDefault(`/m/timeline/${userAgentId}/${params[4]}.${params[5]}/${params[6]}`, options);
                }
            }
            if (_.startsWith(path, '/timeline/summary')) {
                let summaryUrl = '/travel-summary/';

                if (params.length > 3) {
                    const period = params[3];
                    const owner = params[4];

                    if (!_.isEmpty(period)) {
                        summaryUrl += '/' + period;

                        if (!_.isEmpty(owner)) {
                            summaryUrl += '/' + owner;
                        }
                    }
                }

                return getStateFromPathDefault(summaryUrl, options);
            }

            if (['/trips/', '/m/timeline'].indexOf(path) > -1) {
                return getStateFromPathDefault(PathConfig.Timeline, options);
            }

            if (['/m/profile', '/user/edit.php'].indexOf(path) > -1) {
                return getStateFromPathDefault(PathConfig.Profile, options);
            }

            if (_.startsWith(path, '/user/')) {
                const formLink = {
                    '/user/notifications': 'notifications',
                    '/user/regional': 'regional',
                    '/user/useCoupon': 'useCoupon',
                    '/user/change-password': 'changePassword',
                    '/user/change-email': 'changeEmail',
                    '/user/personal': 'personal',
                };

                if (_.isUndefined(formLink[path]) === false) {
                    return getStateFromPathDefault(`/profile/${formLink[path]}`, options);
                }
            }

            if (_.startsWith(path, '/user/connections') || _.startsWith(path, '/user/family/')) {
                if (_.isString(params[3])) {
                    const id = params[3];

                    if (id.length > 0) {
                        return getStateFromPathDefault(_.replace(PathConfig.ConnectionEdit, ':id', id), options);
                    }
                }
            }

            if (_.startsWith(path, '/m/profile/') && params.length >= 4) {
                const formLink = path.replace('/m/profile', '');

                if (formLink === '/location/list') {
                    return getStateFromPathDefault('/profile/location/list', options);
                }

                return getStateFromPathDefault(`/profile/${formLink}`, options);
            }

            if (_.startsWith(path, '/mailboxes/update-oauth/')) {
                return getStateFromPathDefault(_.replace(PathConfig.Mailboxes, ':updateId', params[3]), options);
            }

            if (_.startsWith(path, '/m/merchants')) {
                return getStateFromPathDefault(PathConfig.MerchantLookup, options);
            }

            if (['/account/list/analysis', '/m/spend-analysis'].indexOf(path) > -1) {
                return getStateFromPathDefault(PathConfig.SpendAnalysis, options);
            }

            if (_.startsWith(path, '/blog/?rTagId')) {
                return getStateFromPathDefault(_.replace(PathConfig.BlogPageRedirect, ':rTagId', path.replace('/blog/?rTagId=', '')), options);
            }

            if (_.startsWith(path, '/blog/?s=')) {
                return getStateFromPathDefault(_.replace(PathConfig.BlogSearch, ':search', path.replace('/blog/?s=', '')), options);
            }
        }

        return getStateFromPathDefault(path, options);
    },
    getPathFromState(...args) {
        return getPathFromStateDefault(...args);
    },
    getInitialURL() {
        return null;
    },
};

// @ts-ignore
export const getStateFromPath = (path) => NavigationLinkingOptions.getStateFromPath(path, LinkingConfig);
// @ts-ignore
export const getPathFromState = (state) => NavigationLinkingOptions.getPathFromState(state, LinkingConfig);
