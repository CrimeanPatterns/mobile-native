import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {useDark} from '../../../../theme';
import {StringBlock} from '../../../../types/trips/blocks';
import SelectableText from '../../../page/selectableText';
import {TimelineDetailsIconChanged} from './row';
import styles from './styles';

type IString = React.FunctionComponent<StringBlock>;

const String: IString = ({name, val, old, bold, background}) => {
    const isDark = useDark();

    const textBold = isIOS ? styles.textBold : [styles.textBold, styles.textBlue, isDark && styles.textBlueDark];
    const backgroundColor = {
        gray: isDark ? styles.containerSilverDark : styles.containerSilver,
    };

    return (
        <View
            style={[styles.container, styles.containerSmall, isDark && styles.containerDark, _.isString(background) && backgroundColor[background]]}>
            <View style={[styles.details, styles.marginRight]}>
                <Text style={[styles.text, bold === true && textBold, isDark && styles.textDark]}>{name}</Text>
                {_.isString(old) && <TimelineDetailsIconChanged />}
            </View>
            <View style={[styles.info, styles.wrap]}>
                <SelectableText style={[styles.text, styles.textRight, bold === true && textBold, isDark && styles.textDark]}>{val}</SelectableText>
                {_.isString(old) && (
                    <SelectableText
                        style={[styles.textOld, styles.textMargin, styles.textRight, bold === true && textBold, isDark && styles.textDark]}>
                        {old}
                    </SelectableText>
                )}
            </View>
        </View>
    );
};

export default String;
