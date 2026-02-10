import Translator from 'bazinga-translator';
import {startsWith} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Spinner from '../../components/spinner';
import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import {getMainColor} from '../../helpers/header';
import {openExternalUrl} from '../../helpers/navigation';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

class WebViewPage extends BaseThemedPureComponent {
    static clickEvent = Platform.select({
        ios: 'click',
        android: undefined,
    });

    static onShouldStartLoadWithRequest(navigation, event) {
        const {url, navigationType} = event;

        if (navigationType === WebViewPage.clickEvent) {
            handleOpenUrl({url}, (event) => {
                const {url} = event;

                if (startsWith(url, Config.API_URL) && startsWith(url, `${Config.API_URL}/blog/`) === false) {
                    return navigation.navigate('InternalPage', event);
                }

                return openExternalUrl(event);
            });

            return false;
        }

        return true;
    }

    constructor(props) {
        super(props);

        this.onShouldStartLoadWithRequest = this.onShouldStartLoadWithRequest.bind(this);
        this.renderLoadingView = this.renderLoadingView.bind(this);
    }

    onShouldStartLoadWithRequest = (event) => {
        const {navigation} = this.props;

        return WebViewPage.onShouldStartLoadWithRequest(navigation, event);
    };

    get mainColor() {
        return getMainColor(this.selectColor(Colors.grayBlue, DarkColors.text), this.isDark);
    }

    reload() {
        if (this._webView) {
            this._webView.reload();
        }
    }

    getSourceUrl() {
        const {uri} = this.props;

        return `${uri}?locale=${Translator.getLocale()}`;
    }

    // eslint-disable-next-line class-methods-use-this
    renderLoadingView() {
        return (
            <View style={[styles.loading, this.isDark && styles.pageDark]}>
                <Spinner androidColor={this.mainColor} />
            </View>
        );
    }

    render() {
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        return (
            <View style={containerStyle}>
                <WebView
                    ref={(ref) => (this._webView = ref)}
                    style={containerStyle}
                    source={{uri: this.getSourceUrl()}}
                    renderLoading={this.renderLoadingView}
                    startInLoadingState
                    originWhitelist={['*']}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    automaticallyAdjustContentInsets={false}
                    contentInset={{left: 0, top: 0, right: 0, bottom: 0}}
                    sharedCookiesEnabled={this.getSourceUrl().includes(Config.API_URL)}
                    renderError={() => null}
                    setSupportMultipleWindows={false}
                />
            </View>
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
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});

WebViewPage.propTypes = {
    uri: PropTypes.string,
};

export default {
    ContactUs: {
        getScreen: () => require('./contactUs').default,
        path: '/contact-us',
    },
    AboutUs: {
        getScreen: () => require('./aboutUs').default,
        path: '/about',
    },
    PrivacyNotice: {
        getScreen: () => require('./privacy').default,
        path: '/privacy',
    },
    FAQs: {
        getScreen: () => require('./faqs').default,
        path: '/faqs',
    },
    Terms: {
        getScreen: () => require('./terms').default,
        path: '/terms',
    },
    InternalPage: {
        getScreen: () => require('./internal').default,
        path: '/internal',
    },
};

const ThemedWebViewPage = withTheme(WebViewPage);

export {WebViewPage as BaseWebViewPage, ThemedWebViewPage};
