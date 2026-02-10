import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export function triggerHapticFeedback(type: ReactNativeHapticFeedback.HapticFeedbackTypes): void {
    const options = {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
    };

    ReactNativeHapticFeedback.trigger(type, options);
}
