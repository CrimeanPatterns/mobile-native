import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {TouchableBackground} from '../../page/touchable/background';
import styles from './styles';

const CustomRadioButton = React.memo(({onChangeValue = _.noop, label, value}) => {
    const isDark = useDark();

    return (
        <TouchableBackground
            onPress={onChangeValue}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={[styles.container /** unnecessary array in style */]}>
            <RadioButton
                onPress={onChangeValue}
                value='second'
                status={value ? 'checked' : 'unchecked'}
                color={isDark ? DarkColors.chetwodeBlue : Colors.chetwodeBlue}
                uncheckedColor={isDark ? DarkColors.gray : Colors.grayDarkLight}
            />
            <Text style={[styles.text, isDark && styles.textDark]}>{label}</Text>
        </TouchableBackground>
    );
});

CustomRadioButton.propTypes = {
    onChangeValue: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.number,
    isActive: PropTypes.bool,
};

export default CustomRadioButton;
