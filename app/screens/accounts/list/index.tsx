import BottomSheetAccountsUpdate from '@components/accounts/list/bottomSheet/accountsUpdate';
import ButtonBar from '@components/accounts/list/button-bar';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {useDebounce} from 'use-debounce';

import DiscoveredAccounts from '../../../components/accounts/discovered';
import AccountListFooter from '../../../components/accounts/list/footer';
import TotalBar from '../../../components/accounts/list/total-bar';
import Icon from '../../../components/icon';
import ActionButton from '../../../components/page/actionButton';
import {Header} from '../../../components/page/header';
import HeaderButton from '../../../components/page/header/button';
import Title from '../../../components/page/header/title';
import SearchBar from '../../../components/page/searchBar';
import {getDefaultNavigationOptions} from '../../../config/defaultHeader';
import {BottomSheetUpdateAccountsProvider, useBottomSheetUpdateAccountsContext} from '../../../context/updateAccounts';
import {isAndroid, isIOS} from '../../../helpers/device';
import {handleOpenUrl} from '../../../helpers/handleOpenUrl';
import {IDiscoveredAccount, useDiscoveredAccounts} from '../../../hooks/accounts';
import AccountsListService from '../../../services/accountsList';
import EventEmitter from '../../../services/eventEmitter';
import Session from '../../../services/session';
import StorageSync from '../../../services/storageSync';
import Storage from '../../../storage';
import {Colors, DarkColors} from '../../../styles';
import {ColorSchemeDark, useTheme} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import AccountAddListKindScreen from '../add/listKind';
import styles from './styles';
import {AccountSwipeableList} from './swipeableList';

const AccountListScreen: AccountsStackScreenFunctionalComponent<'AccountsList'> = ({navigation, route}) => {
    const [lastSyncDate, setLastSyncDate] = useState(Session.getProperty('timestamp'));
    const [accountList, setAccountList] = useState(AccountsListService.getList());
    const [searchList, setSearchList] = useState<IAccount[]>([]);
    const [counters, setCounters] = useState(AccountsListService.getCounters());
    const isFocused = useIsFocused();

    const updateData = useCallback(
        (lastSyncDate?: number) => {
            if (lastSyncDate) {
                setLastSyncDate(lastSyncDate);
            }

            setCounters(AccountsListService.getCounters());
            setAccountList(AccountsListService.getList());
            setSearchList(AccountsListService.getSearchList());
        },
        [navigation],
    );

    useEffect(() => {
        navigation.setParams({
            // @ts-ignore
            amount: counters.accounts,
        });
    }, [counters]);

    useEffect(() => {
        if (isFocused) {
            updateData();
        }
    }, [isFocused]);

    useEffect(() => {
        const listener = EventEmitter.addListener('accountsList:update', () => updateData(Date.now()));

        return () => listener.remove();
    }, []);

    return (
        <BottomSheetUpdateAccountsProvider>
            <AccountList
                navigation={navigation}
                route={route}
                lastSyncDate={lastSyncDate}
                accountList={accountList}
                searchList={searchList}
                counters={counters}
            />
        </BottomSheetUpdateAccountsProvider>
    );
};

