import {Platform, Share} from 'react-native';

function shareUrl(url) {
    const content = Platform.select({
        ios: {url},
        android: {message: url},
    });

    Share.share(content);
}

// eslint-disable-next-line import/prefer-default-export
export {shareUrl};
