import _ from 'lodash';
import PropTypes from 'prop-types';

import {withTheme} from '../../../theme';
import Message from './message';

@withTheme
class ChangeStatusRequest extends Message {
    static propTypes = {
        ...Message.propTypes,
        message: PropTypes.string.isRequired,
        replacements: PropTypes.object,
        statusCode: PropTypes.string,
        statusDesc: PropTypes.string,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    renderMessage() {
        const {message, replacements} = this.props;
        let text = message;

        _.forEach(replacements, (value, key) => {
            text = text.replace(key, value);
        });

        return this.renderAsNative(text);
    }
}

export default ChangeStatusRequest;
