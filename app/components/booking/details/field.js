import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import styles from './styles';

class Field extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    getAccessibilityLabel() {
        const {name, value} = this.props;

        if (!_.isNull(value)) {
            return `${name} ${value}`;
        }

        return name;
    }

    renderValue() {
        const {value} = this.props;

        return <Text style={[styles.fieldNameText, styles.fieldValueText, this.isDark && styles.textDark, styles.bold]}>{value}</Text>;
    }

    render() {
        const {name} = this.props;
        const accessibilityLabel = this.getAccessibilityLabel();

        return (
            <View style={[styles.field, this.isDark && styles.fieldDark]} accessible accessibilityLabel={accessibilityLabel}>
                <View style={styles.fieldName}>
                    <Text style={[styles.fieldNameText, this.isDark && styles.textDark]}>{name}</Text>
                </View>
                <View style={styles.fieldValue}>{this.renderValue()}</View>
            </View>
        );
    }
}

export default withTheme(Field);
export {Field};
