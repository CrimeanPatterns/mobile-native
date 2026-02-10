import {ProviderFavicons} from '@assets/favicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import _ from 'lodash';
import React, {PropsWithChildren, useCallback, useMemo, useRef} from 'react';
import {Image, Text, useWindowDimensions, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {ContextMenuView, MenuConfig, MenuElementConfig} from 'react-native-ios-context-menu';
import LinearGradient from 'react-native-linear-gradient';
import SwipeableItem, {SwipeableItemImperativeRef} from 'react-native-swipeable-item';

import ProviderIcons from '../../../../config/providerIcons';
import {isIOS, isTablet} from '../../../../helpers/device';
import {providerFaviconHasBorder} from '../../../../helpers/providerFavicon';
import {PathConfig} from '../../../../navigation/linking';
import {AccountDetails} from '../../../../screens/accounts/account/details';
import AccountsListService from '../../../../services/accountsList';
import {navigateByPath} from '../../../../services/navigator';
import {Colors, DarkColors} from '../../../../styles';
import {ThemeColors, useTheme} from '../../../../theme';
import {IAccount} from '../../../../types/account';
import {InsideStackScreenParams} from '../../../../types/navigation';
import Icon from '../../../icon';
import {SeparatorArrow} from '../../../page/crookedSeparator';
import {ActionRemove} from '../../../page/swipeableList/actionButton';
import {SwipeableListItemOverlay} from '../../../page/swipeableList/itemOverlay';
import TimeAgo from '../../../timeAgo';
import TimerCountdown from '../../../timerCountdown';
import AccountBalance from '../../details/balance';
import ExpirationStateIcon from '../../expirationStateIcon';
import styles from './styles';

type AccountContextMenuProps = {
    account: IAccount;
    navigate: (routeName, params?) => void;
};

const AccountContextMenu: React.FunctionComponent<PropsWithChildren<AccountContextMenuProps>> = ({account, navigate, children}) => {
    const contextMenu = useRef<ContextMenuView>(null);
    const menu = useMemo((): MenuConfig => {
        const {Access, Autologin} = account;
        const menuItems: MenuElementConfig[] = [];

        if (Access) {
            if (Access.update) {
                menuItems.push({
                    actionKey: 'update',
                    actionTitle: Translator.trans('update.button', {}, 'messages'),
                    icon: {
                        iconType: 'ASSET',
                        iconValue: 'Update',
                    },
                });
            }
            if (Access.edit) {
                menuItems.push({
                    actionKey: 'edit',
                    actionTitle: Translator.trans('award.account.list.button.edit', {}, 'messages'),
                    icon: {
                        iconType: 'ASSET',
                        iconValue: 'Edit',
                    },
                });
            }
            if (Access.autologin) {
                const isExtension = Autologin && (Autologin.desktopExtension || Autologin.mobileExtension);

                menuItems.push({
                    actionKey: 'login',
                    actionTitle: (isExtension && Translator.trans('button.autologin')) || Translator.trans('buttons.gotosite', {}, 'mobile'),
                    icon: {
                        iconType: 'ASSET',
                        iconValue: isExtension ? 'Autologin' : 'Gotosite',
                    },
                });
            }
            if (Access.delete) {
                menuItems.push({
                    menuTitle: Translator.trans('button.delete', {}, 'messages'),
                    menuOptions: ['destructive'],
                    icon: {
                        iconType: 'SYSTEM',
                        iconValue: 'trash',
                    },
                    menuItems: [
                        {
                            actionKey: 'delete',
                            actionTitle: Translator.trans('button.delete', {}, 'messages'),
                            menuAttributes: ['destructive'],
                            icon: {
                                iconType: 'SYSTEM',
                                iconValue: 'trash',
                            },
                        },
                    ],
                });
            }
        }
        return {
            menuTitle: '',
            menuItems,
        };
    }, [account]);
    const onPressMenuItem = useCallback(
        ({nativeEvent}) => {
            const {actionKey} = nativeEvent;
            const {FID: accountId} = account;

            if (actionKey === 'login') {
                navigate('AccountAutoLogin');
            }

            if (actionKey === 'update') {
                navigateByPath(PathConfig.AccountUpdate, {ID: accountId, backTo: 'AccountsList'}, true);
            }

            if (actionKey === 'edit') {
                navigate('AccountEdit');
            }

            if (actionKey === 'delete') {
                AccountsListService.deleteAccount(accountId);
            }
        },
        [account],
    );

    const onPressMenuPreview = useCallback(() => {
        navigate('AccountDetails', {animation: 'none'});
    }, []);

    const renderPreview = useCallback(
        () => <AccountDetails.Preview accountId={account.FID} subAccountId={account.SubAccountID} />,
        [account.FID, account.SubAccountID],
    );

    useFocusEffect(
        useCallback(
            () => () => {
                contextMenu.current?.dismissMenu();
            },
            [],
        ),
    );

    if (!isIOS || isTablet || _.isEmpty(account.PreviewBlocks)) {
        return <>{children}</>;
    }

    return (
        <ContextMenuView
            ref={contextMenu}
            internalCleanupMode='viewController'
            previewConfig={{
                previewType: 'CUSTOM',
                preferredCommitStyle: 'pop',
            }}
            onPressMenuPreview={onPressMenuPreview}
            renderPreview={renderPreview}
            onPressMenuItem={onPressMenuItem}
            menuConfig={menu}>
            <>{children}</>
        </ContextMenuView>
    );
};

const AccountListItem: React.FunctionComponent<{
    account: IAccount;
    isSubAccount?: boolean;
    hasArrow?: boolean;
    index: number;
    setSwipeableRef: (ref: SwipeableItemImperativeRef, index: number) => void;
    onSwipeBegin: (index: number) => void;
}> = ({account, isSubAccount, hasArrow, setSwipeableRef: _setSwipeableRef, index, onSwipeBegin}) => {
    const setSwipeableRef = useRef<((ref: SwipeableItemImperativeRef, index: number) => void) | undefined>(_setSwipeableRef);
    const navigation = useNavigation<StackNavigationProp<InsideStackScreenParams>>();
    const theme = useTheme();
    const isDark = theme === 'dark';
    const themeColors = ThemeColors[theme];
    const {width} = useWindowDimensions();
    const isPortrait = width > 767 && width < 1024;
    const navigate = useCallback(
        (routeName, params?) => {
            const {FID, SubAccountID, Access} = account;

            navigation.navigate('Account', {screen: routeName, params: {ID: FID, SubAccountID, Access, ...params}});
        },
        [account, navigation],
    );
    const displayName = useMemo(
        () => (!account.ParentAccount ? account.DisplayName : account.CouponType),
        [account.CouponType, account.DisplayName, account.ParentAccount],
    );
    const hasLogin = useMemo(() => _.isString(account.Login) && account.Login.length > 0, [account.Login]);
    const getAccountStatus = useCallback(() => {
        if (account.Disabled) {
            return 'disable';
        }

        if (account.Error) {
            return 'error';
        }

        if (_.isNumber(account.LastChangeDate) && _.isNumber(account.LastChangeRaw)) {
            const lastChange = AccountBalance.isLastChangeDate(account.LastChangeDate * 1000);

            if (lastChange && account.LastChangeRaw > 0) {
                return 'increase';
            }

            if (lastChange && account.LastChangeRaw < 0) {
                return 'decrease';
            }
        }

        return null;
    }, [account.Disabled, account.Error, account.LastChangeDate, account.LastChangeRaw]);
    const getAccountStatusBackgroundColor = (status) => {
        switch (status) {
            case 'disable':
                return themeColors.orange;
            case 'error':
                return themeColors.red;
            case 'increase':
                return themeColors.green;
            case 'decrease':
                return themeColors.blue;
            default:
                return null;
        }
    };
    const getAccountBorderColor = () => {
        const status = getAccountStatus();

        if (!isSubAccount && status === 'error') {
            return Colors.red;
        }

        if (isDark) {
            return DarkColors.bg;
        }

        return Colors.gray;
    };
    const getParentBorderColor = () => {
        if (isSubAccount && account.ParentError && !account.ParentDisabled) {
            return Colors.red;
        }

        if (isDark) {
            return DarkColors.bg;
        }

        return Colors.gray;
    };
    const getAccountStatusGradient = () => {
        const status = getAccountStatus();

        switch (status) {
            case 'disable':
                return Colors.orange;
            case 'error':
                return Colors.red;
            case 'increase':
                return Colors.green;
            case 'decrease':
                return Colors.blue;
            default:
                return isDark ? DarkColors.bgLight : Colors.white;
        }
    };
    const onPress = useCallback(() => navigate('AccountDetails'), [navigate]);
    const renderArrow = () => {
        if (hasArrow && isSubAccount) {
            return (
                <SeparatorArrow
                    style={{arrow: styles.arrow, innerArrow: styles.innerArrow}}
                    color={getParentBorderColor()}
                    backgroundColor={isDark ? DarkColors.bgLight : ''}
                />
            );
        }

        return null;
    };
    const renderAccountStatus = useCallback(() => {
        const status = getAccountStatus();
        const iconSize = 13;

        switch (status) {
            case 'disable':
                return <Text style={styles.statusIcon}>!</Text>;
            case 'error':
                return <Text style={styles.statusIcon}>!</Text>;
            case 'increase':
                return <Icon name='double-arrow' color={Colors.white} size={iconSize} />;
            case 'decrease':
                return <Icon name='double-arrow' color={Colors.white} size={iconSize} style={{transform: [{rotate: '180deg'}]}} />;
            default:
                return null;
        }
    }, [getAccountStatus]);

    const renderProviderLogo = useCallback(() => {
        const status = getAccountStatus();
        const logo = ProviderFavicons[account.ProviderCode as string];
        const categoriesLogo = ProviderIcons[account.Type ? account.Type : account.Kind];
        const backgroundColor = getAccountStatusBackgroundColor(status);
        const hasBorder = providerFaviconHasBorder(account.ProviderCode as string, isDark);

        return (
            <View style={styles.providerLogoWrap}>
                {_.isNil(logo) === false ? (
                    <Image
                        style={[styles.providerLogo, hasBorder && styles.providerLogoBorder, isDark && styles.providerLogoDark]}
                        borderRadius={8}
                        source={logo}
                    />
                ) : (
                    <View style={[styles.providerLogo, styles.kindLogo, isDark && styles.providerLogoDark, !isDark && styles.providerLogoBorder]}>
                        <Icon {...categoriesLogo} size={20} color={Colors.grayDark} />
                    </View>
                )}

                {_.isNil(status) === false && (
                    <View style={[styles.accountStatusWrap, {backgroundColor: backgroundColor}]}>{renderAccountStatus()}</View>
                )}
            </View>
        );
    }, [account.ProviderCode, account.Type, account.Kind, isDark, getAccountStatus]);
    const renderLoginCell = useCallback(() => {
        if (isTablet && !(width > 767 && width < 1024)) {
            if (typeof account.Login === 'string' && account.Login.length > 0) {
                return (
                    <View style={styles.accountColumnAccount}>
                        <Text style={styles.loginText} numberOfLines={1} ellipsizeMode='tail'>
                            {account.Login}
                        </Text>
                    </View>
                );
            }

            if (!isSubAccount) {
                return (
                    <View style={styles.accountColumnAccount}>
                        <Text style={styles.loginText} />
                    </View>
                );
            }
        }

        return null;
    }, [account.Login, isSubAccount, width]);
    const renderStatusCell = useCallback(() => {
        const {ID, EliteStatus} = account;

        if (isTablet) {
            if (_.isObject(EliteStatus)) {
                return (
                    <View style={styles.accountColumnStatus}>
                        <View style={styles.accountColumnStatusItem}>
                            <Text style={[styles.accountStatusText, isDark && styles.textDark]}>{EliteStatus.Name}</Text>
                            <View style={styles.accountProgress}>
                                {Array(EliteStatus.LevelsCount)
                                    .fill(0)
                                    .map((_, i) => (
                                        <View style={{flex: 1}} key={`${ID}-status-cell-${i}`}>
                                            <View
                                                style={[
                                                    styles.accountProgressLine,
                                                    i < EliteStatus.Rank && styles.accountProgressLineActive,
                                                    isDark && styles.accountProgressLineDark,
                                                    i < EliteStatus.Rank && styles.accountProgressLineActiveDark,
                                                ]}
                                            />
                                        </View>
                                    ))}
                            </View>
                        </View>
                    </View>
                );
            }

            if (!isSubAccount) {
                return (
                    <View style={styles.accountColumnStatus}>
                        <View style={styles.accountColumnStatusItem}>
                            <Text style={[styles.accountStatusText, isDark && styles.textDark]} />
                        </View>
                    </View>
                );
            }
        }

        return null;
    }, [account, isDark, isSubAccount]);
    const renderExpireCell = useCallback(() => {
        const {ExpirationUpgrade, ExpirationDate, ExpirationState} = account;

        if (isTablet && width > 767) {
            const ExpirationIcon = <ExpirationStateIcon state={ExpirationState} size={13} style={{fontSize: 13, marginRight: 5}} />;

            if (_.isObject(ExpirationDate)) {
                if (ExpirationUpgrade) {
                    return (
                        <View style={styles.accountColumnExpire}>
                            <Text style={[styles.accountExpireText, isDark && styles.textDark]}>{ExpirationDate.fmt}</Text>
                        </View>
                    );
                }
                if (ExpirationState !== 'expired' && ExpirationDate.ts) {
                    return (
                        <View style={styles.accountColumnExpire}>
                            {ExpirationIcon}
                            <TimeAgo date={ExpirationDate.ts * 1000} shortFormat style={[styles.accountExpireText, isDark && styles.textDark]} />
                        </View>
                    );
                }
                if (_.isString(ExpirationDate.fmt)) {
                    return (
                        <View style={styles.accountColumnExpire}>
                            {ExpirationIcon}
                            <Text style={[styles.accountExpireText, isDark && styles.textDark]}>{ExpirationDate.fmt}</Text>
                        </View>
                    );
                }
            }

            if (!isSubAccount) {
                return (
                    <View style={styles.accountColumnExpire}>
                        <Text style={[styles.accountExpireText, isDark && styles.textDark]} />
                    </View>
                );
            }
        }

        return null;
    }, [account, isDark, isSubAccount, width]);
    const renderLastChange = useCallback(() => {
        if (_.isNumber(account.LastChangeDate) && _.isNumber(account.LastChangeRaw) && _.isString(account.LastChange)) {
            const isLastChangePositive = account.LastChangeRaw > 0;
            const colorLastChange = isLastChangePositive ? themeColors.green : themeColors.blue;
            const iconSize = isIOS ? 10 : 12;

            return (
                <View style={styles.balanceBlock}>
                    <Text style={[styles.balanceLastChange, {color: colorLastChange}, account.Disabled && styles.disabled]}>
                        {account.LastChange}
                    </Text>
                    {isLastChangePositive ? (
                        <Icon
                            name='square-arrow'
                            color={themeColors.green}
                            size={iconSize}
                            style={[
                                {
                                    width: iconSize,
                                    height: iconSize,
                                },
                                styles.balanceBlockImage,
                            ]}
                        />
                    ) : (
                        <Icon
                            name='square-arrow'
                            color={themeColors.blue}
                            size={iconSize}
                            style={[
                                {
                                    width: iconSize,
                                    height: iconSize,
                                    transform: [{rotate: '180deg'}],
                                },
                                styles.balanceBlockImage,
                            ]}
                        />
                    )}
                </View>
            );
        }

        return null;
    }, [account, themeColors]);
    const renderExpirationStateIcon = useCallback(() => {
        const {red, green, orange} = themeColors;

        if (account.ExpirationState === 'far') {
            return <Icon name='success' color={green} size={8} />;
        }
        if (account.ExpirationState === 'soon') {
            return <Icon name='warning' color={orange} size={11} />;
        }
        if (account.ExpirationState === 'expired') {
            return <Icon name='error' color={red} size={8} />;
        }

        return null;
    }, [account.ExpirationState, themeColors]);

    const deleteAccount = useCallback(() => {
        AccountsListService.deleteAccount(account.FID);
    }, [account]);

    const renderQuickActions = useCallback(
        () => (
            <View style={styles.actionButton}>
                <ActionRemove onPress={deleteAccount} />
            </View>
        ),
        [deleteAccount],
    );

    const setSwipeableItemRef = useCallback(
        (ref: SwipeableItemImperativeRef | null) => {
            if (!ref || isSubAccount) {
                return;
            }

            if (setSwipeableRef.current) {
                setSwipeableRef.current(ref, index);
            }
            setSwipeableRef.current = undefined;
        },
        [index],
    );

    const renderOverlay = useCallback(() => <SwipeableListItemOverlay index={index} onSwipeBegin={onSwipeBegin} />, []);

    return (
        <View
            style={{
                borderTopWidth: isSubAccount && hasArrow ? 1 : 0,
                borderBottomWidth: account.HasSubAccounts ? 0 : 1,
                borderTopColor: getParentBorderColor(),
                borderBottomColor: getAccountBorderColor(),
            }}>
            <View
                style={{
                    overflow: 'hidden',
                    justifyContent: 'center',
                }}>
                <SwipeableItem
                    ref={setSwipeableItemRef}
                    item={account}
                    swipeEnabled={!isSubAccount}
                    renderUnderlayLeft={renderQuickActions}
                    renderOverlay={renderOverlay}
                    snapPointsLeft={[70]}>
                    <AccountContextMenu account={account} navigate={navigate}>
                        <RectButton
                            onLongPress={_.noop}
                            testID={`account-list-item-${account.FID}`}
                            rippleColor={isDark ? DarkColors.border : Colors.gray}
                            underlayColor={isDark ? DarkColors.bg : Colors.grayLight}
                            style={[
                                styles.accountWrap,
                                isDark && styles.accountWrapDark,
                                isSubAccount && styles.subAccountWrap,
                                isSubAccount && isDark && styles.subAccountWrapDark,
                            ]}
                            activeOpacity={1}
                            onPress={onPress}>
                            <LinearGradient
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 0}}
                                locations={[0.6, 1]}
                                colors={[
                                    fromColor(getAccountStatusGradient()).alpha(0).rgb().toString(),
                                    fromColor(getAccountStatusGradient())
                                        .alpha(isDark ? 0.15 : 0.1)
                                        .rgb()
                                        .toString(),
                                ]}>
                                <View style={[styles.accountRow, isSubAccount && styles.subAccountRow]}>
                                    {!isSubAccount && renderProviderLogo()}
                                    <View style={[styles.accountColumn, isSubAccount && styles.subAccountColumn]}>
                                        <Text
                                            style={[
                                                styles.displayName,
                                                isDark && styles.whiteText,
                                                account.Disabled && styles.disabled,
                                                isSubAccount && {fontSize: isIOS ? 14 : 13},
                                                isTablet && isPortrait && {fontSize: 17},
                                            ]}
                                            numberOfLines={(isSubAccount && 1) || (!hasLogin && 2) || 1}
                                            ellipsizeMode='tail'>
                                            {displayName}
                                        </Text>
                                        <View style={styles.loginWrap}>
                                            {account.CouponType && account.CouponType !== displayName && account.CouponType !== account.Login && (
                                                <Text style={[styles.couponType, isDark && styles.couponTypeDark]}>{account.CouponType}</Text>
                                            )}
                                            {(!isTablet || isPortrait) && hasLogin && (
                                                <Text style={[styles.login, isDark && styles.grayText]} numberOfLines={1}>
                                                    {account.Login}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    {renderLoginCell()}
                                    {renderStatusCell()}
                                    {renderExpireCell()}
                                    <View style={styles.accountColumnBalance}>
                                        {_.isString(account.Balance) && (
                                            <Text
                                                style={[
                                                    styles.balanceText,
                                                    isDark && styles.whiteText,
                                                    account.Disabled && styles.disabled,
                                                    isSubAccount && styles.balanceSubAccountText,
                                                ]}
                                                numberOfLines={1}
                                                ellipsizeMode='tail'>
                                                {account.Balance}
                                            </Text>
                                        )}
                                        {renderLastChange()}
                                        {_.isObject(account.ExpirationDate) && (
                                            <View style={styles.balanceChange}>
                                                {renderExpirationStateIcon()}
                                                {account.ExpirationState !== 'expired' && _.isNumber(account.ExpirationDate.ts) ? (
                                                    <TimeAgo
                                                        date={account.ExpirationDate.ts * 1000}
                                                        shortFormat
                                                        style={[styles.balanceChangeText, isDark && styles.grayText]}
                                                    />
                                                ) : (
                                                    typeof account.ExpirationDate.fmt === 'string' && (
                                                        <Text style={[styles.balanceChangeText, isDark && styles.grayText]}>
                                                            {account.ExpirationDate.fmt}
                                                        </Text>
                                                    )
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    <Icon style={styles.accountMore} name='arrow' color={themeColors.grayDarkLight} size={14} />
                                </View>

                                {!isSubAccount && _.isNumber(account.BalanceWatchEndDate) && (
                                    <View style={[styles.accleratedWrap, isDark && styles.accleratedWrapDark]}>
                                        <View style={[styles.accleratedStatusIconWrap, isDark && styles.accleratedStatusIconWrapDark]}>
                                            <Text style={styles.statusIcon}>!</Text>
                                        </View>
                                        <View style={styles.accleratedTextWrap}>
                                            <View style={styles.accleratedRow}>
                                                <Text style={[styles.accleratedText, isDark && styles.accleratedTextDark]}>
                                                    {Translator.trans('account.list.balancewatch.monitored-changes', {}, 'messages')}
                                                </Text>
                                            </View>
                                            <View style={styles.accleratedRow}>
                                                <Text style={[styles.accleratedText, isDark && styles.accleratedTextDark]}>{`${Translator.trans(
                                                    'remaining-time-col',
                                                    {},
                                                    'messages',
                                                )} `}</Text>
                                                <TimerCountdown
                                                    style={[
                                                        styles.accleratedText,
                                                        isIOS && styles.accleratedBoldText,
                                                        isDark && styles.accleratedTextDark,
                                                    ]}
                                                    date={account.BalanceWatchEndDate}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </LinearGradient>
                        </RectButton>
                    </AccountContextMenu>
                </SwipeableItem>
            </View>
            {renderArrow()}
        </View>
    );
};

export default React.memo(AccountListItem);
