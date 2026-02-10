import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {LayoutAnimation, Platform, Text, TouchableOpacity, View} from 'react-native';

import Icon from '../../components/icon';
import MailboxRow from '../../components/mailboxes/row';
import ActionButton from '../../components/page/actionButton';
import {SwipeableFlatList} from '../../components/page/swipeableList';
import {ACTION_UPDATE, MailboxActions} from '../../components/page/swipeableList/actionButton';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import API from '../../services/api';
import CentrifugeProvider from '../../services/centrifuge';
import Storage from '../../storage';
import {Colors, DarkColors} from '../../styles';
import {IconColors} from '../../styles/icons';
import {withTheme} from '../../theme';
// eslint-disable-next-line import/no-named-as-default
import {MailboxAdd} from './add';
import {Mailbox} from './mailbox';
import styles from './styles/list';
import {log} from './utils';

class MailboxList extends Mailbox {
    static propTypes = {
        navigation: PropTypes.object,
        theme: PropTypes.string,
    };

    static navigationOptions = ({route}) => {
        // const loading = route.params?.loading;
        const title = route.params?.title ?? '';
        // let headerTitle;

        // if (loading) {
        //     headerTitle = <Spinner />;
        // }

        return {
            title,
            // headerTitle: () => headerTitle,
            headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
        };
    };

