import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {withTheme} from '../../../theme';
import Message from './message';
import MessageTable from './table';

@withTheme
class SeatAssignments extends Message {
    static propTypes = {
        ...Message.propTypes,
        message: PropTypes.string.isRequired,
        phoneNumbers: PropTypes.array.isRequired,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    renderMessage() {
        const {message, phoneNumbers} = this.props;

        return (
            <>
                {_.isString(message) && this.renderAsNative(message)}
                {_.isArray(phoneNumbers) && <MessageTable data={phoneNumbers} />}
            </>
        );
    }
}

export default SeatAssignments;
