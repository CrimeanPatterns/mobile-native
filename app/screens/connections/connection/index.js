import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Image, Platform, StyleSheet, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Prompt from 'react-native-prompt-android';

import {BaseThemedPureComponent} from '../../../components/baseThemed';
import ConnectionActionSheet, {ActionRow} from '../../../components/connections/actionSheet';
import Icon from '../../../components/icon';
import Spinner from '../../../components/spinner';
import {isIOS} from '../../../helpers/device';
import {getMainColor} from '../../../helpers/header';
import ConnectionsAPI from '../../../services/http/connections';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';

const [ACTION_DELETE, ACTION_INVITE, ACTION_RESEND, ACTION_DISCONNECT, ACTION_CANCEL_INVITE] = [
    'delete',
    'invite',
    'resend',
    'disconnect',
    'cancel_invite',
];

class Connection extends BaseThemedPureComponent {
    static getStatusTranslation(status) {
        const translations = {
            // approved: Translator.trans('user.connections.approved'),
            waiting: Translator.trans('user.connections.waiting_approval'),
            expired: Translator.trans('user.connections.invitation_expired'),
        };

        return translations[status];
    }

    static getActionSheetRow(action, {type, name}) {
        const translations = {
            full_access: Translator.trans('trip.sharing.give-full-control', {agent_fullname: name}),
            read_only: Translator.trans('trip.sharing.give-read-only', {agent_fullname: name}),
        };

        translations[ACTION_DELETE] = Translator.trans('button.delete');
        translations[ACTION_RESEND] = Translator.trans('user.connections.resend');
        translations[ACTION_INVITE] = Translator.trans('connections.button.invite');
        translations[ACTION_DISCONNECT] = Translator.trans('user.invites.disconnect');
        translations[ACTION_CANCEL_INVITE] = translations[ACTION_DISCONNECT];

        if (['full_access', 'read_only'].includes(action)) {
            return {component: ActionRow, option: translations[action]};
        }

        if (action === ACTION_DELETE && type === 'invite') {
            return translations.disconnect;
        }

        return translations[action];
    }

    static showInviteMessage = () => {
        Connection.showSuccessMessage(Translator.trans('invite.message', {}, 'mobile-native'));
    };

    static showSuccessMessage = (message) => {
        showMessage({
            message,
            type: 'success',
            duration: 3000,
        });
    };

    static showErrorMessage = (message) => {
        showMessage({
            message,
            type: 'danger',
            duration: 5000,
        });
    };

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    get mainColor() {
        return getMainColor(this.selectColor(Colors.gold, DarkColors.gold), this.isDark);
    }

    // eslint-disable-next-line class-methods-use-this
    getStatusIcon(status, style) {
        const colors = this.themeColors;

        if (status === 'approved') {
            return <Icon color={colors.green} style={style} name='square-success' size={13} />;
        }

        if (status === 'waiting') {
            return <Icon color={this.selectColor(Colors.grayDark, Colors.white)} style={style} name='waiting' size={24} />;
        }

        if (status === 'expired') {
            return <Icon color={colors.orange} style={style} name='waiting' size={24} />;
        }

        return null;
    }

    subscribe() {
        const {navigation, route} = this.props;

        this.willFocusSubscription = navigation.addListener('focus', () => {
            const reload = route.params?.reload ?? false;

            if (reload) {
                navigation.setParams({reload: false});
                this.reload();
            }
        });
    }

