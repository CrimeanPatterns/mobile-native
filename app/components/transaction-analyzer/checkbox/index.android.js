import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import {Checkbox} from 'react-native-paper';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {TouchableBackground} from '../../page/touchable/background';
import styles from './styles';

const CustomCheckbox = React.memo(({onChangeValue = _.noop, label, value, indent = 0}) => {
    const isDark = useDark();

    return (
        <TouchableBackground
            onPress={onChangeValue}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={[styles.container, {paddingLeft: 15 + indent}]}>
            <Checkbox
                onPress={onChangeValue}
                status={value ? 'checked' : 'unchecked'}
                color={isDark ? DarkColors.chetwodeBlue : Colors.chetwodeBlue}
                uncheckedColor={isDark ? DarkColors.gray : Colors.grayDarkLight}
            />
            <Text style={[styles.text, isDark && styles.textDark]}>{label}</Text>
        </TouchableBackground>
    );
});

CustomCheckbox.propTypes = {
    onChangeValue: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.bool,
    indent: PropTypes.number,
};

export default CustomCheckbox;
