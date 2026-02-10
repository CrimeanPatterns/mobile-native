import Clipboard from '@react-native-clipboard/clipboard';
import {useDimensions} from '@react-native-community/hooks';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import RNFlashMessage, {showMessage} from 'react-native-flash-message';
import HTML from 'react-native-render-html';
import Share from 'react-native-share';
import ViewShot, {captureRef} from 'react-native-view-shot';

// @ts-ignore
import IconBackground from '../../../assets/images/bg-square.svg';
import {SubmitButton} from '../../../components/form';
import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {useProfileData, useProfileScreenReload} from '../../../hooks/profile';
import {Colors} from '../../../styles';
import {useDark} from '../../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../../types/navigation';
import {TOTPButtonColor, TOTPButtonDarkColor} from './index';
import styles from './styles';

const TOTPCompleteSetupScreen: ProfileStackScreenFunctionalComponent<'TOTPCompleteSetup'> = ({navigation, route}) => {
    const isDark = useDark();
    const reload = useProfileScreenReload();
    const recoveryCode = route.params.recovery;
    const viewRef = useRef<ViewShot>(null);
    const flashMessageRef = useRef<RNFlashMessage>(null);
    const {UserEmail} = useProfileData();
    const {
        window: {width: windowWidth},
    } = useDimensions();
    const iconSize = 50;

    const copyKey = useCallback(() => {
        Clipboard.setString(recoveryCode);

        if (isIOS) {
            showMessage({
                message: 'Recovery Key saved to clipboard',
                type: 'default',
            });
        } else {
            ToastAndroid.showWithGravityAndOffset('Recovery Key saved to clipboard', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 200);
        }
    }, [recoveryCode]);

    const saveKey = useCallback(async () => {
        const uri = await captureRef(viewRef, {
            format: 'jpg',
            quality: 1,
        });

        if (_.isString(uri)) {
            await Share.open({url: uri});
        }
    }, []);

    const completeSetup = useCallback(async () => {
        navigation.navigate('Profile');
    }, [navigation]);

    useEffect(() => reload(), []);
    const renderShot = useCallback(
        () => (
            <View style={[{position: 'absolute', bottom: -windowWidth - 1}]}>
                <ViewShot ref={viewRef} options={{format: 'jpg', quality: 1}}>
                    <View style={[{position: 'absolute'}]}>
                        <IconBackground width={windowWidth} height={windowWidth} />
                    </View>
                    <View
                        style={[
                            {
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: windowWidth,
                                height: windowWidth,
                            },
                        ]}>
                        <Icon name='logo-monotone' size={30} color={Colors.white} style={{marginBottom: 30}} />
                        <View style={{height: iconSize, marginBottom: 15, alignItems: 'center', width: windowWidth}}>
                            <Icon name='two-factor1' style={styles.icon} color={Colors.white} size={iconSize} />
                            <Icon name='two-factor2' style={styles.icon} color={Colors.white} size={iconSize} />
                        </View>
                        <Text style={[styles.text, {color: Colors.white}, styles.textTitle, {marginBottom: 15}]}>Recovery Key</Text>
                        <Text style={[styles.text, {color: Colors.white, marginBottom: 15}]}>{UserEmail}</Text>
                        <View style={{paddingVertical: 5, paddingHorizontal: 20, borderRadius: 5, backgroundColor: Colors.white}}>
                            <Text style={[styles.text]}>{recoveryCode}</Text>
                        </View>
                    </View>
                </ViewShot>
            </View>
        ),
        [UserEmail, recoveryCode, windowWidth],
    );

    return (
        <>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <View style={styles.container}>
                    <HTML
                        source={{html: Translator.trans('two-factor.confirm.instruction', {}, 'messages')}}
                        baseFontStyle={{...styles.text, ...(isDark && styles.textDark)}}
                        tagsStyles={{
                            strong: styles.strong,
                        }}
                    />
                </View>
                <View style={styles.container}>
                    <Text style={[styles.text, styles.textTitle, isDark && styles.textDark]}>{recoveryCode}</Text>
                    <TouchableOpacity onPress={copyKey}>
                        <Text style={[styles.text, styles.textLink, isDark && styles.textLinkDark]}>
                            {Translator.trans(/** @Desc("Copy Key") */ 'two-factor.copy-key', {}, 'mobile-native')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={[styles.container, styles.text, isDark && styles.textDark]}>
                    {Translator.trans('two-factor.confirm.instruction2', {}, 'messages')}
                </Text>
                <View style={styles.footer}>
                    <SubmitButton
                        onPress={saveKey}
                        label={Translator.trans(/** @Desc("Save Recovery Key") */ 'two-factor.save-key', {}, 'mobile-native')}
                        color={isDark ? TOTPButtonDarkColor : TOTPButtonColor}
                    />
                    <TouchableOpacity style={styles.manually} onPress={completeSetup}>
                        <Text style={[styles.text, styles.textLink, isDark && styles.textLinkDark]}>
                            {Translator.trans(/** @Desc("Done") */ 'button.done', {}, 'mobile-native')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {renderShot()}
            <RNFlashMessage ref={flashMessageRef} autoHide hideStatusBar={false} duration={3000} />
        </>
    );
};

TOTPCompleteSetupScreen.navigationOptions = () => ({
    title: Translator.trans('two-factor.recovery-key', {}, 'mobile-native'),
});

export default TOTPCompleteSetupScreen;
