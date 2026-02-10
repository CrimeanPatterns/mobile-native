import PropTypes from 'prop-types';
import React from 'react';
import {ActivityIndicator, Platform} from 'react-native';
import Spinkit from 'react-native-spinkit';

import {Colors, DarkColors} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';

@withTheme
class Spinner extends BaseThemedPureComponent {
    static propTypes = {
        androidColor: PropTypes.string,
        size: PropTypes.number,
    };

    render() {
        const {androidColor, ...props} = this.props;

        return Platform.select({
            ios: <Spinkit type='Arc' size={25} color={this.selectColor(Colors.grayDark, Colors.white)} {...props} />,
            android: <ActivityIndicator size='small' color={androidColor || this.selectColor(Colors.white, DarkColors.text)} {...props} />,
        });
    }
}

export default Spinner;
