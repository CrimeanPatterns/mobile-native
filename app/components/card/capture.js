import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Modal} from 'react-native';

import {isIOS} from '../../helpers/device';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import {HeaderButton} from '../page';
import Header from '../page/header';
import CardCamera from './camera';

class CardCapture extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onTakePicture: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        title: PropTypes.string,
        tooltip: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    async open() {
        try {
            await CardCamera.checkPermissions();
        } catch {
            this.close();
        }
    }

    close = async () => {
        const {onClose} = this.props;

        if (_.isFunction(onClose)) {
            await onClose();
        }
    };

    onTakePicture = async (...args) => {
        const {onTakePicture} = this.props;

        await this.close();

        if (_.isFunction(onTakePicture)) {
            onTakePicture(...args);
        }
    };

    headerLeft = () => <HeaderButton onPress={() => this.close()} iconName='android-clear' />;

    render() {
        const {title, tooltip, theme} = this.props;

        return (
            <Modal
                presentationStyle='overFullScreen'
                statusBarTranslucent
                visible
                transparent={false}
                animationType='slide'
                onRequestClose={this.close}>
                <Header headerLeft={this.headerLeft} title={title} transparent={!isIOS} transparentHeaderColor='rgba(0, 0, 0, 0.5)' />
                <CardCamera tooltip={tooltip} onTakePicture={this.onTakePicture} theme={theme} />
            </Modal>
        );
    }
}

export default React.forwardRef((props, forwardedRef) => React.createElement(withTheme(CardCapture), {forwardedRef, ...props}));
