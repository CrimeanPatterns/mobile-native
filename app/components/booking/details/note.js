import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import HTML from '../../html';
import styles, {htmlStyles} from './styles';

@withTheme
class Note extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        name: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    render() {
        const {name, value} = this.props;
        const textDark = this.isDark && htmlStyles.textDark;
        const baseFontStyle = {...htmlStyles.fieldNameText, ...htmlStyles.noteText, ...textDark};

        return (
            <View style={styles.noteField} accessible accessibilityLabel={name}>
                <View style={styles.noteFieldName}>
                    <Text style={[styles.fieldNameText, textDark]}>{name}</Text>
                </View>
                <View style={styles.noteFieldValue}>
                    <HTML html={value} baseFontStyle={baseFontStyle} />
                </View>
            </View>
        );
    }
}

export default Note;
