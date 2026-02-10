import CookieManager from '@react-native-cookies/cookies';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import DeviceInfo from 'react-native-device-info';
import {WebView} from 'react-native-webview';
import url from 'url';

import {isIOS} from '../../helpers/device';
import API, {API_URL} from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import {cookies, sha1} from './lib';
import AutoLoginLocalPasswordPopup from './localPassword';

const jsSha1 = require('js-sha1');

const safeParseJson = (text) => {
    let str;

    try {
        str = JSON.parse(text);
    } catch (e) {
        str = JSON.parse(JSON.stringify(text));
    }

    return str;
};
let jQueryScript = '';

function log(...args) {
    console.log(`[AUTOLOGIN]`, ...args);
}

function getHash() {
    const now = Date.now();

    return jsSha1(String(_.random(_.random(0, now), now)).split(''));
}

@withTheme
class AutoLogin extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onLoadStart: PropTypes.func,
        onLoadEnd: PropTypes.func,
        onRequestLocalPassword: PropTypes.func,
        onRequestShow: PropTypes.func,
        onRequestHide: PropTypes.func,
    };

    static get initialState() {
        return {
            url: null,
            params: {},
            extension: null,
            accountId: null,
            providerCode: null,
            reload: false,
            action: null,
            clearCache: false,
            alwaysSendLogs: false,
            hideOnStart: false,
            update: false,
            kind: null,
            userAgent: null,
            startTime: Date.now(),
            incognito: false,
            hash: getHash(),
        };
    }

    static evalExtension(extension) {
        const scriptHeader = `var console = {};
        var document = {};
        var navigator = {};
        var window = {
            postMessage: () => {},
        };
        var jQuery = () => {};
        var $ = () => {};
        var util;`;
        /* eslint-disable no-eval */

        var {plugin, params} = eval(`${scriptHeader}${extension}; var evalResult = {plugin, params}; evalResult`);
        /* eslint-enable no-eval */

        return {plugin, params};
    }

    constructor(props) {
        super(props);

        this._webView = React.createRef();
        this.start = this.startExtensionAutologin.bind(this);
        this.cancel = this.cancel.bind(this);
        this.abort = this.abort.bind(this);

        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onPostMessage = this.onPostMessage.bind(this);

        this.injectScript = this.injectScript.bind(this);

        this.step = 'start';
        this.command = null;
        this.stepHistory = [];
        this.mobileLogs = [];
        this.params = null;
        this.onError = null;

        this.state = AutoLogin.initialState;
    }

    componentDidMount() {
        this.mounted = true;

        RNFetchBlob.fs.readFile(RNFetchBlob.fs.asset('jquery.min.js'), 'utf8').then((contents) => {
            jQueryScript = contents;
            console.log(jQueryScript);
        });
    }

    componentWillUnmount() {
        this.mounted = false;
        this.clearLog();
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    get webView() {
        return this._webView.current;
    }

    onRequestShow() {
        const {onRequestShow} = this.props;

        if (_.isFunction(onRequestShow)) {
            onRequestShow();
        }
    }

    onRequestHide() {
        const {onRequestHide} = this.props;

        if (_.isFunction(onRequestHide)) {
            onRequestHide();
        }
    }

    reset() {
        this.step = 'start';
        this.command = null;
        this.stepHistory = [];
        this.mobileLogs = [
            {type: 'message', content: 'Mobile Log'},
            {type: 'message', content: `App Version: ${DeviceInfo.getVersion()}`},
            {type: 'message', content: `Device Model: ${DeviceInfo.getModel()}`},
            {
                type: 'message',
                content: `Platform: ${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
            },
        ];
        this.params = null;
        this.onError = null;
    }

    checkStep() {
        if (this.step === '') {
            this.stepHistory = [];
            return false;
        }

        let times = 0;

        for (let i = 0; i < this.stepHistory.length; i += 1) {
            if (this.step === this.stepHistory[i]) {
                times += 1;
            }
        }

        if (times > 10) {
            this.step = '';
            return false;
        }

        this.stepHistory.push(this.step);

        while (this.stepHistory.length > 100) {
            this.stepHistory.shift();
        }

        return true;
    }

    onRequestLocalPassword(extension) {
        const {onRequestLocalPassword} = this.props;

        if (_.isObject(extension) && extension.localPassword === true && _.isFunction(onRequestLocalPassword)) {
            onRequestLocalPassword(extension);
        }
    }

    /**
     * Get extension
     *
     * @param {object} data
     * @param {('desktop'|'mobile'|'extension')} type - extension type
     * @returns {Promise<any>}
     */
    getApi = (data, type) =>
        new Promise((resolve, reject) => {
            API.post('/autologin', {...data, type}, {retry: 3, timeout: 30000, globalError: false})
                .then((response) => {
                    const {data} = response;

                    resolve(data);
                })
                .catch((rejection) => {
                    const {response} = rejection;

                    if (_.isObject(response)) {
                        const {data} = response;

                        if (_.isObject(data)) {
                            resolve(data);
                            if (__DEV__) {
                                const {error} = data;

                                if (_.isString(error)) {
                                    alert(error);
                                }
                            }
                        } else {
                            if (__DEV__) {
                                log('Error load api', response);
                            }
                            reject();
                        }
                    } else {
                        reject();
                    }
                });
        });

    /**
     * Get account auto-login extension
     *
     * @param {integer} accountId
     * @param {('desktop'|'mobile')} type - extension type
     * @returns {Promise<any>}
     */
    getAccountExtension(accountId, type) {
        return this.getApi({accountId}, type);
    }

    /**
     * Get itinerary auto-login extension
     *
     * @param {string} itineraryId
     * @param {('desktop'|'mobile')} type - extension type
     * @returns {Promise<any>}
     */
    getItineraryAutologinExtension(itineraryId, type) {
        return this.getApi({itineraryId}, type);
    }

    /**
     * Get provider extension
     *
     * @param {string} providerCode
     * @returns {Promise<any>}
     */
    getProviderExtension(providerCode) {
        return this.getApi({providerCode}, 'extension');
    }

    startExtensionAutologin({ID: accountId, ProviderCode: providerCode, Autologin}) {
        this.reset();

        if (Autologin.mobileExtension === true) {
            this.getAccountExtension(accountId, 'mobile')
                .then((extension) => {
                    if (!_.isObject(extension)) {
                        try {
                            const {plugin, params} = AutoLogin.evalExtension(extension);

                            if (_.isFunction(plugin.autologin)) {
                                return this.startDesktopExtensionAutologin(accountId, providerCode, Autologin);
                            }
                            let {url} = plugin.autologin;

                            if (_.isFunction(plugin.autologin.getStartingUrl)) {
                                url = plugin.autologin.getStartingUrl(params);
                            }

                            if (__DEV__) {
                                log('autologin', 'open browser from mobile extension, done');
                            }

                            const {clearCache, mobileUserAgent: userAgent, alwaysSendLogs, hosts, incognito} = plugin;

                            this.setWebViewState({
                                url,
                                params,
                                extension,
                                accountId,
                                providerCode,
                                action: 'autologin',
                                clearCache,
                                kind: 'autologin',
                                userAgent,
                                alwaysSendLogs,
                                hosts,
                                incognito,
                            });
                        } catch (e) {
                            if (__DEV__) {
                                log(`Syntax error in api for ${providerCode}`);
                                log('autologin', 'open browser from mobile login url, exception', e);
                            }
                            this.setWebViewState({
                                url: Autologin.loginUrl,
                                accountId,
                            });
                        }
                    }

                    this.onRequestLocalPassword(extension);

                    return undefined;
                })
                .catch(() => {
                    this.setWebViewState({
                        url: Autologin.loginUrl,
                        accountId,
                    });
                });
        } else {
            this.startDesktopExtensionAutologin(accountId, providerCode, Autologin);
        }
    }

    startDesktopExtensionAutologin(accountId, providerCode, Autologin) {
        if (Autologin.desktopExtension === true) {
            this.getAccountExtension(accountId, 'desktop')
                .then((extension) => {
                    if (_.isString(extension)) {
                        try {
                            const {plugin, params} = AutoLogin.evalExtension(extension);
                            const {clearCache, mobileUserAgent: userAgent, alwaysSendLogs, hosts, incognito} = plugin;

                            this.setWebViewState({
                                url: plugin.getStartingUrl(params),
                                params,
                                extension,
                                accountId,
                                providerCode,
                                clearCache,
                                kind: 'autologin',
                                userAgent,
                                alwaysSendLogs,
                                hosts,
                                incognito,
                            });
                        } catch (e) {
                            if (__DEV__) {
                                log(`Syntax error in api for ${providerCode}`);
                                log('autologin', 'open browser from mobile login url, exception', e);
                            }
                            this.setWebViewState({
                                url: Autologin.loginUrl,
                                accountId,
                            });
                        }
                    }

                    this.onRequestLocalPassword(extension);
                })
                .catch(() => {
                    this.setWebViewState({
                        url: Autologin.loginUrl,
                        accountId,
                    });
                });
        } else {
            if (__DEV__) {
                log('autologin', 'open browser from desktop extension login url, desktop extension disabled');
            }
            this.setWebViewState({
                url: Autologin.loginUrl,
                accountId,
            });
        }
    }

    startExtensionUpdate(accountId, onError) {
        this.reset();

        if (_.isFunction(onError)) {
            this.onError = onError;
        }

        this.getAccountExtension(accountId, 'desktop').then((extension) => {
            if (_.isString(extension)) {
                try {
                    const {plugin, params} = AutoLogin.evalExtension(extension);
                    const {clearCache, hideOnStart = false, mobileUserAgent: userAgent, alwaysSendLogs, hosts, incognito} = plugin;

                    this.setWebViewState({
                        url: plugin.getStartingUrl(params),
                        params,
                        extension,
                        accountId,
                        providerCode: params.providerCode,
                        clearCache,
                        hideOnStart,
                        userAgent,
                        alwaysSendLogs,
                        hosts,
                        incognito,
                        update: true,
                        kind: 'update',
                    });
                } catch (e) {
                    if (__DEV__) {
                        log(`Syntax error in api for ${accountId}`, e);
                    }
                }
            }

            this.onRequestLocalPassword(extension);
        });
    }

    startItineraryAutologin(itineraryId, type = 'desktop') {
        this.reset();

        this.getItineraryAutologinExtension(itineraryId, type).then((extension) => {
            if (_.isString(extension)) {
                try {
                    const {plugin, params} = AutoLogin.evalExtension(extension);
                    const {clearCache, hideOnStart = false, mobileUserAgent: userAgent, alwaysSendLogs, hosts, incognito} = plugin;

                    this.setWebViewState({
                        url: plugin.getStartingUrl(params),
                        params,
                        extension,
                        providerCode: params.providerCode,
                        kind: 'autologin',
                        clearCache,
                        hideOnStart,
                        userAgent,
                        alwaysSendLogs,
                        hosts,
                        incognito,
                    });
                } catch (e) {
                    if (__DEV__) {
                        log(`Syntax error in api for ${itineraryId}`, e);
                    }
                }
            }

            this.onRequestLocalPassword(extension);
        });
    }

    showFlightStatus(providerCode, param) {
        if (!param) {
            return;
        }

        this.getProviderExtension(providerCode)
            .then((extension) => {
                if (_.isString(extension)) {
                    try {
                        const {plugin} = AutoLogin.evalExtension(extension);

                        if (typeof plugin.flightStatus !== 'undefined' && typeof plugin.flightStatus.match !== 'undefined') {
                            if (!plugin.flightStatus.match.test(param.flightNumber)) {
                                alert('Sorry, we are not able to show flight status for this flight number.');
                                return;
                            }
                        }

                        const {clearCache, mobileUserAgent: userAgent, alwaysSendLogs, hosts} = plugin;

                        this.setWebViewState({
                            url: plugin.flightStatus.url,
                            params: param,
                            extension,
                            providerCode,
                            clearCache,
                            update: false,
                            kind: 'flightStatus',
                            userAgent,
                            alwaysSendLogs,
                            hosts,
                            action: 'flightStatus',
                        });
                    } catch (e) {
                        alert('Sorry, we are not able to show flight status for this airline yet.');
                        if (__DEV__) {
                            log('Syntax error in api', e);
                        }
                    }
                }
            })
            .catch(() => {
                alert('Sorry, we are not able to show flight status for this airline yet.');
            });
    }

    getInjectedScript() {
        const {update, extension, action, hash} = this.state;
        let {params} = this.state;

        params = _.isObject(this.params) ? this.params : params;
        params.autologin = !update;

        if (_.isObject(params.account)) {
            params.account.data = {};
            params.account.data.properties = {};
        }

        if (_.isObject(params.data) === false) {
            params.data = {};
            params.data.properties = {};
        }

        if (_.isObject(params.account) && _.isUndefined(params.account.properties)) {
            params.account.properties = {};
        }

        if (params && extension && this.checkStep()) {
            // desktop extension support
            const path = action ? `plugin.${action}` : 'plugin';
            const console = __DEV__
                ? 'console'
                : `{
                log: noop,
                warn: noop,
                debug: noop,
                error: noop,
                table: noop,
                group: noop,
                groupEnd: noop,
            }`;

            const code = `
                var noop = () => {};
                (function(console){
                    const require = undefined;
                    const define = undefined;
                    const exports = undefined;

                    ${jQueryScript}
                    ${cookies}
                    ${sha1};

                    function sendEvent(event){
                        var jsonStr = JSON.stringify(event);
                        var message = '{"1":"' + sha1(jsonStr + "${hash}") + '", "2":' + jsonStr + '}';

                        window.ReactNativeWebView.postMessage(message);
                    }

                    ${extension};

                    params = ${JSON.stringify(params)};

                    $(document).ready(function () {
                        try {
                            var step = '${this.step}';

                            ${path}[step](params);
                        } catch (err) {
                            api.log(err);
                        }
                    });
                })(${console});
            `;

            return `
            ${code}
            `;
        }

        return '';
    }

    injectScript() {
        if (!this.webView) {
            return;
        }

        this.safeSetState(
            {
                hash: getHash(),
            },
            this._injectScript,
        );
    }

    async _injectScript() {
        const script = this.getInjectedScript();

        try {
            await this.webView.injectJavaScript(script);
        } catch (error) {
            if (__DEV__) {
                log('inject script error', {error, script});
            }
        }
    }

    async setWebViewState(properties) {
        const {url: startUrl, clearCache, hideOnStart, incognito, hosts} = properties;
        const startingUrl = url.parse(startUrl);

        log('init', {
            startUrl,
            clearCache,
            hideOnStart,
            incognito,
        });

        if (hideOnStart === true) {
            this.onRequestHide();
        }

        if (hideOnStart === false) {
            this.onRequestShow();
        }

        if (clearCache === true && _.isObject(hosts)) {
            try {
                const clearHosts = Object.keys(hosts);

                if (startUrl !== 'about:blank') {
                    clearHosts.push(startingUrl.hostname);
                }

                const cookieHosts = [...new Set(clearHosts)];

                log('clear cookies', cookieHosts);

                await CookieManager.clearByHosts(cookieHosts);

                if (isIOS) {
                    await CookieManager.clearByHosts(cookieHosts, true);
                }
            } catch (e) {
                //
            }
        }

        this.safeSetState({
            ...AutoLogin.initialState,
            ...properties,
        });
    }

    cancel() {
        this.onRequestHide();
        if (['complete', 'error'].indexOf(this.command) === -1) {
            this._onError();
        }
    }

    abort(reason) {
        if (['complete', 'error', 'log'].indexOf(this.command) === -1) {
            const date = new Date();

            this.mobileLogs.push({
                type: 'message',
                content: `[${[date.getHours(), date.getMinutes(), date.getSeconds()].join(':')}] Aborted, reason: ${reason}`,
            });
            this.saveLog();
        }
        this.cancel();
    }

    saveLog() {
        const {accountId} = this.state;

        log('save browser log', this.mobileLogs);
        return API.post(
            '/account/receive-browser-log',
            {
                accountId,
                log: this.mobileLogs,
            },
            {
                retry: 3,
                globalError: false,
            },
        );
    }

    clearLog() {
        this.mobileLogs = [];
    }

    saveProperties = ({accountId, properties = {}, errorMessage, errorCode}) => {
        const {account, pass, password, properties: rest, data: restData, ...params} = this.params;
        const data = {...params, accountId, properties, errorMessage, errorCode};

        log('save properties', data);

        return API.post('/account/receive-from-browser', data, {
            retry: 3,
            globalError: false,
        });
    };

    submitStat = (accountId, providerCode, success, errorMessage, mobileKind) => {
        let errorCode = 2;

        /* eslint-disable no-param-reassign */
        success = success ? 1 : 0;

        if (typeof errorMessage === 'undefined' || success === 1) {
            errorCode = 1;
            errorMessage = '';
        } else if (typeof errorMessage === 'object') {
            if (typeof errorMessage[1] !== 'undefined') {
                errorCode = errorMessage[1];
            }
            errorMessage = errorMessage[0];
            /* eslint-enable prefer-destructuring */
        }

        const data = {
            accountId,
            providerCode,
            success,
            errorMessage,
            errorCode,
            mobileKind,
        };

        log('submit extension stat', data);

        return API.post('/account/extension-stats', data, {
            retry: 3,
            globalError: false,
        });
    };

    onLoadStart() {
        const {onLoadStart} = this.props;

        if (_.isFunction(onLoadStart)) {
            onLoadStart();
        }

        clearTimeout(this.timeoutId);
    }

    _onLoadEnd = () => {
        const {onLoadEnd} = this.props;

        if (['complete', 'log', 'error'].indexOf(this.command) === -1) {
            this.injectScript();
        }

        if (_.isFunction(onLoadEnd)) {
            onLoadEnd();
        }
    };

    onLoadEnd(event) {
        // log('onLoadEnd', {event: event.nativeEvent, command: this.command});
        if (event.nativeEvent.loading !== true && !['other', 'backforward'].includes(event.nativeEvent.navigationType)) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(this._onLoadEnd, 250);
        }
    }

    _onError() {
        if (_.isFunction(this.onError)) {
            this.onError();
        }
    }

    onLoadError = (error) => {
        if (__DEV__) {
            log('onLoadError', error);
        }
    };

    isIncognito = () => {
        const {incognito} = this.state;

        if (isIOS) {
            return incognito;
        }

        return false;
    };

    verifyEvent = (eventData, hash) => {
        if (_.isObject(eventData)) {
            if (eventData[1] && eventData[2]) {
                const salt = eventData[1];
                const data = eventData[2];

                if (salt === jsSha1(JSON.stringify(data) + hash)) {
                    return data;
                }
            }
        }

        return null;
    };

    onPostMessage(event) {
        const {nativeEvent} = event;

        if (_.isObject(nativeEvent)) {
            const {data} = nativeEvent;
            const eventRaw = safeParseJson(data);

            if (_.isObject(eventRaw) === false) {
                return true;
            }

            const {accountId, providerCode, hash, update, kind, alwaysSendLogs} = this.state;
            const eventData = this.verifyEvent(eventRaw, hash);

            if (eventData !== null) {
                const {message, params, errorCode, step, command} = eventData;

                if (command === 'logger') {
                    if (_.isObject(message)) {
                        this.mobileLogs.push(message);
                    } else {
                        log(message);
                        this.mobileLogs.push({type: 'message', content: message});
                    }

                    return;
                }

                if (['complete', 'log', 'error'].indexOf(this.command) > -1) {
                    return false;
                }

                this.command = command;

                if (_.isEmpty(params) === false) {
                    this.params = params;
                }

                if (this.command === 'show') {
                    this.onRequestShow();
                }

                if (this.command === 'hide') {
                    this.onRequestHide();
                }

                if (this.command === 'error' && !_.isEmpty(message)) {
                    if (update || alwaysSendLogs) {
                        this.saveLog();
                    }
                    if (update) {
                        this.saveProperties({accountId, errorMessage: message, errorCode});
                        this.onRequestHide();
                    }
                    this.submitStat(accountId, providerCode, false, [message, errorCode], kind);
                }

                if (this.command === 'log') {
                    this.saveLog();
                    if (update) {
                        this.onRequestHide();
                    }
                    this._onError();
                }

                if (this.command === 'complete') {
                    let properties = {};

                    if (update) {
                        if (this.params && this.params.account && this.params.account.properties) {
                            properties = this.params.account.properties;
                        }

                        this.saveProperties({accountId, properties});
                        this.onRequestHide();
                    }

                    if (alwaysSendLogs || (update && _.isNil(properties.Balance))) {
                        this.saveLog();
                    }

                    this.submitStat(accountId, providerCode, true, [null, null], kind);
                }

                if (this.command === 'nextstep' && !_.isEmpty(step)) {
                    this.step = step;
                }
            }
        }
    }

    renderError = () => null;

    renderLoadingView = () => {
        const {theme} = this.props;

        return <View style={[styles.loading, theme === 'dark' && styles.loadingDark]} />;
    };

    render() {
        const {theme} = this.props;
        const {url: uri, userAgent, startTime} = this.state;
        const style = [styles.page, theme === 'dark' && styles.pageDark];

        if (typeof uri === 'string') {
            return (
                <WebView
                    key={`webView-${startTime}`}
                    style={style}
                    ref={this._webView}
                    source={
                        uri === 'about:blank'
                            ? {
                                  html: `<html><body style="background-color: ${
                                      isIOS ? this.selectColor(Colors.white, Colors.black) : Colors.white
                                  };">
                                    <script>
                                        ${this.getInjectedScript()}
                                    </script>
                                </body>
                              </html>`,
                              }
                            : {uri}
                    }
                    onError={this.onLoadError}
                    renderError={this.renderError}
                    sharedCookiesEnabled={uri.indexOf(API_URL) > -1}
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    decelerationRate={0.99}
                    pullToRefreshEnabled
                    geolocationEnabled={false}
                    builtInZoomControls
                    originWhitelist={['*']}
                    onLoadStart={this.onLoadStart}
                    onLoadEnd={this.onLoadEnd}
                    onMessage={this.onPostMessage}
                    startInLoadingState
                    renderLoading={this.renderLoadingView}
                    incognito={this.isIncognito()}
                    userAgent={userAgent || undefined}
                />
            );
        }

        return <View style={style} />;
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
    loadingDark: {
        backgroundColor: Colors.black,
    },
});

const ThemedAutoLogin = React.forwardRef((props, ref) => <AutoLogin forwardedRef={ref} {...props} />);

ThemedAutoLogin.displayName = 'ThemedAutoLogin';

export default ThemedAutoLogin;
export {AutoLoginLocalPasswordPopup};
