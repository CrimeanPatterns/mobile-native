import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {BoxedBlock} from '../../../../types/trips/blocks';
import SelectableText from '../../../page/selectableText';
import {TimelineDetailsIconChanged} from './row';
import styles from './styles';

type IBoxed = React.FunctionComponent<BoxedBlock>;

const Boxed: IBoxed = ({name, val, old}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, styles.containerSmall, isDark && styles.containerDark]}>
            <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
            <View style={[styles.info]}>
                {_.isString(old) && <TimelineDetailsIconChanged />}
                <SelectableText style={[styles.silverBlock, isDark && styles.silverBlockDark]}>{val}</SelectableText>
                {_.isString(old) && <Text style={[styles.silverBlock, styles.textOld, isDark && styles.silverBlockDark]}>{old}</Text>}
            </View>
        </View>
    );
};

export default Boxed;
