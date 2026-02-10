import Translator from 'bazinga-translator';
import _ from 'lodash';
import {Alert} from 'react-native';

import {BaseThemedComponent} from '../../components/baseThemed';
import {signInProvider} from '../../components/oauth';
import {signInGoogle} from '../../components/oauth/google';
import API from '../../services/api';

export class Mailbox extends BaseThemedComponent {
    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    navigate = (routeName, params) => {
        const {navigation} = this.props;

        navigation.navigate(routeName, params);
    };

    setLoading = (loading) => {
        const {navigation} = this.props;

        navigation.setParams({loading});
    };

    reload() {
        const {reload} = this.props;

        if (_.isFunction(reload)) {
            reload();
        } else {
            this.navigate('Mailboxes');
        }
    }

    // eslint-disable-next-line class-methods-use-this
    _confirmDeleteMailbox(email, onSuccess, onCancel) {
        Alert.alert(
            null,
            Translator.trans(/** @Desc("Are you sure, you want to delete %email% mailbox?") */ 'delete-mailbox', {email}, 'mobile-native'),
            [
                {
                    text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                    onPress: onCancel,
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: onSuccess,
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    confirmDeleteMailbox(email) {
        return new Promise((resolve, reject) => {
            this._confirmDeleteMailbox(email, resolve, reject);
        });
    }

    // eslint-disable-next-line class-methods-use-this
    deleteMailbox(mailboxId) {
        return API.delete(`/mailbox/${mailboxId}`, {globalError: false});
    }

    addMailbox = (data) => API.post('/mailbox/add', data);

    _signInProvider = async (config, provider) => {
        const data = await signInProvider(config);

        return {[provider]: data};
    };

    _updateMailbox = async (provider, config) => {
        const mailboxes = {
            google: signInGoogle,
            microsoft: this._signInProvider,
            yahoo: this._signInProvider,
            aol: this._signInProvider,
        };

        const data = await mailboxes[provider](config, provider);

        await this.addMailbox(data);
    };

    updateMailbox(mailboxId) {
        return new Promise(async (resolve) => {
            this.setLoading(true);

            try {
                const response = await API.post(`/mailbox/update/${mailboxId}`, {}, {globalError: false});

                if (_.isObject(response)) {
                    const {data} = response;

                    if (_.isObject(data)) {
                        const {type, ...config} = data;

                        if (type !== 'imap') {
                            await this._updateMailbox(type, config);
                        } else {
                            this.navigate('MailboxIMAP', {...config, update: true});
                        }
                    }
                }
            } finally {
                this.setLoading(false);
                resolve();
            }
        });
    }
}
