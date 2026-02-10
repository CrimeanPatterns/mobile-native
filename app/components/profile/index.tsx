import {useScrollToTop} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Image, NativeModules, Platform, RefreshControl, Text, TouchableHighlight, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {FlatList} from 'react-native-gesture-handler';
import Prompt from 'react-native-prompt-android';

import {isAndroid, isIOS} from '../../helpers/device';
import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import Popover from '../../helpers/popover';
import {getTouchableComponent} from '../../helpers/touchable';
import {useProfileScreenReload} from '../../hooks/profile';
import API from '../../services/api';
import eventEmitter from '../../services/eventEmitter';
import Session from '../../services/session';
import StorageSync from '../../services/storageSync';
import UserSettings, {isVibrationSupported} from '../../services/userSettings';
import {Colors, DarkColors} from '../../styles';
import {ThemeColors, useDark, useTheme} from '../../theme';
import {ProfileStackScreenProps} from '../../types/navigation';
import {IProfile} from '../../types/profile';
import Icon from '../icon';
import ActionButton from '../page/actionButton';
import {HeaderRightButton} from '../page/header/button';
import {TravelStatistics} from '../travel-summary';
// eslint-disable-next-line import/no-unresolved
import rowStyles from './overview/styles';
import {TextProperty} from './overview/textProperty';
import {footerStyle, searchListStyles, styles} from './styles';

const TouchableItem = getTouchableComponent(TouchableHighlight);

const components = {
    balanceCredits: require('./overview/balanceCredits').default,
    cancelSubscription: require('./overview/cancelSubscription').default,
    checklistItem: require('./overview/checklistItem').default,
    flashMessage: require('./overview/flashMessage').default,
    groupTitle: require('./overview/groupTitle').default,
    paragraph: require('./overview/paragraph').default,
    pincode: require('./overview/pincode').default,
    twoFactorAuthentication: require('./overview/twoFactorAuthentication').default,
    subTitle: require('./overview/subTitle').default,
    table: require('./overview/table').default,
    textProperty: TextProperty,
    formTextProperty: require('./overview/formTextProperty').default,
    upgrade: require('./overview/upgrade').default,
    warningLink: require('./overview/warningLink').default,
    linkedAccount: require('./overview/linkedAccount').default,
    blog: React.forwardRef((props, ref) => <TextProperty ref={ref} {...props} style={{borderTopWidth: 1, borderTopColor: Colors.gray}} />),
};

const getComponent = ({type}) => {
    const Component = components[type];

    if (Component) {
        return Component;
    }

    return undefined;
};

type ProfileProps = {profile: IProfile};

