import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {ImportantBlock} from '../../../../types/trips/blocks';
import {TimelineDetailsIconBlock} from './row';
import styles from './styles';

type IImportant = React.FunctionComponent<ImportantBlock>;

const Important: IImportant = ({name, val, icon, old}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.info}>
                <TimelineDetailsIconBlock iconName={icon} changed={_.isString(old)} />
                <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
                <Text style={[styles.text, styles.textBold, styles.textMargin, isDark && styles.textDark]}>{val}</Text>
                {_.isString(old) && <Text style={[styles.text, styles.textOld, styles.textMargin, isDark && styles.textGrayDark]}>{old}</Text>}
            </View>
        </View>
    );
};

export default Important;
