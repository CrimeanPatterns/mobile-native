import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';

export default class Separator extends BaseThemedPureComponent {
    render() {
        const styles = StyleSheet.create({
            separator: {
                height: 1,
                ...Platform.select({
                    ios: {
                        borderTopWidth: 2,
                        borderColor: this.selectColor(Colors.borderGray, DarkColors.border),
                        marginVertical: 20,
                    },
                    android: {
                        borderTopWidth: 1,
                        borderColor: this.selectColor(Colors.gray, DarkColors.border),
                        marginVertical: 20,
                    },
                }),
            },
        });

        return <View style={styles.separator} />;
    }
}
