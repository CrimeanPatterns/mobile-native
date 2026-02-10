import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {isAndroid} from '../../../helpers/device';
import Intro from '../../../services/intro';
import NotificationManager from '../../../services/notification';
import {Colors, DarkColors} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import {SubmitButton} from '../../form';
import {Header} from '../../page/header';
import HeaderButton from '../../page/header/button';
import {BackgroundNotificationsImage} from '../backgroundImage/backgroundNotifications';
import styles, {introColors} from '../styles';

class NotificationsIntro extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onComplete: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            visibleButton: true,
        };

        this.onPress = this.onPress.bind(this);
    }

    async onPress() {
        const {onComplete} = this.props;

        await NotificationManager.requestNotificationsPermission();

        const status = onComplete();

        Intro.performedNotifications();

        if (status === 'next') {
            setTimeout(() => this.setState({visibleButton: false}), 300);
        }
    }

    get headerButton() {
        const {closeIntro} = this.props;

        return <HeaderButton onPress={closeIntro} iconName='android-clear' />;
    }

    renderImage() {
        return <BackgroundNotificationsImage />;
    }

    render() {
        const {visibleButton} = this.state;
        const {theme} = this.props;

        return (
            <View style={{flex: 1}}>
                {this.renderImage()}
                <Header
                    fullScreen={isAndroid}
                    headerLeft={this.headerButton}
                    headerColor={isAndroid ? this.selectColor(Colors.blueDark, DarkColors.bgLight) : undefined}
                    title={Translator.trans(/** @Desc("Notifications Permission") */ 'intro.notifications-title', {}, 'mobile-native')}
                />
                <View style={styles.content}>
                    <Text style={[styles.title, this.isDark && styles.textDark, styles.textBold]}>
                        {'AwardWallet works better if you allow push notifications.'}
                    </Text>
                    <Text style={[styles.text, styles.containerInner, this.isDark && styles.textDark]}>
                        {
                            'We will deliver mile expiration warnings and flight delay alerts via these notifications. You can control which specific notifications you want to receive from us by navigating to your profile settings.'
                        }
                    </Text>
                    {visibleButton && (
                        <SubmitButton
                            onPress={this.onPress}
                            label={Translator.trans(/** @Desc("Enable Push Notifications") */ 'intro.notifications-button.ios', {}, 'mobile-native')}
                            raised
                            color={this.selectColor(introColors.buttonColor, introColors.buttonColorDark)}
                            theme={theme}
                        />
                    )}
                </View>
            </View>
        );
    }
}

export default NotificationsIntro;
