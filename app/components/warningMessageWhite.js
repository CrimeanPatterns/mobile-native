import React from 'react';

import {Colors} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';
import WarningMessage from './warningMessage';

@withTheme
class WarningMessageWhite extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        ...WarningMessage.propTypes,
    };

    render() {
        const colors = this.themeColors;

        return (
            <WarningMessage
                {...this.props}
                iconColor={colors.orange}
                containerStyle={{backgroundColor: this.selectColor(Colors.white, Colors.black)}}
                fontStyle={{color: this.selectColor(Colors.grayDark, Colors.white)}}
                linkStyle={{color: colors.blue}}
            />
        );
    }
}

export default WarningMessageWhite;
