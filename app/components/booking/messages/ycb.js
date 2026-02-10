import PropTypes from 'prop-types';

import {withTheme} from '../../../theme';
import Message from './message';

@withTheme
class Ycb extends Message {
    static propTypes = {
        ...Message.propTypes,
        body: PropTypes.string.isRequired,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };
}

export default Ycb;
