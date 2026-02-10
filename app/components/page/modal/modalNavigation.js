import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {isIOS} from '../../../helpers/device';
import {Header} from '../header';
import HeaderButton from '../header/button';

class Modal extends PureComponent {
    static propTypes = {
        title: PropTypes.string,
        onClose: PropTypes.func.isRequired,
        children: PropTypes.any.isRequired,
        avoidKeyboard: PropTypes.bool,
        headerButtonColor: PropTypes.string,
        headerColor: PropTypes.string,
        headerStyle: PropTypes.object,
        headerTitleStyle: PropTypes.object,
        headerShown: PropTypes.bool,
        headerForceInset: PropTypes.object,
        presentationStyle: PropTypes.string,
        style: PropTypes.any,
    };

    static defaultProps = {
        headerShown: true,
        presentationStyle: 'overFullScreen',
    };

    get headerLeft() {
        const {onClose, headerButtonColor} = this.props;

        return <HeaderButton color={headerButtonColor} onPress={onClose} iconName='android-clear' />;
    }

    get keyboardVerticalOffset() {
        if (isIOS) {
            if (DeviceInfo.hasNotch()) {
                return 50;
            }

            return 40;
        }

        return 0;
    }

    avoidKeyboard = (children) => {
        const {avoidKeyboard, style} = this.props;

        if (avoidKeyboard) {
            return (
                <KeyboardAvoidingView style={style} behavior={isIOS ? 'padding' : 'height'} keyboardVerticalOffset={this.keyboardVerticalOffset}>
                    {children}
                </KeyboardAvoidingView>
            );
        }

        return children;
    };

    renderHeader = () => {
        const {onClose, children, avoidKeyboard, style, headerShown, presentationStyle, headerForceInset, ...rest} = this.props;

        if (headerShown) {
            return <Header headerLeft={this.headerLeft} fullScreen={['fullScreen', 'overFullScreen'].includes(presentationStyle)} {...rest} />;
        }

        return null;
    };

    renderContent = () => this.props.children;

    render() {
        return this.avoidKeyboard(
            <>
                {this.renderHeader()}
                {this.renderContent()}
            </>,
        );
    }
}

export default Modal;
