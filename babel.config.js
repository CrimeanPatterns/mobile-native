module.exports = function transform(api) {
    const resolvePath = require('babel-plugin-module-resolver/lib/resolvePath').default;
    const env = api.env();

    api.cache(false);

    const presets = ['module:@react-native/babel-preset'];
    const plugins = [
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
        [
            require.resolve('babel-plugin-module-resolver'),
            {
                alias: {
                    'bazinga-translator': './app/services/translator.js',
                    '@assets': './app/assets',
                    '@components': './app/components',
                    '@hooks': './app/hooks',
                    '@screens': './app/screens',
                    '@services': './app/services',
                    '@stacks': './app/stacks',
                    '@theme': './app/theme',
                    '@styles': './app/styles',
                },

                resolvePath: (sourcePath, currentFile, opts) => {
                    if (currentFile.includes('translator.js')) {
                        return undefined;
                    }

                    return resolvePath(sourcePath, currentFile, opts);
                },
            },
        ],
    ];

    if (env === 'undefined' || !env || env === 'production') {
        plugins.push('transform-remove-console');
        plugins.push('react-native-paper/babel');
    }

    plugins.push('@babel/plugin-transform-named-capturing-groups-regex');
    plugins.push('react-native-reanimated/plugin');

    return {
        presets,
        plugins,
    };
};