// @ts-ignore
AccountListScreen.navigationOptions = ({navigation, route, theme}) => {
    const amount = route.params?.amount ?? 0;
    const discoveredAccounts = route.params?.discoveredAccounts ?? 0;
    const hasAccounts = amount !== 0;
    const hasDiscovered = discoveredAccounts > 0 && !hasAccounts;
    let headerRight: (() => React.ReactNode) | null = null;
    const options: Partial<NativeStackNavigationOptions> = {
        title: hasDiscovered ? Translator.trans('discovered-accounts', {}, 'mobile-native') : Translator.trans('menu.button.accounts', {}, 'menu'),
        headerTitle: undefined,
    };

    const handleLeftButtonPress = () => {
        EventEmitter.emit('pressLeftButtonEvent');
    };

    if (!hasDiscovered) {
        options.headerTitle = () =>
            !hasDiscovered && (
                <Title
                    title={Translator.trans('menu.button.accounts', {}, 'menu')}
                    amount={amount}
                    amountColor={Platform.select({ios: Colors.blue, android: Colors.blueDark})}
                    amountColorDark={DarkColors.blue}
                />
            );
    }

    if (!hasDiscovered && hasAccounts && isIOS) {
        headerRight = () => (
            <HeaderButton
                testID='accounts-add-header'
                iconName='plus'
                onPress={() =>
                    // @ts-ignore
                    navigation.navigate(discoveredAccounts > 0 ? 'DiscoveredAccounts' : 'AccountsAdd')
                }
            />
        );
    }

    const {headerStyle} = getDefaultNavigationOptions(theme, Colors.blueDark);

    if (isAndroid) {
        return {
            header: () => (
                <Header
                    {...options}
                    headerStyle={headerStyle}
                    headerLeft={headerRight}
                    headerRight={() => hasAccounts && <HeaderButton testID='update-all' iconName='update-all' onPress={handleLeftButtonPress} />}
                />
            ),
            title: Translator.trans('menu.button.accounts', {}, 'menu'),
        };
    }

    return {
        header: () => (
            <Header
                {...options}
                headerStyle={headerStyle}
                headerRight={headerRight}
                headerLeft={() => hasAccounts && <HeaderButton testID='update-all' iconName='update-all' onPress={handleLeftButtonPress} />}
            />
        ),
        title: Translator.trans('menu.button.accounts', {}, 'menu'),
    };
};

type AccountListScreenProps = {
    navigation: StackNavigationProp<AccountsStackParamList, 'AccountsList'>;
    route: RouteProp<AccountsStackParamList, 'AccountsList'>;
};

const AccountList: React.FunctionComponent<
    AccountListScreenProps & {
        lastSyncDate: number;
        accountList: IAccount[];
        searchList: IAccount[];
        counters: {[key: string]: number};
    }
