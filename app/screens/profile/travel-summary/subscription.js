import Translator from 'bazinga-translator';
import {Alert} from 'react-native';

import {SubscriptionPayment} from '../subscription/payment';

const showPleaseUpgrade = () => {
    Alert.alert(
        Translator.trans('please-upgrade'),
        'Unfortunately, this feature is only available to AwardWallet Plus members',
        [
            {
                text: Translator.trans('button.ok', {}, 'messages'),
            },
        ],
        {cancelable: false},
    );
};

class TravelSummarySubscriptionPlus extends SubscriptionPayment {
    componentDidMount() {
        super.componentDidMount();
        showPleaseUpgrade();
    }

    render() {
        return this.renderModalContent();
    }
}

export {TravelSummarySubscriptionPlus};
