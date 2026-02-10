import {useIsFocused, useNavigation, useScrollToTop} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import _ from 'lodash';
import React, {useCallback, useRef, useState} from 'react';
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {WebView} from 'react-native-webview';
import {WebViewProgressEvent} from 'react-native-webview/lib/WebViewTypes';

import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import {openExternalUrl} from '../../helpers/navigation';
import {useProfileData} from '../../hooks/profile';
import {API_URL} from '../../services/api';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import {BlogStackParamList} from '../../types/navigation';
import BlogPageSkeleton, {BlogPageRedirectSkeleton} from './skeleton';

const clickEvent = Platform.select({
    ios: 'click',
    android: undefined,
});
const blogUrl = `${API_URL}/blog`;

// @ts-ignore
export const BlogScreenComponent: React.FunctionComponent<{
    url: string;
    renderLoading: () => React.ReactElement;
    onPageLoad: (webView: React.RefObject<WebView>) => void;
    onPostMessage: (data: Record<string, any>) => void;
}> = ({url, renderLoading, onPageLoad, onPostMessage}) => {
    const isFocused = useIsFocused();
    const navigation = useNavigation<StackNavigationProp<BlogStackParamList, 'BlogPage'>>();
    const profile = useProfileData();
    const webViewRef = useRef<WebView>(null);
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const onLoadProgress = (event: WebViewProgressEvent) => {
        if (event.nativeEvent.progress > 0.4) {
            setLoading(false);
        }
    };
    const onLoad = useCallback(() => {
        if (_.isFunction(onPageLoad)) {
            onPageLoad(webViewRef);
        }
    }, [onPageLoad]);
    const onShouldStartLoadWithRequest = useCallback(
        (event) => {
            const {url, navigationType} = event;

            if (navigationType === clickEvent) {
                if (_.isEqual(url.replace(/\/$/, ''), blogUrl) || _.isEqual(url.replace(/\/#$/, ''), blogUrl)) {
                    return false;
                }
                if (_.startsWith(url, API_URL)) {
                    if (_.startsWith(url, `${blogUrl}/link/`)) {
                        openExternalUrl(event);
                        return false;
                    }
                    if (_.startsWith(url, `${blogUrl}/author/`)) {
                        navigation.push('BlogAuthorPage', {url});
                        return false;
                    }
                    if (_.startsWith(url, blogUrl)) {
                        navigation.push('BlogPage', {url});
                        return false;
                    }

                    // @ts-ignore
                    handleOpenUrl({url}, (event: {url: string}) => openExternalUrl(event));

                    return false;
                }

                openExternalUrl(event);
                return false;
            }

            return true;
        },
        [navigation],
    );

    const onMessage = useCallback(
        (event) => {
            let {data} = event.nativeEvent;

            data = JSON.parse(data);

            if (_.isObject(data)) {
                // @ts-ignore
                if (data.type === 'navigate') {
                    // @ts-ignore
                    navigation.push('BlogPage', {url: data.url});
                }

                if (_.isFunction(onPostMessage)) {
                    onPostMessage(data);
                }
            }
        },
        [onPostMessage],
    );

    const renderLoadingSkeleton = () => {
        if (_.isNil(renderLoading)) {
            return <BlogPageSkeleton />;
        }

        return renderLoading();
    };

    useScrollToTop(
        useRef({
            scrollToTop() {
                webViewRef.current?.injectJavaScript("(function(){jQuery('html, body').animate({ scrollTop: 0 }, 'fast');})()");
            },
        }),
    );

    return (
        <>
            <WebView
                ref={webViewRef}
                source={{
                    uri: url,
                    headers: {
                        'x-aw-mobile-native': 'true',
                        'x-aw-theme': theme,
                        'x-aw-platform': Platform.OS,
                        'x-aw-version': DeviceInfo.getVersion(),
                        'x-aw-userid': String(profile.UserID),
                        'x-aw-ref-code': profile.refCode,
                    },
                    method: 'GET',
                }}
                onLoad={onLoad}
                onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                keyboardDismissMode='on-drag'
                geolocationEnabled={false}
                builtInZoomControls
                allowsLinkPreview
                forceDarkOn={theme === 'dark'}
                contentMode='mobile'
                pullToRefreshEnabled
                originWhitelist={['*']}
                automaticallyAdjustContentInsets={false}
                contentInset={{left: 0, top: 0, right: 0, bottom: 0} /* @ts-ignore */}
                renderError={() => null}
                renderLoading={() => <></>}
                setSupportMultipleWindows={false}
                onMessage={onMessage}
                decelerationRate={1}
                webviewDebuggingEnabled={__DEV__}
                onLoadProgress={onLoadProgress}
                onContentProcessDidTerminate={() => {
                    webViewRef.current?.reload();
                }}
                style={{
                    backgroundColor: theme === 'dark' ? DarkColors.bgLight : Colors.white,
                    flex: 1,
                    opacity: loading ? 0 : 1,
                }}
            />
            {loading && isFocused && renderLoadingSkeleton()}
        </>
    );
};

// @ts-ignore
export const BlogScreen: React.FunctionComponent = () => <BlogScreenComponent url={`${blogUrl}/`} />;

// @ts-ignore
export const BlogSearchScreen: React.FunctionComponent = ({route}) => <BlogScreenComponent url={`${API_URL}${route.path}`} />;
// @ts-ignore
export const BlogPageRedirectScreen: React.FunctionComponent = ({route}) => (
    /* @ts-ignore */
    <BlogScreenComponent url={`${blogUrl}/?rTagId=${route.params.rTagId}`} renderLoading={() => <BlogPageRedirectSkeleton />} />
);
