import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../styles';
import {ThemeColors, useTheme} from '../theme';
import Icon from './icon';

// eslint-disable-next-line react/display-name,react/prop-types
const Warning = React.memo(
    ({text}) => {
        // eslint-disable-next-line no-unused-vars
        const theme = useTheme();
        const colors = ThemeColors[theme];
        const isDark = theme === 'dark';

        return (
            <View style={[styles.container, isDark && styles.containerDark]}>
                <Icon name='warning' style={styles.icon} color={colors.orange} size={24} />
                <View style={[styles.containerRow, {paddingHorizontal: 0, paddingVertical: 0}]}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{text}</Text>
                </View>
            </View>
        );
    },
    (prevProps, nextProps) => prevProps.text === nextProps.text,
);

Warning.propTypes = {
    text: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    containerRow: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    icon: {
        marginRight: 25,
    },
    text: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#8e9199',
        lineHeight: 17,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
});

export {Warning};
