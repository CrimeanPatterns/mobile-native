import PropTypes from 'prop-types';
import React from 'react';

import {Colors} from '../../styles';
import {ThemeColors, withTheme} from '../../theme';
import Icon from '../icon';

const ExpirationStateIcon = ({theme, state, style, size = 24}) => {
    const colors = ThemeColors[theme];
    const isDark = theme === 'dark';
    const iconStyle = {
        backgroundColor: isDark ? Colors.black : Colors.white,
        width: size,
        height: size,
    };

    if (state === 'far') {
        return <Icon name='square-success' color={colors.green} size={size} style={[style, iconStyle]} />;
    }

    if (state === 'soon') {
        return <Icon name='warning' color={colors.orange} size={size} style={style} />;
    }

    if (state === 'expired') {
        return <Icon name='square-error' color={colors.red} size={size} style={[style, iconStyle]} />;
    }

    return null;
};

ExpirationStateIcon.displayName = 'ExpirationStateIcon';
ExpirationStateIcon.propTypes = {
    theme: PropTypes.string,
    state: PropTypes.string,
    style: PropTypes.any,
    size: PropTypes.number,
};

export default withTheme(ExpirationStateIcon);
