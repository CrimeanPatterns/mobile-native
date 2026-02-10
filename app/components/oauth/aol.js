import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {getTouchableComponent} from '../../helpers/touchable';
import {Colors} from '../../styles';
import {useDark, useTheme} from '../../theme';
import Icon from '../icon';
import {propsAreEqual, signIn, signInProvider} from './index';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

const AolButton = React.memo(({onPress, signUp}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    let buttonCaption = Translator.trans('award.mailbox.aol', {}, 'messages');

    if (signUp) {
        buttonCaption = Translator.trans('sign-up-btn.aol');
    }

    return (
        <TouchableItem onPress={onPress} testID='oauth-aol'>
            <View style={[styles.button, isDark && styles.buttonDark]} pointerEvents='box-only'>
                <View style={[styles.iconContainer]}>
                    <AolIcon />
                </View>
                <Text style={[styles.text, isDark && styles.textDark]}>{buttonCaption}</Text>
            </View>
        </TouchableItem>
    );
}, propsAreEqual);

AolButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    signUp: PropTypes.bool,
};

AolButton.displayName = 'AolButton';

export default AolButton;

// eslint-disable-next-line react/prop-types
export const AolIcon = React.memo(({size = 30}) => {
    const isDark = useDark();

    return (
        <View style={{alignSelf: 'center'}}>
            <Icon name='aol' style={styles.relative} color={isDark ? Colors.white : Colors.black} size={size} />
        </View>
    );
});

export async function signInAol(config) {
    const provider = 'aol';

    const response = await signIn(provider, config, signInProvider);

    if (response.success) {
        return response;
    }

    return {[provider]: response};
}
