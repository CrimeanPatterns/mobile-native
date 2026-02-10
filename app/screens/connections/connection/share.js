import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, SectionList, StyleSheet, Text, View} from 'react-native';

import {Button} from '../../../components/form';
import Icon from '../../../components/icon';
import Modal from '../../../components/page/modal/modalNavigation';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseConnection} from './index';

const [ACCOUNTS_WITHOUT_LOCAL_PASSWORDS, ACCOUNTS_WITH_LOCAL_PASSWORDS] = [0, 1];

class ConnectionShare extends BaseConnection {
    static navigationOptions = () => ({
        title: '',
        headerShown: false,
        gestureEnabled: false,
        tabBarVisible: false,
        animationEnabled: false,
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
                timing: 0,
            },
        }),
    });

    constructor(props) {
        super(props);

        this.buttonUndo = null;

        this.state = {
            loading: false,
            items: [],
            agent: null,
            fullAccess: false,
            avatar: null,
            hidePopup: false,
            connectionId: null,
        };
    }

    async componentDidMount() {
        this.mounted = true;
        await this.shareAccounts();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    getConnectionId = () => {
        const {connectionId} = this.state;
        const connection = this.getConnection();

        if (_.isObject(connection)) {
            const {id} = connection;

            return id;
        }

        return connectionId;
    };

    shareAccounts = async () => {
        const {route} = this.props;
        const id = this.getConnectionId();
        const grantType = route.params?.grantType ?? 'readonly';
        const shareCode = route.params?.shareCode ?? null;
        let response;

        this.setLoading(true);

        if (_.isString(shareCode)) {
            response = await this.share(shareCode);
        } else {
            response = await this.grant({id}, grantType);
        }

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isObject(data)) {
                const {agent, accountsWithoutLocalPasswords, accountsWithLocalPasswords, fullAccess, avatar, connectionId} = data;
                const items = [];

                if (_.isEmpty(accountsWithoutLocalPasswords) === false) {
                    items.push({
                        section: ACCOUNTS_WITHOUT_LOCAL_PASSWORDS,
                        data: accountsWithoutLocalPasswords,
                    });
                }

                if (_.isEmpty(accountsWithLocalPasswords) === false) {
                    items.push({
                        section: ACCOUNTS_WITH_LOCAL_PASSWORDS,
                        data: accountsWithLocalPasswords,
                    });
                }

                this.safeSetState({
                    agent,
                    items,
                    fullAccess,
                    avatar,
                    connectionId,
                });
            }
        }

        this.setLoading(false);
    };

    undo = async () => {
        const id = this.getConnectionId();

        this.buttonUndo.setLoading(true);

        await this.denyAll({id});

        this.close();
    };

    setLoading = (loading) => {
        this.safeSetState({loading});
    };

    close = () => {
        const id = this.getConnectionId();
        const {navigation} = this.props;

        if (!id) {
            return navigation.navigate('Connections');
        }

        return navigation.navigate('ConnectionEdit', {id, reload: true});
    };

    renderSectionHeader = ({section: {section}}) => {
        const {agent, avatar} = this.state;
        const translations = [
            Translator.trans('share-all.success', {agentName: ''}),
            Translator.trans('share-all.without-passwords', {agentName: ''}),
        ];

        return (
            <View style={[styles.user, this.isDark && styles.userDark]}>
                {section === ACCOUNTS_WITHOUT_LOCAL_PASSWORDS && this.renderAvatar(avatar)}
                <View style={styles.userDetails}>
                    <Text style={[styles.userName, this.isDark && styles.textDark]}>{translations[section]}</Text>
                    {section === ACCOUNTS_WITHOUT_LOCAL_PASSWORDS && (
                        <Text style={[styles.userName, styles.boldText, this.isDark && styles.textDark]}>{agent}</Text>
                    )}
                </View>
            </View>
        );
    };

    renderFooter = () => {
        const {hidePopup} = this.state;
        const colors = this.themeColors;
        const {whiteStyle, blueStyle} = this.getButtonStyles();

        if (!hidePopup) {
            return (
                <View style={[styles.modalBottom, this.isDark && styles.modalBottomDark]}>
                    <View style={styles.modalInfo}>
                        <Icon color={colors.green} style={[styles.modalInfoIcon, styles.containerIconWhite]} name='square-success' size={13} />
                        <View style={styles.modalInfoDetails}>
                            <Text style={[styles.modalInfoText, this.isDark && styles.textDark]}>{Translator.trans('share-all.done')}</Text>
                            <Text style={[styles.modalInfoSmallText, this.isDark && styles.textDark]}>
                                {Translator.trans(
                                    /** @Desc("If you did this by mistake you can undo this by pressing the \"Undo\" button below.") */ 'share-undo',
                                    {},
                                    'mobile-native',
                                )}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.modalBottomButtons}>
                        <View style={styles.modalButton}>
                            <Button
                                ref={(ref) => {
                                    this.buttonUndo = ref;
                                }}
                                mode='outlined'
                                label={Translator.trans(/** @Desc("Undo") */ 'undo', {}, 'mobile-native')}
                                customStyle={whiteStyle}
                                raised
                                onPress={this.undo}
                                pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                            />
                        </View>
                        <View style={styles.modalButton}>
                            <Button
                                mode='outlined'
                                label={Translator.trans('button.ok')}
                                raised
                                onPress={() => this.safeSetState({hidePopup: true})}
                                pressedColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                                customStyle={blueStyle}
                            />
                        </View>
                    </View>
                </View>
            );
        }

        return null;
    };

    renderIcon = (section) => {
        const colors = this.themeColors;

        if (section === ACCOUNTS_WITHOUT_LOCAL_PASSWORDS) {
            return <Icon color={colors.green} style={[styles.containerIcon, styles.containerIconWhite]} name='square-success' size={13} />;
        }

        return <Icon color={colors.orange} style={styles.containerIcon} name='warning' size={13} />;
    };

    renderItem = ({item, section: {section}}) => {
        const {program, user, balance} = item;

        return (
            <View style={styles.container}>
                <View style={styles.containerLeft}>
                    {this.renderIcon(section)}
                    <View style={styles.containerCol}>
                        <Text style={[styles.containerText, this.isDark && styles.textGray]}>{program}</Text>
                        <Text style={[styles.containerSmallText, this.isDark && styles.textDark]}>{user}</Text>
                    </View>
                </View>
                <View style={styles.containerRight}>
                    <Text style={[styles.containerText, this.isDark && styles.textDark]}>{balance}</Text>
                </View>
            </View>
        );
    };

    renderItemSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    keyExtractor = (item, index) => `${index}`;

    renderContent = () => {
        const {loading, items} = this.state;

        if (loading) {
            return this.renderSpinner();
        }

        return (
            <>
                <SectionList
                    sections={items}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    renderSectionHeader={this.renderSectionHeader}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    stickySectionHeadersEnabled={false}
                    automaticallyAdjustContentInsets
                    contentInsetAdjustmentBehavior='automatic'
                />
                {this.renderFooter()}
            </>
        );
    };

    render() {
        return (
            <Modal headerColor={this.mainColor} title={Translator.trans('access_level.granted.account')} onClose={this.close}>
                <View style={[styles.page, this.isDark && styles.pageDark]}>{this.renderContent()}</View>
            </Modal>
        );
    }
}

