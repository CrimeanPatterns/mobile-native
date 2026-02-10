import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import WarningMessage from '../../warningMessage';

class Message extends PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
    };

    render() {
        const {value} = this.props;

        return (
            <View style={[isIOS && {marginTop: -12, marginBottom: 12}]}>
                <WarningMessage text={value} />
            </View>
        );
    }
}

export default Message;
