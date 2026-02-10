import {DrawerScreenProps} from '@react-navigation/drawer';
import {CompositeScreenProps, NavigatorScreenParams} from '@react-navigation/native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';

import {AccountDetailsNavigationParams} from '../screens/accounts/account/types';
import {ITripSegment} from './trips';
import {AttachmentBlock} from './trips/blocks';

export type CommonRoutes = {
    AboutUs: undefined;
    PrivacyNotice: undefined;
    ContactUs: undefined;
    FAQs: undefined;
    Terms: undefined;
    InternalPage: {
        url: string;
    };
};

export type ConnectionsRoutes = {
    Connections: {
        loading?: boolean;
        addNewConnection?: boolean;
        addNewPerson?: boolean;
        reload?: boolean;
    };
    ConnectionEdit:
        | {id: string}
        | {
              showActions: () => void;
              id: string;
              reloadCb: () => void;
          }
        | undefined;
    ConnectionGrantAccess;
    ConnectionShare: {
        connection;
        shareCode: string;
        grantType: 'full' | 'readonly';
    };
    ConnectionInvite: {
        shareCode: string;
    };
    AgentAdd:
        | {
              onSuccess: () => void;
          }
        | undefined;
};

export type OutsideStackParamList = {
    SignIn: {
        login?: string;
        error?: string;
        requiredPassword?: boolean;
    };
    SignUp: undefined;
    ForgotPassword;
    PasswordRecovery: {
        userId?: string;
        hash?: string;
    };
    SecurityQuestions: {
        securityQuestions?: {[key: string]: unknown};
    };
    MerchantOffer: {
        id: string;
        label: string;
        category: string;
        nameToUrl: string;
    };
    MerchantLookup: undefined;
    ConnectionInvite;
} & CommonRoutes &
    TripsShareStackParamList;

export type OutsideStackScreenParams = {
    Main: NavigatorScreenParams<OutsideStackParamList>;
};

export type OutsideStackScreenProps<T extends keyof OutsideStackParamList> = CompositeScreenProps<
    DrawerScreenProps<OutsideStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type OutsideStackScreenFunctionalComponent<T extends keyof OutsideStackParamList> = React.FunctionComponent<OutsideStackScreenProps<T>> & {
    navigationOptions: ({navigation, route}: DrawerScreenProps<OutsideStackParamList, T>) => NativeStackNavigationOptions;
};

export type MailboxesStackParamList = {
    Mailboxes: {
        loading: boolean;
        title: string;
        updateId;
        deleteId;
    };
    MailboxAdd;
    MailboxDetails: {
        email;
        owner;
        status;
        icon;
        deleteMailbox;
    };
    MailboxIMAP: {
        email: string;
        owner;
    };
};

export type ProfileStackParamList = {
    Profile:
        | {
              loading?: boolean;
              reload?: boolean;
          }
        | undefined;
    ProfileEdit: {
        formLink: string;
        formTitle?: string;
        scrollTo?: string;
    };
    ProfileSearch;
    Onecard;
    SubscriptionInfo;
    SubscriptionCancel: {
        platform: 'ios' | 'android' | 'desktop';
    };
    BalanceWatchCreditsPayment: {
        loading: boolean;
    };
    Payment;
    StoreLocations: {
        removeLocation?: () => void;
        locationId: string;
        accountId: string;
        subId: string;
        reload?: () => void;
        lat: string;
        lng: string;
    };
    StoreLocationsList: {
        formLink: string;
        edit?: boolean;
        changeMode?: () => void;
    };
    UserDelete;
    TwoFactorAuthentication;
    TOTPManualSetup: {
        initData;
    };
    TOTPSetupCode: {
        secret: string;
    };
    TOTPCompleteSetup: {
        recovery: string;
    };
} & MailboxesStackParamList &
    ConnectionsRoutes &
    CommonRoutes;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
    StackScreenProps<ProfileStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type ProfileStackScreenFunctionalComponent<T extends keyof ProfileStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    ProfileStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<ProfileStackParamList, T>) => NativeStackNavigationOptions;
};

