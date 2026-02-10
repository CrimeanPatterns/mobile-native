import {NativeModules, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const deviceLocale = Platform.select({
    ios:
        NativeModules.SettingsManager &&
        (NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]),
    android: NativeModules.I18nManager.localeIdentifier,
});
export const isIOS = Platform.OS === 'ios';
export const isAndroid = !isIOS;
export const isTablet = DeviceInfo.isTablet();
export const osVersion = DeviceInfo.getSystemVersion();
