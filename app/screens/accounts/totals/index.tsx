import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {FormattedNumber} from 'react-intl';
import {ScrollView, Text, View} from 'react-native';

import TotalBar from '../../../components/accounts/list/total-bar';
import Title from '../../../components/page/header/title';
import AccountsList from '../../../services/accountsList';
import {ThemeColors, useDark} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';
import {IProviderKinds} from '../../../types/providerKinds';
import styles from './styles';

const AccountsTotalsScreen: AccountsStackScreenFunctionalComponent<'AccountsTotals'> = ({navigation}) => {
    const isDark = useDark();
    const accounts: IAccount[] = AccountsList.getList();
    const providerKinds: IProviderKinds = AccountsList.getProviderKinds();
    const counters = AccountsList.getCounters();

    const [totals, setTotals] = useState({});

    const getTotals = useCallback(() => {
        const totals: {[kind: number]: {accounts: number; mileValue: number; totals: number}} = {};
        const users: string[] = [];

        accounts.forEach((account) => {
            if (providerKinds[account.Kind] && _.isNil(account.ParentAccount)) {
                if (_.isUndefined(totals[account.Kind])) {
                    totals[account.Kind] = {
                        accounts: 0,
                        mileValue: 0,
                        totals: 0,
                    };
                }

                if (!_.isUndefined(account.TotalBalance)) {
                    totals[account.Kind].totals += account.TotalBalance;
                }

                if (_.isNumber(account.TotalUSDCash)) {
                    totals[account.Kind].mileValue += account.TotalUSDCash;
                }

                if (users.indexOf(account.UserName) < 0) {
                    users.push(account.UserName);
                }

                totals[account.Kind].accounts += 1;
            }
        });

        _.forEach(totals, (total, kind) => {
            totals[kind] = {
                accounts: Math.floor(total.accounts),
                mileValue: Math.floor(total.mileValue),
                totals: Math.floor(total.totals),
            };
        });

        return {totals, users};
    }, [accounts, providerKinds]);

    useEffect(() => {
        const {totals, users} = getTotals();

        setTotals(totals);

        navigation.setParams(
            users.length > 1
                ? {
                      amount: users.length,
                      user: null,
                  }
                : {
                      amount: null,
                      user: users[0],
                  },
        );
    }, [getTotals, navigation]);

    return (
        <ScrollView style={[styles.page, isDark && styles.pageDark]} contentContainerStyle={styles.safeZone}>
            <TotalBar counters={counters} />
            {_.map(
                _.orderBy(
                    _.values(providerKinds).filter((providerKind) => !providerKind.hidden),
                    'index',
                ),
                (item) =>
                    totals[item.KindID] && (
                        <View style={[styles.container, isDark && styles.containerDark]} key={item.KindID}>
                            <View style={styles.title}>
                                <Text style={[styles.name, isDark && styles.textDark]}>{item.Name}</Text>
                                <Text style={[styles.accounts, styles.boldText, isDark && styles.accountsDark]}>{totals[item.KindID].accounts}</Text>
                            </View>
                            <View style={styles.value}>
                                <View style={styles.valueRow}>
                                    <Text style={[styles.totals, styles.boldText, isDark && styles.textDark]}>
                                        <FormattedNumber value={totals[item.KindID].totals} />
                                    </Text>
                                    {item.KindID > 1 ? (
                                        <Text style={[styles.text, isDark && styles.textDark]}>
                                            {Translator.transChoice('award.account.list.totals.points', totals[item.KindID].totals, {}, 'messages')}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.text, isDark && styles.textDark]}>
                                            {` ${Translator.transChoice(
                                                'award.account.list.totals.miles',
                                                totals[item.KindID].totals,
                                                {},
                                                'messages',
                                            )}`}
                                        </Text>
                                    )}
                                </View>
                                {totals[item.KindID].mileValue > 0 && (
                                    <Text style={[styles.mileValue, isDark && styles.mileValueDark]}>
                                        <Text>$</Text>
                                        <FormattedNumber value={totals[item.KindID].mileValue} />
                                    </Text>
                                )}
                            </View>
                        </View>
                    ),
            )}
        </ScrollView>
    );
};

AccountsTotalsScreen.navigationOptions = ({route}) => {
    const amount = route.params?.amount;
    const user = route.params?.user;

    return {
        headerTitle: () => (
            <Title
                title={user || Translator.trans(/** @Desc("Multiple Users") */ 'award.account.list.totals.multiple', {}, 'mobile-native')}
                amount={amount}
                amountColorDark={ThemeColors.dark.blue}
                amountColor={ThemeColors.light.blue}
            />
        ),
    };
};

export {AccountsTotalsScreen};
