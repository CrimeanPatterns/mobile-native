import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {ConfNoBlock} from '../../../../types/trips/blocks';
import SelectableText from '../../../page/selectableText';
import {TimelineDetailsIconChanged} from './row';
import styles from './styles';

type IConfNo = React.FunctionComponent<ConfNoBlock>;

const ConfNo: IConfNo = ({name, val, old, hint}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, styles.containerLarge, isDark && styles.containerDark]}>
            <View>
                <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
                {_.isString(hint) && <Text style={[styles.text, styles.textGray, isDark && styles.textGrayDark]}>{hint}</Text>}
            </View>
            <View style={[styles.info]}>
                {_.isString(old) && <TimelineDetailsIconChanged />}
                <SelectableText style={[styles.textBlue, styles.textLarge, isDark && styles.textBlueDark]}>{val}</SelectableText>
            </View>
        </View>
    );
};

export default ConfNo;
