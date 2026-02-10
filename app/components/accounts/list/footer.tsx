import ButtonBar from '@components/accounts/list/button-bar';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import formColor from 'color';
import React from 'react';
import {FormattedNumber} from 'react-intl';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../../theme';
import {AccountsStackParamList} from '../../../types/navigation';
import Icon from '../../icon';

const currencyMileValue = '$';
const TouchableRow = getTouchableComponent(TouchableOpacity);

const AccountListFooter: React.FunctionComponent<{
    counters: {[key: string]: number};
}> = ({counters}) => {
    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList, 'AccountsList'>>();
    const {totals, mileValue} = counters;
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const colors = ThemeColors[theme];

    return (
        <>
            <TouchableRow testID='totals' onPress={() => navigation.navigate('AccountsTotals')}>
                <View style={[styles.totalsRow, isDark && styles.totalsRowDark]} pointerEvents='box-only'>
                    <View style={styles.totalsTitle}>
                        <Text style={[styles.totalsItemText, isDark && styles.darkText]}>{Translator.trans('award.account.list.totals')}</Text>
                    </View>
                    <View style={styles.totalsBalance}>
                        <Text style={[styles.totalsMileValue, isDark && styles.totalsMileValueDark]}>
                            {currencyMileValue}
                            <FormattedNumber value={Math.round(mileValue)} />
                        </Text>
                        <Text style={[styles.totalsItemAmount, isDark && styles.darkText]}>
                            <FormattedNumber value={Math.round(totals)} />
                        </Text>
                    </View>
                    <Icon style={styles.totalsMore} name='arrow' color={colors.grayDarkLight} size={14} />
                </View>
            </TouchableRow>
            {isAndroid && <View style={{flex: 1, height: 80}} />}
            {isIOS && <ButtonBar stylesButton={{marginVertical: 16}} />}
        </>
    );
};

const styles = StyleSheet.create({
    totalsRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        height: 65,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        ...Platform.select({
            ios: {
                paddingLeft: 17,
                paddingRight: 10,
                backgroundColor: Colors.white,
            },
            android: {
                paddingHorizontal: 16,
                backgroundColor: Colors.white,
            },
        }),
    },
    totalsRowDark: {
        borderColor: DarkColors.bg,
        backgroundColor: DarkColors.bgLight,
    },
    totalsItemText: {
        ...Platform.select({
            ios: {
                fontFamily: Fonts.bold,
                fontWeight: '700',
                fontSize: 15,
                color: Colors.textGray,
            },
            android: {
                fontFamily: Fonts.bold,
                fontWeight: '700',
                fontSize: 15,
                color: Colors.grayDark,
            },
        }),
    },
    darkText: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    totalsItemAmount: {
        ...Platform.select({
            ios: {
                fontFamily: Fonts.bold,
                fontWeight: '700',
                fontSize: 17,
                color: Colors.grayDark,
            },
            android: {
                fontFamily: Fonts.regular,
                fontSize: 17,
                fontWeight: '700',
                color: Colors.grayDark,
            },
        }),
    },
    totalsMileValue: {
        fontFamily: Fonts.regular,
        marginRight: 15,
        ...Platform.select({
            ios: {
                fontSize: 17,
                fontWeight: '600',
                color: Colors.grayDark,
                opacity: 0.5,
            },
            android: {
                fontSize: 17,
                fontWeight: '600',
                color: formColor(Colors.grayDark).alpha(0.5).rgb().toString(),
            },
        }),
    },
    totalsMileValueDark: {
        ...Platform.select({
            ios: {
                color: formColor(Colors.white).alpha(0.5).rgb().toString(),
            },
            android: {
                color: formColor(DarkColors.text).alpha(0.5).rgb().toString(),
            },
        }),
    },
    totalsTitle: {
        flex: 1,
    },
    totalsBalance: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalsMore: {
        ...Platform.select({
            ios: {
                marginLeft: 10,
                marginRight: 5,
            },
            android: {
                width: 0,
                opacity: 0,
                height: 0,
            },
        }),
    },
});

export default AccountListFooter;
