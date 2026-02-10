import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Translator from 'bazinga-translator';
import {Alert, AppState} from 'react-native';
import GeofencingNotification from 'react-native-geofencing-notification';
import {check, openSettings, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import EventEmitter from '../../eventEmitter';
import NotificationUtils, {NotificationEvents} from '../utils';
import {BaseNotificationProvider} from './base';

const {log} = NotificationUtils;

class IosProvider extends BaseNotificationProvider {
    constructor() {
        super();

        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }

    async getInitialNotification() {
        const notification = await PushNotificationIOS.getInitialNotification();

        if (notification != null) {
            this.onNotificationOpened(notification, true, false);
        }
    }

    subscribe() {
        PushNotificationIOS.addEventListener('register', this.onRegister);
        PushNotificationIOS.addEventListener('registrationError', this.onRegistrationError);
        // @ts-ignore
        PushNotificationIOS.addEventListener('notification', this.onNotificationOpened);
        // @ts-ignore
        PushNotificationIOS.addEventListener('localNotification', this.onNotificationOpened);
    }

    unsubscribe() {
        // @ts-ignore
        PushNotificationIOS.removeEventListener('register', this.onRegister);
        // @ts-ignore
        PushNotificationIOS.removeEventListener('registrationError', this.onRegistrationError);
        // @ts-ignore
        PushNotificationIOS.removeEventListener('notification', this.onNotificationOpened);
        // @ts-ignore
        PushNotificationIOS.removeEventListener('localNotification', this.onNotificationOpened);
    }

    getAuthorizationStatus = () =>
        new Promise<string>((resolve, reject) => {
            GeofencingNotification.getAuthorizationStatus((status) => {
                if (status === 'authorizedAlways') {
                    resolve(status);
                } else {
                    reject(status);
                }
            });
        });

    checkLocationPermission = async () => {
        const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

        log('check location', {status});
        return Promise.resolve(status === RESULTS.GRANTED);
    };

    checkBackgroundLocationPermission = () => Promise.resolve(true);

    requestBackgroundLocationPermission = () => Promise.resolve();

    requestLocationPermission = async () => {
        const oldStatus = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
        const newStatus = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

        if (oldStatus === RESULTS.BLOCKED && newStatus === RESULTS.BLOCKED) {
            await this.alertEnableLocation();
        }
    };

    checkAndRequestLocationPermission = async () => {
        const status = await this.checkLocationPermission();

        log('getAuthorizationStatus:', status);
        await this.requestLocationPermission();
    };

    checkAndRequestLocationSettings = () => Promise.resolve();

    createGeoNotifications = (notifications) => {
        GeofencingNotification.createNotifications(notifications);

        return Promise.resolve();
    };

    presentLocalNotification = (request) => {
        PushNotificationIOS.addNotificationRequest(request);
    };

    cancelLocalNotification = (id: string) => {
        PushNotificationIOS.removePendingNotificationRequests([id]);
        PushNotificationIOS.removeDeliveredNotifications([id]);
    };

    cancelNotifications = () => {
        PushNotificationIOS.removeAllPendingNotificationRequests();
        GeofencingNotification.cancelNotifications();

        return Promise.resolve();
    };

    alertEnableLocation = () => {
        log('alert enable location');

        return new Promise<void>((resolve) => {
            Alert.alert(
                Translator.trans('location.enable-service.title', {}, 'mobile'),
                Translator.trans('location.enable-service', {}, 'mobile'),
                [
                    {
                        text: Translator.trans('button.ok', {}, 'messages'),
                        // @ts-ignore
                        onPress: resolve,
                    },
                    {
                        text: Translator.trans('settings', {}, 'messages'),
                        onPress: async () => {
                            await openSettings();

                            resolve();
                        },
                    },
                ],
                {cancelable: false},
            );
        });
    };

    onRegister = (token) => {
        EventEmitter.emit(NotificationEvents.TOKEN_RECEIVED, token);
    };

    onRegistrationError = (error) => {
        log('registration error', error);
        EventEmitter.emit(NotificationEvents.TOKEN_RECEIVED, '');
    };

    onNotificationOpened = (notification, initial, foreground) => {
        // eslint-disable-next-line no-param-reassign
        foreground = foreground || AppState.currentState === 'active';
        notification.finish(PushNotificationIOS.FetchResult.NoData);
        EventEmitter.emit(NotificationEvents.NOTIFICATION_OPENED, {
            notification: notification.getData(),
            initial,
            foreground,
        });
    };
}

export default new IosProvider();
