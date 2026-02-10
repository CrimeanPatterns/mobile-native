import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {BaseThemedPureComponent} from '../../baseThemed';
import styles from './styles';

class GroupTitle extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        name: PropTypes.string.isRequired,
        small: PropTypes.bool,
        testID: PropTypes.string,
    };

    render() {
        const {testID, name} = this.props;

        return (
            <View testID={testID} accessible accessibilityLabel={name} style={[styles.title, this.isDark && styles.titleDark]}>
                <Text style={[styles.titleText, this.isDark && styles.textDark]}>{name}</Text>
            </View>
        );
    }
}

export default GroupTitle;
