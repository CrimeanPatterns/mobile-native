import PropTypes from 'prop-types';

import {withTheme} from '../../../theme';
import Message from './message';

@withTheme
class UpdateRequest extends Message {
    static propTypes = {
        ...Message.propTypes,
        message: PropTypes.string.isRequired,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    renderMessage() {
        const {message} = this.props;

        return this.renderAsNative(message);
    }
}

export default UpdateRequest;