export type AccountsStackParamList = {
    AccountsList:
        | {
              amount?: number;
              discoveredAccounts?: number;
          }
        | undefined;
    AccountScanAdd: {
        providerId;
        promises;
        barcode;
        images;
    };
    AccountsUpdate;
    AccountsTotals:
        | {
              amount: null;
              user: string;
          }
        | {
              amount: number;
              user: null;
          }
        | undefined;
    AccountsAdd:
        | {
              scan?: boolean;
          }
        | undefined;
    AccountAddListProvider: {
        kindId?;
        providerId?;
        scan?: boolean;
    };
    AccountDetails: AccountDetailsNavigationParams & {
        animation?;
    };
    AccountAdd: {
        providerId;
    };
    AccountEdit: {
        ID: string;
        SubAccountID?: string;
    };
    AccountUpdate: {
        ID: string;
        backTo?: string;
        firstUpdate?: boolean;
    };
    AccountBalanceChart: {
        ID: string;
        SubAccountID?: string;
    };
    AccountHistory: {
        ID: string;
        SubAccountID?: string;
    };
    AccountHistoryOffer: {
        uuid;
        extraData;
    };
    AccountDetailsPhones: {
        ID: string;
        SubAccountID?: string;
    };
    AccountAutoLogin: {
        ID: string;
        loading: boolean;
    };
    AccountDetailsBarcode: {
        ID: string;
        SubAccountID?: string;
        removeBarcode?: () => void;
        type;
    };
    AccountPictures: {
        ID: string;
        SubAccountID?: string;
        newPicture: {
            fileName: string;
            filePath: string;
        };
    };
    Covid19;
    DiscoveredAccounts;
    DiscoveredAccountAdd: {
        accountId: string | number;
        backTo: keyof AccountsStackParamList;
    };
    ScanCardCamera: {
        skip: () => void;
        side: string;
        title: string;
        onTakePicture: () => void;
    };
    ScanCardCrop: {
        onCrop: () => void;
        imagePath: string;
        crop: () => void;
    };
    BalanceWatchCreditsPayment: {
        loading: boolean;
    };
    StoreLocations: {
        removeLocation?: () => void;
        locationId?: string;
        accountId?: string;
        subId?: string;
        reload?: () => void;
        lat?: string;
        lng?: string;
    };
    StoreLocationsList: {
        formLink: string;
        edit?: boolean;
        changeMode?: () => void;
    };
    MileValue;
} & ConnectionsRoutes &
    CommonRoutes;

export type AccountsStackScreenProps<T extends keyof AccountsStackParamList> = CompositeScreenProps<
    StackScreenProps<AccountsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type AccountsStackScreenFunctionalComponent<T extends keyof AccountsStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    AccountsStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<AccountsStackParamList, T>) => NativeStackNavigationOptions;
};

export type TripStackParamList = {
    TimelineSegmentDetails: {
        userAgentId: string;
        id: ITripSegment['id'];
        shareCode?: ITripSegment['menu']['shareCode'];
        forceRefresh?: boolean;
        reload?: () => void;
    };
    TimelineSegmentPhones: {
        userAgentId: string;
        id: ITripSegment['id'];
    };
    TimelineSegmentFlightsAutoLogin: {
        Trip: unknown;
        Date: number[];
        loading: boolean;
    };
    TimelineSegmentFlights;
    ItineraryAutologin: {
        itineraryId;
        type;
        loading: boolean;
    };
    TimelineLoungeList: {
        segmentId;
        arrivalTerminal?;
        departureTerminal?;
        stage;
    };
    TimelineLoungeDetails: {
        id: number;
    };
};

export type TripsStackParamList = {
    Timeline;
    Trip: NavigatorScreenParams<TripStackParamList>;
    Note;
} & CommonRoutes;

export type TripsShareStackParamList = {
    TimelineShare: {
        userAgentId: string;
        title?: string;
        amount?: string;
        loading?: boolean;
        showDeleted?: boolean;
        toggleDeleted?: () => void;
        chooseTraveler?: () => void;
    };
    TimelineShareSegmentDetails: TripStackParamList['TimelineSegmentDetails'];
    TimelineShareSegmentPhones: TripStackParamList['TimelineSegmentDetails'];
    TimelineShareSegmentFlights: {
        id: string;
    };
    TimelineSegmentFlightsAutoLogin: {
        Trip: unknown;
        Date: number[];
        loading: boolean;
    };
} & CommonRoutes;

export type TripsStackScreenProps<T extends keyof TripsStackParamList> = CompositeScreenProps<
    StackScreenProps<TripsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type TripsStackScreenFunctionalComponent<T extends keyof TripsStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    TripsStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<TripsStackParamList, T>) => NativeStackNavigationOptions;
};

