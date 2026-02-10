import Translator from 'bazinga-translator';
import Config from 'react-native-config';

import {withTheme} from '../../theme';
import {BaseWebViewPage} from './index';

class ContactUs extends BaseWebViewPage {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('menu.contact-us', {}, 'menu'),
        animation: route.params?.animation ?? 'default',
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    getSourceUrl = () => `${Config.API_URL}/contact?fromapponce=1&KeepDesktop=1&theme=${this.props.theme}`;
}

export default withTheme(ContactUs);
