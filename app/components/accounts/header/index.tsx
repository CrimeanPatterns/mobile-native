import _ from 'lodash';
import React from 'react';
import {Image, ImageSourcePropType, Platform, Text, View} from 'react-native';

import ProviderIcons from '../../../config/providerIcons';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {useDark} from '../../../theme';
import {IAccount} from '../../../types/account';
import Icon from '../../icon';
import AccountDisplayName from '../details/displayName';
import styles from './styles';

type ProviderIcon = {
    name: string;
    size: number;
};

function getProviderIcon(kind: IAccount['Kind'], type: IAccount['Type']): ProviderIcon {
    if (_.isString(type) && _.isObject(ProviderIcons[type])) {
        return ProviderIcons[type];
    }

    return ProviderIcons[kind];
}

function getProviderLogo(providerCode: IAccount['ProviderCode'], isDark: boolean): ImageSourcePropType | null {
    if (providerCode === 'capitalcards') {
        if (isDark) {
            return require('../../../assets/images/capitalone/capitalone-logo-dark.png');
        }
        return require('../../../assets/images/capitalone/capitalone-logo.png');
    }

    return null;
}

type AccountHeaderProps = {
    kind: IAccount['Kind'];
    displayName: IAccount['DisplayName'];
    number: IAccount['Number'];
    type: IAccount['Type'];
    balance: IAccount['Balance'];
    eliteStatus: IAccount['EliteStatus'];
    logo: IAccount['ProviderCode'];
    isCustom: IAccount['isCustom'];
};

type IAccountHeader = React.FunctionComponent<AccountHeaderProps>;

const AccountHeader: IAccountHeader = ({kind, displayName, number, type, balance, eliteStatus, logo, isCustom}) => {
    const isDark = useDark();
    const icon = getProviderIcon(kind, type);
    const providerLogo = getProviderLogo(logo, isDark);

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={styles.title}>
                {_.isObject(icon) && (
                    <Icon {...icon} style={{marginRight: 10}} color={IconColors.gray} colorDark={isIOS ? Colors.white : DarkColors.text} />
                )}
                <View style={styles.name}>
                    <AccountDisplayName title={displayName} />
                    {_.isString(number) && (
                        <Text
                            style={[styles.login, isDark && styles.loginDark]}
                            accessibilityLabel={number}
                            selectable
                            suppressHighlighting /* eslint-disable-next-line react/jsx-props-no-spreading */
                            {...Platform.select({
                                android: {
                                    // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                                    key: Math.random(),
                                },
                            })}>
                            {number}
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.value}>
                {!_.isNull(providerLogo) && (
                    <View style={[{justifyContent: 'center', minHeight: 50}]}>
                        <Image style={styles.resizeMode} source={providerLogo} />
                    </View>
                )}
                {!isCustom && (
                    <Text
                        style={[styles.balance, isDark && styles.balanceDark]}
                        selectable
                        suppressHighlighting /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...Platform.select({
                            android: {
                                // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                                key: Math.random(),
                            },
                        })}>
                        {balance}
                    </Text>
                )}
                {_.isObject(eliteStatus) && _.isString(eliteStatus.Name) && (
                    <Text style={[styles.login, isDark && styles.loginDark]}>{eliteStatus.Name}</Text>
                )}
            </View>
        </View>
    );
};

export default AccountHeader;
export {getProviderIcon};
