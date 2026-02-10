import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {WebView} from 'react-native-webview';

import {BASE_URL} from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import ThemedModal from '../page/modal';

const RecaptchaContext = React.createContext();

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export class RecaptchaProvider extends PureComponent {
    static propTypes = {
        children: PropTypes.any,
    };

    _recaptcha = React.createRef();

    recaptcha = {
        open: async (siteKey, onComplete, onClose) => {
            this._recaptcha.current.open(onComplete, onClose);
        },
        close: (...rest) => {
            this._recaptcha.current.close(...rest);
        },
    };

    render() {
        const {children} = this.props;

        return (
            <RecaptchaContext.Provider value={this.recaptcha}>
                <ThemedRecaptcha ref={this._recaptcha} />
                {children}
            </RecaptchaContext.Provider>
        );
    }
}

@withTheme
class Recaptcha extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
    };

    _modal = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    get modal() {
        return this._modal.current;
    }

    open(onComplete, onCancel) {
        this.setState(
            {
                visible: true,
            },
            () => {
                if (this.modal) {
                    if (_.isFunction(onComplete)) {
                        this.onComplete = onComplete;
                        this.onCancel = onCancel;
                    }
                    this.modal.open();
                }
            },
        );
    }

    close(canceled = true) {
        if (_.isFunction(this.onCancel)) {
            this.onCancel(canceled);
        }

        this.onComplete = null;
        this.onCancel = null;

        this.setState({visible: false});
    }

    onRequestToken = (e) => {
        const {data} = e.nativeEvent;

        if (this.onComplete) {
            this.onComplete(data);
        }

        this.close(false);
    };

    renderLoadingCaptcha = () => {
        const {theme} = this.props;

        return <View style={[styles.loading, theme === 'dark' && styles.loadingDark]} />;
    };

    renderRecaptcha() {
        const {theme} = this.props;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        return (
            <View style={containerStyle}>
                <WebView
                    source={{
                        uri: `${BASE_URL}/recaptcha?theme=${theme}`,
                        headers: {
                            'x-aw-platform': Platform.OS,
                            'x-aw-version': DeviceInfo.getVersion(),
                        },
                        method: 'GET',
                    }}
                    onMessage={this.onRequestToken}
                    scrollEnabled={false}
                    javaScriptEnabled
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    automaticallyAdjustContentInsets={false}
                    contentInset={{left: 0, top: 0, right: 0, bottom: 0}}
                    style={containerStyle}
                    startInLoadingState
                    renderLoading={this.renderLoadingCaptcha}
                    renderError={_.noop}
                    webviewDebuggingEnabled={__DEV__}
                />
            </View>
        );
    }

    render() {
        const {visible} = this.state;

        if (!visible) {
            return null;
        }

        return (
            <ThemedModal ref={this._modal} onClose={this.close} presentationStyle={'fullScreen'}>
                {this.renderRecaptcha()}
            </ThemedModal>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
    },
    loadingDark: {
        backgroundColor: DarkColors.bgLight,
    },
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        flex: 1,
        backgroundColor: DarkColors.bgLight,
    },
});

export const withRecaptcha = (Component) =>
    class extends PureComponent {
        static displayName = `withRecaptcha${getDisplayName(Component)}`;

        render() {
            const {...rest} = this.props;

            return (
                <RecaptchaContext.Consumer>
                    {(recaptcha) =>
                        React.createElement(Component, {
                            ...rest,
                            recaptcha,
                        })
                    }
                </RecaptchaContext.Consumer>
            );
        }
    };

const ThemedRecaptcha = React.forwardRef((props, ref) => <Recaptcha forwardedRef={ref} {...props} />);

ThemedRecaptcha.displayName = 'ThemedRecaptcha';

export {ThemedRecaptcha as Recaptcha};
