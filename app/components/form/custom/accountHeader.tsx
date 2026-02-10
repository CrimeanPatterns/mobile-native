import {ProviderFavicons} from '@assets/favicons';
import {ImageDimensionsSource} from '@react-native-community/hooks/lib/useImageDimensions';
import fromColor from 'color';
import _ from 'lodash';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import ProviderIcons from '../../../config/providerIcons';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {useDark} from '../../../theme';
import {IAccount} from '../../../types/account';
import AccountDisplayName from '../../accounts/details/displayName';
import Icon from '../../icon';

function getProviderIcon(kind: IAccount['Kind']) {
    return ProviderIcons[kind];
}

function getProviderLogo(providerCode: IAccount['ProviderCode'], _isDark: boolean): ImageDimensionsSource {
    return ProviderFavicons[providerCode as string];
}

const ProviderLogo = ({providerCode}) => {
    const isDark = useDark();
    const logo = getProviderLogo(providerCode, isDark);

    return (
        <View style={{width: 36, height: 36}}>
            <Image
                style={[
                    {
                        flex: 1,
                        width: 36,
                        height: 36,
                    },
                ]}
                borderRadius={8}
                source={logo}
            />
        </View>
    );
};

type AccountHeaderProps = {
    providerKind: IAccount['Kind'];
    providerName: IAccount['DisplayName'];
    providerCode: IAccount['ProviderCode'];
    hint?: string;
};

type IAccountHeader = React.FunctionComponent<AccountHeaderProps>;

const FormAccountHeader: IAccountHeader = (props) => {
    const {providerKind: kind, providerName: displayName, hint, providerCode} = props;
    const isDark = useDark();
    const icon = getProviderIcon(kind);
    const hasProviderLogo = _.isString(providerCode) && !_.isNil(ProviderFavicons[providerCode]);

    return (
        <View style={{overflow: 'hidden', backgroundColor: isDark ? DarkColors.bg : Colors.grayLight}}>
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.title}>
                    {hasProviderLogo && <ProviderLogo providerCode={providerCode} />}
                    {!hasProviderLogo && _.isObject(icon) && (
                        // @ts-ignore
                        <Icon name={icon.name} size={icon.size} color={IconColors.gray} colorDark={isIOS ? Colors.white : DarkColors.text} />
                    )}
                    <View style={[styles.name, (hasProviderLogo || _.isObject(icon)) && {paddingLeft: 14}]}>
                        <Text style={[styles.programName, isDark && styles.programNameDark]}>{'Program Name'}</Text>
                        <AccountDisplayName title={displayName} />
                    </View>
                    {_.isString(hint) && <Text style={[styles.hint, isDark && styles.hintDark]}>{hint}</Text>}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        minHeight: 70,
        paddingHorizontal: 15,
        paddingVertical: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
        shadowColor: 'rgb(61, 71, 97)',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.025,
        shadowRadius: 3.84,
        elevation: 8,
    },
    containerDark: {
        backgroundColor: DarkColors.bgLight,
        borderBottomColor: DarkColors.border,
        borderColor: 'transparent',
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 50,
    },
    name: {
        flex: 1,
    },
    programName: {
        textTransform: 'uppercase',
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        opacity: 0.5,
    },
    programNameDark: {
        color: DarkColors.grayLight,
    },
    hint: {
        flex: 0.5,
        textAlign: 'right',
        color: fromColor(Colors.grayDark).alpha(0.5).rgb().string(),
        fontFamily: Fonts.regular,
        fontSize: 12,
        fontWeight: '400',
    },
    hintDark: {
        color: DarkColors.grayLight,
    },
});

export {FormAccountHeader};
export {getProviderIcon};
export {ProviderLogo};
