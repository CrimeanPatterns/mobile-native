import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useTheme} from '../../../../theme';
import {BaseThemedPureComponent} from '../../../baseThemed';
import Icon from '../../../icon';
import Header from '../../../page/header';
import HeaderButton from '../../../page/header/button';
import {TouchableBackground} from '../../../page/touchable';
import Spinner from '../../../spinner';
import util from '../../util';
import BaseField from '../baseField';
import styles from './styles';

const capitalOneImage = require('../../../../assets/images/capitalone_button.png');
// const bankOfAmericaImage = require('../../../../assets/images/bankofamerica.png');

const TouchableItem = isIOS ? TouchableOpacity : TouchableBackground;

class BaseOauthField extends BaseField {
    static displayName = 'OauthField';

    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onChangeValue: PropTypes.func.isRequired,
        authenticatedText: PropTypes.string.isRequired,
        notAuthenticatedText: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
        revokeButtonText: PropTypes.string.isRequired,
        callbackUrl: PropTypes.string.isRequired,
        programCode: PropTypes.string.isRequired,
        statusText: PropTypes.string.isRequired,
        value: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            error: null,
        };

        this._showModal = this._showModal.bind(this);
        this._hideModal = this._hideModal.bind(this);
        this.onLoadError = this.onLoadError.bind(this);
        this.renderLoadingView = this.renderLoadingView.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._revoke = this._revoke.bind(this);
    }

    _showModal() {
        this.setState({
            modalVisible: true,
        });
    }

    _hideModal() {
        this.setState({
            modalVisible: false,
        });
    }

    onLoadError(error) {
        if (__DEV__) {
            console.log('_onError', error);
        }
    }

    _onMessage(event) {
        const {onChangeValue} = this.props;
        let msgData;

        this._hideModal();
        try {
            msgData = JSON.parse(event.nativeEvent.data);
            if (msgData.error) {
                this.setState({error: msgData.error});
            } else if (_.isString(msgData.code) && !util.isEmpty(msgData.code)) {
                this.setState({error: null});
                onChangeValue(msgData.code);
            }
        } catch (err) {
            if (__DEV__) {
                console.log('error', err);
            }
        }
    }

    _revoke() {
        const {onChangeValue} = this.props;

        this.setState({error: null});
        onChangeValue('');
    }

    get headerLeft() {
        return <HeaderButton onPress={this._hideModal} iconName='android-clear' />;
    }

    get isAuthorized() {
        const {value} = this.props;

        return _.isString(value) && value.length > 0;
    }

    renderLoadingView() {
        return (
            <View style={[styles.loading, this.isDark && styles.loadingDark]}>
                <Spinner style={styles.spinner} androidColor={this.selectColor(Colors.blueDark, DarkColors.blue)} />
            </View>
        );
    }

    _renderModal(callbackUrl) {
        const {modalVisible} = this.state;

        return (
            modalVisible && (
                <Modal statusBarTranslucent animationType='slide' transparent={false} visible onRequestClose={this._hideModal}>
                    <Header headerLeft={this.headerLeft} />
                    <WebView
                        source={{uri: callbackUrl}}
                        renderLoading={this.renderLoadingView}
                        startInLoadingState
                        onMessage={this._onMessage}
                        originWhitelist={['*']}
                        contentInsetAdjustmentBehavior='automatic'
                        keyboardDismissMode='on-drag'
                        automaticallyAdjustContentInsets={false}
                        contentInset={{left: 0, top: 0, right: 0, bottom: 0}}
                        sharedCookiesEnabled
                        webviewDebuggingEnabled={__DEV__}
                    />
                </Modal>
            )
        );
    }

    renderModal() {
        const {callbackUrl} = this.props;

        return this._renderModal(callbackUrl);
    }

    renderAuthButton(buttonText, onPress) {
        const {programCode} = this.props;
        const images = {
            capitalcards: {
                source: capitalOneImage,
            },
            // bankofamerica: {
            //     source: bankOfAmericaImage,
            // },
        };

        return (
            <View style={styles.buttonWrap}>
                <TouchableItem
                    onPress={onPress}
                    rippleColor={this.selectColor(Colors.gray, DarkColors.border)}
                    style={[styles.authButton, this.isDark && styles.authButtonDark]}>
                    <>
                        {Object.prototype.hasOwnProperty.call(images, programCode) && <Image {...images[programCode]} style={styles.buttonImage} />}
                        {!Object.prototype.hasOwnProperty.call(images, programCode) && (
                            <Text style={[styles.buttonText, this.isDark && styles.textDark]}>{isIOS ? buttonText.toUpperCase() : buttonText}</Text>
                        )}
                    </>
                </TouchableItem>
            </View>
        );
    }

    renderRevokeButton(revokeButtonText, onPress) {
        return (
            <View style={styles.buttonWrap}>
                <TouchableItem onPress={onPress} style={[styles.authButton, this.isDark && styles.authButtonDark, styles.buttonWide]}>
                    <Text style={[styles.buttonText, this.isDark && styles.textDark]}>
                        {isIOS ? revokeButtonText.toUpperCase() : revokeButtonText}
                    </Text>
                </TouchableItem>
            </View>
        );
    }

    renderStatusIcon(isAuthorized) {
        return isAuthorized ? (
            <Icon name='square-success' style={[styles.iconSuccess, this.isDark && styles.iconSuccessDark]} size={24} />
        ) : (
            <Icon name='square-error' style={[styles.iconError, this.isDark && styles.iconErrorDark]} size={24} />
        );
    }

    renderContainer(buttonText, revokeButtonText, isAuthorized, authCb, revokeCb) {
        const {authenticatedText, notAuthenticatedText, statusText} = this.props;

        return (
            <View style={[styles.oauth, this.isDark && styles.oauthDark, this.isDark && styles.borderDark]}>
                <View style={[styles.message, this.isDark && styles.borderDark]}>
                    <View style={styles.iconContainer}>{this.renderStatusIcon(isAuthorized)}</View>
                    {!isIOS ? (
                        <View style={styles.messageInfo}>
                            <Text style={[styles.messageText, this.isDark && styles.textDark]}>{`${statusText}:`}</Text>
                            <Text style={[styles.messageBoldText, this.isDark && styles.textDark]}>
                                {isAuthorized ? authenticatedText : notAuthenticatedText}
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.messageInfo}>
                            <Text style={[styles.messageText, this.isDark && styles.textDark]}>
                                {isAuthorized ? authenticatedText : notAuthenticatedText}
                            </Text>
                        </View>
                    )}
                </View>
                {!isAuthorized && this.renderAuthButton(buttonText, authCb)}
                {isAuthorized && this.renderRevokeButton(revokeButtonText, revokeCb)}
            </View>
        );
    }

    render() {
        const {buttonText, revokeButtonText} = this.props;

        return (
            <>
                {this.renderContainer(buttonText, revokeButtonText, this.isAuthorized, this._showModal, this._revoke)}
                {this.renderModal()}
            </>
        );
    }
}
export default React.forwardRef((props, forwardedRef) => {
    const theme = useTheme();

    return <BaseOauthField theme={theme} ref={forwardedRef} {...props} />;
});

export {BaseOauthField};
