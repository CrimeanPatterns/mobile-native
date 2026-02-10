import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';

import {SubmitButton} from '../../components/form';
import Icon from '../../components/icon';
import {ActionSheet, RefreshableSectionList} from '../../components/page';
import ActionButton from '../../components/page/actionButton';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import ConnectionsAPI from '../../services/http/connections';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme} from '../../theme';
import sectionListGetItemLayout from '../../vendor/sectionListGetItemLayout';
import {BaseConnection} from './connection';

const [CONNECTED_USERS, FAMILY_MEMBERS, PENDING_CONNECTIONS] = [1, 2, 3];
const TouchableButton = getTouchableComponent(TouchableOpacity);
const TouchableRow = getTouchableComponent(TouchableHighlight);

class Connections extends BaseConnection {
    constructor(props) {
        super(props);

        this.getList = this.getList.bind(this);
        this.setList = this.setList.bind(this);

        this.getItemLayout = sectionListGetItemLayout({
            getItemHeight: () => 50,
            getSeparatorHeight: () => 1,
            getSectionHeaderHeight: () => 80,
        });

        this.state = {
            loading: false,
            data: [],
            lastSyncDate: Date.now(),
        };
    }

    async componentDidMount() {
        this.mounted = true;
        this.subscribe();

        this.setLoading(true);

        await this.getList();

        this.setLoading(false);
    }

    componentWillUnmount() {
        this.mounted = false;
        this.unsubscribe();
    }

    subscribe() {
        const {navigation, route} = this.props;

        this.willFocusSubscription2 = navigation.addListener('focus', (props) => {
            const {route} = this.props;

            if (route.params?.reload) {
                this.reload();
            }

            const addNewPerson = route.params?.addNewPerson ?? false;
            const addNewConnection = route.params?.addNewConnection ?? false;

            if (addNewPerson && this.addActionSheet) {
                navigation.setParams({addNewPerson: false});

                this.addActionSheet.show();
            } else if (addNewConnection) {
                this.actionAddConnection(0);
            }
        });

        super.subscribe();
    }

    unsubscribe() {
        if (this.willFocusSubscription2) {
            this.willFocusSubscription2();
        }
        super.unsubscribe();
    }

