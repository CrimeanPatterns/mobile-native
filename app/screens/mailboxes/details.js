import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import Icon from '../../components/icon';
import StatusIcon from '../../components/mailboxes/statusIcon';
import BottomMenu from '../../components/page/menu';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {Mailbox} from './mailbox';
import styles from './styles/details';

class MailboxDetails extends Mailbox {
    static navigationOptions = () => ({
        title: Translator.trans(/** @Desc("Edit Mailbox") */ 'edit-mailbox', {}, 'mobile-native'),
    });

    constructor(props) {
        super(props);

        this.deleteMailbox = this.deleteMailbox.bind(this);
    }

    // eslint-disable-next-line class-methods-use-this
    getParams() {
        const {route} = this.props;
        const email = route.params?.email;
        const owner = route.params?.owner;
        const status = route.params?.status;
        const icon = route.params?.icon;
        const id = route.params?.id;
        const actions = route.params?.actions;
        const deleteMailbox = route.params?.deleteMailbox;

        return {
            email,
            owner,
            status,
            icon,
            id,
            actions,
            deleteMailbox,
        };
    }

    navigateBack = (deleteId) => {
        this.navigate('Mailboxes', {deleteId});
    };

    async deleteMailbox() {
        const {email, id, deleteMailbox} = this.getParams();

        await this.confirmDeleteMailbox(email);

        if (_.isFunction(deleteMailbox)) {
            await deleteMailbox(id);
        }

        this.navigateBack();
    }

    updateMailbox = async () => {
        const {id: mailboxId} = this.getParams();

        await super.updateMailbox(mailboxId);

        this.navigateBack();
    };

    getBottomMenu() {
        const {actions} = this.getParams();
        const mailboxActions = {
            delete: {
                key: 'delete',
                title: Translator.trans('button.delete', {}, 'messages'),
                icon: {
                    name: 'footer-delete',
                    size: 24,
                },
                onPress: this.deleteMailbox,
            },
            update: {
                key: 'authenticate',
                title: Translator.trans('mailbox.reauthenticate', {}, 'messages'),
                icon: {
                    name: 'authenticate',
                    size: 24,
                },
                onPress: this.updateMailbox,
            },
        };

        if (_.isEmpty(actions) === false) {
            return actions.map((action) => mailboxActions[action]);
        }

        return [];
    }

    render() {
        const {email, owner, status, icon} = this.getParams();
        const menu = this.getBottomMenu();

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <View style={{flexGrow: 1}}>
                    <View style={[styles.title, this.isDark && styles.titleDark]}>
                        <Icon name='mail' size={24} style={[styles.titleIcon, this.isDark && styles.textDark]} />
                        <View style={styles.titleWrap}>
                            <Text style={[styles.titleText, this.isDark && styles.textDark]}>{email}</Text>
                        </View>
                    </View>
                    {_.isString(owner) && (
                        <View style={[styles.container, this.isDark && styles.containerDark]}>
                            <Text style={[styles.containerCaption, this.isDark && styles.containerCaptionDark]}>
                                {Translator.trans('award.account.list.column.owner', {}, 'messages')}
                            </Text>
                            <View style={styles.containerDetails}>
                                <View style={styles.containerStatus}>
                                    <Text style={[styles.containerStatusText, this.isDark && styles.textDark]}>{owner}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    <View style={[styles.container, this.isDark && styles.containerDark]}>
                        <Text style={[styles.containerCaption, this.isDark && styles.containerCaptionDark]}>
                            {Translator.trans('award.mailbox.th-status', {}, 'messages')}
                        </Text>
                        <View style={styles.containerDetails}>
                            <View style={styles.containerStatus}>
                                <Text style={[styles.containerStatusText, this.isDark && styles.textDark]}>{status}</Text>
                            </View>
                            <View style={styles.containerStatusIcon}>
                                <StatusIcon name={icon} />
                            </View>
                        </View>
                    </View>
                </View>
                <BottomMenu items={menu} color={Colors.gold} colorDark={DarkColors.gold} />
            </View>
        );
    }
}

export default withTheme(MailboxDetails);
