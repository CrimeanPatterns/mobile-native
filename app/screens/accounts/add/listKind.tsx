import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios, {CancelTokenSource} from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import EmptyRow from '../../../components/accounts/add/emptyRow';
import ProviderRow from '../../../components/accounts/add/providerRow';
import SearchDetails from '../../../components/accounts/add/searchDetails';
import {BaseThemedComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import {RefreshableFlatList} from '../../../components/page';
import SearchBar from '../../../components/page/searchBar';
import {useStorage} from '../../../context/storage';
import {isAndroid, isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import API from '../../../services/api';
import Session from '../../../services/session';
import {Colors, DarkColors, Fonts, IconColors} from '../../../styles';
import {useDark, useTheme} from '../../../theme';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import {IProviderKinds} from '../../../types/providerKinds';
import ScanCard from '../scancard';
import styles from './styles';

const EmptyList: React.FC = () => {
    const isDark = useDark();

    return (
        <View style={[emptyList.container, isDark && emptyList.containerDark]}>
            <Text style={[emptyList.text, isDark && styles.textDark]}>{Translator.trans('account.add.no-accounts', {}, 'mobile')}</Text>
        </View>
    );
};

const emptyList = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        padding: 25,
        paddingRight: 15,
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
});

const TouchableRow = getTouchableComponent(TouchableHighlight);

type AccountAddListKindProps = {
    navigation: StackNavigationProp<AccountsStackParamList, 'AccountsAdd'>;
    route: RouteProp<AccountsStackParamList, 'AccountsAdd'>;
    accountsList: boolean;
    onRefresh: () => void;
    constants: {
        providerKinds: IProviderKinds[];
    };
};

type AccountAddListKindState = {
    providers: unknown[];
    search: string;
    details: string | null;
    error: string | null;
    lastSyncDate: number;
};

class AccountAddListKind extends BaseThemedComponent<AccountAddListKindProps, AccountAddListKindState> {
    private requests: {
        post: CancelTokenSource;
    } = {
        post: axios.CancelToken.source(),
    };

    private _mounted = false;

    constructor(props) {
        super(props);

        this.cancelRequests = this.cancelRequests.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.renderEmpty = this.renderEmpty.bind(this);
        this.renderEmptyRow = this.renderEmptyRow.bind(this);

        this.state = {
            providers: [],
            search: '',
            details: null,
            error: null,
            lastSyncDate: Session.getProperty('timestamp'),
        };
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this.cancelRequests();
        this._mounted = false;
    }

    safeSetState(...args) {
        if (this._mounted) {
            // @ts-ignore
            this.setState(...args);
        }
    }

    isScan() {
        const {route} = this.props;

        return route?.params?.scan;
    }

    cancelRequests() {
        this.requests.post.cancel();
    }

    search() {
        const {search} = this.state;

        if (search.length > 0) {
            API.post<{queryString: string; details?: string; error?: string}>(
                '/providers',
                {
                    queryString: search,
                    scope: this.isScan() && 'all',
                },
                {
                    cancelToken: this.requests.post.token,
                },
            ).then(
                (response) => {
                    if (_.isObject(response) && response.data) {
                        const {data} = response;
                        const {queryString, details, error} = data;

                        if (search === queryString) {
                            this.setSearchResult(data);
                        }
                        if (_.isString(details) || _.isString(error)) {
                            this.setSearchResult({...data, providers: []});
                        }
                    }
                },
                () => {},
            );
        }
    }

    setSearchResult(response) {
        this.safeSetState(response);
    }

    onSearchChange(search) {
        if (this.requests.post) {
            this.requests.post.cancel();
            this.requests.post = axios.CancelToken.source();
        }
        if (search && search.length > 0) {
            this.safeSetState({search, details: null, error: null});
            this.search();
        } else {
            this.safeSetState({search, providers: [], details: null, error: null});
        }
    }

    navigate(params) {
        const {navigation, route} = this.props;
        const {kindId} = params;
        let {providerId} = params;

        if (_.isString(kindId) && kindId !== 'popular') {
            providerId = kindId;
        }

        if (!_.isNil(providerId)) {
            const routeName = (this.isScan() && 'AccountScanAdd') || 'AccountAdd';

            // @ts-ignore
            navigation.navigate(routeName, {
                ...route?.params,
                providerId,
            });
        } else {
            navigation.navigate('AccountAddListProvider', {
                ...route?.params,
                kindId,
            });
        }
    }

