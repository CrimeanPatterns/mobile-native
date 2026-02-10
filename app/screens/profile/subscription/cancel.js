import Translator from 'bazinga-translator';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';
import {WebView} from 'react-native-webview';

import Spinner from '../../../components/spinner';
import {getMainColor} from '../../../helpers/header';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {SubscriptionInfo} from './info';

class SubscriptionCancel extends SubscriptionInfo {
    static navigationOptions = () => ({
        title: Translator.trans('subscription.cancel', {}, 'messages'),
    });

    getSubscriptionPlatform = () => {
        const {route} = this.props;

        return route?.params?.platform ?? 'ios';
    };

    getMessage() {
        const placeholders = {
            start_list: '<ol>',
            end_list: '</ol>',
            start_list_item: '<li>',
            end_list_item: '</li>',
        };
        const messages = {
            ios: Translator.trans(
                /** @Desc("%start_list% %start_list_item%Launch the Settings app on your iPhone or iPad.%end_list_item% %start_list_item%Tap on iTunes & App Store.%end_list_item% %start_list_item%Tap on your Apple ID at the top.%end_list_item% %start_list_item%Choose View Apple ID from the popup menu.%end_list_item% %start_list_item%Enter your password if/when prompted and tap on OK.%end_list_item% %start_list_item%Tap on Manage under Subscriptions.%end_list_item% %start_list_item%Tap on the AwardWallet subscription.%end_list_item% %start_list_item%Turn the Auto-Renewal option to Off.%end_list_item% %end_list%") */ 'ios.subscription.cancel',
                placeholders,
                'mobile',
            ),
            android: Translator.trans(
                /** @Desc("%start_list% %start_list_item%Launch the Google Play Store app.%end_list_item% %start_list_item%Tap Menu -> My Apps -> Subscriptions and tap on AwardWallet.%end_list_item% %start_list_item%Alternatively, tap Menu -> My Apps -> Tap AwardWallet -> Tap the app details page.%end_list_item% %start_list_item%Tap Cancel and Yes to confirm the cancellation.%end_list_item% %start_list_item%Now, the status of this Subscription has been changed from Subscribed to Canceled.%end_list_item% %end_list%") */ 'android.subscription.cancel',
                placeholders,
                'mobile',
            ),
        };

        return messages[this.getSubscriptionPlatform()];
    }

    renderLoadingView = () => <Spinner androidColor={getMainColor(Colors.grayBlue, this.isDark)} style={{top: 10, alignSelf: 'center'}} />;

    renderWebView = () => (
        <WebView
            source={{uri: `${Config.API_URL}/user/profile?fromapponce=1&KeepDesktop=1`}}
            renderLoading={this.renderLoadingView}
            startInLoadingState
            sharedCookiesEnabled
            useWebKit={false}
        />
    );

    render() {
        const platform = this.getSubscriptionPlatform();

        if (platform === 'desktop') {
            return <View style={[styles.page, this.isDark && styles.pageDark]}>{this.renderWebView()}</View>;
        }

        return super.render();
    }
}

export default withTheme(SubscriptionCancel);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});
