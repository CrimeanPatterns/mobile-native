import _ from 'lodash';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {TerminalAndGateBlock} from '../../../../types/trips/blocks';
import {TimelineDetailsIconBlock} from './row';
import styles from './styles';

type ITerminalAndGate = React.FunctionComponent<TerminalAndGateBlock>;

const TerminalAndGate: ITerminalAndGate = ({name, val, icon, old}) => {
    const isDark = useDark();

    const renderItem = useCallback(
        (name, val, old) => (
            <View style={[styles.info, styles.marginRight]}>
                <Text style={[styles.text, styles.textBold, isDark && styles.textDark]}>{name}</Text>
                <Text style={[styles.blueBlock, isDark && styles.blueBlockDark]}>{val}</Text>
                {_.isString(old) && <Text style={[styles.silverBlock, isDark && styles.silverBlockDark, styles.textOld]}>{old}</Text>}
            </View>
        ),
        [isDark],
    );

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.row}>
                <TimelineDetailsIconBlock iconName={icon} changed={_.isObject(old)} />
                {_.isString(val.terminal) && renderItem(name.terminal, val.terminal, _.isObject(old) && old.terminal)}
                {_.isString(val.gate) && renderItem(name.gate, val.gate, _.isObject(old) && old.gate)}
            </View>
        </View>
    );
};

export default TerminalAndGate;
