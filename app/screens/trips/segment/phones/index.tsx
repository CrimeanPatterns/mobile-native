import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {FlatList, Linking, Platform, Text, TouchableOpacity, View} from 'react-native';

import Icon from '../../../../components/icon';
import Icons from '../../../../components/trips/icons';
import {isAndroid, isIOS} from '../../../../helpers/device';
import {useProfileData} from '../../../../hooks/profile';
import {Colors} from '../../../../styles';
import {IconColors} from '../../../../styles/icons';
import {useDark} from '../../../../theme';
import {TripSegmentPhone, TripSegmentPhoneGroup, TripSegmentPhonesListItem} from '../../../../types/trips';
import {styles} from './styles';

const orderPhones = (menuPhones: TripSegmentPhonesListItem, country: string) => {
    const orderedPhones: TripSegmentPhone[] = [];

    menuPhones.groups.forEach((group) => {
        let groupPhones = menuPhones.phones.filter((item) => item.group === group.name);
        let orderPhones;

        if (group.order) {
            orderPhones = group.order;
            if (orderPhones[0] && orderPhones[0] === 'geo' && _.isEmpty(country) === false) {
                orderPhones[0] = (phone) => {
                    if (phone.countryCode === country || (menuPhones.ownerCountry && phone.countryCode === menuPhones.ownerCountry)) {
                        return 1;
                    }
                    return undefined;
                };
            }
            groupPhones = _.orderBy(groupPhones, orderPhones);
        }
        orderedPhones.push(...groupPhones);
    });

    return orderedPhones;
};

const callPhone = (phoneNumber) => {
    const phone = phoneNumber.replace(/[^\d.]/g, '');

    Linking.canOpenURL(`tel:${phone}`).then((supported) => supported && Linking.openURL(`tel:${phone}`));
};

type PhoneListHeader = Pick<TripSegmentPhonesListItem, 'title' | 'icon'> & {
    rowKind: 'header';
};

type PhoneRow = {
    rowKind: 'phone';
} & TripSegmentPhone;
type PhoneListItem = PhoneListHeader | PhoneRow;

const TimelineSegmentPhones: React.FunctionComponent<{
    phones: TripSegmentPhoneGroup;
}> = ({phones: phonesGroup}) => {
    const isDark = useDark();
    const profileData = useProfileData();
    const country = useMemo(() => {
        if (profileData) {
            return profileData.country;
        }

        return undefined;
    }, [profileData]);
    const rows: PhoneListItem[] = useMemo(() => {
        const rows: PhoneListItem[] = [];
        const {phonesLists} = phonesGroup;

        phonesLists.forEach((group) => {
            const {title, icon} = group;
            const orderedPhones = orderPhones(group, country);

            rows.push({title, icon, rowKind: 'header'});
            rows.push(
                ...orderedPhones.map(
                    (phone): PhoneListItem => ({
                        rowKind: 'phone',
                        ...phone,
                    }),
                ),
            );
        });

        return rows;
    }, [country, phonesGroup]);
    const keyExtractor = useCallback((_, index) => String(index), []);
    const renderHeader = useCallback(
        (item: PhoneListHeader) => {
            const {icon, title} = item;
            const iconProps = _.isString(icon) && Icons[icon.split(/\s/)[0]];

            return (
                <View style={[styles.top, isDark && styles.topDark]}>
                    {_.isObject(iconProps) && (
                        <Icon {...iconProps} size={24} style={[styles.icon, isDark && styles.textDark]} color={IconColors.gray} />
                    )}
                    <View style={styles.topDetails}>
                        <Text style={[styles.topTag, isDark && styles.textDark]}>{title}</Text>
                    </View>
                </View>
            );
        },
        [isDark],
    );
    const renderPhone = useCallback(
        (item: PhoneRow) => (
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.containerTitle}>
                    <Text style={[styles.caption, isDark && styles.textDark]}>{item.name}</Text>
                    {isIOS && (
                        <View style={styles.phoneContainer}>
                            {_.isString(item.country) && <Text style={[styles.country, isDark && styles.textDark]}>{item.country}</Text>}
                            <Text style={[styles.phone, isDark && styles.textDark]} selectable>
                                {item.phone}
                            </Text>
                        </View>
                    )}
                    {isAndroid && (
                        <View style={styles.phoneContainer}>
                            <Text
                                {...Platform.select({
                                    android: {
                                        // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                                        key: Math.random(),
                                    },
                                })}
                                style={[styles.phone, isDark && styles.textDark]}
                                selectable>
                                {item.phone}
                            </Text>
                            {_.isString(item.country) && <Text style={styles.country}>{item.country}</Text>}
                        </View>
                    )}
                </View>
                {}
                <TouchableOpacity style={[styles.button, isDark && styles.buttonDark]} onPress={callPhone.bind(this, item.phone)}>
                    <Icon
                        name='phone'
                        color={Platform.select({
                            ios: Colors.white,
                            android: isDark ? Colors.black : Colors.white,
                        })}
                        size={24}
                    />
                    <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>{Translator.trans('account.phones.call', {}, 'mobile')}</Text>
                </TouchableOpacity>
            </View>
        ),
        [isDark],
    );
    const renderItem = useCallback(
        ({item}: {item: PhoneListItem}) => {
            if (item.rowKind === 'header') {
                return renderHeader(item);
            }

            return renderPhone(item);
        },
        [renderHeader, renderPhone],
    );

    return (
        <FlatList
            style={[styles.page, isDark && styles.pageDark]}
            data={rows}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentInsetAdjustmentBehavior='automatic'
        />
    );
};

export {TimelineSegmentPhones};
