import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles from './styles';

const Checkbox = React.memo(({onChangeValue = _.noop, label, value, indent = 0}) => {
    const isDark = useDark();
    const color = isDark ? DarkColors.gray : Colors.grayDarkLight;
    const colorActive = isDark ? DarkColors.blue : Colors.blue;

    return (
        <TouchableBackground
            onPress={onChangeValue}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            style={[styles.container, {paddingLeft: 15 + indent}]}>
            <Icon
                style={[styles.icon, {backgroundColor: isDark ? DarkColors.bg : Colors.white}]}
                name={value ? 'square-success' : 'radio-button'}
                color={value ? colorActive : color}
                size={18}
            />
            <Text style={[styles.text, isDark && styles.textDark]}>{label}</Text>
        </TouchableBackground>
    );
});

Checkbox.propTypes = {
    onChangeValue: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.bool,
    indent: PropTypes.number,
};

export default Checkbox;
