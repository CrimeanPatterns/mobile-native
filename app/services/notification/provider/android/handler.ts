import type {ReceivedNotification} from 'react-native-push-notification';
import PushNotification from 'react-native-push-notification';

type RegisterEvent = {token: string; os: string};
type RegisterEventHandler = (token: string) => void;
type NotificationEventHandler = (notification: object) => void;

class NotificationHandler {
    private _onNotification: NotificationEventHandler | undefined;

    private _onRegister: RegisterEventHandler | undefined;

    private _token: string | undefined;

    public getToken(): string | undefined {
        return this._token;
    }

    public onNotification(notification: object): void {
        if (typeof this._onNotification === 'function') {
            this._onNotification(notification);
        }
    }

    public onRegister({token}: RegisterEvent): void {
        this._token = token;
        if (typeof this._onRegister === 'function') {
            this._onRegister(token);
        }
    }

    public onAction(notification: ReceivedNotification): void {
        console.log('onAction', notification);
        // if (notification.action === 'Yes') {
        //     PushNotification.invokeApp(notification);
        // }
    }

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    public onRegistrationError(error: string) {
        console.log(error);
    }

    public attachRegister(registerHandler: RegisterEventHandler): () => void {
        this._onRegister = registerHandler;
        return () => (this._onRegister = undefined);
    }

    public attachNotification(notificationHandler: NotificationEventHandler): () => void {
        this._onNotification = notificationHandler;
        return () => (this._onNotification = undefined);
    }
}

const handler = new NotificationHandler();

PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: handler.onRegister.bind(handler),

    // (required) Called when a remote or local notification is opened or received
    onNotification: handler.onNotification.bind(handler),

    // (optional) Called when Action is pressed (Android)
    onAction: handler.onAction.bind(handler),

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: handler.onRegistrationError.bind(handler),

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: false,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     */
    requestPermissions: false,
});

export default handler;