    async getList() {
        try {
            const response = await ConnectionsAPI.get();

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    this.setList(data);
                }
            }
        } finally {
            this.safeSetState({
                forceRefresh: false,
            });
        }
    }

    setList({connections, familyMembers, pendingConnections}) {
        const data = [];

        if (_.isEmpty(familyMembers) === false) {
            data.push({
                section: FAMILY_MEMBERS,
                data: familyMembers,
            });
        }

        if (_.isEmpty(connections) === false) {
            data.push({
                section: CONNECTED_USERS,
                data: connections,
            });
        }

        if (_.isEmpty(pendingConnections) === false) {
            data.push({
                section: PENDING_CONNECTIONS,
                data: pendingConnections,
            });
        }

        this.safeSetState({data, lastSyncDate: Date.now()});
    }

    setLoading(loading) {
        this.safeSetState({loading});
    }

    async reload() {
        const {navigation} = this.props;

        navigation.setParams({reload: false});

        if (!isIOS) {
            this.safeSetState({
                forceRefresh: true,
            });
        } else {
            navigation.setParams({loading: true});
            try {
                await this.getList();
            } finally {
                navigation.setParams({loading: false});
            }
        }
    }

    actionAddConnection = (index) => {
        const {navigation} = this.props;

        if (index === 0) {
            this.showInvitePopup();
        }

        if (index === 1) {
            navigation.navigate('AgentAdd', {onSuccess: () => this.reload()});
        }
    };

    editConnection = (connection) => {
        const {edit, actions} = connection;
        const {navigation} = this.props;

        if (edit === true) {
            const {id} = connection;

            navigation.navigate('ConnectionEdit', {id, reloadCb: () => this.reload()});
        } else {
            this.showActions({connection, actions});
        }
    };

    openAddActionSheet = () => {
        if (this.addActionSheet) {
            this.addActionSheet.show();
        }
    };

    renderSectionHeader = ({section: {section}}) => {
        const titles = [];

        titles[CONNECTED_USERS] = Translator.trans(/** @Desc("Connected Users") */ 'connected.users', {}, 'mobile-native');
        titles[FAMILY_MEMBERS] = Translator.trans(/** @Desc("Family Members") */ 'family.members', {}, 'mobile-native');
        titles[PENDING_CONNECTIONS] = Translator.trans('user.connections.heading.pending_table', {}, 'messages');

        return (
            <View style={[styles.title, this.isDark && styles.titleDark]}>
                <Text style={[styles.titleText, this.isDark && styles.textDark]}>{titles[section]}</Text>
            </View>
        );
    };

    renderFooter = () => {
        if (!isIOS) {
            return <View style={styles.footer} />;
        }

        if (this.state.loading === false) {
            const {theme} = this.props;

            return (
                <View style={styles.footer}>
                    <SubmitButton
                        color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                        onPress={this.openAddActionSheet}
                        label={Translator.trans('user.connections.btn.new_connection')}
                        raised
                        theme={theme}
                    />
                </View>
            );
        }

        return null;
    };

    renderStatus = (status) => {
        const text = BaseConnection.getStatusTranslation(status);
        const statusIcon = this.getStatusIcon(status);

        return (
            _.isString(text) && (
                <View style={styles.containerDetailsRow}>
                    {_.isNull(statusIcon) === false && statusIcon}
                    <Text style={[styles.boldText, this.isDark && styles.boldTextDark]}>{text}</Text>
                </View>
            )
        );
    };

    renderButtons = ({section, item}) => {
        if (section === PENDING_CONNECTIONS) {
            return (
                <View style={styles.containerLinks}>
                    <TouchableButton onPress={() => this.doAction({connection: item, action: 'approveRequest'})}>
                        <Text style={[styles.blueLink, this.isDark && styles.blueLinkDark]}>
                            {Translator.trans('user.connections.button.approve')}
                        </Text>
                    </TouchableButton>
                    <View style={styles.separatorButton} />
                    <TouchableButton onPress={() => this.doAction({connection: item, action: 'denyRequest'})}>
                        <Text style={[styles.redLink, this.isDark && styles.redLinkDark]}>{Translator.trans('user.connections.button.deny')}</Text>
                    </TouchableButton>
                </View>
            );
        }

        return null;
    };

    renderItem = ({item, section: {section}, separators}) => {
        const {email, name, status} = item;
        const isPendingConnection = section === PENDING_CONNECTIONS;
        const colors = this.themeColors;
        const props = {};
        let Touchable = View;

        if (!isPendingConnection) {
            Touchable = TouchableRow;
            props.onPress = () => {
                this.editConnection(item);
            };
            if (!isIOS) {
                props.onPressIn = separators.highlight;
                props.onPressOut = separators.unhighlight;
            }
            props.delayPressIn = 0;
            props.underlayColor = this.selectColor(Colors.grayLight, DarkColors.bg);
        }

        return (
            <Touchable {...props}>
                <View style={[styles.container]}>
                    <View style={[styles.containerCaption, !isPendingConnection && {maxWidth: '90%', paddingRight: 0}]}>
                        <View style={styles.containerRow}>
                            {_.isString(name) && <Text style={[styles.caption, this.isDark && styles.textDark]}>{name}</Text>}
                            {!_.isString(name) && _.isString(email) && <Text style={[styles.caption, this.isDark && styles.textDark]}>{email}</Text>}
                        </View>
                        {this.renderStatus(status)}
                    </View>
                    {this.renderButtons({section, item})}
                    {!isPendingConnection && <Icon style={styles.arrow} name='arrow' color={colors.grayDarkLight} size={20} />}
                </View>
            </Touchable>
        );
    };

    renderEmpty = () => {
        const {loading} = this.state;
        const colors = this.themeColors;

        return (
            !loading && (
                <View style={styles.emptyList}>
                    <Icon name='info' color={colors.blue} size={13} />
                    <Text style={[styles.emptyListText, this.isDark && styles.textDark]}>{Translator.trans('no-connections')}</Text>
                </View>
            )
        );
    };

    renderItemSeparator = (separators) => (
        <View style={[styles.separator, this.isDark && styles.separatorDark, separators.highlighted && styles.separatorHide]} />
    );

    renderAddConnectionSheet = () => {
        const items = [Translator.trans('agents.popup.connect.btn'), Translator.trans('agents.popup.add.btn')];
        const tintColor = Platform.select({android: this.selectColor(Colors.grayDarkLight, DarkColors.text)});

        return (
            <ActionSheet
                ref={(ref) => (this.addActionSheet = ref)}
                options={items}
                tintColor={tintColor}
                onPress={this.actionAddConnection}
                title={Translator.trans('agents.popup.header')}
                message={Translator.trans('agents.popup.content')}
                cancelButton={Translator.trans('cancel', {}, 'messages')}
                buttonUnderlayColor={this.selectColor('#f9f9f9', DarkColors.bgLight)}
            />
        );
    };

    keyExtractor = (item, index) => `${index}`;

    render() {
        const {data, loading, lastSyncDate, forceRefresh} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.bgDark]}>
                {loading && this.renderSpinner()}
                <RefreshableSectionList
                    style={styles.content}
                    sections={data}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    renderSectionHeader={this.renderSectionHeader}
                    ListFooterComponent={this.renderFooter}
                    ItemSeparatorComponent={this.renderItemSeparator}
                    SectionSeparatorComponent={this.renderItemSeparator}
                    ListEmptyComponent={this.renderEmpty}
                    onRefresh={this.getList}
                    lastSyncDate={lastSyncDate}
                    forceRefresh={forceRefresh}
                    windowSize={31}
                    contentInsetAdjustmentBehavior='automatic'
                    getItemLayout={this.getItemLayout}
                />
                {isAndroid && !loading && <ActionButton color={this.mainColor} onPress={this.openAddActionSheet} iconName='plus' />}
                {this.renderConnectionActionSheet()}
                {this.renderAddConnectionSheet()}
            </View>
        );
    }
}

