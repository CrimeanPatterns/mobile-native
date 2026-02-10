import Account from '../../../services/http/account';
import {withTheme} from '../../../theme';
import {BaseAccountAdd} from '../account/add';

class DiscoveredAccountAdd extends BaseAccountAdd {
    get accountId() {
        const {route} = this.props;

        return route.params?.accountId;
    }

    // eslint-disable-next-line class-methods-use-this
    _getForm() {
        return Account.getForm('account', this.accountId);
    }

    saveForm(fields) {
        return Account.saveForm('account', this.accountId, fields);
    }

    navigate(accountId, needUpdate) {
        const {navigation, route} = this.props;
        const backTo = route.params?.backTo;

        if (needUpdate) {
            return navigation.navigate('AccountUpdate', {ID: accountId, firstUpdate: true, backTo});
        }

        return navigation.navigate(backTo);
    }
}

DiscoveredAccountAdd.navigationOptions = () => ({title: ''});

export default withTheme(DiscoveredAccountAdd);
