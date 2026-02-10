import Translator from 'bazinga-translator';
import {Alert} from 'react-native';

import API from '../../../services/api';
import {TextProperty} from './textProperty';

type TOTPCancelResponse = {
    success: boolean;
};

class TOTPCancel extends TextProperty {
    private props: any;

    // eslint-disable-next-line class-methods-use-this
    get isLink() {
        return true;
    }

    async delete() {
        const {navigation} = this.props;

        const response = await API.delete<TOTPCancelResponse>('/profile/2factor');
        const {data} = response;

        if (data?.success) {
            navigation.dispatch({
                type: 'RELOAD',
            });
        }
    }

    onPress() {
        Alert.alert(
            Translator.trans('two-factor.cancel.title', {}, 'messages'),
            Translator.trans('two-factor.cancel.question', {}, 'messages'),
            [
                {
                    text: Translator.trans('button.no', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.yes', {}, 'messages'),
                    onPress: () => this.delete(),
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }
}

export default TOTPCancel;
