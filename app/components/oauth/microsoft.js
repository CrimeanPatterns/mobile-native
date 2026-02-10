import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {getTouchableComponent} from '../../helpers/touchable';
import {CorporateColors} from '../../styles/corporate';
import {useTheme} from '../../theme';
import Icon from '../icon';
import {propsAreEqual, signIn, signInProvider} from './index';
import {styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

const MicrosoftButton = React.memo(({onPress, signUp}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    let buttonCaption = Translator.trans('award.mailbox.misrosoft', {}, 'messages');

    if (signUp) {
        buttonCaption = Translator.trans('sign-up-btn.microsoft');
    }

    return (
        <TouchableItem onPress={onPress} testID='oauth-microsoft'>
            <View style={[styles.button, isDark && styles.buttonDark]} pointerEvents='box-only'>
                <View style={[styles.iconContainer]}>
                    <MicrosoftIcon />
                </View>
                <Text style={[styles.text, isDark && styles.textDark]}>{buttonCaption}</Text>
            </View>
        </TouchableItem>
    );
}, propsAreEqual);

MicrosoftButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    signUp: PropTypes.bool,
};

MicrosoftButton.displayName = 'MicrosoftButton';

export default MicrosoftButton;

export const MicrosoftIcon = React.memo(({size = 30}) => (
    <View style={{alignSelf: 'center'}}>
        <Icon name='microsoft-path1' style={styles.relative} color={CorporateColors.microsoft.red} size={size} />
        <Icon name='microsoft-path2' style={styles.absolute} color={CorporateColors.microsoft.green} size={size} />
        <Icon name='microsoft-path3' style={styles.absolute} color={CorporateColors.microsoft.blue} size={size} />
        <Icon name='microsoft-path4' style={styles.absolute} color={CorporateColors.microsoft.orange} size={size} />
    </View>
));

MicrosoftIcon.propTypes = {
    size: PropTypes.number,
};

export async function signInMicrosoft(config) {
    const provider = 'microsoft';

    const response = await signIn(provider, config, signInProvider);

    if (response.success) {
        return response;
    }

    return {[provider]: response};
}
