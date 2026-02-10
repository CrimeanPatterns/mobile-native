import fromColor from 'color';
import React, {useCallback, useMemo} from 'react';

import {HeaderRightButton} from '../../components/page/header/button';
import {isIOS} from '../../helpers/device';
import {shareUrl} from '../../helpers/share';
import {API_URL} from '../../services/api';
import {Colors} from '../../styles';
import {BlogScreenComponent} from './index';
import {BlogPostSkeleton} from './skeleton';

// @ts-ignore
export const BlogPageScreen: React.FunctionComponent = ({navigation, route}) => {
    const url = useMemo(() => (route.path ? `${API_URL}${route.path}` : route.params.url), [route]);
    const setOptions = useCallback((url) => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderRightButton
                    iconName={isIOS ? 'share' : 'android-share'}
                    color={Colors.white}
                    style={{
                        marginRight: 10,
                        backgroundColor: fromColor('#000').alpha(0.2).rgb().string(),
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                    }}
                    onPress={() => shareUrl(url)}
                />
            ),
        });
    }, []);
    const onPageLoad = useCallback(
        (webView) => {
            setOptions(url);
            webView.current?.injectJavaScript('if(window.getSharingUrl){window.getSharingUrl();}');
        },
        [route.path, setOptions],
    );
    const onMessage = useCallback(
        (data) => {
            if (data.type === 'getSharingUrl') {
                setOptions(data.url);
            }
        },
        [setOptions],
    );

    return (
        <BlogScreenComponent
            // @ts-ignore
            url={url}
            renderLoading={() => <BlogPostSkeleton />}
            onPageLoad={onPageLoad}
            onPostMessage={onMessage}
        />
    );
};
