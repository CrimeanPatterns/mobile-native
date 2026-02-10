import React from 'react';
import {View} from 'react-native';

import {useDark} from '../../../../theme';
import styles from './styles';

const Separator = () => {
    const isDark = useDark();

    return <View style={[styles.separator, isDark && styles.separatorDark]} />;
};

export default Separator;
