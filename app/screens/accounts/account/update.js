import _ from 'lodash';
import React, {PureComponent} from 'react';

import AccountUpdater from '../../../components/accounts/update';
import {PathConfig} from '../../../navigation/linking';
import AccountsListService from '../../../services/accountsList';
import {resetByPath} from '../../../services/navigator';

class AccountUpdate extends PureComponent {
    static navigationOptions = () => ({
        gestureEnabled: false,
        headerShown: false,
        animation: 'none',
        presentation: 'containedTransparentModal',
        contentStyle: {
            backgroundColor: 'transparent',
        },
    });

    accountUpdater = React.createRef();

    constructor(props) {
        super(props);

        this.updateAccount = this.updateAccount.bind(this);
        this.onUpdateComplete = this.onUpdateComplete.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.updateAccount();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    get accountId() {
        const {route} = this.props;

        return route.params.ID;
    }

    get account() {
        return AccountsListService.getAccount(this.accountId);
    }

    updateAccount() {
        if (this.accountUpdater.current) {
            this.accountUpdater.current.start();
        }
    }

    onUpdateComplete() {
        const ID = this.accountId;
        const {navigation, route} = this.props;
        const backTo = route.params?.backTo;

        if (backTo === 'AccountsList') {
            return navigation.navigate(backTo);
        }

        const navigationState = navigation.getState();
        const prevRoute = navigationState.routes[navigationState.index - 1];
        const prevRouteName = prevRoute.name;

        if (['AccountAdd', 'AccountScanAdd'].includes(prevRouteName)) {
            return resetByPath(PathConfig.AccountDetails, {ID});
        }

        return navigation.navigate('AccountDetails', {ID});
    }

    render() {
        const {navigation, route} = this.props;
        const ID = this.accountId;
        const {DisplayName} = this.account;
        const firstUpdate = route.params?.firstUpdate ?? false;

        return (
            _.isObject(this.account) && (
                <AccountUpdater
                    ref={this.accountUpdater}
                    accountId={ID}
                    displayName={DisplayName}
                    onComplete={this.onUpdateComplete}
                    firstUpdate={firstUpdate}
                    navigation={navigation}
                    route={route}
                />
            )
        );
    }
}

export default AccountUpdate;
