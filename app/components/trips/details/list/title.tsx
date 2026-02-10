import _ from 'lodash';
import React from 'react';
import {View} from 'react-native';

import {useDark} from '../../../../theme';
import {TitleBlock} from '../../../../types/trips/blocks';
import SelectableText from '../../../page/selectableText';
import styles from './styles';

type ITitle = React.FunctionComponent<TitleBlock>;

const Title: ITitle = ({name, val}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, styles.title, isDark && styles.containerDark]}>
            <SelectableText style={[styles.text, styles.textLarge, styles.flex1, isDark && styles.textDark]}>{name}</SelectableText>
            {_.isString(val) && (
                <SelectableText style={[styles.text, styles.textLarge, styles.textBlue, styles.textMargin, isDark && styles.textBlueDark]}>
                    {val}
                </SelectableText>
            )}
        </View>
    );
};

export default Title;
