import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../../theme';
import {Block} from '../types';
import styles from './styles';

type IString = React.FunctionComponent<Block>;

const String: IString = ({name, val}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
            <Text style={[styles.text, isDark && styles.textDark]}>{val}</Text>
        </View>
    );
};

export default String;
