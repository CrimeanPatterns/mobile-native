import Translator from 'bazinga-translator';
import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../../theme';
import {Block} from '../types';
import styles from './styles';

type ILayover = React.FunctionComponent<Block>;

const Layover: ILayover = ({name, val}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.row}>
                <Text style={[styles.text, isDark && styles.textDark]}>
                    {Translator.trans(/** @Desc("Layover in") */ 'alternative-flight.layover', {}, 'mobile-native')}
                </Text>
                <Text style={[styles.text, styles.textBold, styles.textBlue, styles.textMargin, isDark && styles.textBlueDark]}>{name}</Text>
            </View>
            <Text style={[styles.text, isDark && styles.textDark]}>{val}</Text>
        </View>
    );
};

export default Layover;