    unsubscribe() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription();
        }
    }

    getConnection = () => {
        const {route} = this.props;

        return route.params?.connection;
    };

    showInvitePopup = () => {
        Prompt(
            Translator.trans('agents.connect.step1.header'),
            Translator.trans(
                /** @Desc("Please enter email. We will search through our database and add this user to your profile.") */ 'agents.connect.email.notice',
                {},
                'mobile-native',
            ),
            [
                {text: Translator.trans('cancel'), style: 'cancel'},
                {
                    text: Translator.trans('alerts.btn.ok'),
                    onPress: (email) => this.doAction({action: 'invite', connection: {email}}),
                },
            ],
            {
                cancelable: true,
                keyboardType: 'email-address',
                type: (isIOS && 'plain-text') || 'email-address',
            },
        );
    };

    inviteFamilyMember = async ({id, email}) => {
        const response = await ConnectionsAPI.inviteFamilyMember(id, email);

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isObject(data)) {
                const {error} = data;

                if (error) {
                    return Promise.reject(error);
                }

                return Promise.resolve({
                    reload: true,
                    success: Translator.trans(/** @Desc("Connection invite was sent.") */ 'invite.message', {}, 'mobile-native'),
                });
            }
        }

        return Promise.reject();
    };

    confirmInviteFamilyMember = (connection) =>
        new Promise((resolve, reject) => {
            const {email, id} = connection;

            Prompt(
                Translator.trans('connections.popup.invite.header'),
                null,
                [
                    {text: Translator.trans('cancel'), style: 'cancel'},
                    {
                        text: Translator.trans('alerts.btn.ok'),
                        onPress: async (email) => {
                            try {
                                const response = await this.inviteFamilyMember({id, email});

                                resolve(response);
                            } catch (error) {
                                reject(error);
                            }
                        },
                    },
                ],
                {
                    cancelable: true,
                    type: (isIOS && 'plain-text') || 'email-address',
                    keyboardType: 'email-address',
                    defaultValue: email || '',
                },
            );
        });

    invite = async ({email}) => {
        if (_.isString(email)) {
            const response = await ConnectionsAPI.invite(email);

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    const {error, success} = data;

                    if (success) {
                        return Promise.resolve({
                            reload: true,
                            success: Translator.trans('invite.message', {}, 'mobile-native'),
                        });
                    }

                    if (_.isString(error)) {
                        return Promise.reject(error);
                    }
                }
            }
        }

        return Promise.reject();
    };

    denyAll = ({id}) => ConnectionsAPI.denyAll(id);

    denyRequest = ({id}) => ConnectionsAPI.removeConnection(id);

    approveRequest = ({id}) => ConnectionsAPI.approve(id);

    showActions = ({connection, actions}) => {
        if (this.actionSheet) {
            const {type, name} = connection;
            const options = actions.map((action) => Connection.getActionSheetRow(action, {type, name}));
            let destructiveButtonIndex = actions.indexOf(ACTION_DELETE);

            if (actions.indexOf(ACTION_CANCEL_INVITE) >= 0) {
                destructiveButtonIndex = actions.indexOf(ACTION_CANCEL_INVITE);
            }

            this.actionSheet.open(
                {
                    actions: options,
                    destructiveButtonIndex,
                },
                (index) => this.doAction({action: actions[index], connection}),
            );
        }
    };

    doAction = async ({action, connection}) => {
        const actions = {
            resend: this.resend,
            invite: this.invite,
            inviteFamilyMember: this.confirmInviteFamilyMember,
            cancel_invite: this._delete,
            delete: this.delete,
            denyRequest: this.denyRequest,
            approveRequest: this.approveRequest,
            read_only: this.shareReadOnly,
            full_access: this.shareFullAccess,
        };
        let callback = actions[action];

        if (action === 'invite' && connection.type === 'family_member') {
            callback = actions.inviteFamilyMember;
        }

        if (_.isFunction(callback)) {
            try {
                const response = await callback(connection);

                if (_.isObject(response)) {
                    const {success} = response;

                    if (_.isString(success)) {
                        Connection.showSuccessMessage(success);
                    }
                }

                this.reload(action);
            } catch (error) {
                if (_.isString(error)) {
                    Connection.showErrorMessage(error);
                }
            }
        }
    };

    resend = async ({id, type}) => {
        await ConnectionsAPI.resendInvite(id, type);

        Connection.showInviteMessage();

        return Promise.reject();
    };

    confirmDelete = ({type, name}) => {
        let message = Translator.trans(
            /** @Desc("You are about to delete %name%`s name from your profile, please note that since %name% is not a connected user with a separate AwardWallet account all of the loyalty accounts (if any) that belong to this user will be transferred to you automatically?") */ 'connections.delete',
            {name},
            'mobile-native',
        );

        if (type !== 'family_member') {
            message = Translator.trans('connections.popup.delete.content');
        }

        return new Promise((resolve, reject) => {
            Alert.alert(
                Translator.trans('delete.connection'),
                message,
                [
                    {
                        text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                        onPress: reject,
                    },
                    {
                        text: Translator.trans('button.delete', {}, 'messages'),
                        onPress: resolve,
                        style: 'destructive',
                    },
                ],
                {cancelable: false},
            );
        });
    };

    delete = async ({id, type, name}) => {
        await this.confirmDelete({type, name});
        await this._delete({id, type});
    };

    _delete = async ({id, type}) => {
        if (type === 'invite') {
            await ConnectionsAPI.removeInvite(id);
        } else {
            await ConnectionsAPI.removeConnection(id);
        }
    };

    grant = ({id}, grantType) => ConnectionsAPI.grant(id, grantType);

    share = (shareCode) => ConnectionsAPI.share(shareCode);

    shareReadOnly = (connection) => {
        const {navigation} = this.props;

        navigation.navigate('ConnectionShare', {connection, grantType: 'readonly'});

        return Promise.reject();
    };

    shareFullAccess = (connection) => {
        const {navigation} = this.props;

        navigation.navigate('ConnectionShare', {connection, grantType: 'full'});

        return Promise.reject();
    };

    shareNeverShow = (connection) => this.grant(connection, 'never-show');

    // eslint-disable-next-line class-methods-use-this
    reload() {
        // do something
    }

    getButtonStyle = ({backgroundColor, textColor, activeTextColor}) => ({
        button: {
            base: {
                marginHorizontal: 0,
                marginVertical: 0,
                width: '100%',
                backgroundColor,
            },
        },
        label: {
            base: {
                color: textColor,
            },
            pressed: {
                color: activeTextColor,
            },
        },
    });

    getButtonStyles = () => {
        const colors = this.themeColors;
        const whiteStyle = this.getButtonStyle({
            backgroundColor: this.selectColor(Colors.white, DarkColors.bgLight),
            textColor: Platform.select({
                ios: this.selectColor(Colors.grayDark, Colors.white),
                android: this.mainColor,
            }),
            activeTextColor: Colors.gray,
        });

        const blueStyle = {
            button: {
                base: {
                    marginHorizontal: 0,
                    marginVertical: 0,
                    width: '100%',
                    ...Platform.select({
                        android: {
                            elevation: 2,
                            backgroundColor: this.selectColor(Colors.gold, DarkColors.gold),
                        },
                        ios: {
                            backgroundColor: colors.blue,
                        },
                    }),
                },
            },
            label: Platform.select({
                android: {
                    base: {
                        color: this.selectColor(Colors.white, Colors.black),
                    },
                    pressed: {
                        color: Colors.white,
                    },
                },
            }),
        };

        return {whiteStyle, blueStyle};
    };

    renderSpinner = () => <Spinner androidColor={this.mainColor} style={styles.spinner} />;

    renderConnectionActionSheet = () => <ConnectionActionSheet ref={(ref) => (this.actionSheet = ref)} />;

    renderAvatar = (avatar) => {
        const avatarSize = 64;
        const avatarColor = Platform.select({
            ios: this.selectColor(Colors.gray, Colors.white),
            android: Colors.grayDarkLight,
        });

        return (
            <View
                style={{
                    width: avatarSize,
                    height: avatarSize,
                    borderWidth: 1,
                    borderRadius: avatarSize / 2,
                    borderColor: avatarColor,
                    overflow: 'hidden',
                }}>
                {_.isEmpty(avatar) && <Icon name='avatar' color={avatarColor} size={avatarSize} />}
                {_.isString(avatar) && (
                    <Image
                        style={{
                            width: avatarSize,
                            height: avatarSize,
                            resizeMode: 'contain',
                        }}
                        source={{
                            uri: avatar,
                        }}
                    />
                )}
            </View>
        );
    };
}

const styles = StyleSheet.create({
    spinner: {
        marginTop: 10,
        alignSelf: 'center',
    },
});

export {Connection as BaseConnection};
export default withTheme(Connection);
