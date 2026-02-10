import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {BaseThemedPureComponent} from '../../baseThemed';
import styles from './styles';

class PlainSubTitle extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        name: PropTypes.string.isRequired,
        bold: PropTypes.bool,
        color: PropTypes.string,
        testID: PropTypes.string,
    };

    render() {
        const {testID, name, color} = this.props;

        return (
            <View testID={testID} style={styles.label} accessibilityLabel={name}>
                <Text style={[styles.labelText, this.isDark && styles.labelTextDark, color && {color}]}>{isIOS ? name.toUpperCase() : name}</Text>
            </View>
        );
    }
}

export default PlainSubTitle;
