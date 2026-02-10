import Translator from 'bazinga-translator';
import {AppState, NativeModules, Platform} from 'react-native';
import {check, checkMultiple, Permission, PERMISSIONS, request, requestMultiple, RESULTS} from 'react-native-permissions';
import PushNotification, {PushNotificationObject} from 'react-native-push-notification';

import {Colors} from '../../../styles';
import EventEmitter from '../../eventEmitter';
import NotificationUtils, {NotificationEvents} from '../utils';
import {ChannelGroup} from './android/channelGroup';
import {NotificationGroups, NotificationImportance, NotificationsChannels} from './android/constants';
import NotificationHandler from './android/handler';
import {NotificationChannel} from './android/notificationChannel';
import {BaseNotificationProvider} from './base';

const {GeofencingNotificationAndroid} = NativeModules;
const {log} = NotificationUtils;

type PermissionResult = Record<Permission, 'unavailable' | 'blocked' | 'denied' | 'granted' | 'limited'>;

const LocationPermissions: Permission[] = [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION];

if (Platform.Version < 30) {
    // https://developer.android.com/training/location/permissions#request-only-foreground
    // If your app targets Android 11 (API level 30) or higher, the system enforces this best practice. If you request a foreground location permission and the background location permission at the same time, the system ignores the request and doesn't grant your app either permission.
    LocationPermissions.push(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
}

function filterPermission(permissions: PermissionResult) {
    // https://developer.android.com/about/versions/10/privacy/changes
    // fix for PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
    // If your app requests either ACCESS_FINE_LOCATION or ACCESS_COARSE_LOCATION, the system automatically adds ACCESS_BACKGROUND_LOCATION to the request.
    return Object.values(permissions).filter((value) => value !== RESULTS.UNAVAILABLE);
}

function checkAndRequest(permissions: Permission[]) {
    return new Promise<void>((resolve, reject) => {
        checkMultiple(permissions)
            .then((results: PermissionResult) => {
                const result = filterPermission(results);

                if (result.every((permission) => permission === RESULTS.GRANTED)) {
                    resolve();
                } else {
                    requestMultiple(permissions)
                        // tslint:disable-next-line:no-shadowed-variable
                        .then((results: PermissionResult) => {
                            const granted = !filterPermission(results).some((value) => value !== RESULTS.GRANTED);

                            if (granted) {
                                resolve();
                            } else {
                                reject();
                            }
                        })
                        .catch((e) => {
                            console.log('catch', e);
                        });
                }
            })
            .catch(reject);
    });
}

function getChannelGroups(): ChannelGroup[] {
    return [
        new ChannelGroup(NotificationGroups.GROUP_LP, Translator.trans('notification.group.lp', {}, 'mobile')),
        new ChannelGroup(NotificationGroups.GROUP_TRAVEL, Translator.trans('notification.group.travel', {}, 'mobile')),
        new ChannelGroup(NotificationGroups.GROUP_BOOKING, Translator.trans('notification.group.booking', {}, 'mobile')),
        new ChannelGroup(NotificationGroups.GROUP_SECURITY, Translator.trans('notification.group.security', {}, 'mobile')),
        new ChannelGroup(NotificationGroups.GROUP_OTHER, Translator.trans('notification.group.other', {}, 'mobile')),
    ];
}

function getChannels(): NotificationChannel[] {
    return [
        new NotificationChannel(
            NotificationsChannels.CHANNEL_BALANCE_EXPIRATION,
            Translator.trans('notification.channel.balance_expiration', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.balance_expiration.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_LP),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_REWARDS_ACTIVITY,
            Translator.trans('notification.channel.rewards_activity', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.rewards_activity.desc', {}, 'mobile'))
            .setLightColor(Colors.blue)
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_LP),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_RETAIL_CARDS,
            Translator.trans('notification.channel.retail_cards', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.retail_cards.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_LP),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_BOOKING_ACTIVITY,
            Translator.trans('notification.channel.booking_activity', {}, 'mobile'),
            NotificationImportance.Default,
        )
            .setDescription(Translator.trans('notification.channel.booking_activity.desc', {}, 'mobile'))
            .setLightColor(Colors.blue)
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_BOOKING),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_OTC,
            Translator.trans('notification.channel.otc', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.otc.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_SECURITY),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_CHECKIN,
            Translator.trans('notification.channel.checkin', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.checkin.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_DEP,
            Translator.trans('notification.channel.dep', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.dep.desc', {}, 'mobile'))
            .setLightColor(Colors.blue)
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_BOARDING,
            Translator.trans('notification.channel.boarding', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.boarding.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_NEW_RESERVATION,
            Translator.trans('notification.channel.new_reservation', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.new_reservation.desc', {}, 'mobile'))
            .setLightColor(Colors.blue)
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_CHANGE_ALERT,
            Translator.trans('notification.channel.change_alert', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.change_alert.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_FLIGHT_CONNECTION,
            Translator.trans('notification.channel.flight_connection', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.flight_connection.desc', {}, 'mobile'))
            .setLightColor(Colors.blue)
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_TRAVEL),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_PROMO,
            Translator.trans('notification.channel.promo', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.promo.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_OTHER),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_BLOG_POST,
            Translator.trans('notification.channel.blog', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.blog.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_OTHER),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_AWP_EXPIRE,
            Translator.trans('notification.channel.awplus', {}, 'mobile'),
            NotificationImportance.High,
        )
            .setDescription(Translator.trans('notification.channel.awplus.desc', {}, 'mobile'))
            .setLightColor('#f4ac4e')
            .setShowBadge(true)
            .setGroup(NotificationGroups.GROUP_OTHER),

        new NotificationChannel(
            NotificationsChannels.CHANNEL_FOREGROUND_SERVICE,
            Translator.trans('notification.channel.services', {}, 'mobile'),
            NotificationImportance.Min,
        )
            .setDescription(Translator.trans('notification.channel.services.desc', {}, 'mobile'))
            .setEnableLights(false)
            .setEnableVibration(false)
            .setShowBadge(false)
            .setGroup(NotificationGroups.GROUP_OTHER),
    ];
}

class AndroidProvider extends BaseNotificationProvider {
    private onNotificationRegister: (() => void) | undefined;

    private onNotificationListener: (() => void) | undefined;

    // private onLocaleUpdateListener: any;

    constructor() {
        super();

        // Clear badge number at start
        PushNotification.getApplicationIconBadgeNumber(function (number) {
            if (number > 0) {
                PushNotification.setApplicationIconBadgeNumber(0);
            }
        });
    }

    async requestPermissions() {
        try {
            await super.requestPermissions();
        } finally {
            // this method called for get fcm token, not for request permission from user
            await PushNotification.requestPermissions();
            this.onNotificationRegister = NotificationHandler.attachRegister((token) => {
                log('device token received', token);
                this.onTokenReceived(token);
            });
        }
    }

    getInitialNotification = (): void => {
        PushNotification.popInitialNotification((notification: any) => {
            if (notification) {
                log('popInitialNotification', notification);
                this.onNotificationOpened(notification, true, false);
            }
        });
    };

    subscribe(): void {
        this.onNotificationListener = NotificationHandler.attachNotification((notification) => {
            if (notification) {
                log('notification', notification);
                // @ts-ignore
                const {userInteraction} = notification;

                if (userInteraction) {
                    this.onNotificationOpened(notification, false, AppState.currentState === 'active');
                }
            }
        });
        // TODO, event storage:updated deprecated
        // this.onLocaleUpdateListener = EventEmitter.addListener('storage:updated', this.createChannels);

        this.createChannels();
    }

    unsubscribe(): void {
        // if (this.onLocaleUpdateListener) {
        //     this.onLocaleUpdateListener.remove();
        // }
        if (this.onNotificationListener) {
            this.onNotificationListener();
        }
        if (this.onNotificationRegister) {
            this.onNotificationRegister();
        }
    }

    checkLocationPermission = async (): Promise<boolean> => {
        const results = await checkMultiple(LocationPermissions);
        const hasPermission = Object.values(results).some((value) => value === RESULTS.GRANTED);

        log('check location permission', {hasPermission});
        return Promise.resolve(hasPermission);
    };

    checkBackgroundLocationPermission = async (): Promise<boolean> => {
        const status = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        const hasPermission = status === RESULTS.GRANTED;

        log('check background location permission', {hasPermission});
        return Promise.resolve(hasPermission);
    };

    requestLocationPermission = async () => {
        await requestMultiple(LocationPermissions);
    };

    requestBackgroundLocationPermission = async () => {
        await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
    };

    checkAndRequestLocationPermission = () => checkAndRequest(LocationPermissions);

    checkAndRequestLocationSettings = () =>
        new Promise<void>((resolve, reject) => {
            GeofencingNotificationAndroid.locationSettingsRequest().then((result: boolean) => {
                if (result) {
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });

    getAuthorizationStatus = this.checkLocationPermission;

    presentLocalNotification = (notification: PushNotificationObject) => {
        PushNotification.presentLocalNotification(notification);
    };

    cancelLocalNotification = (id: string) => {
        PushNotification.cancelLocalNotification(id);
    };

    createGeoNotifications = (notifications: object[]): Promise<void> => GeofencingNotificationAndroid.createNotifications(notifications);

    cancelNotifications = (): Promise<void> => {
        PushNotification.cancelAllLocalNotifications();
        GeofencingNotificationAndroid.cancelNotifications();

        return Promise.resolve();
    };

    onNotificationOpened = (notification: object, initial: boolean, foreground: boolean): void => {
        // @ts-ignore
        const {data} = notification;

        EventEmitter.emit(NotificationEvents.NOTIFICATION_OPENED, {
            notification: data,
            initial,
            foreground,
        });
    };

    onTokenReceived = (token: string): void => {
        EventEmitter.emit(NotificationEvents.TOKEN_RECEIVED, token);
    };

    createChannels = (): void => {
        log('createChannels');
        GeofencingNotificationAndroid.createChannelGroups(getChannelGroups());
        GeofencingNotificationAndroid.createChannels(getChannels());
    };
}

export default new AndroidProvider();

// @ts-ignore
const translations = [
    Translator.trans(/** @Desc("Retail Store Locator") */ 'location.android.finder.title', {}, 'mobile-native'),
    Translator.trans(
        /** @Desc("The service is enabled. When you come close to the location of a grocery store or a restaurant the bonus card and the barcode will appear on your home screen. You can set up all of your favorite grocery store and restaurant locations inside the AwardWallet app") */ 'location.android.finder_enabled',
        {},
        'mobile-native',
    ),
    Translator.trans(/** @Desc("View the list of all subscribed locations") */ 'location.android.finder.list', {}, 'mobile-native'),
    Translator.trans(
        /** @Desc("The service is disabled. If you turn it on we will be able to deliver your bonus card with the barcode right to your home screen when you come close to your favorite grocery store or a restaurant.") */ 'location.android.finder_disabled',
        {},
        'mobile-native',
    ),
    Translator.trans(/** @Desc("Enable Location Tracking") */ 'location.android.finder.start_tracking', {}, 'mobile-native'),
    Translator.trans(
        /** @Desc("You need to activate the Location Service to use this feature. Please turn on the \"High Accuracy\" mode in the location settings") */ 'location.android.finder.enable_service',
        {},
        'mobile-native',
    ),
];
