import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {FlatList, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AccountDisplayName from '../../../components/accounts/details/displayName';
import {BaseThemedPureComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {useAccount} from '../../../hooks/account';
import {Colors, DarkColors, Fonts, IconColors} from '../../../styles';
import {useTheme} from '../../../theme';
import {AccountsStackScreenFunctionalComponent} from '../../../types/navigation';

class AccountDetailsPhones extends BaseThemedPureComponent {
    constructor(props) {
        super(props);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
        const {account, navigation} = this.props;

        if (!_.isObject(account) || (_.isObject(account) && _.isEmpty(account.Phones))) {
            navigation.goBack();
        }
    }

    _phoneCall = (phoneNumber) => {
        const phone = phoneNumber.replace(/[^\d.]/g, '');

        Linking.canOpenURL(`tel:${phone}`).then((supported) => supported && Linking.openURL(`tel:${phone}`));
    };

    renderHeader() {
        const {theme, account} = this.props;
        const colors = this.themeColors;

        return (
            <View style={[styles.top, this.isDark && styles.topDark]}>
                <Icon name='airline' color={this.selectColor(IconColors.gray, Colors.white)} style={styles.icon} size={24} />
                <View style={styles.topDetails}>
                    {_.isObject(account) && <AccountDisplayName theme={theme} title={account.DisplayName} />}
                    <Text style={[styles.topTag, {color: colors.text}]}>{Translator.trans('account.phones.title', {}, 'mobile')}</Text>
                </View>
            </View>
        );
    }

    renderPhoneNum = (phone) => (
        <Text
            {...Platform.select({
                android: {
                    // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                    key: Math.random(),
                },
            })}
            style={[styles.phone, this.isDark && styles.textDark]}
            selectable>
            {phone}
        </Text>
    );

    renderItem({item}) {
        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <View style={styles.containerTitle}>
                    <Text style={[styles.caption, this.isDark && styles.textDark]}>{item.name}</Text>
                    {isIOS && (
                        <View style={styles.phoneContainer}>
                            <Text style={[styles.country, this.isDark && styles.textDark]}>{item.region}</Text>
                            {this.renderPhoneNum(item.phone)}
                        </View>
                    )}
                    {!isIOS && (
                        <View style={styles.phoneContainer}>
                            {this.renderPhoneNum(item.phone)}
                            <Text style={styles.country}>{item.region}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={[styles.button, this.isDark && styles.buttonDark]} onPress={() => this._phoneCall(item.phone)}>
                    <Icon
                        name='phone'
                        color={Platform.select({
                            ios: Colors.white,
                            android: this.selectColor(Colors.white, Colors.black),
                        })}
                        size={24}
                    />
                    <Text style={[styles.buttonText, this.isDark && styles.buttonTextDark]}>
                        {Translator.trans('account.phones.call', {}, 'mobile')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {account} = this.props;

        if (_.isObject(account) && _.isArray(account.Phones)) {
            return (
                <FlatList
                    style={[styles.page, this.isDark && styles.pageDark]}
                    data={account.Phones}
                    ListHeaderComponent={this.renderHeader}
                    renderItem={this.renderItem}
                    keyExtractor={(row, index) => String(index)}
                    contentInsetAdjustmentBehavior='automatic'
                />
            );
        }

        return null;
    }
}
export const AccountDetailsPhonesScreen: AccountsStackScreenFunctionalComponent<'AccountDetailsPhones'> = ({navigation, route}) => {
    const {ID, SubAccountID} = route.params;
    const {account} = useAccount(ID, SubAccountID);
    const theme = useTheme();

    return <AccountDetailsPhones theme={theme} navigation={navigation} route={route} account={account} />;
};

AccountDetailsPhonesScreen.navigationOptions = () => ({
    title: '',
});

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.grayLight,
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
    top: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                paddingVertical: 20,
                paddingRight: 15,
            },
            android: {
                paddingRight: 16,
                paddingVertical: 22,
                marginBottom: 8,
            },
        }),
    },
    topDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    icon: {
        ...Platform.select({
            ios: {
                marginRight: 10,
                marginLeft: 15,
            },
            android: {
                width: 70,
                paddingLeft: 16,
            },
        }),
    },
    topDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    topTag: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 17,
                color: '#8e9199',
            },
            android: {
                fontSize: 16,
                color: Colors.grayDarkLight,
            },
        }),
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            android: {
                marginHorizontal: 8,
                marginBottom: 8,
                backgroundColor: Colors.white,
                elevation: 5,
                paddingHorizontal: 16,
                paddingVertical: 10,
            },
        }),
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    containerTitle: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    caption: {
        color: Colors.grayDark,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        ...Platform.select({
            ios: {
                fontSize: 13,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    country: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 13,
                color: Colors.blue,
            },
            android: {
                fontSize: 12,
                color: '#9e9e9e',
            },
        }),
    },
    phoneContainer: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    phone: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 18,
            },
            android: {
                fontSize: 20,
            },
        }),
    },
    button: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.blueDark,
        ...Platform.select({
            ios: {
                height: 45,
                padding: 10,
            },
            android: {
                height: 36,
                paddingHorizontal: 12,
                borderRadius: 2,
                elevation: 2,
            },
        }),
    },
    buttonDark: {
        backgroundColor: DarkColors.blue,
    },
    buttonText: {
        color: Colors.white,
        marginLeft: 10,
        ...Platform.select({
            ios: {
                fontSize: 13,
                fontFamily: Fonts.regular,
            },
            android: {
                fontSize: 14,
                fontFamily: Fonts.bold,
                fontWeight: '500',
            },
        }),
    },
    buttonTextDark: {
        ...Platform.select({
            android: {
                color: Colors.black,
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {color: Colors.white},
            android: {
                color: DarkColors.text,
            },
        }),
    },
});
