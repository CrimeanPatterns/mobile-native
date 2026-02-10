import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {SubmitButton} from '../../../components/form';
import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {useProfileData} from '../../../hooks/profile';
import API from '../../../services/api';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../../types/navigation';
import styles from './styles';

export type TOTPInitResponse = {
    secret: string;
    secret_formatted: string;
};

const TOTPButtonColor = isIOS ? Colors.blueDark : Colors.gold;
const TOTPButtonDarkColor = isIOS ? DarkColors.blueDark : DarkColors.gold;

const TOTPScreen: ProfileStackScreenFunctionalComponent<'TwoFactorAuthentication'> = ({navigation}) => {
    const isDark = useDark();
    const profile = useProfileData();
    const systemVersion = DeviceInfo.getSystemVersion();
    const [initData, setInitData] = useState<TOTPInitResponse | null>(null);
    const iconColors = useMemo(
        () => ({
            basic: isDark ? Colors.white : Colors.grayDark,
            accentIOS: isDark ? DarkColors.blue : Colors.blue,
            accentAndroid: isDark ? DarkColors.gold : Colors.gold,
        }),
        [isDark],
    );
    const iconSize = 80;
    const labelButton =
        isIOS && +systemVersion >= 15
            ? Translator.trans(/** @Desc("Set Up via iOS Password Manager") */ 'two-factor.ios-password-manager', {}, 'mobile-native')
            : Translator.trans('form.button.next', {}, 'messages');

    const getData = useCallback(async () => {
        const response = await API.get<TOTPInitResponse>('/profile/2factor/init');
        const {data} = response;

        if (_.isObject(data)) {
            setInitData(data);
        }
    }, []);

    const openAuthenticator = useCallback(() => {
        if (_.isObject(initData)) {
            const {UserEmail} = profile;
            const url = `otpauth://totp/AwardWallet:${UserEmail}?secret=${initData.secret}&issuer=AwardWallet`;

            Linking.openURL(url);
        }
    }, [initData, profile]);

    const openEnterCode = useCallback(() => {
        if (_.isObject(initData)) {
            const {secret} = initData;

            openAuthenticator();
            navigation.navigate('TOTPSetupCode', {secret});
        }
    }, [initData, navigation, openAuthenticator]);

    const openManualSetup = useCallback(() => {
        navigation.navigate('TOTPManualSetup', {initData});
    }, [initData, navigation]);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <View style={[styles.container, {height: iconSize}]}>
                    <Icon name='two-factor1' style={styles.icon} color={iconColors.basic} size={iconSize} />
                    <Icon name='two-factor2' style={styles.icon} color={isIOS ? iconColors.accentIOS : iconColors.accentAndroid} size={iconSize} />
                </View>
                <View style={styles.container}>
                    <Text style={[styles.text, styles.textTitle, isDark && styles.textDark]}>
                        {Translator.trans(/** @Desc("Add Extra Security%br%To Your Account!") */ 'two-factor.title', {br: '\n'}, 'mobile-native')}
                    </Text>
                </View>
                <View style={styles.container}>
                    <Text style={[styles.text, isDark && styles.textDark]}>
                        {Translator.trans(
                            /** @Desc("Two-factor authentication adds an extra layer of security to your account by requiring a unique one-time code when you log in to AwardWallet. A separate app will generate this one-time code outside of AwardWallet, such as 1Password, Google Authenticator, Authy, Duo Mobile, etc.") */ 'two-factor.message.what-is-two-factor',
                            {},
                            'mobile-native',
                        )}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <SubmitButton label={labelButton} onPress={openEnterCode} color={isDark ? TOTPButtonDarkColor : TOTPButtonColor} />
                    <TouchableOpacity style={styles.manually} onPress={openManualSetup}>
                        <Text style={[styles.text, styles.textLink, isDark && styles.textLinkDark]}>
                            {Translator.trans(/** @Desc("Set Up via Third-Party App") */ 'two-factor.third-party-app', {}, 'mobile-native')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

TOTPScreen.navigationOptions = () => ({
    title: Translator.trans('personal_info.site_settings.2factor', {}, 'messages'),
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

export {TOTPScreen, TOTPButtonColor, TOTPButtonDarkColor};
