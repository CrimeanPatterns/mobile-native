import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';

import {Colors} from '../../styles';
import {ThemeColors, withTheme} from '../../theme';
import Icon from '../icon';
import Spinner from '../spinner';

const StatusIcon = React.memo(
    ({theme, name}) => {
        const colors = ThemeColors[theme];
        const isDark = theme === 'dark';
        const statusIcons = {
            'icon-green-check': <Icon name='square-success' color={colors.green} size={12} style={[styles.icon, isDark && styles.iconDark]} />,
            'icon-red-error': <Icon name='square-error' color={colors.red} size={12} style={[styles.icon, isDark && styles.iconDark]} />,
            loader: <Spinner style={styles.spinner} size={12} androidColor='#abadb0' />,
        };

        if (statusIcons[name]) {
            return statusIcons[name];
        }
        return null;
    },
    (prevProps, nextProps) => prevProps.theme === nextProps.theme && prevProps.name === nextProps.name,
);

StatusIcon.displayName = 'StatusIcon';

StatusIcon.propTypes = {
    theme: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
    icon: {
        backgroundColor: Colors.white,
        width: 12,
        height: 12,
    },
    iconDark: {
        ...Platform.select({
            android: {
                backgroundColor: Colors.black,
            },
        }),
    },
    spinner: {
        alignSelf: 'flex-start',
    },
});

export default withTheme(StatusIcon);
