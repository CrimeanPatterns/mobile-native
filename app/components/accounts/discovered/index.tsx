import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import React from 'react';
import {Alert, Platform, Text, View} from 'react-native';

import {IDiscoveredAccount, useDiscoveredAccounts} from '../../../hooks/accounts';
import API from '../../../services/api';
import Session from '../../../services/session';
import {Colors, DarkColors} from '../../../styles';
import {AccountsStackParamList} from '../../../types/navigation';
import {BaseThemedPureComponent} from '../../baseThemed';
import {RefreshableFlatList} from '../../page';
import Button from '../list/button';
import DiscoveredAccountRow from './row';
import styles from './styles';

type DiscoveredAccountsProps = ReturnType<typeof useDiscoveredAccounts> & {
    accountList?: boolean;
    navigation: StackNavigationProp<AccountsStackParamList, 'DiscoveredAccounts'>;
};

class DiscoveredAccounts extends BaseThemedPureComponent<
    DiscoveredAccountsProps,
    {
        lastSyncDate: string;
        disabled: number[];
    }
> {
    private mounted = false;

    constructor(props) {
        super(props);

        this.state = {
            lastSyncDate: Session.getProperty('timestamp'),
            disabled: [],
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            // @ts-ignore
            this.setState(...args);
        }
    }

    confirmDeleteAll = () =>
        new Promise((resolve, reject) => {
            Alert.alert(
                '',
                Translator.trans(
                    /** @Desc("Are you sure you want to delete all discovered loyalty accounts?") */ 'discovered.confirm-delete-accounts',
                    {},
                    'mobile-native',
                ),
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

    deleteAllDiscoveredAccounts = async () => {
        const {navigation} = this.props;

        await this.confirmDeleteAll();
        await API.delete(`/discovered`);
        await this.onRefresh();

        navigation.navigate('AccountsList');
    };

    deleteDiscoveredAccount = async (id: number): Promise<void> => {
        const {disabled} = this.state;
        const {navigation, discoveredAccounts, deleteDiscoveredAccount} = this.props;
        const isLast = discoveredAccounts.length === 1;

        this.safeSetState({disabled: [...disabled, id]});

        await deleteDiscoveredAccount(id);

        this.safeSetState({disabled: disabled.filter((item) => item !== id)});

        if (isLast) {
            navigation.navigate('AccountsList');
        }
    };

    navigate = (accountId) => {
        const {navigation, discoveredAccounts, accountList} = this.props;
        const backTo = discoveredAccounts.length === 1 || accountList ? 'AccountsList' : 'DiscoveredAccounts';

        navigation.navigate('DiscoveredAccountAdd', {accountId, backTo});
    };

    onRefresh = async () => {
        const {updateDiscoveredAccounts} = this.props;

        await updateDiscoveredAccounts();

        this.safeSetState({
            lastSyncDate: Date.now(),
        });
    };

    keyExtractor = ({id}) => `discoveredAccount-${id}`;

    renderListHeader = () => {
        const {navigation} = this.props;
        const textColor = this.selectColor(
            Colors.white,
            Platform.select({
                ios: Colors.white,
                android: DarkColors.text,
            }),
        );

        return (
            <View style={[styles.header, this.isDark && styles.headerDark]}>
                <Button
                    testID='discovered-accounts-account-add'
                    // @ts-ignore
                    onPress={() => navigation.navigate('AccountsAdd')}
                    label={Translator.trans(/** @Desc("Add Other Loyalty Accounts") */ 'discovered.add-other', {}, 'mobile-native')}
                    iconName='plus'
                    color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                    labelColor={textColor}
                    iconColor={textColor}
                    stylesButton={styles.customButton}
                />
                <Text style={[styles.message, this.isDark && styles.textDark]}>
                    {Translator.trans(
                        /** @Desc("The following loyalty accounts were found via your mailbox; please tar each account to set in up. Swipe left to delete or tap \"Add Other Loyalty Accounts\" at the top to add other accounts.") */ 'discovered.set-up',
                        {},
                        'mobile-native',
                    )}
                </Text>
                <Text style={[styles.title, this.isDark && styles.textDark]}>{Translator.trans('discovered-loyalty-accounts', {}, 'messages')}</Text>
            </View>
        );
    };

    renderListFooter = () => (
        <View style={[styles.footer, this.isDark && styles.footerDark]}>
            <Button
                testID='discovered-accounts-account-delete'
                onPress={this.deleteAllDiscoveredAccounts}
                label={Translator.trans(/** @Desc("Delete All Discovered Loyalty Accounts") */ 'discovered.delete-accounts', {}, 'mobile-native')}
                iconName='footer-delete'
                stylesButton={styles.customButton}
            />
        </View>
    );

    renderItem = ({item}: {item: IDiscoveredAccount}) => {
        const {disabled} = this.state;
        const {id, provider, login, email} = item;

        return (
            <DiscoveredAccountRow
                disabled={disabled.includes(id)}
                provider={provider}
                login={login}
                email={email}
                onPress={() => this.navigate(id)}
                onDelete={() => this.deleteDiscoveredAccount(id)}
            />
        );
    };

    renderSeparator = () => <View style={[styles.separator, this.isDark && styles.separatorDark]} />;

    render() {
        const {lastSyncDate, disabled} = this.state;
        const {discoveredAccounts} = this.props;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <RefreshableFlatList
                    extraData={disabled}
                    data={discoveredAccounts}
                    initialNumToRender={15}
                    maxToRenderPerBatch={50}
                    updateCellsBatchingPeriod={100}
                    windowSize={64}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='always'
                    contentInsetAdjustmentBehavior='automatic'
                    lastSyncDate={lastSyncDate}
                    keyExtractor={this.keyExtractor}
                    ListHeaderComponent={this.renderListHeader()}
                    renderItem={this.renderItem}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListFooterComponent={this.renderListFooter()}
                    onRefresh={this.onRefresh}
                />
            </View>
        );
    }
}

export default DiscoveredAccounts;
