import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Checkbox from '../checkbox';

const CheckboxGroup = React.memo(({onChangeValue = _.noop, data, filtersData}) => {
    const isDark = useDark();
    const {name, choices} = data;
    const defaultValues = choices.map(({value}) => value);
    const indent = 25;

    const renderSeparator = useCallback(
        (indent = 0) => <View style={[styles.separator, {marginLeft: (isIOS ? 15 : 24) + indent}, isDark && styles.separatorDark]} />,
        [isDark],
    );

    const renderCheckbox = useCallback(
        (item, index, arr) => {
            const {name, value} = item;

            return (
                <View key={`${index}-${name}`}>
                    <Checkbox
                        /* TODO: unnecessary arrow func */
                        onChangeValue={() => onChangeValue(value)}
                        label={name}
                        value={_.isNull(filtersData) || _.includes(filtersData, value)}
                        indent={indent}
                    />
                    {index !== arr.length - 1 && renderSeparator(indent)}
                </View>
            );
        },
        [filtersData, onChangeValue, renderSeparator],
    );

    return (
        <>
            <Checkbox
                onChangeValue={() => onChangeValue(defaultValues)}
                label={name}
                value={_.isNull(filtersData) || _.intersection(filtersData, defaultValues).length === defaultValues.length}
            />
            {renderSeparator()}
            {choices.map(renderCheckbox)}
        </>
    );
});

CheckboxGroup.propTypes = {
    onChangeValue: PropTypes.func,
    data: PropTypes.object,
    filtersData: PropTypes.any,
};

export default CheckboxGroup;

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    separatorDark: {
        borderBottomColor: DarkColors.border,
    },
    margin: {
        marginLeft: 25,
    },
});
