import Translator from 'bazinga-translator';
import {Alert} from 'react-native';

import {PathConfig} from '../navigation/linking';
import NavigatorService, {navigateByPath} from '../services/navigator';

export function showPleaseUpgradeAccountLevelPopup(text) {
    Alert.alert(
        Translator.trans('please-upgrade'),
        text,
        [
            {
                text: Translator.trans('application.upgrade.buttons.ok', {}, 'mobile'),
                onPress: () => navigateByPath(PathConfig.SubscriptionPayment),
            },
            {
                text: Translator.trans('button.cancel', {}, 'messages'),
                style: 'cancel',
            },
        ],
        {cancelable: false},
    );
}

export function showBalanceWatchPleaseUpgradePopup() {
    showPleaseUpgradeAccountLevelPopup(Translator.trans('account.balancewatch.awplus-upgrade'));
}

export function showNoCreditsAvailablePopup() {
    Alert.alert(
        Translator.trans('account.balancewatch.credits-no-available-label'),
        Translator.trans('account.balancewatch.credits-no-available-notice'),
        [
            {
                text: Translator.trans('buy'),
                onPress: () => NavigatorService.navigate('BalanceWatchCreditsPayment'),
            },
            {
                text: Translator.trans('button.close', {}, 'messages'),
                style: 'cancel',
            },
        ],
        {cancelable: false},
    );
}
