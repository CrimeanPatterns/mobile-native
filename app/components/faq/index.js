import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

import {getMainColor} from '../../helpers/header';
import {sendClientHeight} from '../../helpers/webview/sendClientHeight';
import {BaseWebViewPage} from '../../screens/static';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import Spinner from '../spinner';

const window = Dimensions.get('window');

@withTheme
class FAQ extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        style: PropTypes.any,
        data: PropTypes.array.isRequired,
        initialScrollTo: PropTypes.string,
        scrollEnabled: PropTypes.bool,
    };

    static defaultProps = {
        scrollEnabled: false,
    };

    constructor(props) {
        super(props);

        this.onWebViewMessage = this.onWebViewMessage.bind(this);
        this.onWebViewLoadEnd = this.onWebViewLoadEnd.bind(this);

        this.state = {
            height: window.height,
        };
    }

    onWebViewMessage(e) {
        this.setState({
            height: parseInt(e.nativeEvent.data, 10),
        });
    }

    onWebViewLoadEnd() {
        const {scrollEnabled} = this.props;

        if (scrollEnabled === false && this._webView) {
            this._webView.injectJavaScript(sendClientHeight);
        }
    }

    onShouldStartLoadWithRequest = (event) => {
        const {navigation} = this.props;

        return BaseWebViewPage.onShouldStartLoadWithRequest(navigation, event);
    };

    get mainColor() {
        return getMainColor(this.selectColor(Colors.grayBlue, DarkColors.blue), this.isDark);
    }

    getStyles = () => {
        const colors = this.themeColors;
        const cssStyles = `
          html, body {
            background-color: ${Platform.select({
                ios: this.selectColor(Colors.white, Colors.black),
                android: this.selectColor(Colors.white, DarkColors.bg),
            })};
          }
          * {
            font-family: ${Fonts.regular};
            font-size: 11pt;
            color: ${Platform.select({
                ios: this.selectColor('#5c6373', DarkColors.white),
                android: this.selectColor('#5c6373', DarkColors.text),
            })};
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
          img {
            max-width: 100%!important;
            height: auto!important;
            resize: vertical;
            margin: 0 auto;
          }
          a {
            background-color: transparent;
          }
          *:focus, a:active, a:hover {
            outline: 0;
          }
          a.blue-link:hover {
            text-decoration: underline;
          }
          .faq-list{
            margin-top: 20px;
          }
          .main-table {
            border-spacing: 0;
            border-collapse: separate;
          }
          .main-table tbody tr td {
            border-top: 1px solid ${this.selectColor(Colors.gray, DarkColors.border)};
            vertical-align: middle;
            color: ${Platform.select({
                ios: this.selectColor('#5c6373', Colors.white),
                android: this.selectColor('#5c6373', DarkColors.text),
            })};
            font-size: 11pt;
            padding: 8px 10px 8px 15px;
          }
          .main-table thead tr th, .main-table thead tr td {
            font-weight: normal;
            color: ${Platform.select({
                ios: this.selectColor('#8e9199', Colors.white),
                android: this.selectColor('#8e9199', DarkColors.text),
            })};
            font-size: 11pt;
            padding: 8px 10px 8px 10px;
          }
          .faq-list .answer a {
            color: ${this.selectColor(Colors.blue, DarkColors.blue)};
            font-size: 11pt;
            text-decoration: none;
            font-family: ${Fonts.bold};
            word-wrap: break-word;
          }
          .faq-list{
            overflow: hidden
          }
          a.blue-link {
            color: ${this.selectColor(Colors.blue, DarkColors.blue)};
            font-size: 11pt;
            text-decoration: none;
            font-family: ${Fonts.bold};
          }
          [class^="icon-"], [class*=" icon-"] {
            font-family: awardwallet;
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            /* Better Font Rendering =========== */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          .icon-sucess-small:before {
            content: "\\e94e";
            color: ${colors.green}
          }
          .icon-error-small:before {
            content: "\\e94e";
            color: ${colors.red}
          }
          .faq-list p {
            font-size: 11pt;
            color: ${Platform.select({
                ios: this.selectColor('#535457', Colors.white),
                android: this.selectColor('#535457', DarkColors.text),
            })};
            line-height: 1.5;
            padding-top: 15px;
          }
          .faq-list .answer li, .faq-list .answer p {
            line-height: 1.5!important;
            font-size: 11pt!important;
          }
          .faq-list .faq-blk p {
            padding-top: 0!important;
          }
          .faq-list .answer ._counter-wrap {
            position: relative;
            padding-left: 30px;
            margin-top: 15px;
          }
          .faq-list .answer ._counter-wrap:first-of-type {
            margin-top: 0;
          }
          .faq-list .answer ._green-blk {
            background: ${this.selectColor('#4dbfa2', DarkColors.green)};
          }
          .faq-list .answer ._blue-blk, .faq-list .answer ._gray-blk, .faq-list .answer ._green-blk {
            display: inline-block;
            height: 20px;
            min-width: 20px;
            margin-left: 0;
            font-size: 11pt;
            line-height: 20px;
            vertical-align: middle;
            font-family: ${Fonts.bold};
            color: #fff;
            text-align: center;
          }
          .faq-list .answer ._counter-wrap ._blue-blk, .faq-list .answer ._counter-wrap ._gray-blk, .faq-list .answer ._counter-wrap ._green-blk {
            position: absolute;
            left: 0;
            top: 4px;
          }
          .faq-list .answer ._gray-blk {
            background: #b0b4bf;
          }
          .red {
            color: ${this.selectColor('#cc3d5e', DarkColors.red)};
          }
          .bold, strong {
            font-family: ${Fonts.bold};
          }
          .answer ul{
            margin-top: 10px;
          }
          .answer ul li {
            list-style: none;
            display: block;
            position: relative;
            padding-left: 15px;
            margin-top: 5px;
            font-size: 11pt;
            color: ${Platform.select({
                ios: this.selectColor('#535457', Colors.red),
                android: this.selectColor('#535457', DarkColors.text),
            })};
            line-height: 1.5;
          }
          .answer ul li:before {
            position: absolute;
            content: "";
            left: 0;
            top: 8px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            background: ${Platform.select({
                ios: this.selectColor('#535457', Colors.white),
                android: this.selectColor('#535457', DarkColors.text),
            })};
          }
          .faq-list .answer ul li {
            margin-top: 0!important;
          }
          .faq-list .answer li, .faq-list .answer p {
            line-height: 1.5!important;
            font-size: 11pt!important;
          }
          .counter-list {
            counter-reset: myCounter;
          }
          .faq-list .answer ol li {
            margin-top: 15px;
          }
          .counter-list li:first-child {
            margin-top: 0;
          }
          .counter-list li {
            list-style: none;
            font-size: 11pt;
            line-height: 1.5;
            display: block;
            color: ${Platform.select({
                ios: this.selectColor('#535457', Colors.white),
                android: this.selectColor('#535457', DarkColors.text),
            })};
            padding-left: 30px;
            margin-top: 15px;
            position: relative;
          }
          .counter-list li:before {
            position: absolute;
            counter-increment: myCounter;
            content: counter(myCounter);
            top: 4px;
            left: 0;
            display: inline-block;
            height: 20px;
            min-width: 20px;
            text-align: center;
            margin-left: 0;
            line-height: 20px;
            font-size: 11pt;
            font-family: ${Fonts.bold};
            color: ${Platform.select({
                ios: Colors.white,
                android: this.selectColor(Colors.white, Colors.black),
            })};
            background: ${this.selectColor('#4dbfa2', DarkColors.green)};
          }
          .secure-information .row {
            margin-top: 30px;
          }
          .secure-information .row:first-child {
            margin-top: 0;
          }
          .secure-information .thumb {
            display: block;
          }
          .secure-information .description {
            display: block
            padding-top: 10px;
          }
          i[class^="faq-icon-"],
          i[class*=" faq-icon-"] {
            display: inline-block;
            width: 76px;
            height: 76px;
            background-image: url('https://awardwallet.com/assets/awardwalletnewdesign/img/faq/sprite_faqs.png');
          }
          @media (-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx) {
            i[class^="faq-icon-"],
            i[class*=" faq-icon-"] {
              background-image: url("https://awardwallet.com/assets/awardwalletnewdesign/img/faq/sprite_faqs@2x.png");
              background-size: 334px 76px;
            }
          }
          .faq-icon-1 {
            background-position: 0 0;
          }
          .faq-icon-2 {
            background-position: -86px 0;
          }
          .faq-icon-3 {
            background-position: -172px 0;
          }
          .faq-icon-4 {
            background-position: -258px 0;
          }
    `;

        const platformStyles = Platform.select({
            ios: `
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
              @font-face {font-family: 'awardwallet'; src: url('awardwallet.ttf')}
              body {
                background-color: ${this.selectColor(Colors.white, Colors.black)};
                overflow-y: 'hidden';
              }
              .main-table.upgraded-account{
                margin-left: -54px;
                margin-right: -15px;
                width: calc(100% + 69px);
              }
              .question {
                padding: 18px 15px 18px 54px;
                border-top: 2px solid ${this.selectColor('#bec2cc', DarkColors.border)};
                font-size: 12pt;
                line-height: 1.3;
                color: ${this.selectColor(Colors.grayDark, Colors.white)};
                font-family: ${Fonts.regular};
                position: relative;
                background-color: ${this.selectColor(Colors.grayLight, DarkColors.bg)};
                border-bottom: 1px solid ${this.selectColor(Colors.gray, DarkColors.border)};
                z-index: 10;
              }
              .question:after,
              .answer:after{
                position: absolute;
                left: 15px;
                top: 15px;
                display: block;
                font-size: 8pt;
                color: ${Colors.white};
                width: 24px;
                height: 24px;
                font-family: ${Fonts.bold};
                line-height: 24px;
                text-align: center;
                border-radius: 50%;
              }
              .question:after{
                content: 'Q';
                background-color: ${this.selectColor(Colors.blue, DarkColors.blue)};
              }
              .question__arrow:before{
                position: absolute;
                content: '';
                display: block;
                left: 20px;
                bottom: -6px;
                border-top: 6px solid ${this.selectColor('#dfe1e6', DarkColors.bg)};
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
              }
              .question__arrow:after{
                position: absolute;
                content: '';
                display: block;
                left: 20px;
                bottom: -6px;
                border-top: 6px solid ${this.selectColor('#f8f9fa', DarkColors.border)};
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
              }
              .answer{
                position: relative;
                font-family: ${Fonts.regular};
                color: ${this.selectColor(Colors.textGray, Colors.white)};
                font-size: 11pt;
                line-height: 1.3;
                padding: 18px 15px 40px 54px;
              }
              .answer:after{
                content: 'A';
                background-color: ${this.selectColor('#5c6373', DarkColors.bgLight)};
              }
              .faq-list.once .question{
                background-color: ${this.selectColor(Colors.white, Colors.black)};
                border-top: 0;
              }
              .faq-list.once .question:after,
              .faq-list.once .answer:after,
              .faq-list.once .question__arrow{
                display: none;
              }
              .faq-list.once .question,
              .faq-list.once .answer{
                padding-left: 15px;
                padding-right: 15px;
              }
              .faq-list.once .main-table.upgraded-account {
                margin-left: -15px;
                margin-right: -15px;
                width: calc(100% + 30px);
              }
            `,
            android: `
              @font-face {font-family: 'awardwallet'; src:url('file:///android_asset/fonts/awardwallet.ttf')}
              .main-table.upgraded-account{
                margin-left: -74px;
                margin-right: -15px;
                width: calc(100% + 89px);
              }
              .question {
                padding: 14px 15px 14px 74px;
                font-size: 13pt;
                line-height: 1.3;
                color: ${this.selectColor(Colors.grayDark, DarkColors.text)};
                font-family: ${Fonts.regular};
                position: relative;
                background-color: ${this.selectColor(Colors.grayLight, DarkColors.bgLight)};
                z-index: 10;
              }
              .question:after,
              .answer:after{
                position: absolute;
                left: 15px;
                top: 15px;
                display: block;
                font-size: 12pt;
                color: ${this.selectColor(Colors.white, Colors.black)};
                width: 24px;
                height: 24px;
                font-family: ${Fonts.bold};
                line-height: 24px;
                text-align: center;
                border-radius: 50%;
              }
              .question:after{
                content: 'Q';
                background-color: ${this.selectColor(Colors.blue, DarkColors.blue)};
              }
              .answer{
                position: relative;
                font-family: ${Fonts.regular};
                color: ${this.selectColor(Colors.textGray, DarkColors.text)};
                font-size: 12pt;
                line-height: 1.3;
                padding: 14px 15px 40px 74px;
              }
              .answer:after{
                content: 'A';
                background-color: ${this.selectColor('#9e9e9e', DarkColors.grayLight)};
              }
              .faq-list.once .question:after,
              .faq-list.once .answer:after{
                display: none;
              }
              .faq-list.once .question,
              .faq-list.once .answer{
                padding-left: 15px;
              }
              .faq-list.once .main-table.upgraded-account {
                margin-left: -15px;
                width: calc(100% + 30px);
              }
              .faq-list.once .question{
                background-color: ${this.selectColor(Colors.white, DarkColors.bg)};
              }
            `,
        });

        return {cssStyles, platformStyles};
    };

    renderLoadingView = () => {
        const {theme} = this.props;

        return (
            <View style={[styles.loading, theme === 'dark' && styles.pageDark]}>
                <Spinner androidColor={this.mainColor} />
            </View>
        );
    };

    render() {
        const {data, initialScrollTo, style, scrollEnabled, theme} = this.props;
        const {height} = this.state;
        const {cssStyles, platformStyles} = this.getStyles();
        let html = '';
        let scrollTo = '';

        data.forEach((row) => {
            const {question, answer, id} = row;

            html += `
                <div class="question" id="q${id}"><div class="question__arrow"></div>${question}</div>
                <div class="answer">${answer}</div>
            `;
        });

        if (scrollEnabled && _.isString(initialScrollTo)) {
            scrollTo = `
            function scrollTo(element) {
              window.scroll({
                left: 0,
                top: element.offsetTop
              });
            }
            function initialRedirect() { scrollTo(document.querySelector("#q${initialScrollTo}")); }
            `;
        }

        return (
            <WebView
                ref={(ref) => {
                    this._webView = ref;
                }}
                style={[styles.page, theme === 'dark' && styles.pageDark, style, {height}]}
                source={{
                    html: `
                            <html>
                                <head>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                                    <style>
                                            * {
                                                margin: 0;
                                                padding: 0;
                                            }
                                            ${cssStyles}
                                            ${platformStyles}
                                    </style>
                                    <base href="${Config.API_URL}">
                                    <script>
                                        ${scrollTo}
                                    </script>
                                </head>
                                <body onload="${scrollTo ? 'initialRedirect()' : ''}">
                                    <div class="faq-list ${data.length === 1 && 'once'}">
                                      ${html}
                                    </div>
                                </body>
                            </html>
                    `,
                    baseUrl: ReactNativeBlobUtil.fs.dirs.MainBundleDir,
                }}
                startInLoadingState
                renderLoading={this.renderLoadingView}
                onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                onLoadEnd={this.onWebViewLoadEnd}
                onMessage={this.onWebViewMessage}
                originWhitelist={['*']}
                javaScriptEnabled
                scrollEnabled={scrollEnabled}
                contentInsetAdjustmentBehavior='automatic'
                keyboardDismissMode='on-drag'
                automaticallyAdjustContentInsets={false}
                builtInZoomControls={false}
                renderError={() => null}
                decelerationRate={1}
            />
        );
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 10,
        height: '100%',
        width: '100%',
        backgroundColor: Colors.white,
    },
});

export default FAQ;