export default withTheme(ConnectionShare);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    textGray: {
        color: DarkColors.text,
    },
    user: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray,
        ...Platform.select({
            ios: {
                padding: 15,
                borderBottomWidth: 2,
            },
            android: {
                paddingHorizontal: 16,
                paddingVertical: 25,
                borderBottomWidth: 1,
            },
        }),
    },
    userDark: {
        backgroundColor: DarkColors.bg,
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    userDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingLeft: 15,
            },
            android: {
                paddingLeft: 20,
            },
        }),
    },
    userName: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 17,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    modalInfo: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    modalInfoIcon: {
        ...Platform.select({
            ios: {
                marginTop: 3,
            },
            android: {
                marginTop: 5,
            },
        }),
    },
    modalInfoDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingLeft: 15,
            },
            android: {
                paddingLeft: 10,
            },
        }),
    },
    modalInfoText: {
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 13,
                fontFamily: Fonts.bold,
                fontWeight: 'bold',
            },
            android: {
                fontSize: 16,
                fontFamily: Fonts.regular,
            },
        }),
    },
    modalInfoSmallText: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                color: Colors.grayDark,
                marginTop: 5,
            },
            android: {
                color: '#9e9e9e',
            },
        }),
    },
    modalBottom: {
        bottom: 0,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                paddingVertical: 15,
                borderTopWidth: 1,
                borderTopColor: Colors.gray,
            },
            android: {
                paddingVertical: 20,
            },
        }),
    },
    modalBottomDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
                borderTopColor: DarkColors.border,
            },
        }),
    },
    modalBottomButtons: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        ...Platform.select({
            ios: {
                padding: 25,
            },
            android: {
                paddingVertical: 15,
                paddingHorizontal: 8,
            },
        }),
    },
    modalButton: {
        width: '50%',
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 8,
            },
        }),
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                minHeight: 50,
                paddingVertical: 5,
            },
            android: {
                paddingHorizontal: 16,
                minHeight: 70,
                paddingVertical: 10,
            },
        }),
    },
    containerLeft: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    containerCol: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingLeft: 15,
            },
            android: {
                paddingLeft: 10,
            },
        }),
    },
    containerRight: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingLeft: 10,
    },
    containerText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 15,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    containerSmallText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        ...Platform.select({
            ios: {
                fontSize: 12,
            },
            android: {
                fontSize: 14,
            },
        }),
    },
    containerIcon: {
        marginTop: 4,
    },
    containerIconWhite: {
        backgroundColor: Colors.white,
        width: 13,
        height: 13,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
});
