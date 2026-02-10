import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import {CorporateColors} from '../../styles/corporate';
import {useTheme} from '../../theme';
import Icon from '../icon';
import {changeStatusBarStyle, propsAreEqual, resetStatusBarStyle, signIn} from './index';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

const GoogleButton = React.memo(({onPress, signUp}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    let buttonCaption = Translator.trans('award.mailbox.google', {}, 'messages');

    if (signUp) {
        buttonCaption = Translator.trans('sign-up-btn.google');
    }

    return (
        <TouchableItem onPress={onPress} testID='oauth-google'>
            <View style={[styles.button, isDark && styles.buttonDark]} pointerEvents='box-only'>
                <View style={[styles.googleIcon, isDark && styles.googleIconDark]}>
                    <GoogleIcon />
                </View>
                <Text style={[styles.text, isDark && styles.textDark]}>{buttonCaption}</Text>
            </View>
        </TouchableItem>
    );
}, propsAreEqual);

GoogleButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    signUp: PropTypes.bool,
};

GoogleButton.displayName = 'GoogleButton';

export default GoogleButton;

export const GoogleIcon = React.memo(({size = 30}) => (
    <View style={{alignSelf: 'center'}}>
        <Icon name='google-path1' style={styles.relative} color={CorporateColors.google.blue} size={size} />
        <Icon name='google-path2' style={styles.absolute} color={CorporateColors.google.red} size={size} />
        <Icon name='google-path3' style={styles.absolute} color={CorporateColors.google.orange} size={size} />
        <Icon name='google-path4' style={styles.absolute} color={CorporateColors.google.green} size={size} />
    </View>
));

GoogleIcon.propTypes = {
    size: PropTypes.number,
};

async function signInProvider(additionalConfig) {
    let response;
    const {incrementalAuthScopes, scopes} = additionalConfig;
    const {additional, base} = incrementalAuthScopes;

    GoogleSignin.configure({
        ...additionalConfig,
        scopes: isIOS ? base : scopes,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
    });

    changeStatusBarStyle();

    try {
        await GoogleSignin.signOut();
        response = await GoogleSignin.signIn();

        if (isIOS) {
            if (_.isArray(additional) && _.isEmpty(additional) === false) {
                try {
                    response = await GoogleSignin.addScopes({
                        scopes: additional,
                    });
                } catch {
                    //
                }
            }
        }

        if (_.isString(response.serverAuthCode)) {
            const {serverAuthCode} = response;

            response = {
                serverAuthCode,
            };
        }
    } finally {
        resetStatusBarStyle();
    }

    return {
        ...response,
        ...additionalConfig,
    };
}

export async function signInGoogle(config) {
    const provider = 'google';
    const response = await signIn(provider, config, signInProvider);

    if (response.success) {
        return response;
    }

    return {[provider]: response};
}
