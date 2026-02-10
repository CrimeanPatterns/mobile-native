import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';

import {DateTitle, SectionRow} from '../../../../components/accounts/history';
import HistorySkeletonList from '../../../../components/accounts/history/skeletonList';
import {BaseThemedPureComponent} from '../../../../components/baseThemed';
import Icon from '../../../../components/icon';
import SearchBar from '../../../../components/page/searchBar';
import Spinner from '../../../../components/spinner';
import UpgradeFAQ from '../../../../components/upgrade';
import {isIOS} from '../../../../helpers/device';
import {useAccount} from '../../../../hooks/account';
import Account from '../../../../services/http/account';
import Storage from '../../../../storage';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {ColorScheme, useTheme} from '../../../../theme';
import {IAccount} from '../../../../types/account';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../../types/navigation';

class AccountHistory extends BaseThemedPureComponent<
    {
        theme: ColorScheme;
        navigation: StackNavigationProp<AccountsStackParamList, 'AccountHistory'>;
        route: RouteProp<AccountsStackParamList, 'AccountHistory'>;
        account: IAccount;
        parentAccount?: IAccount;
    },
    {
        history: null;
        search: string;
        nextPageToken: null;
        loading: boolean;
        showSpinner: boolean;
    }
> {
    static ANALYTIC_TAG = 'transaction-history&mid=mobile';

    private initialHistory: any[];

    private didFocusSubscription: (() => void) | undefined;

    private mounted = false;

    private loadingTimeout: number | null | undefined;

    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderHeader = this.renderHeader.bind(this);

        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);

        this.initialHistory = null;
        this.state = {
            history: null,
            search: '',
            nextPageToken: null,
            loading: false,
            showSpinner: false,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {account} = this.getAccount();

        this.loadingTimeout = null;
        this.mounted = true;

        if (_.isObject(account)) {
            this.didFocusSubscription = navigation.addListener('focus', this.init);
        } else {
            navigation.goBack();
        }
    }

    componentWillUnmount() {
        this.loadingTimeout = null;
        this.mounted = false;
        this.initialHistory = null;
        if (this.didFocusSubscription) {
            this.didFocusSubscription();
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    init() {
        if (this.isFree() === false) {
            this.getHistory();
        }
    }

    isFree = () => {
        const {Free} = Storage.getItem('profile');

        return Free === true;
    };

    getAccount() {
        const {account, parentAccount} = this.props;

        return {account, parentAccount};
    }

    getHistory(postData, loadMore = false) {
        const {account, parentAccount} = this.getAccount();
        const requestParam = {};

        if (_.isObject(parentAccount)) {
            requestParam.accountId = parentAccount.ID;
            requestParam.subAccountId = account.SubAccountID;
        } else {
            requestParam.accountId = account.ID;
        }

        if (_.isObject(postData)) {
            requestParam.postData = postData;
        }

        Account.getHistory(requestParam).then((response) => {
            const {data} = response;

            if (this.loadingTimeout != null) {
                clearTimeout(this.loadingTimeout);
            }

            if (_.isObject(data)) {
                const {history} = this.state;
                const {rows, nextPageToken} = data;

                if (_.isArray(rows)) {
                    let data;

                    if (_.isNil(this.initialHistory)) {
                        this.initialHistory = rows;
                    }

                    if (loadMore && _.isArray(history)) {
                        data = history.concat(rows);
                    } else {
                        data = rows;
                    }

                    this.safeSetState({
                        history: data,
                        nextPageToken,
                        loading: false,
                        showSpinner: false,
                    });
                }
            }
        });

        if (loadMore) {
            this.safeSetState(
                {
                    loading: true,
                },
                () => {
                    this.loadingTimeout = setTimeout(() => {
                        const {loading} = this.state;

                        if (loading) {
                            this.safeSetState({
                                showSpinner: true,
                            });
                        }
                    }, 2000);
                },
            );
        }
    }

    onSearchChange(search) {
        if (_.isArray(this.initialHistory)) {
            if (search && search.length > 0) {
                this.safeSetState({search}, () => this.search());
            } else {
                this.safeSetState({
                    search,
                    history: this.initialHistory,
                });
            }
        } else {
            this.safeSetState({search});
        }
    }

    search() {
        const {search} = this.state;

        if (search && search.length >= 3) {
            this.getHistory({
                descriptionFilter: search,
            });
        }
    }

    handleLoadMore = _.debounce(() => {
        const {search, nextPageToken} = this.state;

        if (!_.isEmpty(nextPageToken)) {
            this.getHistory(
                {
                    descriptionFilter: search,
                    nextPage: nextPageToken,
                },
                true,
            );
        }
    }, 250);

    renderHeader({editable = true}) {
        const {search} = this.state;
        const {account, parentAccount} = this.getAccount();
        const providerName = account.DisplayName;
        let accountNumber;
        let userName;

        if (_.isObject(parentAccount)) {
            userName = parentAccount.UserName;
            accountNumber = parentAccount.Login;
        } else {
            userName = account.UserName;
            accountNumber = account.Login;
        }

        return (
            <>
                <View style={[styles.title, this.isDark && styles.titleDark]}>
                    <Text style={[styles.titleText, this.isDark && styles.textDark]}>
                        {Translator.trans('history-transaction.provider-header', {providerName}, 'messages')}
                    </Text>
                    <Text style={[styles.titleAccount, this.isDark && styles.textDark]}>
                        {Translator.trans('history-transaction.account-header', {accountNumber, userName}, 'messages')}
                    </Text>
                </View>
                <SearchBar tintColor={this.isDark ? DarkColors.blue : Colors.blue} placeholder={Translator.trans('search')} value={search} onChangeText={this.onSearchChange} editable={editable} />
            </>
        );
    }

    renderFooter() {
        const {loading, showSpinner, history} = this.state;

        return (
            <>
                {_.isArray(history) && history.length > 0 && <View style={[styles.separator, this.isDark && styles.separatorDark]} />}
                {loading && showSpinner && (
                    <Spinner androidColor={this.selectColor(Colors.blueDark, DarkColors.blue)} style={{marginTop: 10, alignSelf: 'center'}} />
                )}
            </>
        );
    }

    renderEmptyList = () => {
        const colors = this.themeColors;

        return (
            <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                <Icon name='warning' color={colors.orange} size={24} />
                <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>
                    {Translator.trans('account.history.not-exist', {}, 'messages')}
                </Text>
            </View>
        );
    };

    renderItem = ({item, index}) => {
        const {history} = this.state;
        const {theme} = this.props;

        if (item.kind === 'row') {
            const hasArrow = history[index - 1] && history[index - 1].kind === 'date';

            return (
                <SectionRow
                    {...item}
                    index={index}
                    arrow={hasArrow}
                    last={index === history.length - 1}
                    extraData={{source: AccountHistory.ANALYTIC_TAG}}
                    theme={theme}
                />
            );
        }

        return <DateTitle title={item.value} theme={theme} />;
    };

    renderSkeletonHeader = () => this.renderHeader({editable: false});

    keyExtractor = (item, index) => {
        if (_.isObject(item) && item.date) {
            const {d, m} = item.date;

            return `${d}-${m}-${index}`;
        }

        return String(index);
    };

    render() {
        const {history} = this.state;

        if (this.isFree()) {
            return <UpgradeFAQ />;
        }

        if (_.isArray(history)) {
            return (
                <FlatList
                    style={[styles.page, this.isDark && styles.pageDark]}
                    windowSize={21}
                    scrollEventThrottle={16}
                    contentInsetAdjustmentBehavior='automatic'
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='always'
                    data={history}
                    extraData={this.state}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    ListEmptyComponent={this.renderEmptyList}
                    renderItem={this.renderItem}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0.5}
                    keyExtractor={this.keyExtractor}
                    scrollIndicatorInsets={{right: 1}}
                />
            );
        }

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <HistorySkeletonList ListHeaderComponent={this.renderSkeletonHeader} />
            </View>
        );
    }
}

export const AccountHistoryScreen: AccountsStackScreenFunctionalComponent<'AccountHistory'> = ({navigation, route}) => {
    const theme = useTheme();
    const {ID, SubAccountID} = route.params;
    const {account, parentAccount} = useAccount(ID, SubAccountID);

    return <AccountHistory theme={theme} navigation={navigation} route={route} account={account} parentAccount={parentAccount} />;
};

AccountHistoryScreen.navigationOptions = () => ({title: Translator.trans('history', {}, 'mobile')});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    title: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        paddingHorizontal: isIOS ? 15 : 16,
    },
    titleDark: {
        borderBottomColor: DarkColors.border,
    },
    titleText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 17,
                lineHeight: 20,
            },
            android: {
                fontSize: 20,
                lineHeight: 24,
            },
        }),
    },
    titleAccount: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        marginTop: 5,
        ...Platform.select({
            ios: {
                fontSize: 12,
                lineHeight: 14,
            },
            android: {
                fontSize: 14,
                lineHeight: 16,
            },
        }),
    },
    separator: {
        backgroundColor: Colors.gray,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    noFound: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        backgroundColor: Colors.white,
        padding: 25,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: Colors.black,
    },
    noFoundText: {
        fontSize: 13,
        marginLeft: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});
