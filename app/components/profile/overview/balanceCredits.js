import Translator from 'bazinga-translator';

import Upgrade from './upgrade';

export default class BalanceCredits extends Upgrade {
    onPress() {
        const {navigation} = this.props;

        navigation.navigate('BalanceWatchCreditsPayment');
    }

    getSecondCaption = () => Translator.trans(/** @Desc("Buy Balance Watch Credits") */ 'buy_watch_credits.button', {}, 'mobile-native');
}
