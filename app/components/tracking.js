import React from 'react';
import {View} from 'react-native';
import Config from 'react-native-config';
import RootSiblings from 'react-native-root-siblings';
import WebView from 'react-native-webview';

const {API_URL} = Config;

export const TrackingWebView = React.memo(
    // eslint-disable-next-line react/prop-types
    ({trackingId, callback}) => (
        <View
            style={{
                position: 'absolute',
                left: 0,
                top: -9999,
            }}>
            <WebView
                source={{
                    uri: `${API_URL}/m/api/external-tracking/${trackingId}`,
                }}
                onLoadEnd={callback}
                sharedCookiesEnabled
                originWhitelist={['*']}
            />
        </View>
    ),
    () => true,
);

export class Tracking {
    static track(trackingId) {
        let element;
        const callback = () => element && element.destroy();

        element = new RootSiblings(<TrackingWebView trackingId={trackingId} callback={callback} />);

        return element;
    }
}
