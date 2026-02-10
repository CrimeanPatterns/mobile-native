import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

import {getMainColor} from '../helpers/header';
import {BaseWebViewPage} from '../screens/static';
import {Colors, DarkColors} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';
import Spinner from './spinner';

class OfferWebView extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        source: PropTypes.string,
        forwardedRef: PropTypes.any,
        height: PropTypes.number,
    };

    static navigationOptions = () => ({
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    onShouldStartLoadWithRequest = (event) => {
        const {navigation} = this.props;

        return BaseWebViewPage.onShouldStartLoadWithRequest(navigation, event);
    };

    webViewRef = React.createRef();

    injectJavaScript(...args) {
        if (this.webViewRef && this.webViewRef.current) {
            this.webViewRef.current.injectJavaScript(...args);
        }
    }

    setSourceTheme = (data) => _.isString(data) && data.replace('<html', `<html class="${this.props.theme}-mode"`);

    getSource() {
        const {source} = this.props;

        return {
            html: this.setSourceTheme(source),
            baseUrl: Config.API_URL,
        };
    }

    renderLoadingView = (showSpinner) => (
        <View style={[styles.loading, this.isDark && styles.pageDark]}>
            {showSpinner && <Spinner androidColor={getMainColor(this.selectColor(Colors.grayBlue, DarkColors.text), this.isDark)} />}
        </View>
    );

    renderError = () => null;

    render() {
        const {source, height, theme, ...rest} = this.props;
        const containerStyle = [styles.page, this.isDark && styles.pageDark, height && {height}];

        if (_.isString(source)) {
            return (
                <WebView
                    ref={this.webViewRef}
                    key={`webview_${theme}`}
                    style={containerStyle}
                    source={this.getSource()}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    originWhitelist={['*']}
                    builtInZoomControls
                    renderError={this.renderError}
                    startInLoadingState
                    renderLoading={this.renderLoadingView}
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    automaticallyAdjustContentInsets={false}
                    decelerationRate={1}
                    {...rest}
                />
            );
        }

        return this.renderLoadingView(true);
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    loading: {
        position: 'absolute',
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        height: '100%',
        width: '100%',
    },
});

const ThemedOfferWebView = withTheme(OfferWebView);
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedOfferWebView {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefOfferWebView';

export default ForwardRefComponent;
