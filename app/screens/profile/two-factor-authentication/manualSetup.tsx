import Clipboard from '@react-native-clipboard/clipboard';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useState} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {SubmitButton} from '../../../components/form';
import Skeleton from '../../../components/page/skeleton';
import {isIOS} from '../../../helpers/device';
import {useDark} from '../../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../../types/navigation';
import {TOTPButtonColor, TOTPButtonDarkColor, TOTPInitResponse} from './index';
import styles from './styles';

const TOTPManualSetupScreen: ProfileStackScreenFunctionalComponent<'TOTPManualSetup'> = ({navigation, route}) => {
    const isDark = useDark();
    const [initData] = useState<TOTPInitResponse>(route.params.initData);

    const copyKey = useCallback(() => {
        if (_.isObject(initData)) {
            const {secret} = initData;

            Clipboard.setString(secret);

            if (isIOS) {
                showMessage({
                    message: 'Key copied to clipboard',
                    type: 'default',
                });
            } else {
                ToastAndroid.showWithGravityAndOffset('Key copied to clipboard', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 200);
            }
        }
    }, [initData]);

    const openEnterCode = useCallback(() => {
        if (_.isObject(initData)) {
            const {secret} = initData;

            navigation.navigate('TOTPSetupCode', {secret});
        }
    }, [initData, navigation]);

    const renderCode = useCallback(() => {
        if (_.isObject(initData)) {
            return (
                <>
                    <Text style={[styles.text, styles.textTitle, isDark && styles.textDark]}>{initData.secret_formatted}</Text>
                    <TouchableOpacity style={styles.copyKey} onPress={copyKey}>
                        <Text style={[styles.text, styles.textLink, isDark && styles.textLinkDark]}>
                            {Translator.trans(/** @Desc("Copy Key") */ 'two-factor.copy-key', {}, 'mobile-native')}
                        </Text>
                    </TouchableOpacity>
                </>
            );
        }

        return <Skeleton layout={[{key: 'secret', width: 200, height: 25}]} />;
    }, [initData, isDark, copyKey]);

    return (
        <View style={[styles.page, isDark && styles.pageDark]}>
            <View style={styles.container}>{renderCode()}</View>
            <Text style={[styles.container, styles.text, isDark && styles.textDark]}>
                {Translator.trans(
                    /** @Desc("To set up two-factor authentication manually, please copy the key above and paste it into the authentication app of your choice, such as 1Password, Google Authenticator, Authy, Duo Mobile, etc. Once done your app will start generating a random one-time code every 30 seconds, please copy this code and press Next below.") */ 'two-factor.instruction',
                    {},
                    'mobile-native',
                )}
            </Text>
            <View style={styles.footer}>
                <SubmitButton
                    label={Translator.trans('form.button.next', {}, 'messages')}
                    onPress={openEnterCode}
                    color={isDark ? TOTPButtonDarkColor : TOTPButtonColor}
                />
            </View>
        </View>
    );
};

TOTPManualSetupScreen.navigationOptions = () => ({
    title: Translator.trans('personal_info.site_settings.2factor', {}, 'messages'),
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

export {TOTPManualSetupScreen};
