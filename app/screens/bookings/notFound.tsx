import Translator from 'bazinga-translator';
import React from 'react';
import {ScrollView} from 'react-native';

import WarningMessage from '../../components/warningMessageWhite';
import {useProfileData} from '../../hooks/profile';
import EventEmitter from '../../services/eventEmitter';
import {useDark} from '../../theme';
import {BookingDetailsScreenFunctionalComponent} from '../../types/navigation';
import styles, {forbiddenStyles} from './details/styles';

export const BookingNotFound: BookingDetailsScreenFunctionalComponent<'NotFound'> = () => {
    const isDark = useDark();
    const {Login: login} = useProfileData();

    const doLogout = () => EventEmitter.emit('doLogout');

    return (
        <ScrollView style={[forbiddenStyles.page, isDark && styles.containerDark]} contentInsetAdjustmentBehavior='automatic'>
            <WarningMessage
                text={Translator.trans(
                    'error.booking-view.403.text',
                    {
                        user_login: `<b>${login}</b>`,
                        logout_url: '#logout',
                    },
                    'messages',
                )}
                onLinkPress={doLogout}
            />
        </ScrollView>
    );
};
