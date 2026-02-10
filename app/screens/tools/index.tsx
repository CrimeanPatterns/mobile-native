import Icon from '@components/icon';
import {TouchableBackground} from '@components/page/touchable';
import SmallButton from '@components/tools/cards/smallButton';
import TravelStatistics from '@components/tools/cards/travelStatistics';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {CardGrid} from '../../components/tools/cards';
import Profile from '../../components/tools/cards/profile';
import SubscriptionPlus from '../../components/tools/cards/subscriptionPlus';
import {isAndroid} from '../../helpers/device';
import {useProfileData} from '../../hooks/profile';
import eventEmitter from '../../services/eventEmitter';
import {Colors, DarkColors} from '../../styles';
import {useDark} from '../../theme';
import {ToolsStackScreenFunctionalComponent} from '../../types/navigation';
import styles from './styles';

const ToolsScreen: ToolsStackScreenFunctionalComponent<'Tools'> = ({navigation}) => {
    const isDark = useDark();
    const profile = useProfileData();
    const insets = useSafeAreaInsets();
    const {IsTrial, FullName, UserEmail, AvatarImage, Free, travelSummary} = profile;

    const navigateProfile = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('Profile');
    }, [navigation]);

    const navigateTransferTimes = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('TransferTimes');
    }, [navigation]);

    const navigateMileValue = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('MileValue');
    }, [navigation]);

    const navigateTravelSummary = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('ModalScreens', {screen: 'TravelSummary'});
    }, [navigation]);

    const navigateSubscriptionPayment = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('ModalScreens', {screen: 'SubscriptionPayment'});
    }, [navigation]);

    const navigateBookings = useCallback((): void => {
        // @ts-ignore
        navigation.navigate('Bookings');
    }, [navigation]);

    const navigateFAQs = useCallback((): void => {
        navigation.navigate('FAQs');
    }, [navigation]);

    const navigateNotification = useCallback((): void => {
        navigation.navigate('Profile', {
            screen: 'ProfileEdit',
            params: {formLink: '/profile/notifications/push'},
        });
    }, [navigation]);

    const navigateContactUs = useCallback((): void => {
        navigation.navigate('ContactUs');
    }, [navigation]);

    const navigateAboutUs = useCallback((): void => {
        navigation.navigate('AboutUs');
    }, [navigation]);

    const navigatePrivacyNotice = useCallback((): void => {
        navigation.navigate('PrivacyNotice');
    }, [navigation]);

    const navigateTermsOfUse = useCallback((): void => {
        navigation.navigate('Terms');
    }, [navigation]);

    const logout = useCallback((): void => {
        eventEmitter.emit('doLogout');
    }, []);

    const renderLogout = useCallback(
        () => (
            <>
                <Icon name={'menu-logout'} size={20} color={isDark ? Colors.white : Colors.grayDark} style={styles.logoutIcon} />
                <Text style={[styles.text, styles.logoutText, isDark && styles.logoutTextDark]}>
                    {Translator.trans('menu.button.logout', {}, 'menu')}
                </Text>
            </>
        ),
        [isDark],
    );

    return (
        <ScrollView style={[styles.page, isDark && styles.pageDark]} automaticallyAdjustContentInsets>
            <View style={{height: isAndroid ? 0 : insets.top}} />
            <View style={styles.profileWrap}>
                <Profile Free={Free} AvatarImage={AvatarImage} FullName={FullName} UserEmail={UserEmail} onPress={navigateProfile} />
                <View style={styles.smallButtonWrap}>
                    <SmallButton icon={'settings'} onPress={navigateProfile} />
                    <SmallButton icon={'menu-notifications'} onPress={navigateNotification} />
                </View>
            </View>
            {_.isObject(travelSummary) && Object.keys(travelSummary).length > 0 && (
                <TravelStatistics travelSummary={travelSummary} navigateTravelSummary={navigateTravelSummary} />
            )}
            {(Free || IsTrial) && (
                <View style={styles.gridColumn}>
                    <SubscriptionPlus onPress={navigateSubscriptionPayment} />
                </View>
            )}
            <View style={styles.gridRow}>
                <CardGrid
                    type='transferTimes'
                    icon='menu-transfer-times'
                    name={Translator.trans('transfer_times', {}, 'messages')}
                    onPress={navigateTransferTimes}
                    style={styles.indentCardGridSmall}
                />
                <CardGrid
                    type='mileValue'
                    icon='menu-mile-values'
                    name={Translator.trans('point-mile-values', {}, 'messages')}
                    onPress={navigateMileValue}
                />
            </View>
            <View style={styles.gridRow}>
                <CardGrid
                    type='bookings'
                    icon='menu-booking'
                    name={Translator.trans('award-booking-service', {}, 'menu')}
                    onPress={navigateBookings}
                    style={styles.indentCardGridSmall}
                />
                <CardGrid
                    type='faqs'
                    icon='menu-faqs'
                    name={Translator.trans('menu.faqs', {}, 'menu')}
                    onPress={navigateFAQs}
                />
            </View>
            <View style={styles.gridRow}>
                <CardGrid
                    type='aboutUs'
                    icon='menu-about-new'
                    name={Translator.trans('about.us.link', {}, 'messages')}
                    onPress={navigateAboutUs}
                    style={styles.indentCardGridSmall}
                />
                <CardGrid
                    type='contactUs'
                    icon='menu-contact-us-new'
                    name={Translator.trans('menu.contact-us', {}, 'menu')}
                    onPress={navigateContactUs}
                />
            </View>
            <View style={styles.gridRow}>
                <CardGrid
                    type='privacyNotice'
                    icon='menu-privacy-new'
                    name={Translator.trans('privacy.notice.link', {}, 'messages')}
                    onPress={navigatePrivacyNotice}
                    style={styles.indentCardGridSmall}
                />
                <CardGrid
                    type='termsOfUse'
                    icon='menu-terms-new'
                    name={Translator.trans('menu.terms-of-use', {}, 'menu')}
                    onPress={navigateTermsOfUse}
                />
            </View>

            {isAndroid ? (
                <View style={{overflow: 'hidden'}}>
                    <TouchableBackground
                        rippleColor={isDark ? DarkColors.bgLight : Colors.gray}
                        activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                        style={styles.logoutWrap}
                        onPress={logout}>
                        {renderLogout()}
                    </TouchableBackground>
                </View>
            ) : (
                <TouchableOpacity style={[styles.logoutWrap]} onPress={logout}>
                    {renderLogout()}
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

ToolsScreen.navigationOptions = () => ({
    headerLargeTitle: true,
    header: () => null,
});

export {ToolsScreen};
