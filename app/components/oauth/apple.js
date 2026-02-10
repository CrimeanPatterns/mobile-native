import {appleAuth, appleAuthAndroid} from '@invertase/react-native-apple-authentication';
import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import {Colors} from '../../styles';
import {useTheme} from '../../theme';
import Icon from '../icon';
import {propsAreEqual, signIn, signInProvider as baseSignInProvider} from './index';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

const AppleButton = React.memo(({onPress, signUp}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const color = isDark ? Colors.white : Colors.black;
    let buttonCaption = Translator.trans('sign-in-btn.apple');

    if (signUp) {
        buttonCaption = Translator.trans('sign-up-btn.apple');
    }

    return (
        <TouchableItem onPress={onPress} testID='oauth-apple'>
            <View style={[styles.button, isDark && styles.buttonDark]} pointerEvents='box-only'>
                <View style={[styles.appleIcon, isDark && styles.appleIconDark]}>
                    <Icon name='apple' style={styles.relative} color={color} size={30} />
                </View>
                <Text style={[styles.text, isDark && styles.textDark]}>{buttonCaption}</Text>
            </View>
        </TouchableItem>
    );
}, propsAreEqual);

AppleButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    signUp: PropTypes.bool,
};

AppleButton.isSupported = isIOS ? appleAuth.isSupported : appleAuthAndroid.isSupported;
AppleButton.displayName = 'AppleButton';

export default AppleButton;

export const AppleIcon = React.memo(({size = 30, color = Colors.black}) => <Icon name='apple' color={color} size={size} />);

AppleIcon.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
};

async function signInProvider(config) {
    const {state} = config;
    let response;

    if (isIOS) {
        response = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.IMPLICIT,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            state,
        });
    } else {
        response = await baseSignInProvider(config);
    }

    return {
        ...response,
        ...config,
    };
}

export async function signInApple(config) {
    const provider = 'apple';
    const response = await signIn(provider, config, signInProvider);

    if (response.success) {
        return response;
    }

    return {[provider]: response};
}
