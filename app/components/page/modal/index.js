import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Modal as NativeModal, Platform, StatusBar, StyleSheet} from 'react-native';

import {isIOS, isTablet} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useTheme} from '../../../theme';
import ModalNavigation from './modalNavigation';

class Modal extends PureComponent {
    static propTypes = {
        ...ModalNavigation.propTypes,
        visible: PropTypes.bool,
        theme: PropTypes.string,
        presentationStyle: PropTypes.string,
        animationType: PropTypes.string,
        onRequestClose: PropTypes.func,
    };

    static defaultProps = {
        visible: false,
        avoidKeyboard: false,
        presentationStyle: 'formSheet',
        animationType: 'slide',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: props.visible,
        };
    }

    setStateAsync = (state) =>
        new Promise((resolve) => {
            this.setState(state, resolve);
        });

    open = () => {
        this.setState({
            visible: true,
        });
    };

    close = async () => {
        await this.setStateAsync({
            visible: false,
        });
    };

    onClose = async () => {
        const {onClose} = this.props;

        await this.close();

        if (_.isFunction(onClose)) {
            onClose();
        }
    };

    isVisible() {
        const {visible} = this.state;

        return visible;
    }

    renderStatusBar() {
        const {visible} = this.state;
        const {presentationStyle} = this.props;

        if (visible && isIOS && isTablet === false && ['fullScreen', 'overFullScreen'].indexOf(presentationStyle) === -1) {
            return <StatusBar barStyle='light-content' />;
        }

        return null;
    }

    renderContent() {
        const {children, theme, presentationStyle, animationType, style, onClose, ...rest} = this.props;

        return (
            <>
                {this.renderStatusBar()}
                <ModalNavigation
                    style={[styles.modal, theme === 'dark' && styles.modalDark, style]}
                    onClose={this.onClose}
                    presentationStyle={presentationStyle}
                    {...rest}>
                    {children}
                </ModalNavigation>
            </>
        );
    }

    render() {
        const {presentationStyle, animationType, onRequestClose} = this.props;

        if (this.isVisible()) {
            return (
                <NativeModal
                    statusBarTranslucent
                    presentationStyle={presentationStyle}
                    animationType={animationType}
                    visible
                    onRequestClose={onRequestClose || this.onClose}>
                    {this.renderContent()}
                </NativeModal>
            );
        }

        return null;
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    modalDark: Platform.select({
        ios: {
            backgroundColor: Colors.black,
        },
        android: {
            backgroundColor: DarkColors.bg,
        },
    }),
});

const ThemedModal = React.forwardRef((props, ref) => {
    const theme = useTheme();

    return <Modal ref={ref} theme={theme} {...props} />;
});

ThemedModal.displayName = 'ThemedModal';

export default ThemedModal;
export {Modal};
