import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {TextProperty} from './textProperty';

class FormTextProperty extends TextProperty {
    render() {
        const {testID} = this.props;

        return (
            <View style={style.container}>
                {this._renderRow({
                    testID,
                    touchableRow: this.getTouchableRow(true),
                    touchableProps: this.getTouchableProps(true),
                    isLink: true,
                    caption: this.getCaption(),
                    details: this.getDetails(),
                    style: {
                        customStyle: {
                            container: [style.textRow, this.isDark && style.textRowDark],
                            caption: [style.caption, this.isDark && style.textDark],
                        },
                    },
                })}
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        marginVertical: 14,
    },
    textRow: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    textRowDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    caption: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.black,
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

export default FormTextProperty;
