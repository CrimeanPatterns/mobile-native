import {useEffect, useRef} from 'react';

import NotificationManagerService from '../../services/notification';

export const RootNotificationManager = () => {
    useEffect(() => {
        NotificationManagerService.subscribe();

        return () => {
            NotificationManagerService.unsubscribe();
        };
    }, []);

    return null;
};

export const InitialNotification = () => {
    const isOpened = useRef<boolean>(false);

    if (!isOpened.current) {
        NotificationManagerService.getInitialNotification();
        isOpened.current = true;
    }

    return null;
};

export const NotificationManager = () => {
    useEffect(() => {
        NotificationManagerService.connect();
    }, []);

    return null;
};
