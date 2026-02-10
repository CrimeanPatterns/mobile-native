export enum NotificationImportance {
    None,
    Min,
    Low,
    Default,
    High,
    Max,
    Unspecified = -1000,
}

export enum Visibility {
    Private,
    Public,
    Secret = -1,
}

export enum NotificationsChannels {
    CHANNEL_BALANCE_EXPIRATION = 'balance_expiration',
    CHANNEL_REWARDS_ACTIVITY = 'rewards_activity',
    CHANNEL_RETAIL_CARDS = 'retail_cards',
    CHANNEL_BOOKING_ACTIVITY = 'booking_activity',
    CHANNEL_OTC = 'otc',
    CHANNEL_CHECKIN = 'checkin',
    CHANNEL_DEP = 'dep',
    CHANNEL_BOARDING = 'boarding',
    CHANNEL_NEW_RESERVATION = 'new_reservation',
    CHANNEL_CHANGE_ALERT = 'change_alert',
    CHANNEL_FLIGHT_CONNECTION = 'flight_connection',
    CHANNEL_PROMO = 'promo',
    CHANNEL_BLOG_POST = 'blog_post',
    CHANNEL_AWP_EXPIRE = 'awp_expire',
    CHANNEL_FOREGROUND_SERVICE = 'foreground_service',
}

export enum NotificationGroups {
    GROUP_LP = '1_lp',
    GROUP_TRAVEL = '2_travel',
    GROUP_BOOKING = '3_booking',
    GROUP_SECURITY = '4_security',
    GROUP_OTHER = '5_other',
}

export type NativeAndroidChannel = {
    bypassDnd?: boolean;
    channelId: string;
    description?: string;
    group?: string;
    importance: NotificationImportance;
    lightColor?: string;
    lightsEnabled?: boolean;
    lockScreenVisibility?: Visibility;
    name: string;
    showBadge?: boolean;
    sound?: string;
    vibrationEnabled?: boolean;
    vibrationPattern?: number[];
};

export type NativeChannelGroup = {
    groupId: string;
    name: string;
};
