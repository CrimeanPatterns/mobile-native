export type AccountNavigationParams = {
    ID: string;
    SubAccountID?: string;
    Access?: {
        edit?: boolean;
        update?: boolean;
        delete?: boolean;
        autologin?: boolean;
    };
};

export type AccountDetailsNavigationParams = AccountNavigationParams & {
    animationEnabled?: boolean;
    updateAccount?: () => void;
    forceRefresh?: boolean;
};
