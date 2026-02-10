import Translator from 'bazinga-translator';
import {Alert} from 'react-native';
import {checkNotifications, openSettings, requestNotifications, RESULTS} from 'react-native-permissions';

import NotificationUtils from '../utils';

const {log} = NotificationUtils;

export interface INotificationProvider {
    checkPermissions: () => Promise<boolean>;
    requestPermissions: () => Promise<void>;
    getInitialNotification: () => void;
    subscribe: () => void;
    unsubscribe: () => void;
    checkLocationPermission: () => Promise<boolean>;
    checkBackgroundLocationPermission: () => Promise<boolean>;
    requestBackgroundLocationPermission: () => Promise<void>;
    requestLocationPermission: () => Promise<void>;
    checkAndRequestLocationPermission: () => Promise<void>;
    checkAndRequestLocationSettings: () => Promise<void>;
    createGeoNotifications: (notifications: unknown[]) => Promise<void>;
    cancelNotifications: () => Promise<void>;
    getAuthorizationStatus: () => Promise<string | boolean>;
    cancelLocalNotification: (notificationId: string) => void;
    presentLocalNotification: (notification: unknown) => void;
}

export class BaseNotificationProvider implements INotificationProvider {
    async checkPermissions() {
        const {status} = await checkNotifications();

        log('check notification permission', {status});
        return Promise.resolve(status === RESULTS.GRANTED);
    }

    async requestPermissions() {
        const {status: oldStatus} = await checkNotifications();
        const {status: newStatus} = await requestNotifications(['alert', 'badge', 'sound']);

        if (oldStatus === RESULTS.BLOCKED && newStatus === RESULTS.BLOCKED) {
            await this.alertEnableNotifications();
        }
    }

    getInitialNotification(): void {
        throw new Error('You have to implement the method getInitialNotification!');
    }

    subscribe() {
        throw new Error('You have to implement the method subscribe!');
    }

    unsubscribe() {
        throw new Error('You have to implement the method unsubscribe!');
    }

    checkLocationPermission(): Promise<boolean> {
        throw new Error('You have to implement the method checkLocationPermission!');
    }

    checkBackgroundLocationPermission(): Promise<boolean> {
        throw new Error('You have to implement the method checkBackgroundLocationPermission!');
    }

    requestBackgroundLocationPermission(): Promise<void> {
        throw new Error('You have to implement the method requestBackgroundLocationPermission!');
    }

    checkAndRequestLocationPermission(): Promise<void> {
        throw new Error('You have to implement the method checkAndRequestLocationPermission!');
    }

    checkAndRequestLocationSettings(): Promise<void> {
        throw new Error('You have to implement the method checkAndRequestLocationSettings!');
    }

    createGeoNotifications(_notifications: unknown[]): Promise<void> {
        throw new Error('You have to implement the method createGeoNotifications!');
    }

    alertEnableNotifications = () => {
        log('alert enable notifications');

        return new Promise<void>((resolve) => {
            Alert.alert(
                Translator.trans(
                    /** @Desc("AwardWallet does not have the ability to send notifications") */ 'notifications.enable-service.title',
                    {},
                    'mobile-native',
                ),
                Translator.trans(
                    /** @Desc("Please enable Notifications by tapping \"Settings\" and choosing \"Allow Notifications\" under the \"Notifications\" settings.") */ 'notifications.enable-service',
                    {},
                    'mobile-native',
                ),
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

    cancelLocalNotification(_notificationId: string): void {}

    cancelNotifications(): Promise<void> {
        return Promise.resolve(undefined);
    }

    getAuthorizationStatus(): Promise<string | boolean> {
        return Promise.resolve(false);
    }

    presentLocalNotification(_notification: unknown): void {}

    requestLocationPermission(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
