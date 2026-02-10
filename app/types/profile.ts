import {CentrifugeConnectionConfig} from '../services/centrifuge';

export type IProfile = {
    AccountLevel: string;
    AvatarSrc: string;
    ExpiresOn: string;
    Login: string;
    Logons: number;
    FullName: string;
    AvatarImage: string;
    UserEmail: string;
    impersonate: boolean;
    overview: unknown[];
    emailVerified: boolean;
    IsTrial: boolean;
    Free: boolean;
    travelSummary: {
        longHaulFlights: {
            percantage: number;
            value: number;
        };
        shortHaulFlights: {
            percantage: number;
            value: number;
        };
        totalFlights: {
            percentage: number;
            value: number;
        };
    };
    UserID: number;
    country: string;
    locale: string;
    restore: boolean;
    lastSyncDate: number;
    products: {
        [key: string]: unknown;
        id: string;
        description: string;
        type: string;
    }[];
    OneCards: number;
    centrifugeConfig: CentrifugeConnectionConfig;
    feedbacks: {
        action: number;
        appVersion: string;
        date: number;
    }[];
    googleMailboxConfig: {
        iosClientId: string;
        scopes: string[];
        webClientId: string;
    };
    googleMapsEndpoints: string[];
    language: string;
    locations: {
        total: number;
        tracked: number;
    };
    mailboxOwners: unknown[];
    settings: {
        mpBookingMessages: boolean;
        mpCheckins: boolean;
        mpDisableAll: boolean;
        mpRetailCards: boolean;
    };
    spentAnalysis: boolean;
    updater3k: boolean;
    vaccineCardAccount: string;
    AvailableCardsUpdateDate;
    refCode: string;
};
