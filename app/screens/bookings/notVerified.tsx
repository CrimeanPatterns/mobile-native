import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {Platform, ScrollView, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';

import {Button} from '../../components/form';
import HTML from '../../components/html';
import WarningMessageOrange from '../../components/warningMessage';
import {useForceUpdate} from '../../hooks/forceUpdate';
import {PathConfig} from '../../navigation/linking';
import {API_URL} from '../../services/api';
import BookingService from '../../services/booking';
import {resetByPath} from '../../services/navigator';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../theme';
import {BookingDetailsScreenFunctionalComponent} from '../../types/navigation';
import styles, {notVerifiedStyles} from './details/styles';

export const BookingNotVerified: BookingDetailsScreenFunctionalComponent<'NotVerified'> = ({navigation, route}) => {
    const theme = useTheme();
    const forceUpdate = useForceUpdate();
    const [resending, setResending] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);
    const isDark = theme === ColorSchemeDark;
    const themeColors = ThemeColors[theme];
    const buttonColor = Platform.select({ios: themeColors.blue, android: themeColors.gold});
    const {requestId, conf: confNo} = route.params;
    const request = BookingService.getRequest(parseInt(requestId, 10));

    const onPressResend = useCallback(async () => {
        setResending(true);
        try {
            await BookingService.resend(requestId);
            showMessage({
                message: Translator.trans('request.email.re-sent', {}, 'booking'),
                type: 'success',
            });
        } finally {
            setResending(false);
        }
    }, [requestId]);

    const onPressEditRequest = useCallback(
        () =>
            // @ts-ignore
            navigation.navigate('InternalPage', {
                url: `${API_URL}/awardBooking/edit/${requestId}?fromapp=1&KeepDesktop=1`,
            }),
        [navigation, requestId],
    );

    useEffect(() => {
        async function confirmEmail(requestId, confNo) {
            if (request && _.isString(confNo)) {
                setVerificationLoading(true);
                try {
                    await BookingService.verify(requestId, confNo);
                    await forceUpdate();
                    resetByPath(PathConfig.BookingDetails, {requestId});
                } finally {
                    setVerificationLoading(false);
                }
            }
        }
        confirmEmail(requestId, confNo);
    }, [requestId, confNo]);

    return (
        <ScrollView style={[notVerifiedStyles.page, isDark && styles.containerDark]} contentInsetAdjustmentBehavior='automatic'>
            <WarningMessageOrange text={Translator.trans('request.not-complete', {}, 'booking')} />
            <View style={notVerifiedStyles.p}>
                <HTML html={Translator.trans('request.not-verified', {requestId}, 'booking')} />
            </View>
            <View style={notVerifiedStyles.p}>
                <HTML html={Translator.trans('not-verified.popup.text2', {booker: request.bookerName}, 'booking')} />
            </View>
            <View style={notVerifiedStyles.buttonContainer}>
                {!verificationLoading && (
                    <>
                        <View style={notVerifiedStyles.button}>
                            <Button
                                color={buttonColor}
                                onPress={onPressEditRequest}
                                label={Translator.trans('button.edit')}
                                raised
                                customStyle={{
                                    label: {
                                        base: notVerifiedStyles.buttonLabel,
                                    },
                                }}
                            />
                        </View>
                        <View style={notVerifiedStyles.button}>
                            <Button
                                color={buttonColor}
                                loading={resending}
                                onPress={onPressResend}
                                label={Translator.trans('button.resend')}
                                raised
                                customStyle={{
                                    label: {
                                        base: notVerifiedStyles.buttonLabel,
                                    },
                                }}
                            />
                        </View>
                    </>
                )}
                {verificationLoading && (
                    <View style={notVerifiedStyles.button}>
                        <Button
                            color={buttonColor}
                            loading={true}
                            onPress={_.noop}
                            label={Translator.trans('loading', {}, 'mobile-native')}
                            raised
                            customStyle={{
                                label: {
                                    base: notVerifiedStyles.buttonLabel,
                                },
                            }}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
