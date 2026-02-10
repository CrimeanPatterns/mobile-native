import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {WebView} from 'react-native-webview';

import {isAndroid} from '../../../../helpers/device';
import {sendClientHeight} from '../../../../helpers/webview/sendClientHeight';
import {BaseWebViewPage} from '../../../../screens/static';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {withTheme} from '../../../../theme';
import {BaseThemedPureComponent} from '../../../baseThemed';

class Html extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        content: PropTypes.string.isRequired,
        cssStyles: PropTypes.string,
        onLoadEnd: PropTypes.func,
        style: PropTypes.object,
    };

    static defaultProps = {
        cssStyles: '',
    };

    onLoadEndPromise;

    onLoadEndCallback;

    constructor(props) {
        super(props);

        this.state = {
            height: 0,
        };

        this.onLoadEnd = this.onLoadEnd.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    onShouldStartLoadWithRequest = (event) => {
        const {navigation} = this.props;

        if (!this.mounted) {
            return false;
        }

        return BaseWebViewPage.onShouldStartLoadWithRequest(navigation, event);
    };

    onMessage = (e) => {
        const {data} = e.nativeEvent;

        if (this.mounted) {
            if (data === 'loaded') {
                this.onLoadEnd();
            } else {
                const height = parseInt(data, 10);

                this.setState({
                    height,
                });
            }
        }
    };

    onLoadEnd() {
        const {onLoadEnd = _.noop} = this.props;

        onLoadEnd();

        if (_.isFunction(this.onLoadEndCallback)) {
            this.onLoadEndCallback();
        }

        this.webview.injectJavaScript(sendClientHeight);
    }

    listenReadyState() {
        if (this.onLoadEndPromise) {
            return this.onLoadEndPromise;
        }

        this.onLoadEndPromise = new Promise((resolve) => {
            this.onLoadEndCallback = resolve;
        });

        return this.onLoadEndPromise;
    }

    getHTMLContent() {
        let platformStyles;
        const {content, cssStyles} = this.props;
        const colors = this.themeColors;

        if (isAndroid) {
            platformStyles = `
                h1.alert {
                    font-size: 16px;
                    padding: 16px;
                    font-family: ${Fonts.regular};
                    background: ${colors.red};
                    font-weight: normal;
                    color: ${this.selectColor(Colors.white, DarkColors.text)};
                    line-height: 18px;
                }
                div {
                    background: ${this.selectColor(Colors.grayLight, DarkColors.bgLight)};
                    padding: 16px;
                    font-size: 16px;
                    color: ${this.selectColor(Colors.grayDark, DarkColors.text)};
                    margin-top: 14px;
                    font-family: ${Fonts.regular};
                    line-height: 22px;
                }
                div:last-child {
                    margin-bottom: 14px;
                }
                div.blue-notes {
                    position: relative;
                    background: ${colors.blue};
                    color: ${this.selectColor(Colors.white, DarkColors.text)};
                    padding-left: 72px;
                }
                div.blue-notes:before {
                    content:'';
                    position: absolute;
                    left: 15px;
                    top: 16px;
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-image: url(https://awardwallet.com/assets/awardwalletnewdesign/img/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -538px -136px;
                }
                div a {
                    font-size: 16px;
                    color: ${colors.blue};
                    text-decoration: none;
                }
                div a:active {
                    text-decoration: underline;
                }
                div .userEmail {
                    font-size: 16px;
                    background: ${colors.blue};
                    color: ${this.selectColor(Colors.white, DarkColors.text)};
                    line-height: 1.2;
                    padding: 4px 5px;
                    display: inline-block;
                    margin-top: 2px;
                    text-decoration: none;
                    border-radius: 1px;
                }
                @media (-webkit-min-device-pixel-ratio: 1.5), not all, not all, (min-resolution: 1.5dppx)
                    div.blue-notes:before {
                        background-image: url(https://awardwallet.com/assets/awardwalletnewdesign/img/sprite@2x.png);
                        background-size: 800px 600px;
                    }
                }
           `;
        } else {
            platformStyles = `
               @font-face {
                    font-family: '${Fonts.regular}';
                    src: local('Open Sans Regular'), local('OpenSans'), url('opensans-regular-webfont.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
               }
               @font-face {
                    font-family: '${Fonts.bold}';
                    src: local('Open Sans Bold'), local('OpenSans-Bold'), url('opensans-bold-webfont.ttf') format('truetype');
                    font-weight: bold;
                    font-style: normal;
               }
               body {
                    background-color: ${this.selectColor(Colors.grayLight, Colors.black)};
               }
               h1.alert {
                    font-family: ${Fonts.regular};
                    background: ${colors.red};
                    font-weight: normal;
                    color: #fff;
                    line-height: 18px;
                    font-size: 15px;
                    padding: 15px;
                    border-bottom: 1px solid ${colors.border};
                }
                div {
                    font-family: ${Fonts.regular};
                    line-height: 22px;
                    background: ${this.selectColor(Colors.bgGray, Colors.black)};
                    padding: 15px;
                    font-size: 15px;
                    border-top: 1px solid ${colors.border};
                    margin-top: 10px;
                    border-bottom: 1px solid ${colors.border};
                    color: ${this.selectColor(Colors.black, Colors.white)};
                }
                div:last-child {
                    margin-bottom: 10px;
                }
                div.blue-notes {
                    padding-left: 64px;
                    position: relative;
                    background: ${colors.blue};
                    color: #fff;
                }
                div.blue-notes:before {
                    content:'';
                    position: absolute;
                    left: 15px;
                    top: 16px;
                    display: inline-block;
                    width: 25px;
                    height: 25px;
                    background-image: url(https://awardwallet.com/assets/awardwalletnewdesign/img/sprite.png);
                    background-repeat: no-repeat;
                    background-position: -538px -136px;
                }
                div a {
                    font-family: ${Fonts.bold};
                    font-weight: bold;
                    font-size: 15px;
                    color: ${colors.blue};
                    text-decoration: none;
                }
                div a:active {
                    text-decoration: underline;
                }
                div .userEmail {
                    font-family: ${Fonts.bold};
                    font-weight: bold;
                    font-size: 13px;
                    background: ${colors.blue};
                    color: #fff;
                    line-height: 1.2;
                    padding: 4px 5px;
                    display: inline-block;
                    margin-top: 2px;
                    text-decoration: none;
                    border-radius: 1px;
                }
                @media (-webkit-min-device-pixel-ratio: 1.5), not all, not all, (min-resolution: 1.5dppx) {
                    div.blue-notes:before {
                        background-image: url(https://awardwallet.com/assets/awardwalletnewdesign/img/sprite@2x.png);
                        background-size: 800px 600px;
                    }
                }
           `;
        }

        return `
            <html>
            <head>
                <title></title>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
                    ${platformStyles}
                    ${cssStyles}
                </style>
                <script>
                    function onload() {
                        window.ReactNativeWebView.postMessage('loaded');
                    }
                </script>
            </head>
            <body onload="onload()">
                ${content}
            </body>
            <script>
                ${sendClientHeight}
            </script>
            </html>
        `;
    }

    render() {
        const {style, onLoadEnd, cssStyles, ...props} = this.props;
        const {height} = this.state;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        return (
            <View style={[styles.container, ...containerStyle]} renderToHardwareTextureAndroid>
                <WebView
                    ref={(ref) => {
                        this.webview = ref;
                    }}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    onMessage={this.onMessage}
                    scrollEnabled={false}
                    javaScriptEnabled
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    automaticallyAdjustContentInsets={false}
                    contentInset={{left: 0, top: 0, right: 0, bottom: 0}}
                    style={[style, ...containerStyle, height > 0 && {height}]}
                    source={{html: this.getHTMLContent(), baseUrl: ReactNativeBlobUtil.fs.dirs.MainBundleDir}}
                    originWhitelist={['*']}
                    {...props}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    page: {
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
            },
        }),
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
});

const ThemedHtml = withTheme(Html);
const ForwardRefComponent = React.forwardRef((props, ref) => <ThemedHtml {...props} forwardedRef={ref} />);

ForwardRefComponent.displayName = 'ForwardRefThemedHtml';

export default ForwardRefComponent;
