import _ from 'lodash';
import {Linking, Platform} from 'react-native';

import {isIOS} from '../../helpers/device';
import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import AccountsListService from '../accountsList';
import API, {API_URL} from '../api';
import EventEmitter, {EventSubscription} from '../eventEmitter';
import Session from '../session';
import UserSettings from '../userSettings';
import NotificationProvider from './provider';
import {INotificationProvider} from './provider/base';
import NotificationUtils, {NotificationEvents} from './utils';

const {log} = NotificationUtils;

class NotificationManagerService {
    private listeners: EventSubscription[] = [];
    private readonly provider: INotificationProvider;

    constructor(provider: INotificationProvider) {
        this.provider = provider;

        this.onUserSettingsUpdate = this.onUserSettingsUpdate.bind(this);
        this.refreshAccountsNotifications = this.refreshAccountsNotifications.bind(this);
    }

    /**
     * Check/request permissions, register device
     */
    async connect() {
        const hasPermission = await this.checkNotificationsPermission();

        try {
            if (hasPermission) {
                await this.requestNotificationsPermission();
            } else {
                this.register();
            }
        } finally {
            this.initialize();
        }
    }

    /**
     * Unsubscribe & remove event listeners
     */
    disconnect() {
        this.unregister();
        this.cancelNotifications();
    }

    /**
     * Unregister device
     */
    unregister = () => {
        const token = NotificationUtils.getDeviceToken();

        log('post /push/unregister', {token});

        API.post(
            '/push/unregister',
            {
                id: token,
                type: Platform.OS,
            },
            {retry: 3, timeout: 30000, globalError: false},
        );
    };

    initialize() {
        this.refreshAccountsNotifications();
    }

    subscribe() {
        this.listeners.push(
            EventEmitter.addListener('accountsList:update', this.refreshAccountsNotifications),
            EventEmitter.addListener('userSettings:update', this.onUserSettingsUpdate),
            EventEmitter.addListener(NotificationEvents.TOKEN_RECEIVED, this.register),
            EventEmitter.addListener(NotificationEvents.NOTIFICATION_OPENED, this.onNotificationOpened),
        );
        this.provider.subscribe();
    }

    unsubscribe() {
        this.provider.unsubscribe();
        this.listeners.map((listener) => listener.remove());
        this.listeners = [];
    }

    getInitialNotification() {
        return this.provider.getInitialNotification();
    }

    getLocationAuthorizationStatus() {
        log('get location authorization status');
        return this.provider.getAuthorizationStatus();
    }

    checkLocationPermission() {
        log('check location permission');
        return this.provider.checkLocationPermission();
    }

    checkBackgroundLocationPermission() {
        log('check background location permission');
        return this.provider.checkBackgroundLocationPermission();
    }

    requestLocationPermission() {
        log('request location permission');
        return this.provider.requestLocationPermission();
    }

    requestBackgroundLocationPermission() {
        log('request background location permission');
        return this.provider.requestBackgroundLocationPermission();
    }

    checkNotificationsPermission() {
        log('check notifications permission');
        return this.provider.checkPermissions();
    }

    requestNotificationsPermission() {
        log('request notifications permission');
        return this.provider.requestPermissions();
    }

    checkAndRequestLocationPermission() {
        log('check and request location permission');
        return this.provider.checkAndRequestLocationPermission();
    }

    checkAndRequestLocationSettings() {
        log('check and request location settings');
        return this.provider.checkAndRequestLocationSettings();
    }

    createGeoNotifications(notifications) {
        log('create geo notifications', notifications);
        return this.provider.createGeoNotifications(notifications);
    }

    cancelNotifications() {
        log('cancel all notifications');
        return this.provider.cancelNotifications();
    }

    presentLocalNotification(notification) {
        return this.provider.presentLocalNotification(notification);
    }

    cancelLocalNotification(notificationId) {
        return this.provider.cancelLocalNotification(notificationId);
    }

    async refreshAccountsNotifications() {
        log('refresh accounts notifications');

        const granted = await this.checkLocationPermission();

        if (granted && UserSettings.isMpEnabled('mpRetailCards')) {
            const geoNotifications = AccountsListService.getAccountsNotifications();

            if (geoNotifications && geoNotifications.length > 0) {
                if (isIOS) {
                    this.cancelNotifications();
                }

                this.createGeoNotifications(geoNotifications)
                    .then(() => {
                        log('success create geo notifications');
                    })
                    .catch(() => {
                        log('fail create geo notifications');
                    });
            }
        } else {
            this.cancelNotifications();
        }
    }

    register = async (token?: string) => {
        log('register', token);

        const persistData = {token, deviceId: null};

        try {
            const response = await API.post(
                '/push/register',
                {
                    id: token,
                    type: Platform.OS,
                },
                {retry: 3, timeout: 30000, globalError: false},
            );
            const {data} = response;
            const {deviceId} = data;

            if (deviceId) {
                persistData.deviceId = deviceId;
            }

            log('register device, success', deviceId);
        } catch (error) {
            log('register device, fail', error);
        }

        NotificationUtils.persistData(persistData);
    };

    onNotificationOpened = (data) => {
        log('notification opened', data);

        const {notification} = data;
        const {action} = data;

        // eslint-disable-next-line no-param-reassign
        data = notification.payload || notification.additionalData || notification;

        // eslint-disable-next-line no-underscore-dangle
        const forceRefresh = parseInt(data._ts, 10) > parseInt(Session.getProperty('timestamp'), 10) / 1000;

        if (_.isUndefined(data.tel) === false) {
            log('open tel', data.tel);
            Linking.canOpenURL(`tel:${data.tel}`).then((supported) => supported && Linking.openURL(`tel:${data.tel}`));
        }

        if (_.isUndefined(data.ex) === false) {
            // open links from push notification
            log('open notification', data.ex);
            handleOpenUrl({url: decodeURIComponent(data.ex)}, undefined, {forceRefresh}, true);
        }

        if (action === 'locations_list') {
            handleOpenUrl({url: `${API_URL}/m/profile/location/list`});
        }
    };

    onUserSettingsUpdate(changed) {
        if (changed.mpDisableAll || changed.mpRetailCards || changed.sound || changed.vibrate) {
            this.refreshAccountsNotifications();
        }
    }
}

export default new NotificationManagerService(NotificationProvider);
