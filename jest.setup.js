import './app/services/translator';
import './app/assets/translations';

// eslint-disable-next-line import/no-extraneous-dependencies
import {configure} from 'enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

if (global.window === undefined) {
    global.window = global;
}

// trick the notifier in thinking it's not running in the remote debugger
global.nativeCallSyncHook = () => {};

jest.mock('react-native-keychain', () => ({
    ACCESS_CONTROL: {
        USER_PRESENCE: 'MOCK_USER_PRESENCE',
        BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'MOCK_BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
    },
    ACCESSIBLE: {
        WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'MOCK_WHEN_UNLOCKED_THIS_DEVICE_ONLY',
    },
    AUTHENTICATION_TYPE: {
        DEVICE_PASSCODE_OR_BIOMETRICS: 'MOCK_DEVICE_PASSCODE_OR_BIOMETRICS',
    },
    SECURITY_LEVEL: {
        ANY: 'MOCK_SECURITY_LEVEL_ANY',
        SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
        SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
    },
    STORAGE_TYPE: {
        RCA: 'MOCK_STORAGE_TYPE_RCA',
    },
    setGenericPassword: jest.fn().mockResolvedValue(),
    getGenericPassword: jest.fn().mockResolvedValue(),
    resetGenericPassword: jest.fn().mockResolvedValue(),
}));

jest.mock('react-navigation', () => {
    const View = require('react-native/Libraries/Components/View/View');

    return {
        withOrientation: (Component) => Component,
        withNavigation: (Component) => Component,
        withNavigationFocus: (Component) => Component,
        NavigationEvents: View,
        ThemeColors: {
            light: {},
            dark: {},
        },
    };
});

jest.mock('react-native/Libraries/AppState/AppState.js', () => {
    const listeners = {};

    return {
        currentState: 'background',
        addEventListener: (eventName, cb) => (listeners[eventName] = cb),
        removeEventListener: (eventName) => delete listeners[eventName],
        // eslint-disable-next-line consistent-return
        fireEvent: (eventName, appState) => {
            if (listeners[eventName]) {
                return listeners[eventName](appState);
            }
        },
    };
});

jest.mock('./app/storage', () => {
    const properties = {
        profile: {
            locale: 'en-US',
        },
    };

    return {
        getItem: jest.fn((property) => properties[property]),
        setItem: jest.fn((property, value) => (properties[property] = value)),
    };
});

global.Platform = {
    OS: process.env.TEST_PLATFORM || 'ios',
    select: (obj) => obj[this.OS],
};

jest.mock('./app/helpers/device', () => {
    const OS = process.env.TEST_PLATFORM || 'ios';

    return {
        isIOS: OS === 'ios',
        isAndroid: !this.isIOS,
        isTablet: false,
        deviceLocale: 'en_US',
    };
});

// eslint-disable-next-line func-names
jest.mock('@react-native-community/datetimepicker', function () {
    const mockComponent = jest.requireActual('react-native/jest/mockComponent');

    return mockComponent('@react-native-community/datetimepicker');
});

// eslint-disable-next-line func-names
jest.mock('@react-native-picker/picker', function () {
    const mockComponent = jest.requireActual('react-native/jest/mockComponent');

    return mockComponent('@react-native-picker/picker');
});

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
