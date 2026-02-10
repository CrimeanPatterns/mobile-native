import Translator from 'bazinga-translator';
import _ from 'lodash';
import Prompt from 'react-native-prompt-android';

import Account from '../../services/http/account';

const AutoLoginLocalPasswordPopup = (accountId, callback) => {
    Account.getLocalPasswordForm(accountId)
        .then((response) => {
            const {data} = response;

            if (_.isObject(data)) {
                const {DisplayName} = data;

                Prompt(
                    `${DisplayName} ${Translator.trans('popups.localpassword.title', {}, 'mobile')}`,
                    null,
                    [
                        {
                            text: Translator.trans('alerts.btn.cancel'),
                            style: 'cancel',
                            onPress: () => {
                                // reject();
                            },
                        },
                        {
                            text: Translator.trans('button.ok'),
                            onPress: (text) => {
                                const password = _.trim(text);

                                if (_.isEmpty(password)) {
                                    AutoLoginLocalPasswordPopup(accountId, callback);
                                } else {
                                    Account.saveLocalPasswordForm(accountId, {password}).then(callback).catch(callback);
                                }
                            },
                        },
                    ],
                    {
                        type: 'secure-text',
                        cancelable: false,
                    },
                );
            }
        })
        .catch(callback);
};

export default AutoLoginLocalPasswordPopup;