> = ({navigation, accountList, searchList, lastSyncDate, counters}) => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const [searchQuery, setSearch] = useState('');
    const {discoveredAccounts, deleteDiscoveredAccount, updateDiscoveredAccounts} = useDiscoveredAccounts();
    const [search] = useDebounce(searchQuery, 300);
    const {presentBottomSheet} = useBottomSheetUpdateAccountsContext();

    const onSearchInput = (search) => setSearch(search);
    const filterList = (accounts: IAccount[], search: string) =>
        accounts.filter((account) => {
            let additionalResult = false;

            if (_.isArray(account.SubAccountsArray)) {
                additionalResult = !_.isEmpty(filterList(account.SubAccountsArray, search));
            }

            const hasSearchText = [account.DisplayName, account.Login].filter(
                (str) => _.isString(str) && str.toLowerCase().indexOf(search.toLowerCase()) > -1,
            );

            return hasSearchText.length > 0 || additionalResult;
        });

    const filterDiscoveredAccounts = (discoveredAccounts: IDiscoveredAccount[], search: string) =>
        discoveredAccounts.filter((account) => account.provider.toLowerCase().includes(search.toLowerCase()));

    const refreshData = () => StorageSync.forceUpdate();

    const list = useMemo(() => {
        const isSearch = search.length > 0;
        let accounts = accountList;
        // eslint-disable-next-line no-underscore-dangle
        let _discoveredAccounts = discoveredAccounts;

        if (isSearch) {
            accounts = filterList(searchList, search);
            _discoveredAccounts = filterDiscoveredAccounts(discoveredAccounts, search);
        }

        return AccountsListService.displayList(accounts, _discoveredAccounts, isSearch);
    }, [accountList, search, filterList, discoveredAccounts, searchList]);

    const renderEmptyList = useCallback(() => {
        if (search.length > 0) {
            return (
                <View style={[styles.noFound, isDark && styles.noFoundDark]}>
                    <Icon name='warning' color={isDark ? DarkColors.orange : Colors.orange} size={24} />
                    <Text style={[styles.noFoundText, isDark && styles.textDark]}>{Translator.trans('award.account.list.search.not-found')}</Text>
                </View>
            );
        }

        return null;
    }, [isDark, search.length]);

    const renderHeader = useCallback(() => {
        const blog: {
            title: string;
            link: string;
        } | null = Storage.getItem('blog');

        return (
            <>
                {_.isObject(blog) &&
                    _.isString(blog.title) && ( // change text on Translator Text
                        <TouchableOpacity
                            testID='blog-offer-link'
                            onPress={() => handleOpenUrl({url: blog.link})}
                            style={[styles.blog, isDark && styles.blogDark]}>
                            <View style={[styles.newWrap, isDark && styles.newWrapDark]}>
                                <Text style={styles.newText}>{'New'}</Text>
                            </View>
                            <Text style={[styles.blogLink, isDark && styles.blogLinkDark]} numberOfLines={1}>
                                {blog.title}
                            </Text>
                            <Icon name={'arrow'} color={isDark ? DarkColors.blue : Colors.blue} size={18} style={styles.arrowMore} />
                        </TouchableOpacity>
                    )}
                <SearchBar
                    placeholder={Translator.trans('award.account.list.search.placeholder', {}, 'messages')}
                    value={searchQuery}
                    onChangeText={onSearchInput}
                    tintColor={isDark ? DarkColors.blue : Colors.blue}
                />
                {_.isEmpty(search) && (
                    <>
                        <TotalBar counters={counters} styleCard={{marginTop: 14, marginBottom: 8}} />
                        <ButtonBar stylesButton={{marginBottom: 14}} />
                    </>
                )}
            </>
        );
    }, [isDark, searchQuery, onSearchInput, search, discoveredAccounts, theme]);

    const renderFooter = useCallback(
        (): React.ReactElement | null => (!search ? <AccountListFooter counters={counters} /> : null),
        [counters, search],
    );

    useEffect(() => {
        navigation.setParams({
            discoveredAccounts: discoveredAccounts.length,
        });
    }, [discoveredAccounts]);

    useEffect(() => {
        const event = EventEmitter.addListener('pressLeftButtonEvent', presentBottomSheet);

        return () => event.remove();
    }, [presentBottomSheet]);

    if (search.length === 0) {
        if ((!list || list.length < 1) && discoveredAccounts.length > 0) {
            return (
                <DiscoveredAccounts
                    theme={theme}
                    discoveredAccounts={discoveredAccounts}
                    deleteDiscoveredAccount={deleteDiscoveredAccount}
                    updateDiscoveredAccounts={updateDiscoveredAccounts}
                    accountList
                    // @ts-ignore
                    navigation={navigation}
                />
            );
        }
        if (!list || (list && list.length < 1)) {
            // @ts-ignore
            return <AccountAddListKindScreen accountsList onRefresh={refreshData} navigation={navigation} />;
        }
    }

    return (
        <View style={[styles.page, isDark && styles.pageDark]}>
            <AccountSwipeableList
                data={list}
                ListHeaderComponent={renderHeader()}
                ListFooterComponent={renderFooter()}
                ListEmptyComponent={renderEmptyList()}
                onRefresh={refreshData}
                lastSyncDate={lastSyncDate}
                deleteDiscoveredAccount={deleteDiscoveredAccount}
            />
            <BottomSheetAccountsUpdate />
            {isAndroid && (
                <View style={styles.actionButtonWrap}>
                    <ActionButton
                        color={isDark ? DarkColors.blue : Colors.blueDark}
                        onPress={() =>
                            // @ts-ignore
                            navigation.navigate(discoveredAccounts.length > 0 ? 'DiscoveredAccounts' : 'AccountsAdd')
                        }
                        iconName='plus'
                        style={styles.actionButton}
                    />
                </View>
            )}
        </View>
    );
};

export {AccountListScreen};