    constructor(props) {
        super(props);

        this.getMailboxes = this.getMailboxes.bind(this);
        this.loadMailboxes = this.loadMailboxes.bind(this);
        this.deleteMailbox = this.deleteMailbox.bind(this);
        this.onCentrifugeMessage = this.onCentrifugeMessage.bind(this);
        this.subscribeOnMessages = this.subscribeOnMessages.bind(this);
        this.navigateMailboxAdd = this.navigateMailboxAdd.bind(this);

        this.renderMailboxes = this.renderMailboxes.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderForm = this.renderForm.bind(this);

        this.actions = {
            update: this.updateMailbox,
            delete: this.confirmDeleteMailbox,
        };

        this.layoutLinear = {
            duration: 100,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
        };

        this.queueMessages = [];

        this.state = {
            mailboxes: null,
            loading: false,
            edit: false,
            owners: [],
            lastSyncDate: Date.now(),
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.getMailboxes();
        this.onPageLoaded();
        this.subscribe();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.unsubscribe();
    }

    // eslint-disable-next-line camelcase
    onPageLoaded() {
        const {navigation, route} = this.props;
        const updateId = route.params?.updateId;
        const deleteId = route.params?.deleteId;

        if (updateId || deleteId) {
            if (updateId) {
                super.updateMailbox(updateId);
            }

            if (deleteId) {
                this.deleteMailboxById(deleteId);
            }

            navigation.setParams({
                updateId: null,
                deleteId: null,
            });
        }
    }

    subscribe() {
        const {navigation} = this.props;
        const centrifuge = CentrifugeProvider.getConnection();
        // const reload = navigation.getParam('reload');
        let pageGone = false;

        this.willFocusSubscription = navigation.addListener('focus', () => {
            if (pageGone === true) {
                this.getMailboxes();

                pageGone = false;
            }
        });

        this.willBlurSubscription = navigation.addListener('blur', (event) => {
            // const {
            //     action: {type},
            // } = event;
            //
            // if (type === NavigationActions.BACK) {
            //     if (_.isFunction(reload)) {
            //         reload(false);
            //     }
            // }

            pageGone = true;
        });

        if (!this.centrifugeSubscription && centrifuge) {
            if (centrifuge.isConnected()) {
                this.subscribeOnMessages();
            } else {
                log('connect');
                centrifuge.on('connect', this.subscribeOnMessages);
                centrifuge.connect();
            }
        }
    }

    unsubscribe() {
        if (this.willFocusSubscription) {
            this.willFocusSubscription();
        }
        if (this.willBlurSubscription) {
            this.willBlurSubscription();
        }
        if (this.centrifugeSubscription) {
            this.centrifugeSubscription.unsubscribe();
        }
    }

    getMailboxes() {
        const {navigation} = this.props;

        log('getMailboxes');

        this.loadMailboxes().then((data) => {
            const {mailboxes, owners} = data;

            this.safeSetState({owners});

            log('loadMailboxes', mailboxes);

            if (_.isArray(mailboxes)) {
                this.safeSetState(
                    {
                        mailboxes,
                        loading: false,
                        lastSyncDate: Date.now(),
                    },
                    () => {
                        this.processQueue();
                    },
                );

                if (_.isEmpty(mailboxes)) {
                    navigation.setParams({
                        title: Translator.trans('linking-mailbox', {}, 'mobile-native'),
                    });
                } else {
                    navigation.setParams({
                        title: Translator.trans('personal_info.site_settings.email_scanner', {}, 'messages'),
                    });
                }
            }
        });
    }

    loadMailboxes() {
        this.safeSetState({loading: true});

        return new Promise((resolve, reject) => {
            API.get('/mailbox/list')
                .then((response) => {
                    const {data} = response;

                    if (_.isObject(data)) {
                        const {mailboxes, owners} = data;

                        if (_.isObject(mailboxes)) {
                            resolve({mailboxes, owners});
                        } else {
                            reject();
                        }
                    }
                })
                .catch(() => reject());
        });
    }

    getMailboxByIndex = (index) => {
        const {mailboxes} = this.state;

        if (!_.isEmpty(mailboxes) && mailboxes[index]) {
            return mailboxes[index];
        }

        return null;
    };

    updateMailbox = async (index) => {
        const mailbox = this.getMailboxByIndex(index);

        if (!_.isEmpty(mailbox)) {
            const {id} = mailbox;

            await super.updateMailbox(id);
        }
    };

    confirmDeleteMailbox = async (index) => {
        const mailbox = this.getMailboxByIndex(index);

        if (!_.isEmpty(mailbox)) {
            const {email} = mailbox;

            await super.confirmDeleteMailbox(email);

            this.deleteMailbox(index);
        }
    };

    async deleteMailbox(index) {
        const {navigation} = this.props;
        const {mailboxes} = this.state;

        if (!_.isEmpty(mailboxes) && _.isObject(mailboxes[index])) {
            const {id} = mailboxes[index];

            await super.deleteMailbox(id);

            if (isIOS) {
                LayoutAnimation.configureNext(this.layoutLinear);
            }

            mailboxes.splice(index, 1);

            this.safeSetState(
                {
                    mailboxes,
                },
                () => {
                    const {mailboxes} = this.state;

                    if (_.isEmpty(mailboxes)) {
                        navigation.setParams({
                            title: Translator.trans('linking-mailbox', {}, 'mobile-native'),
                        });
                    }
                },
            );
        }
    }

    deleteMailboxById = async (id) => {
        const {mailboxes} = this.state;

        if (!_.isEmpty(mailboxes)) {
            const mailbox = mailboxes.find((mailbox) => mailbox.id === id);

            if (_.isObject(mailbox)) {
                await this.deleteMailbox(mailboxes.indexOf(mailbox));
            }
        }
    };

    subscribeOnMessages() {
        const profile = Storage.getItem('profile');

        if (_.isObject(profile)) {
            const {UserID} = profile;
            const centrifuge = CentrifugeProvider.getConnection();

            log('connected');
            log('subscribe', `$mailboxes_${UserID}`);
            this.centrifugeSubscription = centrifuge.subscribe(`$mailboxes_${UserID}`, this.onCentrifugeMessage);
        }
    }

    onCentrifugeMessage(message, processQueue = false) {
        if (_.isObject(message)) {
            if (!processQueue) {
                log('onCentrifugeMessage', message);
            }

            const {data} = message;
            const {mailboxes} = this.state;

            if (!_.isEmpty(mailboxes)) {
                const mailbox = mailboxes.find((mailbox) => mailbox.id === data.id);

                if (_.isObject(mailbox)) {
                    if (mailboxes.indexOf(mailbox) > -1) {
                        const {status, icon, actions} = data;

                        mailbox.status = status;
                        mailbox.icon = icon;
                        mailbox.actions = actions;
                        mailboxes[mailboxes.indexOf(mailbox)] = mailbox;

                        return this.safeSetState({mailboxes});
                    }
                }
            }

            if (!processQueue) {
                return this.queuePush(message);
            }
        }

        return undefined;
    }

    queuePush(message) {
        log('queuePush', message);
        this.queueMessages.push(message);
    }

    processQueue() {
        if (!_.isEmpty(this.queueMessages)) {
            while (_.isEmpty(this.queueMessages) === false) {
                const message = this.queueMessages.shift();

                log('processQueue', message);
                this.onCentrifugeMessage(message, true);
            }
        }
    }

    navigateMailboxAdd() {
        const {navigation, route} = this.props;
        const {owners} = this.state;

        navigation.navigate('MailboxAdd', {
            showNotice: false,
            owners,
            source: route.params?.source,
        });
    }

    getSwipeDistance = ({item: {actions}}) => {
        if (_.isEmpty(actions) === false) {
            return actions.length * 70;
        }

        return 0;
    };

    renderHeader() {
        const {mailboxes} = this.state;

        if (!_.isEmpty(mailboxes)) {
            const iconColor = Platform.select({
                ios: this.selectColor('#bec2cc', Colors.white),
                android: this.selectColor(Colors.grayDarkLight, DarkColors.text),
            });

            return (
                <View style={[styles.title, this.isDark && styles.titleDark]}>
                    <View style={styles.titleWrap}>
                        <Text style={[styles.titleText, this.isDark && styles.textDark]}>
                            {Translator.trans(/** @Desc("Mailboxes") */ 'mailboxes', {}, 'mobile-native')}
                        </Text>
                    </View>
                    <Icon name='mail' size={24} color={iconColor} />
                </View>
            );
        }

        return null;
    }

    renderFooter() {
        const {mailboxes} = this.state;

        if (!_.isEmpty(mailboxes)) {
            return (
                <>
                    {!isIOS && <View style={{flex: 1, height: 80}} />}
                    {isIOS && (
                        <View style={[styles.addAccount, this.isDark && styles.addAccountDark]}>
                            <TouchableOpacity
                                style={[styles.addAccountContainer, this.isDark && styles.addAccountContainerDark]}
                                onPress={this.navigateMailboxAdd}>
                                <Icon name='plus' color={IconColors.gray} size={24} />
                                <Text style={[styles.addAccountText, this.isDark && styles.textDark]}>
                                    {Translator.trans('award.mailbox.add-another-btn', {}, 'messages')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            );
        }

        return null;
    }

    renderForm() {
        const {route, navigation, theme} = this.props;
        const {owners} = this.state;

        return (
            <MailboxAdd
                theme={theme}
                reload={this.getMailboxes}
                owners={owners}
                source={route.params?.source}
                route={route}
                navigation={navigation}
            />
        );
    }

    renderItem = ({item, index}) => {
        const {navigation} = this.props;
        const {email, status, actions, icon, owner} = item;
        let onPress;

        if (!isIOS) {
            onPress = () => navigation.navigate('MailboxDetails', {...item, deleteMailbox: this.deleteMailboxById});
        } else if (_.isEmpty(actions) === false && actions.includes(ACTION_UPDATE)) {
            onPress = () => this.updateMailbox(index);
        }

        return <MailboxRow email={email} status={status} owner={owner} onPress={onPress} icon={icon} />;
    };

    renderQuickActions = (item) => {
        if (isIOS) {
            const {
                index,
                item: {actions},
            } = item;

            if (_.isEmpty(actions) === false) {
                return (
                    <View style={[styles.quickActions, this.isDark && styles.quickActionsDark]}>
                        {actions.map((action) => {
                            const ActionButton = MailboxActions[action];

                            if (ActionButton) {
                                return <ActionButton key={`action_${action}`} index={index} onPress={this.actions[action]} />;
                            }

                            return null;
                        })}
                    </View>
                );
            }
        }

        return null;
    };

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    renderMailboxes() {
        const {mailboxes, edit, lastSyncDate} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <SwipeableFlatList
                    data={mailboxes}
                    extraData={this.state}
                    keyExtractor={this.keyExtractor}
                    onRefresh={this.getMailboxes}
                    lastSyncDate={lastSyncDate}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    renderItem={this.renderItem}
                    renderQuickActions={this.renderQuickActions}
                    ItemSeparatorComponent={this.renderSeparator}
                    contentInsetAdjustmentBehavior='automatic'
                    bounceFirstRowOnMount={edit}
                    maxSwipeDistance={this.getSwipeDistance}
                />
                {isAndroid && !_.isEmpty(mailboxes) && (
                    <ActionButton color={this.selectColor(Colors.gold, DarkColors.gold)} onPress={this.navigateMailboxAdd} iconName='plus' />
                )}
            </View>
        );
    }

    keyExtractor = ({id, actions}) => {
        if (_.isEmpty(actions)) {
            return String(id);
        }

        return `${String(id)}-${actions.length}`;
    };

    render() {
        const {mailboxes} = this.state;

        if (_.isArray(mailboxes)) {
            if (!_.isEmpty(mailboxes)) {
                return this.renderMailboxes();
            }

            return this.renderForm();
        }

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <Spinner androidColor={this.selectColor(Colors.gold, DarkColors.gold)} style={styles.spinner} />
            </View>
        );
    }
}

export default withTheme(MailboxList);