export type TripStackScreenProps<T extends keyof TripStackParamList> = CompositeScreenProps<
    StackScreenProps<TripStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type TripStackScreenFunctionalComponent<T extends keyof TripStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    TripStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<TripStackParamList, T>) => NativeStackNavigationOptions;
};

export type TransferTimesParamList = {
    Transfer;
    Purchase;
};

export type BookingDetailsParamList = {
    Details: {
        requestId: string;
    };
    Messages: {
        requestId: string;
    };
    NotVerified: {
        requestId: string;
        conf?: string;
    };
    NotFound: {
        requestId: string;
    };
};

export type BookingsStackParamList = {
    BookingRequests;
    BookingDetails: NavigatorScreenParams<BookingDetailsParamList>;
};

export type BookingDetailsParamListScreenProps<T extends keyof BookingDetailsParamList> = CompositeScreenProps<
    StackScreenProps<BookingDetailsParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type BookingDetailsScreenFunctionalComponent<T extends keyof BookingDetailsParamList, P = Record<string, unknown>> = React.FunctionComponent<
    BookingDetailsParamListScreenProps<T> & P
> & {
    navigationOptions?: ({navigation, route}: StackScreenProps<BookingDetailsParamList, T>) => NativeStackNavigationOptions;
};

export type ToolsStackParamList = {
    Tools;
    Profile: NavigatorScreenParams<ProfileStackParamList>;
    MileValue: {
        animation: 'default' | 'none';
    };
    TransferTimes: NavigatorScreenParams<TransferTimesParamList>;
    Bookings: NavigatorScreenParams<BookingsStackParamList>;
} & CommonRoutes;

export type ToolsStackScreenProps<T extends keyof ToolsStackParamList> = CompositeScreenProps<
    StackScreenProps<ToolsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type ToolsStackScreenFunctionalComponent<T extends keyof ToolsStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    ToolsStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<ToolsStackParamList, T>) => NativeStackNavigationOptions;
};
export type CardsStackParamList = {
    CardsMain: NavigatorScreenParams<{
        SpendAnalysis;
        TransactionAnalyzer;
        MerchantLookup;
    }>;
    AccountHistoryOffer: {
        uuid;
        extraData;
    };
    MerchantOffer: {
        nameToUrl: string;
    };
    MerchantReverse;
    SpendAnalysisDetails: {
        name: string;
        merchant: string;
        formData;
    };
    MileValue;
} & CommonRoutes;

export type CardsStackScreenProps<T extends keyof CardsStackParamList> = CompositeScreenProps<
    StackScreenProps<CardsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type CardsStackScreenFunctionalComponent<T extends keyof CardsStackParamList, P = Record<string, unknown>> = React.FunctionComponent<
    CardsStackScreenProps<T> & P
> & {
    navigationOptions: ({navigation, route}: StackScreenProps<CardsStackParamList, T>) => NativeStackNavigationOptions;
};

export type BlogStackParamList = {
    Blog;
    BlogPage: {
        url: string;
    };
    BlogAuthorPage: {
        url: string;
    };
    BlogPageRedirect: {
        rTagId;
    };
    BlogSearch;
};

export type InsideStackParamList = {
    AccountsTab: NavigatorScreenParams<AccountsStackParamList>;
    TripsTab: NavigatorScreenParams<TripsStackParamList>;
    CardsTab: NavigatorScreenParams<CardsStackParamList>;
    BlogTab: NavigatorScreenParams<BlogStackParamList>;
    ToolsTab: NavigatorScreenParams<ToolsStackParamList>;
};

export type InsideStackScreenProps<T extends keyof InsideStackParamList> = CompositeScreenProps<
    StackScreenProps<InsideStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type InsideStackScreenParams = {
    Main: NavigatorScreenParams<InsideStackParamList>;
    Account: NavigatorScreenParams<AccountsStackParamList>;
    Trip: NavigatorScreenParams<TripsStackParamList>;
    TripsShare: NavigatorScreenParams<TripsShareStackParamList>;
    ModalScreens: NavigatorScreenParams<{
        TravelSummary: {
            owner;
            period;
        };
        SubscriptionPayment;
        TimelineNote: {
            id: string;
            isTravelPlan: boolean;
            notes?: string;
            files?: AttachmentBlock[];
        };
    }>;
};

export type RootStackParamList = {
    Outside: NavigatorScreenParams<OutsideStackScreenParams>;
    Inside: NavigatorScreenParams<InsideStackScreenParams>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
