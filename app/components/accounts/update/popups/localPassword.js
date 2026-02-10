import Translator from 'bazinga-translator';
import _ from 'lodash';
import Prompt from 'react-native-prompt-android';

import Updater from '../../../../services/updater';

let OPENED = false;

const LocalPasswordPopup = ({data, accountId}) => {
    const {displayName, label} = data;

    if (!OPENED) {
        Prompt(
            `${displayName} ${Translator.trans('popups.localpassword.title', {}, 'mobile')}`,
            label,
            [
                {
                    text: Translator.trans('alerts.btn.cancel'),
                    style: 'cancel',
                    onPress: () => {
                        OPENED = false;

                        Updater.cancelPassword(accountId);
                        Updater.nextPopup();
                    },
                },
                {
                    text: Translator.trans('button.ok'),
                    onPress: (text) => {
                        const password = _.trim(text);

                        OPENED = false;

                        if (_.isEmpty(password)) {
                            LocalPasswordPopup({data, accountId});
                        } else {
                            Updater.donePassword(accountId, password);
                            Updater.nextPopup();
                        }
                    },
                },
            ],
            {
                type: 'secure-text',
                cancelable: false,
            },
        );
        OPENED = true;
    }
};

export default LocalPasswordPopup;
