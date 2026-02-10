import React, {PureComponent} from 'react';

import AutoLogin, {AutoLoginLocalPasswordPopup} from '../../../components/autologin';
import Spinner from '../../../components/spinner';
import {useAccount} from '../../../hooks/account';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

class AccountAutoLogin extends PureComponent {
    _autoLogin = React.createRef();

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onLoadEnd = this.onLoadEnd.bind(this);
        this.onRequestLocalPassword = this.onRequestLocalPassword.bind(this);
    }

    componentDidMount() {
        this.start();
    }

    get autoLogin() {
        return this._autoLogin.current;
    }

    start() {
        const {account} = this.props;

        this.autoLogin.start(account);
    }

    onLoadStart() {
        const {navigation} = this.props;

        navigation.setParams({loading: true});
    }

    onLoadEnd() {
        const {navigation} = this.props;

        navigation.setParams({loading: false});
    }

    onRequestLocalPassword(event) {
        const {accountId} = event;

        AutoLoginLocalPasswordPopup(accountId, this.start);
    }

    render() {
        return (
            <AutoLogin
                ref={this._autoLogin}
                onLoadStart={this.onLoadStart}
                onLoadEnd={this.onLoadEnd}
                onRequestLocalPassword={this.onRequestLocalPassword}
            />
        );
    }
}

export {AccountAutoLogin};

export const AccountAutoLoginScreen: AccountsStackScreenFunctionalComponent<'AccountAutoLogin'> = ({navigation, route}) => {
    const {ID} = route.params;
    const {account} = useAccount(ID);

    return <AccountAutoLogin navigation={navigation} route={route} account={account} />;
};

AccountAutoLoginScreen.navigationOptions = ({route}) => ({
    title: '',
    headerTitle: () => route.params.loading && <Spinner />,
});
