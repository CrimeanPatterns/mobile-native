import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {withTheme} from '../../../theme';
import Message from './message';
import MessageTable from './table';

class ShareAccountsResponse extends Message {
    static propTypes = {
        ...Message.propTypes,
        message: PropTypes.string.isRequired,
        accounts: PropTypes.array.isRequired,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    renderMessage() {
        const {message} = this.props;
        const {accounts} = this.props;

        return (
            <>
                {_.isString(message) && this.renderAsNative(message)}
                {_.isArray(accounts) && <MessageTable data={accounts} />}
            </>
        );
    }
}

export default withTheme(ShareAccountsResponse);
export {ShareAccountsResponse};