const ConnectionsScreen = ({route, navigation}) => {
    const theme = useTheme();

    return <Connections theme={theme} route={route} navigation={navigation} />;
};

ConnectionsScreen.navigationOptions = ({route}) => {
    const loading = route.params?.loading;
    const title = Translator.trans('connected.members', {}, 'mobile');

    if (isAndroid) {
        return {
            title,
        };
    }

    return {
        title,
        headerTitle: () => loading && <Spinner />,
    };
};

export {ConnectionsScreen};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    bgDark: {
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
                color: DarkColors.text,
            },
        }),
    },
    content: {
        flexGrow: 1,
        minHeight: '100%',
    },
    title: {
        height: 80,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 10,
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                paddingRight: 5,
                borderBottomWidth: 2,
                borderBottomColor: Colors.borderGray,
            },
            android: {
                marginLeft: 16,
                paddingRight: 16,
            },
        }),
    },
    titleDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
                borderBottomWidth: 1,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    titleText: {
        fontFamily: Fonts.regular,
        fontWeight: 'normal',
        ...Platform.select({
            ios: {
                color: Colors.grayDark,
                fontSize: 25,
            },
            android: {
                color: Colors.gold,
                fontSize: 20,
            },
        }),
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        paddingVertical: 5,
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                paddingRight: 10,
                minHeight: 50,
            },
            android: {
                paddingHorizontal: 16,
                minHeight: 56,
            },
        }),
    },
    caption: {
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
    containerCaption: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        maxWidth: '60%',
        paddingRight: 10,
    },
    containerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        ...Platform.select({
            ios: {
                // maxWidth: '90%',
            },
        }),
    },
    containerDetailsRow: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row-reverse',
    },
    arrow: {
        textAlign: 'right',
        ...Platform.select({
            android: {
                width: 0,
                height: 0,
                opacity: 0,
                margin: 0,
            },
        }),
    },
    boldText: {
        marginRight: 10,
        ...Platform.select({
            ios: {
                fontSize: 15,
                fontFamily: Fonts.bold,
                color: Colors.grayDark,
                fontWeight: 'bold',
            },
            android: {
                fontSize: 14,
                fontFamily: Fonts.regular,
                color: Colors.gold,
            },
        }),
    },
    boldTextDark: {
        ...Platform.select({
            ios: {
                color: DarkColors.text,
            },
            android: {
                color: DarkColors.gray,
            },
        }),
    },
    containerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separatorButton: {
        marginHorizontal: 20,
        width: 1,
        height: 20,
        backgroundColor: Colors.gray,
    },
    blueLink: {
        fontSize: 13,
        color: Colors.blue,
        ...Platform.select({
            ios: {
                fontSize: 13,
                fontFamily: Fonts.bold,
                fontWeight: 'bold',
            },
            android: {
                fontSize: 14,
                fontFamily: Fonts.regular,
            },
        }),
    },
    blueLinkDark: {
        color: DarkColors.blue,
    },
    redLink: {
        fontFamily: Fonts.regular,
        color: '#ff3b31',
        paddingHorizontal: 5,
        ...Platform.select({
            ios: {
                fontSize: 13,
            },
            android: {
                fontSize: 14,
            },
        }),
    },
    redLinkDark: {
        color: DarkColors.red,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
        ...Platform.select({
            android: {
                marginLeft: 16,
            },
        }),
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    separatorHide: {
        backgroundColor: 'transparent',
    },
    footer: {
        height: Platform.select({ios: 88, android: 96}),
    },
    emptyList: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        padding: 25,
    },
    emptyListText: {
        fontSize: 14,
        marginLeft: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
});
