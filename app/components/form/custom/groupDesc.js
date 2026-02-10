import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';

export default class GroupDesc extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        label: PropTypes.string,
    };

    render() {
        const {label} = this.props;

        return (
            <View style={styles.container}>
                <Text style={[styles.text, this.isDark && styles.textDark]}>{label.replace(/\s{2,}/g, ' ')}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // marginBottom: 5,
        ...Platform.select({
            ios: {
                marginTop: 12,
                paddingHorizontal: 15,
            },
            android: {
                marginTop: 20,
                paddingHorizontal: 16,
            },
        }),
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        lineHeight: 16,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 13,
            },
            android: {
                fontSize: 12,
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
});
