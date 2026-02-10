import {PureComponent} from 'react';

import EventEmitter from '../services/eventEmitter';
import PrivacyScreen from '../services/privacyScreen';

const screens = ['SignIn', 'SignUp', 'SecurityQuestions', 'AccountAdd', 'AccountEdit', 'AccountHistory', 'PasswordRecovery'];

const log = (...args) => {
    console.log('<ScreenGuard/>', ...args);
};

let enabled = false;

export class ScreenGuard extends PureComponent {
    componentDidMount(): void {
        this.listener = EventEmitter.addListener('navigationStateChange', this.onNavigationStateChange);
    }

    componentWillUnmount(): void {
        this.listener.remove();
    }

    onNavigationStateChange = (prevScreen, currentScreen) => {
        if (screens.includes(currentScreen)) {
            log('enabled privacy screen on route', currentScreen);
            PrivacyScreen.enable();
            enabled = true;
        } else if (enabled) {
            log('disable privacy screen on route', currentScreen);
            PrivacyScreen.disable();
            enabled = false;
        }
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        return null;
    }
}
