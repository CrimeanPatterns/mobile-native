import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, Text, View} from 'react-native';

import {useTheme} from '../../../../theme';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable/background';
import {BaseOauthField} from './index';
import styles from './styles';

class OauthCapitalCards extends BaseOauthField {
    static displayName = 'OauthCapitalCards';

    static propTypes = {
        ...BaseOauthField.propTypes,
        callbackUrl: PropTypes.string,
        buttonText: PropTypes.string,
        revokeButtonText: PropTypes.string,
        programCode: PropTypes.string.isRequired,
        statusText: PropTypes.string.isRequired,
        value: PropTypes.object,
    };

    get miles() {
        const {
            value: {miles},
        } = this.props;

        return miles;
    }

    get transactions() {
        const {
            value: {transactions},
        } = this.props;

        return transactions;
    }

    _onMessage(event) {
        const {value} = this.state;

        this._hideModal();

        if (_.isNil(value) === false) {
            try {
                const {
                    nativeEvent: {data},
                } = event;
                const {error, code} = JSON.parse(data);

                if (_.isString(error) && _.isEmpty(error) === false) {
                    this.showError(error);
                } else if (_.isString(code) && _.isEmpty(code) === false) {
                    if (value === 'miles') {
                        this.setMilesValue(code);
                        if (_.isNil(this.transactions)) {
                            this.getTransactionsAccess(true);
                        }
                    } else {
                        this.setTransactionsValue(code);
                    }
                }
            } catch (err) {
                if (__DEV__) {
                    console.log('error', err);
                }
            }
        }
    }

    _hideModal() {
        this.setState({
            value: null,
            modalVisible: false,
            callbackUrl: null,
        });
    }

    showError = (error) => {
        Alert.alert(
            null,
            error,
            [
                {
                    text: Translator.trans('button.ok', {}, 'messages'),
                },
            ],
            {cancelable: false},
        );
    };

    showConfirmTransactionsAccess = () => {
        // eslint-disable-next-line camelcase
        const {transactions_confirm, transactions_confirm_title} = this.props;

        return new Promise((resolve, reject) => {
            Alert.alert(
                transactions_confirm_title,
                transactions_confirm,
                [
                    {
                        text: Translator.trans('button.no', {}, 'messages'),
                        onPress: reject,
                    },
                    {
                        text: Translator.trans('button.yes', {}, 'messages'),
                        onPress: resolve,
                    },
                ],
                {cancelable: false},
            );
        });
    };

    setMilesValue = (miles) => {
        const {value, onChangeValue} = this.props;

        onChangeValue({...value, miles});
    };

    setTransactionsValue = (transactions) => {
        const {value, onChangeValue} = this.props;

        onChangeValue({...value, transactions});
    };

    getMilesAccess = () => {
        // eslint-disable-next-line camelcase
        const {miles_callbackUrl} = this.props;

        this.setState({
            value: 'miles',
            callbackUrl: miles_callbackUrl,
            modalVisible: true,
        });
    };

    getTransactionsAccess = async (showConfirm = false) => {
        // eslint-disable-next-line camelcase
        const {transactions_callbackUrl} = this.props;

        if (showConfirm === true) {
            await this.showConfirmTransactionsAccess();
        }

        this.setState({
            value: 'transactions',
            callbackUrl: transactions_callbackUrl,
            modalVisible: true,
        });
    };

    revokeMilesAccess = () => {
        this.setMilesValue(null);
    };

    revokeTransactionsAccess = () => {
        this.setTransactionsValue(null);
    };

    // eslint-disable-next-line class-methods-use-this
    renderStatusIcon(isAuthorized) {
        return isAuthorized ? <Icon name='square-success' color='#008140' size={24} /> : <Icon name='square-error' color='#BA2629' size={24} />;
    }

    _renderButton(buttonText, onPress) {
        return (
            <View style={styles.buttonWrap}>
                <TouchableBackground
                    onPress={onPress}
                    backgroundColor='#013d5b'
                    activeBackgroundColor='#255F82'
                    style={[styles.authButton, this.isDark && styles.authButtonDark, styles.capitalOneButton]}>
                    <Text style={[styles.buttonText, this.isDark && styles.textDark, styles.capitalOneButtonText]}>{buttonText}</Text>
                </TouchableBackground>
            </View>
        );
    }

    renderAuthButton(buttonText, onPress) {
        return this._renderButton(buttonText, onPress);
    }

    renderRevokeButton(revokeButtonText, onPress) {
        return this._renderButton(revokeButtonText, onPress);
    }

    renderLabel(title, subTitle) {
        const styleLabel = [styles.capitalOneLabel, this.isDark && styles.capitalOneLabelDark];

        return (
            <View style={styles.capitalOneLabelContainer}>
                <Text style={styleLabel}>{title}</Text>
                <Text style={styleLabel}>{subTitle}</Text>
            </View>
        );
    }

    renderMilesButton() {
        // eslint-disable-next-line camelcase
        const {miles_buttonText, miles_revokeButtonText, miles_title, miles_desc} = this.props;

        return (
            <>
                {this.renderLabel(miles_title, miles_desc)}
                {this.renderContainer(
                    miles_buttonText,
                    miles_revokeButtonText,
                    _.isEmpty(this.miles) === false,
                    this.getMilesAccess,
                    this.revokeMilesAccess,
                )}
            </>
        );
    }

    renderTransactionsButton() {
        const {value} = this.state;
        // eslint-disable-next-line camelcase
        const {transactions_buttonText, transactions_revokeButtonText, transactions_title, transactions_desc} = this.props;

        if (_.isString(this.transactions) || value === 'transactions' || _.isString(this.miles)) {
            return (
                <>
                    {this.renderLabel(transactions_title, transactions_desc)}
                    {this.renderContainer(
                        transactions_buttonText,
                        transactions_revokeButtonText,
                        _.isEmpty(this.transactions) === false,
                        this.getTransactionsAccess,
                        this.revokeTransactionsAccess,
                    )}
                </>
            );
        }

        return null;
    }

    renderModal() {
        const {callbackUrl} = this.state;

        return this._renderModal(callbackUrl);
    }

    render() {
        return (
            <>
                {this.renderMilesButton()}
                {this.renderTransactionsButton()}
                {this.renderModal()}
            </>
        );
    }
}

export default React.forwardRef((props, forwardedRef) => {
    const theme = useTheme();

    return <OauthCapitalCards theme={theme} ref={forwardedRef} {...props} />;
});