    onRefresh = async () => {
        const {onRefresh} = this.props;

        await onRefresh();
        this.safeSetState({
            lastSyncDate: Date.now(),
        });
    };

    renderArrow = () => isIOS && <Icon name='arrow' color={this.themeColors.grayDarkLight} size={20} />;

    renderHeader = () => {
        const {accountsList} = this.props;
        const {search} = this.state;

        return (
            <>
                {/* @ts-ignore */}
                {accountsList === true && <EmptyList />}
                {!this.isScan() && <ScanCard />}
                <SearchBar
                    tintColor={this.isDark ? DarkColors.blue : Colors.blue}
                    value={search}
                    onChangeText={this.onSearchChange}
                    placeholder={Translator.trans('account.add.find-placeholder', {}, 'mobile')}
                />
            </>
        );
    };

    renderEmpty = () => {
        const {constants} = this.props;
        const {providerKinds} = constants;
        const {details, error, search} = this.state;

        if (error && error.length > 0) {
            return (
                <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                    <Icon name='warning' color={Colors.orange} size={24} />
                    <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>{error}</Text>
                </View>
            );
        }

        if (_.isString(details)) {
            return <SearchDetails message={details} refresh={this.search} />;
        }

        if (!_.isEmpty(search)) {
            return null;
        }

        return (
            <>
                <TouchableRow
                    testID='popular'
                    style={[styles.row, this.isDark && styles.rowDark]}
                    underlayColor={this.selectColor(Colors.grayLight, DarkColors.bgLight)}
                    onPress={() => this.navigate({kindId: 'popular'})}>
                    <View
                        style={[
                            styles.containerTall,
                            isAndroid && styles.containerTitleBorder,
                            this.isDark && styles.containerTallDark,
                            this.isDark && styles.containerDark,
                        ]}
                        pointerEvents='box-only'>
                        <View style={styles.containerIcon}>
                            <Icon name='popular' color={this.selectColor(IconColors.gray, Colors.white)} size={24} />
                        </View>
                        <View style={styles.containerTitle}>
                            <Text style={[styles.title, this.isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                                {Translator.trans('account.add.popular', {}, 'mobile')}
                            </Text>
                        </View>
                        {this.renderArrow()}
                    </View>
                </TouchableRow>
                {providerKinds.filter((kind) => !kind.hidden).map(this.renderEmptyRow)}
            </>
        );
    };

    renderEmptyRow(item) {
        return <EmptyRow key={item.KindID} item={item} onPress={() => this.navigate({kindId: item.KindID})} />;
    }

    renderItem = ({item}) => (
        <ProviderRow
            key={`provider-${item.ProviderID}`}
            name={item.DisplayName}
            added={item.Has}
            code={item.ProviderCode}
            kind={item.Kind}
            onPress={() => this.navigate({providerId: item.ProviderID})}
        />
    );

    renderFooter = () => <View style={{height: 52}} />;

    keyExtractor = (item) => item.ProviderID;

    render() {
        const {providers, lastSyncDate} = this.state;

        return (
            <RefreshableFlatList
                style={[styles.page, this.isDark && styles.pageDark]}
                data={providers}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                ListHeaderComponent={this.renderHeader}
                ListEmptyComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
                onRefresh={this.onRefresh}
                lastSyncDate={lastSyncDate}
                initialNumToRender={15}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
                contentInsetAdjustmentBehavior='automatic'
            />
        );
    }
}

type AccountAddListKindScreenProps = {
    accountsList?: boolean;
    onRefresh?: () => void;
};

const AccountAddListKindScreen: AccountsStackScreenFunctionalComponent<'AccountsAdd', AccountAddListKindScreenProps> = ({
    navigation,
    route,
    accountsList,
    onRefresh,
}) => {
    const theme = useTheme();
    const constants = useStorage('constants');

    return (
        <AccountAddListKind
            navigation={navigation}
            route={route}
            theme={theme}
            accountsList={accountsList}
            onRefresh={onRefresh}
            constants={constants}
        />
    );
};

AccountAddListKindScreen.navigationOptions = () => ({
    title: '',
});

export default AccountAddListKindScreen;
export {EmptyList, AccountAddListKind};
