import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {Button} from '../../form';
import {ShareAccountsResponse} from './shareAccountsResponse';

@withTheme
class ShareAccountsRequest extends ShareAccountsResponse {
    static propTypes = {
        ...ShareAccountsResponse.propTypes,
        shareButton: PropTypes.string,
        shareButtonUrl: PropTypes.string,
    };

    static defaultProps = {
        ...ShareAccountsResponse.defaultProps,
    };

    constructor(props) {
        super(props);

        this.onPressButton = this.onPressButton.bind(this);
    }

    onPressButton() {
        const {shareButtonUrl} = this.props;

        this.openExternalUrl(shareButtonUrl);
    }

    renderFooterButton() {
        const {shareButton, theme} = this.props;

        return (
            _.isString(shareButton) && (
                <Button theme={theme} color={this.selectColor(Colors.blueDark, DarkColors.blue)} label={shareButton} onPress={this.onPressButton} />
            )
        );
    }
}

export default ShareAccountsRequest;
