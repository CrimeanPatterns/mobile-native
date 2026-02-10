import Translator from 'bazinga-translator';
import Config from 'react-native-config';

import {withTheme} from '../../theme';
import {BaseTerms} from './terms';

class PrivacyNotice extends BaseTerms {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('menu.privacy-notice', {}, 'menu'),
        animation: route.params?.animation ?? 'default',
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    getSourceUrl = () => `${Config.API_URL}/m/api/privacy`;
}

export default withTheme(PrivacyNotice);
