import Translator from 'bazinga-translator';
import _ from 'lodash';
import {AppState} from 'react-native';
import Prompt from 'react-native-prompt-android';

import {isIOS} from '../../../../helpers/device';
import NotificationManagerService from '../../../../services/notification';
import Updater from '../../../../services/updater';

let OPENED = false;

const appState = {
    state: AppState.currentState,
    transitionTo(newState) {
        appState.state = newState;
    },
};

const SecurityQuestionPopup = ({data, accountId}): void => {
    const {displayName, question} = data;
    const notificationId = Math.random().toString(10).substr(-6);

    function displayPopup(): void {
        Prompt(
            `${displayName} ${Translator.trans('popups.questions.title', {}, 'mobile')}`,
            question,
            [
                {
                    text: Translator.trans('alerts.btn.cancel'),
                    style: 'cancel',
                    onPress: () => {
                        OPENED = false;

                        NotificationManagerService.cancelLocalNotification(notificationId);
                        Updater.cancelQuestion(accountId);
                        Updater.nextPopup();
                    },
                },
                {
                    text: Translator.trans('button.ok'),
                    onPress: (text) => {
                        const answer = _.trim(text);

                        OPENED = false;

                        NotificationManagerService.cancelLocalNotification(notificationId);
                        if (_.isEmpty(answer)) {
                            SecurityQuestionPopup({data, accountId});
                        } else {
                            Updater.doneQuestion(accountId, {question, answer});
                            Updater.nextPopup();
                        }
                    },
                },
            ],
            {
                cancelable: false,
            },
        );
        OPENED = true;
    }

    if (!OPENED) {
        if (appState.state === 'background') {
            NotificationManagerService.presentLocalNotification({
                id: notificationId,
                title: 'Pending Security Question',
                [isIOS
                    ? 'body'
                    : 'message']: `An answer to a security question is needed for your ${displayName} account. Please tap this notification to provide the answer.`,
            });
            AppState.addEventListener('change', (nextAppState) => {
                if (appState.state.match(/inactive|background/) && nextAppState === 'active') {
                    displayPopup();
                }

                appState.transitionTo(nextAppState);
            });
        } else {
            displayPopup();
        }
    }
};

export default SecurityQuestionPopup;
