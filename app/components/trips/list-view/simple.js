import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import styles from '../list/style';

@withTheme
class Simple extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        title: PropTypes.string,
        val: PropTypes.string.isRequired,
    };

    render() {
        const {title, val} = this.props;

        return (
            <View style={styles.info}>
                {typeof title === 'string' && (
                    <Text style={[styles.silver, this.isDark && {color: DarkColors.text}]} numberOfLines={1} ellipsizeMode='tail'>
                        {title}
                    </Text>
                )}
                <Text style={[styles.title, this.isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                    {val}
                </Text>
            </View>
        );
    }
}

export default Simple;
