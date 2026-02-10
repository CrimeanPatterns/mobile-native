import {Linking} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

export function openExternalUrl(options: {external?: boolean; url: string}): void {
    if (options.external) {
        InAppBrowser.open(options.url);
    } else {
        Linking.canOpenURL(options.url).then((supported) => supported && Linking.openURL(options.url));
    }
}
