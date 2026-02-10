import {ProfileList} from '@components/profile';
import {useProfileData} from '@hooks/profile';
import Translator from 'bazinga-translator';
import React from 'react';

import {Colors, DarkColors, Fonts} from '../../styles';
import {ColorSchemeDark} from '../../theme';
import {ProfileStackScreenFunctionalComponent} from '../../types/navigation';

const ProfileScreen: ProfileStackScreenFunctionalComponent<'Profile'> = ({navigation, route}) => {
    const profile = useProfileData();

    return <ProfileList navigation={navigation} route={route} profile={profile} />;
};

// @ts-ignore
ProfileScreen.navigationOptions = ({theme}) => {
    const isDark = theme === ColorSchemeDark;

    return {
        title: Translator.trans('menu.userinfo.profile', {}, 'menu'),
        headerLargeTitle: true,
        headerLargeStyle: {
            backgroundColor: isDark ? DarkColors.bg : Colors.grayLight,
        },
        headerLargeTitleStyle: {
            fontFamily: Fonts.regular,
        },
    };
};

export {ProfileScreen};
