module.exports = {
    project: {
        android: {
            sourceDir: './android',
        },
        ios: {
            sourceDir: './ios',
        },
    },
    assets: ['./assets/'],
    dependencies: {
        'react-native-push-notification': {
            platforms: {
                ios: null, // disable iOS platform, other platforms will still autolink if provided
            },
        },
        'react-native-simple-native-geofencing': {
            platforms: {
                ios: null, // disable iOS platform, other platforms will still autolink if provided
            },
        },
    },
};
