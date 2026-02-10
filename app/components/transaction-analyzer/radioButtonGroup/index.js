import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import RadioButton from '../radioButton';

const RadioButtonGroup = React.memo(({onChangeValue = _.noop, data, value: isActive}) => {
    const isDark = useDark();

    const renderSeparator = useCallback(() => <View style={[styles.border, styles.margin, isDark && styles.borderDark]} />, [isDark]);

    const renderItem = useCallback(
        ({value, title}, index, arr) => (
            <View key={`${index}-${title}`}>
                {/* TODO: unnecessary arrow func */}
                <RadioButton value={isActive === value} label={title} onChangeValue={() => onChangeValue(value)} />
                {arr.length - 1 !== index && renderSeparator()}
            </View>
        ),
        [isActive, onChangeValue, isDark],
    );

    return data.map(renderItem);
});

RadioButtonGroup.propTypes = {
    onChangeValue: PropTypes.func,
    data: PropTypes.array,
    value: PropTypes.number,
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
    border: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    borderDark: {
        borderBottomColor: DarkColors.border,
    },
    margin: {
        marginLeft: isIOS ? 15 : 24,
    },
});
