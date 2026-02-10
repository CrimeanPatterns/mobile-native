import React from 'react';
import {useWindowDimensions, View} from 'react-native';

import ImageLocation from '../../../assets/images/background-location.svg';
import ImageLocationDark from '../../../assets/images/background-location-dark.svg';
import {useDark} from '../../../theme';
import styles from '../styles';

export const BackgroundLocationImage: React.FunctionComponent = () => {
    const isDark = useDark();
    const dimensions = useWindowDimensions();
    const height = dimensions.height <= 800 ? '75%' : '100%';

    if (isDark) {
        return (
            <View style={styles.imageContainer}>
                <ImageLocationDark width={'100%'} height={height} />
            </View>
        );
    }

    return (
        <>
            <View style={styles.imageContainer}>
                <ImageLocation width={'100%'} height={height} />
            </View>
        </>
    );
};