export const ProfileListHeader: React.FunctionComponent<ProfileStackScreenProps<'Profile'> & ProfileProps> = ({navigation, profile}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const {AccountLevel, IsTrial, FullName, AvatarImage, UserEmail, emailVerified, travelSummary} = profile;
    const avatarSize = 64;
    const colors = ThemeColors[theme];
    const avatarColor = Platform.select({
        ios: colors.border,
        android: Colors.grayDarkLight,
    });

    return (
        <>
            {_.isObject(travelSummary) && <TravelStatistics data={travelSummary} navigation={navigation} />}
            <View style={[styles.info, isDark && styles.infoDark]} testID='profile-header'>
                <View style={styles.picture}>
                    <View
                        style={{
                            width: avatarSize,
                            height: avatarSize,
                            borderWidth: 1,
                            borderColor: avatarColor,
                            borderRadius: 32,
                            overflow: 'hidden',
                        }}>
                        {_.isEmpty(AvatarImage) && <Icon name='avatar' color={avatarColor} size={avatarSize} />}
                        {!_.isEmpty(AvatarImage) && (
                            <Image
                                style={{
                                    width: avatarSize,
                                    height: avatarSize,
                                    resizeMode: 'contain',
                                }}
                                source={{
                                    uri: AvatarImage,
                                }}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.details}>
                    <Text style={[styles.name, isDark && styles.textDark]} numberOfLines={1} accessibilityLabel={FullName}>
                        {FullName}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={[styles.email, isDark && styles.textDark]} numberOfLines={1} accessible accessibilityLabel={UserEmail}>
                                {UserEmail}
                            </Text>
                            {_.isString(AccountLevel) && (
                                <View style={styles.accountLevelWrap}>
                                    <Text
                                        style={[styles.accountLevel, isDark && styles.textDark]}
                                        numberOfLines={1}
                                        accessible
                                        accessibilityLabel={AccountLevel}>
                                        {AccountLevel}
                                    </Text>
                                    {IsTrial === true && <Text style={[styles.accountLevel, styles.badge, isDark && styles.badgeDark]}>Trial</Text>}
                                </View>
                            )}
                        </View>
                        {emailVerified === true && (
                            <View style={{flexDirection: 'column', alignItems: 'center', paddingLeft: 5}}>
                                <Icon name='photo-check' color={colors.green} style={{lineHeight: 20}} />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </>
    );
};

export const ProfileListFooter: React.FunctionComponent = () => {
    const isDark = useDark();
    const date = new Date();
    const version = DeviceInfo.getVersion();

    return (
        <View style={[footerStyle.copyright, isDark && footerStyle.copyrightDark]}>
            <Text style={[footerStyle.copyrightText, isDark && styles.textDark]}>{`© ${date.getFullYear()} AwardWallet v${version}`}</Text>
        </View>
    );
};

export const filterProfileOverview = (children) => {
    const filtered = [];
    let add;

    for (const field of children) {
        add = true;

        if (field.formLink && field.formLink.includes('/profile/location/list') && parseInt(Session.getProperty('locations-total'), 10) === 0) {
            add = false;
        }

        if (field.type === 'checklistItem' && _.has(field, 'attrs.setting')) {
            if (
                (field.attrs.setting === 'vibrate' && !isVibrationSupported()) ||
                ((isIOS || (!isIOS && NativeModules.PlatformConstants.Version >= 26)) && ['sound', 'vibrate'].indexOf(field.attrs.setting) !== -1)
            ) {
                add = false;
            } else {
                field.checked = UserSettings.get(field.attrs.setting);
            }
        }
        if (add) {
            // @ts-ignore
            filtered.push(field);
        }
    }

    return filtered;
};

export const ProfileList: React.FunctionComponent<ProfileStackScreenProps<'Profile'> & ProfileProps> = ({navigation, route, profile}) => {
    const [forceRefresh, setForceRefresh] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const {overview, impersonate} = profile;
    const [search, setSearch] = useState('');
    const theme = useTheme();
    const listRef = useRef<FlatList>(null);
    const scrollToTop = useCallback(() => {
        if (isIOS) {
            // @ts-ignore
            listRef.current?.getNativeScrollRef().scrollTo({y: 0});
        }
    }, [listRef]);
    const isDark = theme === 'dark';
    const keyExtractor = useCallback((item, index) => String(`${item.type}-${index}`), []);
    const renderSearchListItem = useCallback(
        (item) => {
            // @ts-ignore
            const {formLink, formTitle, attrs: {formFieldName} = {}} = item;

            return (
                <TouchableItem
                    delayPressIn={0}
                    underlayColor={isDark ? DarkColors.bg : Colors.grayLight}
                    onPress={() =>
                        handleOpenUrl({url: formLink}, (): void => {
                            navigation.navigate('ProfileEdit', {
                                formLink,
                                formTitle,
                                scrollTo: formFieldName,
                            });
                        })
                    }>
                    <View style={[searchListStyles.row, isDark && searchListStyles.rowDark]}>
                        <Text style={[searchListStyles.name, isDark && searchListStyles.textDark]}>{item.name}</Text>
                        {_.isString(item.group) && <Text style={[searchListStyles.group, isDark && searchListStyles.textDark]}>{item.group}</Text>}
                    </View>
                </TouchableItem>
            );
        },
        [isDark, navigation],
    );
    const renderItem = useCallback(
        ({item, index, separators}) => {
            if (search.length > 0) {
                return renderSearchListItem(item);
            }

            const reservedItems = ['impersonate', 'logout', 'empty'];

            if (reservedItems.includes(item)) {
                const [impersonate, logout, empty] = reservedItems;

                if (item === impersonate) {
                    return <ImpersonateRow separators={separators} />;
                }

                if (item === logout) {
                    return <LogoutRow separators={separators} />;
                }

                if (item === empty) {
                    return <EmptyRow />;
                }

                return null;
            }
            const {type, ...props} = item;
            const Component = getComponent(item);

            if (Component) {
                return React.createElement(Component, {
                    separators,
                    testID: `${type}-${index}`,
                    index,
                    theme,
                    navigation,
                    ...props,
                });
            }

            return null;
        },
        [search, renderSearchListItem, theme, navigation],
    );
    const openContactUs = useCallback(() => navigation.navigate('ContactUs'), [navigation]);

    const renderHeader = useCallback(
        () =>
            // if (_.isString(search) && search.length > 0) {
            null,
        // }
        // return <ProfileListHeader route={route} navigation={navigation} profile={profile} />;
        [search, navigation, profile, route],
    );

    const renderSeparator = useCallback(
        ({highlighted}) => {
            if (_.isString(search) && search.length > 0) {
                return null;
            }
            return <Separator highlighted={highlighted} />;
        },
        [search],
    );

    const renderFooter = useCallback(() => {
        if (_.isString(search) && search.length > 0) {
            return null;
        }
        return <ProfileListFooter />;
    }, [search]);

    const refreshData = useCallback(async (forceRefresh: boolean) => {
        if (!forceRefresh) {
            setRefreshing(true);
        }
        try {
            await StorageSync.forceUpdate();
        } finally {
            setRefreshing(false);
            setForceRefresh(false);
        }
    }, []);

    const filterOverview = useCallback(
        (item) => {
            const {name, group, type, formLink} = item;
            const regex = new RegExp(`\\b${search}`, 'i');

            if (_.isString(formLink) && type !== 'groupTitle') {
                if (_.isString(group) && regex.test(group)) {
                    return true;
                }

                if (_.isString(name)) {
                    return regex.test(name);
                }
            }

            return false;
        },
        [search],
    );
    // @ts-ignore
    const list = useMemo(() => {
        const data = filterProfileOverview([...overview, impersonate && 'impersonate', 'logout', 'empty'].filter((item) => item));

        if (_.isString(search) && search.length > 0) {
            // @ts-ignore
            return _.orderBy(data.filter(filterOverview), ({name}) => name.toLowerCase().indexOf(search.toLowerCase()));
        }

        return data;
    }, [overview, impersonate, search, filterOverview]);

    useEffect(() => {
        if (route.params?.reload) {
            setForceRefresh(true);
        }
    }, [route]);

    useEffect(() => {
        if (forceRefresh) {
            refreshData(forceRefresh);
            scrollToTop();
        }
    }, [forceRefresh]);
    const dropdownRef = useRef<View>(null);
    const menus = useMemo(
        () => [
            {
                menus: [
                    {
                        label: Translator.trans('menu.button.logout', {}, 'menu'),
                        icon: 'menu-logout',
                        key: 'logout',
                    },
                    {
                        label: Translator.trans('menu.account-delete', {}, 'menu'),
                        icon: 'footer-delete',
                        key: 'delete',
                    },
                ],
            },
        ],
        [profile.locale],
    );
    const onMenuItemPress = useCallback(
        (selectionIndex, groupIndex = 0) =>
            Popover.onMenuItemPress(menus, selectionIndex, groupIndex, {
                logout: () => eventEmitter.emit('doLogout'),
                delete: () => navigation.navigate('UserDelete'),
            }),
        [menus, navigation],
    );

    const showPopover = useCallback(
        () =>
            Popover.show(dropdownRef.current, {
                menus,
                theme,
                menuWidth: 205,
                iconMargin: 10,
                textMargin: 10,
                onDone: onMenuItemPress,
            }),
        [menus, theme, onMenuItemPress],
    );

    const headerRight = useCallback(
        () => <HeaderRightButton ref={dropdownRef} iconName={isIOS ? 'more' : 'android-more'} onPress={showPopover} />,
        [showPopover],
    );

    useLayoutEffect(() => {
        const onChangeText = (event) => setSearch(event.nativeEvent.text);

        const options = isIOS
            ? {
                  onChangeText,
              }
            : {
                  tintColor: Colors.white,
                  textColor: Colors.white,
                  headerIconColor: Colors.white,
                  shouldShowHintSearchIcon: false,
                  placeholder: Translator.trans('search'),
                  onChangeText,
                  onFocus: () =>
                      navigation.setOptions({
                          headerRight: () => null,
                      }),
                  onBlur: () => navigation.setOptions({headerRight}),
              };

        navigation.setOptions({
            // @ts-ignore
            headerSearchBarOptions: options,
            headerRight,
        });
    }, [headerRight, navigation]);

    useScrollToTop(
        useRef({
            scrollToTop,
        }),
    );

    return (
        <View style={[styles.page, isDark && styles.pageDark]}>
            <FlatList
                contentInsetAdjustmentBehavior='always'
                ref={listRef}
                data={list}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                ItemSeparatorComponent={renderSeparator}
                refreshControl={
                    // @ts-ignore
                    <RefreshControl refreshing={refreshing} onRefresh={refreshData} progressViewOffset={40} />
                }
                scrollToOverflowEnabled
            />
            {isAndroid && <ActionButton color={isDark ? DarkColors.gold : Colors.gold} onPress={openContactUs} iconName='menu-contact-us' />}
        </View>
    );
};

const EmptyRow: React.FunctionComponent = () => (isAndroid ? <View style={[rowStyles.container, rowStyles.containerRow]} /> : null);

const ImpersonateRow: React.FunctionComponent<{separators: any}> = ({separators}) => {
    const reload = useProfileScreenReload();
    const theme = useTheme();
    const onPress = useCallback(() => {
        Prompt(
            'Impersonate',
            'Enter UserId, Login or Email',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'OK',
                    onPress: (login) => {
                        API.post<{success: boolean}>('/impersonate', {
                            loginOrEmail: login,
                        }).then(
                            async (response) => {
                                if (response) {
                                    const {data} = response;

                                    if (data.success) {
                                        reload();
                                    } else {
                                        // @ts-ignore
                                        alert('Impersonate failed');
                                    }
                                } else {
                                    // @ts-ignore
                                    alert('Impersonate failed');
                                }
                            },
                            () => {
                                // @ts-ignore
                                alert('User not found');
                            },
                        );
                    },
                },
            ],
            {
                cancelable: false,
            },
        );
    }, []);

    return <TextProperty theme={theme} name='Impersonate' separators={separators} onPress={onPress} />;
};

const LogoutRow: React.FunctionComponent<{separators: React.FunctionComponent}> = ({separators}) => {
    const theme = useTheme();
    const onPress = useCallback(() => eventEmitter.emit('doLogout'), []);

    return <TextProperty theme={theme} name={Translator.trans('menu.button.logout', {}, 'menu')} separators={separators} onPress={onPress} />;
};

const Separator: React.FunctionComponent<{highlighted: boolean}> = ({highlighted}) => {
    const isDark = useDark();

    return isAndroid ? <View style={[styles.separator, isDark && styles.separatorDark, highlighted && styles.separatorHide]} /> : null;
};
