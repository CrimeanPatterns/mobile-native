import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {withTheme} from '../../../theme';
import BaseTimeAgo from '../../timeAgo';
import {Field} from './field';
import styles from './styles';

@withTheme
class TimeAgo extends Field {
    static propTypes = {
        ...Field.propTypes,
        value: PropTypes.object,
    };

    renderValue() {
        const {value} = this.props;

        return (
            <BaseTimeAgo date={value.ts * 1000} style={[styles.fieldNameText, styles.fieldValueText, this.isDark && styles.textDark, styles.bold]} />
        );
    }

    getAccessibilityLabel() {
        const {name, value} = this.props;

        if (_.has(value, 'ts') && _.isNumber(value.ts)) {
            return `${name} ${new Date(value.ts).toGMTString()}`;
        }

        return name;
    }
}

export default TimeAgo;
