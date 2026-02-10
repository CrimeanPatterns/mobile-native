import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable/background';
import styles from './styles';

const RadioButton = React.memo(({onChangeValue = _.noop, label, value}) => {
    const isDark = useDark();
    const color = isDark ? Colors.white : Colors.grayDarkLight;
    const colorActive = isDark ? DarkColors.blue : Colors.blue;

    return (
        <TouchableBackground
            onPress={onChangeValue}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            style={[styles.container /** unnecessary array in style */]}>
            <Icon style={styles.icon} name={value ? 'photo-check' : 'android-photo-check'} color={value ? colorActive : color} size={22} />
            <Text style={[styles.text, isDark && styles.textDark]}>{label}</Text>
        </TouchableBackground>
    );
});

RadioButton.propTypes = {
    onChangeValue: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.bool,
};

export default RadioButton;
