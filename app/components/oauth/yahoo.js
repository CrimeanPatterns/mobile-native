import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {getTouchableComponent} from '../../helpers/touchable';
import {Colors} from '../../styles';
import {CorporateColors} from '../../styles/corporate';
import {useTheme} from '../../theme';
import Icon from '../icon';
import {propsAreEqual, signIn, signInProvider} from './index';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

const YahooButton = React.memo(({onPress, signUp}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const color = isDark ? Colors.white : CorporateColors.yahoo;
    let buttonCaption = Translator.trans('award.mailbox.yahoo', {}, 'messages');

    if (signUp) {
        buttonCaption = Translator.trans('sign-up-btn.yahoo');
    }

    return (
        <TouchableItem onPress={onPress} testID='oauth-yahoo'>
            <View style={[styles.button, isDark && styles.buttonDark]} pointerEvents='box-only'>
                <View style={[styles.yahooIcon, isDark && styles.yahooIconDark]}>
                    <Icon name='yahoo' style={styles.relative} color={color} size={30} />
                </View>
                <Text style={[styles.text, isDark && styles.textDark]}>{buttonCaption}</Text>
            </View>
        </TouchableItem>
    );
}, propsAreEqual);

YahooButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    signUp: PropTypes.bool,
};

YahooButton.displayName = 'YahooButton';

export default YahooButton;

export const YahooIcon = React.memo(({size = 30, color = CorporateColors.yahoo}) => <Icon name='yahoo' color={color} size={size} />);

YahooIcon.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
};

export async function signInYahoo(config) {
    const provider = 'yahoo';

    const response = await signIn(provider, config, signInProvider);

    if (response.success) {
        return response;
    }

    return {[provider]: response};
}
