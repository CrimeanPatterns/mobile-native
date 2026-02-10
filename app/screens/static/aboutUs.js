import Translator from 'bazinga-translator';
import Config from 'react-native-config';

import {withTheme} from '../../theme';
import {BaseTerms} from './terms';

class AboutUs extends BaseTerms {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('about-awardwallet', {}, 'messages'),
        animation: route.params?.animation ?? 'default',
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    getSourceUrl = () => `${Config.API_URL}/m/api/about`;
}

export default withTheme(AboutUs);
