import React from 'react';
import {useWindowDimensions, View} from 'react-native';

import ImageNotifications from '../../../assets/images/background-notifications.svg';
import ImageNotificationsDark from '../../../assets/images/background-notifications-dark.svg';
import {useDark} from '../../../theme';
import styles from '../styles';

export const BackgroundNotificationsImage: React.FunctionComponent = () => {
    const isDark = useDark();
    const dimensions = useWindowDimensions();
    const height = dimensions.height <= 800 ? '75%' : '100%';

    if (isDark) {
        return (
            <View style={styles.imageContainer}>
                <ImageNotificationsDark width={'100%'} height={height} />
            </View>
        );
    }

    return (
        <View style={styles.imageContainer}>
            <ImageNotifications width={'100%'} height={height} />
        </View>
    );
};
