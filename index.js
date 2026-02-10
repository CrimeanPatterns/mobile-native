import 'react-native-gesture-handler';
import './app/storage';

import _ from 'lodash';
import {AppRegistry, LogBox} from 'react-native';
import Config from 'react-native-config';

import {name as appName} from './app.json';
import App from './app/app';
import {initBugsnag} from './app/bugsnag';

if (!__DEV__) {
    initBugsnag();
}

console.ignoredYellowBox = ['Setting a timer', 'new NativeEventEmitter()'];

if (!__DEV__) {
    console.log = () => {};
    console.time = () => {};
    console.timeLog = () => {};
    console.timeEnd = () => {};
    console.warn = () => {};
    console.count = () => {};
    console.countReset = () => {};
    console.error = () => {};
    console.info = () => {};
} else {
    const ignoreLogs = [
        'ViewPropTypes will be removed from React Native',
        'ColorPropType will be removed from React Native',
        'EdgeInsetsPropType will be removed from React Native',
        'PointPropType will be removed from React Native',
    ];
    const error = console.error;

    console.error = (...arg) => {
        for (const log of ignoreLogs) {
            if (arg && _.isString(arg[0]) && arg[0].startsWith(log)) {
                return;
            }
        }
        error(...arg);
    };
    LogBox.ignoreLogs(ignoreLogs);
}

const isHermes = () => !!global.HermesInternal;

console.log('Hermes:', isHermes());

if (__DEV__ && Config.STORYBOOK_ENABLED) {
    AppRegistry.registerComponent(appName, () => require('./.storybook/index').default);
} else {
    AppRegistry.registerComponent(appName, () => App);
}
