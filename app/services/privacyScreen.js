import Config from 'react-native-config';
import RNPrivacyScreen from 'react-native-privacy-screen';

export default {
    enable() {
        if (Config.ANDROID_DISABLE_SCREENSHOTS === String(true)) {
            RNPrivacyScreen.enable();
        }
    },
    disable() {
        if (Config.ANDROID_DISABLE_SCREENSHOTS === String(true)) {
            RNPrivacyScreen.disable();
        }
    },
};
