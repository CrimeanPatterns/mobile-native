// @ts-ignore

export type BarcodeObject = Record<'BarCodeData' | 'BarCodeType', 'string'>;

type LastChange = {
    LastChange: string;
    TotalLastChange: number;
};

type LastChangeNull = {
    LastChange: null;
    TotalLastChange: null;
};

type TotalValue = {
    TotalValue: number;
    Value: string;
};

type MileValue = (TotalValue & (LastChange | LastChangeNull)) | null;

export interface IAccount {
    [key: string]: unknown;
    ID: number;
    FID: string;
    SubAccountID?: string;
    SubAccountsArray?: Partial<IAccount>;
    Kind: number;
    DisplayName: string;
    UserName: string;
    Login?: string;
    UserID: number;
    UserAgentID: number;
    ProviderCode?: string;
    ProviderID?: string;
    ParentAccount?: string;
    ParentError?: boolean;
    TableName: string;
    isCustom?: boolean;
    Description?: string;
    Blocks: {[key: string]: Record<string, unknown>}[];
    PreviewBlocks: {[key: string]: Record<string, unknown>}[];
    Access?: {
        edit?: boolean;
        update?: boolean;
        updateAll?: boolean;
        delete?: boolean;
        autologin?: boolean;
    };
    Balance?: string;
    LastBalance?: string;
    TotalBalance?: number;
    UpdateDurationWithoutPlans?: number;
    BalanceWatchEndDate?: number;
    EliteStatus?: {
        Rank: number;
        LevelsCount: number;
        Name: string;
    };
    LastChangeRaw?: number;
    LastChange?: string;
    LastChangeDate?: number;
    ExpirationDate?: {
        fmt: string;
        ts?: number;
    };
    ExpirationState?: 'far' | 'soon' | 'expired';
    Disabled?: boolean;
    Error?: boolean;
    SuccessCheckDate?: number;
    CouponType?: string;
    Type?: 'passport' | 'traveler-number' | 'coupon' | 'vaccine-card' | 'insurance-card' | 'visa' | 'drivers-license' | 'priority-pass';
    HasSubAccounts?: boolean;
    BarcodeType: 'qrcode' | string;
    BarCodeParsed?: BarcodeObject;
    BarCodeCustom?: BarcodeObject;
    Phones?: [];
    Autologin?: {
        mobileExtension: boolean;
        desktopExtension: boolean;
        loginUrl: string;
    };
    HasHistory?: boolean;
    HasBalanceChart?: boolean;
    LoginURL?: string;
    FontColor?: string;
    BackgroundColor?: string;
    IATACode?: string;
    PwnedNotice?: string;
    Question?: string;
    Notice?: Record<'DateInfo' | 'Message' | 'Title', string>;
    Documents?: {
        file: string;
        height: number;
        width: number;
        id: number;
    }[];
    ShowPictures?: boolean;
    ScanBarcode?: boolean;
    VaccineCardAccount?: boolean;
    MileValue?: MileValue;
    TotalUSDCash?: number;
    TotalUSDCashChange?: number;
    Number?: string;
}
