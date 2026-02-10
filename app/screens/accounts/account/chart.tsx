import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios, {CancelTokenSource} from 'axios';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BaseThemedComponent} from '../../../components/baseThemed';
import BarChartVerticalWithLabels from '../../../components/charts/balanceChart';
import Spinner from '../../../components/spinner';
import UpgradeFAQ from '../../../components/upgrade';
import {isIOS} from '../../../helpers/device';
import {useAccount} from '../../../hooks/account';
import API from '../../../services/api';
import Storage from '../../../storage';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ColorScheme, useTheme} from '../../../theme';
import {IAccount} from '../../../types/account';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

class AccountBalanceChart extends BaseThemedComponent<
    {
        theme: ColorScheme;
        navigation: StackNavigationProp<AccountsStackParamList, 'AccountBalanceChart'>;
        route: RouteProp<AccountsStackParamList, 'AccountBalanceChart'>;
        account: IAccount;
        parentAccount?: IAccount;
    },
    {
        isLoading: boolean;
        // eslint-disable-next-line @typescript-eslint/ban-types
        data: {};
    }
> {
    private cancelToken: CancelTokenSource = axios.CancelToken.source();

    private didFocusSubscription: (() => void) | undefined;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            data: {},
        };

        this.init = this.init.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.didFocusSubscription = navigation.addListener('focus', this.init);
    }

    componentWillUnmount() {
        this.cancelToken.cancel();
        if (this.didFocusSubscription) {
            this.didFocusSubscription();
        }
    }

    init() {
        if (this.isFree() === false) {
            this.setData();
        }
    }

    getAccount() {
        const {account} = this.props;
        const {DisplayName, Balance} = account;

        return {DisplayName, Balance};
    }

    isFree = () => {
        const {Free} = Storage.getItem('profile');

        return Free === true;
    };

    setData(limit = 20) {
        const {account, parentAccount} = this.props;
        let url = `/account/balance-chart/`;

        if (parentAccount) {
            url += `${parentAccount.ID}/${account.SubAccountID}`;
        } else {
            url += `${account.ID}`;
        }

        API.post(
            url,
            {limit},
            {
                cancelToken: this.cancelToken.token,
            },
        ).then((response) => {
            const {data} = response;

            this.setState({data, isLoading: false});
        });
    }

    render() {
        if (this.isFree()) {
            return <UpgradeFAQ />;
        }

        const {DisplayName, Balance} = this.getAccount();
        const {data, isLoading} = this.state;

        return (
            <SafeAreaView edges={['bottom']} style={[styles.page, this.isDark && styles.pageDark]}>
                <View style={[styles.balance, this.isDark && styles.balanceDark]}>
                    <Text style={[styles.text, this.isDark && styles.textDark]}>{DisplayName}</Text>
                    <Text style={[styles.text, styles.boldText, this.isDark && styles.textDark]}>{Balance}</Text>
                </View>
                {isLoading ? (
                    <View style={styles.loading}>
                        <Spinner />
                    </View>
                ) : (
                    <View style={styles.chart}>
                        <BarChartVerticalWithLabels data={data} />
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

export const AccountBalanceChartScreen: AccountsStackScreenFunctionalComponent<'AccountBalanceChart'> = ({navigation, route}) => {
    const {ID, SubAccountID} = route.params;
    const theme = useTheme();
    const {account, parentAccount} = useAccount(ID, SubAccountID);

    return <AccountBalanceChart theme={theme} navigation={navigation} route={route} account={account} parentAccount={parentAccount} />;
};

AccountBalanceChartScreen.navigationOptions = () => ({title: ''});

const styles = StyleSheet.create({
    page: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    pageDark: {
        backgroundColor: DarkColors.bg,
    },
    balance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.grayLight,
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray,
    },
    balanceDark: {
        backgroundColor: DarkColors.bg,
        borderBottomColor: DarkColors.border,
    },
    chart: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        color: Colors.textGray,
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: 'bold',
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
});
