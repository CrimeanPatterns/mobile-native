import {useImageDimensions, useLayout} from '@react-native-community/hooks';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Image, Text, useWindowDimensions, View} from 'react-native';

import * as Blocks from '../../../../components/accounts/details';
import AccountMileValueModal from '../../../../components/accounts/details/mile-value/modal';
import AccountDetailsRow from '../../../../components/accounts/details/row';
import AccountHeader, {getProviderIcon} from '../../../../components/accounts/header';
import Barcode from '../../../../components/barcode';
import DocumentScanCrop from '../../../../components/document-scan-crop';
import Icon from '../../../../components/icon';
import {HeaderRightButton} from '../../../../components/page/header/button';
import BottomMenu from '../../../../components/page/menu';
import RefreshableFlatList from '../../../../components/page/refreshableFlatList';
import {isAndroid, isTablet} from '../../../../helpers/device';
import {useAccount} from '../../../../hooks/account';
import {useProfileData} from '../../../../hooks/profile';
import AccountsListService from '../../../../services/accountsList';
import BarcodeManager from '../../../../services/barcode';
import StorageSync from '../../../../services/storageSync';
import {Colors, DarkColors} from '../../../../styles';
import {useTheme} from '../../../../theme';
import type {IAccount} from '../../../../types/account';
import {AccountsStackParamList, AccountsStackScreenFunctionalComponent} from '../../../../types/navigation';
import ScanBarcode from '../../../barcode/scan';
import {styles} from './styles';

type BottomMenuItem = {
    key: string;
    title: string;
    icon: {
        name: string;
        size?: 24;
    };
    state?: {
        routeName: string;
        params?: Record<string, unknown>;
    };
    onPress?: () => void;
};

type AccountDetailsPreviewProps = {
    accountId: string;
    subAccountId?: string;
};

type IAccountDetails<P> = React.FunctionComponent<P> & {
    getAccount: (id: string, subId: string) => Partial<Record<'account' | 'parentAccount', IAccount>>;
    Preview: React.FunctionComponent<AccountDetailsPreviewProps>;
};
type AccountDetailsNavigationProp = StackNavigationProp<AccountsStackParamList, 'AccountDetails'>;
type AccountDetailsRouteProp = RouteProp<AccountsStackParamList, 'AccountDetails'>;

type AccountDetailsScreenProps = {
    navigation: AccountDetailsNavigationProp;
    route: AccountDetailsRouteProp;
};

type AccountDetailsProps = {
    account: IAccount;
    parentAccount?: IAccount;
    lastSyncDate: number;
} & AccountDetailsScreenProps;

const components = {
    accountNumber: Blocks.AccountNumber,
    balance: Blocks.AccountBalance,
    barcode: Blocks.AccountBarcode,
    card_images: Blocks.AccountCardImages,
    date: Blocks.AccountDate,
    disabled: Blocks.AccountDisabled,
    expirationDate: Blocks.AccountExpirationDate,
    login: Blocks.AccountLogin,
    notice: Blocks.AccountNotice,
    storeLocations: Blocks.AccountStoreLocations,
    string: Blocks.AccountString,
    upgrade: Blocks.AccountUpgrade,
    warning: Blocks.AccountWarning,
    balance_watch: Blocks.BalanceWatch,
    subTitle: Blocks.AccountSubTitle,
    mileValue: Blocks.AccountMileValue,
    eliteStatus: Blocks.EliteStatus,
    link: Blocks.AccountLink,
    links: Blocks.AccountLinks,
    spacer: Blocks.AccountSpacer,
};

const previewComponents = {
    balance: Blocks.PreviewAccountBalance,
    accountNumber: Blocks.PreviewAccountNumber,
    string: Blocks.AccountString,
    expirationDate: Blocks.AccountExpirationDate,
};

const getAccount = (id: string, subId?: string): Partial<Record<'account' | 'parentAccount', IAccount>> => {
    const account = AccountsListService.getAccount(id);
    let subAccount;

    if (subId) {
        subAccount = AccountsListService.getAccount(id, subId);

        return {
            account: subAccount,
            parentAccount: account,
        };
    }

    return {
        account,
    };
};

const AccountDetails: IAccountDetails<AccountDetailsProps> = ({account, parentAccount, lastSyncDate, navigation, route}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const [refreshing, setRefreshing] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(false);
    const [visibleMileValue, setVisibleMileValue] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const scanBarcodeRef = useRef<ScanBarcode>(null);
    const documentScanCropRef = useRef<DocumentScanCrop>(null);
    const accountId = useMemo(() => AccountDetailsScreen.getAccountID(route), [route]);
    const updateAccount = useCallback(() => {
        navigation.navigate('AccountUpdate', {ID: accountId});
    }, [navigation, accountId]);
    const onBarcodeRead = useCallback(
        ({data: BarCodeData, type: BarCodeType}: {data: string; type: string}) => {
            const subAccountId = route.params.SubAccountID;

            BarcodeManager.save(
                {Id: accountId, subId: subAccountId},
                {
                    BarCodeData,
                    BarCodeType,
                },
            );
        },
        [accountId, route.params.SubAccountID],
    );
    const onDocumentCapture = useCallback(
        ({fileName, filePath}) => {
            navigation.navigate('AccountPictures', {
                ...route.params,
                newPicture: {
                    fileName,
                    filePath,
                },
            });
        },
        [navigation, route.params],
    );
    const hasBlock = useCallback((kind: Pick<IAccount, 'Kind'>) => account?.Blocks.findIndex((block) => block.Kind === kind) !== -1, [account]);
    const deleteAccount = useCallback(() => {
        Alert.alert(
            '',
            Translator.trans('popups.delete.confirm-question', {}, 'mobile').replace('<br>', ' '),
            [
                {
                    text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => {
                        AccountsListService.deleteAccount(accountId);
                        navigation.goBack();
                    },
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }, [accountId, navigation]);
    const navigateBalance = useCallback(() => {
        navigation.navigate('AccountBalanceChart', route.params);
    }, [navigation, route.params]);

    const openScanBarcode = useCallback(() => scanBarcodeRef.current?.open(), []);
    const captureDocument = useCallback(() => documentScanCropRef.current?.capture(), []);

    const bottomMenu: BottomMenuItem[] = useMemo(() => {
        if (!account) {
            return [];
        }
        const {params} = route;
        const {
            BarcodeType,
            BarCodeParsed,
            BarCodeCustom,
            Access,
            Phones,
            Autologin,
            Documents,
            HasHistory,
            HasBalanceChart,
            ShowPictures,
            ScanBarcode,
        } = account;
        // @ts-ignore
        const showBarcode = _.isObject(BarCodeParsed) || (_.isObject(BarCodeCustom) && BarCodeCustom.BarCodeData !== null);
        let scanBarcode = !showBarcode && ScanBarcode && Access && Access.edit;
        let showPictures: undefined | boolean = false;
        const menu: BottomMenuItem[] = [];

        if (_.isObject(parentAccount)) {
            // @ts-ignore
            const {Access} = parentAccount;

            scanBarcode = scanBarcode && Access && Access.edit;
        }

        if (_.isUndefined(ShowPictures) === false) {
            showPictures = ShowPictures && Access && Access.edit;
        }

        if (showBarcode) {
            menu.push({
                key: 'barcode',
                title: Translator.trans('buttons.barcode', {}, 'mobile'),
                icon: {
                    name: BarcodeType === 'qrcode' ? 'qr-code' : 'footer-barcode',
                    size: 24,
                },
                state: {
                    routeName: 'AccountDetailsBarcode',
                    params,
                },
            });
        }

        if (scanBarcode) {
            menu.push({
                key: 'scan-barcode',
                title: Translator.trans('buttons.scan-barcode', {}, 'mobile'),
                icon: {
                    name: BarcodeType === 'qrcode' ? 'qr-code' : 'footer-barcode',
                    size: 24,
                },
                onPress: openScanBarcode,
            });
        }

        if (HasHistory) {
            menu.push({
                key: 'account-history',
                title: Translator.trans('history', {}, 'mobile'),
                icon: {
                    name: 'footer-history',
                    size: 24,
                },
                state: {
                    routeName: 'AccountHistory',
                    params,
                },
            });
        }

        if (!_.isEmpty(Phones)) {
            menu.push({
                key: 'phone',
                title: Translator.trans('buttons.phone', {}, 'mobile'),
                icon: {
                    name: 'footer-phone',
                    size: 24,
                },
                state: {
                    routeName: 'AccountDetailsPhones',
                    params,
                },
            });
        }

        if (Access) {
            if (Access.autologin === true) {
                const isExtension = Autologin && (Autologin.desktopExtension || Autologin.mobileExtension);

                menu.push({
                    key: 'autologin',
                    title: (isExtension && Translator.trans('button.autologin')) || Translator.trans('buttons.gotosite', {}, 'mobile'),
                    icon: {
                        name: (isExtension && 'footer-autologin') || 'footer-goto-site',
                    },
                    state: {
                        routeName: 'AccountAutoLogin',
                        params: {
                            ...params,
                            loading: true,
                        },
                    },
                });
            }

            if (Access.edit === true) {
                if (showPictures) {
                    const route: BottomMenuItem = {
                        key: 'pictures',
                        title: 'Pictures',
                        icon: {
                            name: 'footer-picture-add',
                            size: 24,
                        },
                    };

                    if (_.isArray(Documents) && !_.isEmpty(Documents)) {
                        menu.push({
                            ...route,
                            icon: {
                                name: 'footer-picture',
                                size: 24,
                            },
                            state: {
                                routeName: 'AccountPictures',
                                params,
                            },
                        });
                    } else {
                        menu.push({
                            ...route,
                            onPress: captureDocument,
                        });
                    }
                }

                menu.push({
                    key: 'edit',
                    title: Translator.trans('award.account.list.button.edit', {}, 'messages'),
                    icon: {
                        name: 'footer-edit',
                        size: 24,
                    },
                    state: {
                        routeName: 'AccountEdit',
                        params,
                    },
                });
            }

            if (Access.delete === true) {
                menu.push({
                    key: 'delete',
                    title: Translator.trans('button.delete', {}, 'messages'),
                    icon: {
                        name: 'footer-delete',
                        size: 24,
                    },
                    onPress: deleteAccount,
                });
            }
        }

        if (HasBalanceChart) {
            menu.push({
                key: 'balance',
                title: Translator.trans(/** @Desc("Balance Chart") */ 'balance-chart', {}, 'mobile-native'),
                icon: {
                    name: 'footer-balance',
                    size: 24,
                },
                onPress: navigateBalance,
            });
        }

        return menu;
    }, [account, captureDocument, deleteAccount, navigateBalance, openScanBarcode, parentAccount, route]);

    const toggleMileValue = useCallback(() => {
        setVisibleMileValue(!visibleMileValue);
    }, [visibleMileValue]);

    const renderListHeader = useCallback(() => {
        const {Kind, Type, DisplayName, ProviderCode, Balance, Number, EliteStatus, isCustom} = account;

        return (
            <AccountHeader
                kind={Kind}
                type={Type}
                displayName={DisplayName}
                balance={Balance}
                number={Number}
                logo={ProviderCode}
                eliteStatus={EliteStatus}
                isCustom={isCustom}
            />
        );
    }, [account]);
    const renderListFooter = useCallback(() => {
        if (_.isArray(bottomMenu) && !_.isEmpty(bottomMenu)) {
            if (isAndroid) {
                return <View style={[styles.footerAndroid, isDark && styles.footerAndroidDark]} />;
            }

            return <View style={styles.footer} />;
        }

        return null;
    }, [bottomMenu, isDark]);
    const renderListItem = useCallback(
        ({item, index}) => {
            const Component = components[item.Kind];

            if (Component) {
                return (
                    <Component
                        theme={theme}
                        item={item}
                        index={index}
                        navigation={navigation}
                        route={route}
                        account={account}
                        parentAccount={parentAccount}
                        hasBlock={hasBlock}
                        toggleMileValue={toggleMileValue}
                    />
                );
            }

            return null;
        },
        [theme, navigation, route, account, parentAccount, hasBlock, toggleMileValue],
    );
    const keyExtractor = useCallback(
        (item, index) => {
            const Component = components[item.Kind];

            if (Component && Component.keyExtractor) {
                return Component.keyExtractor(item, index, account);
            }

            return AccountDetailsRow.keyExtractor(item, index);
        },
        [account],
    );

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

    const onRefresh = useCallback(() => StorageSync.forceUpdate(), []);

    const onComplete = useCallback(
        (success) => {
            if (success) {
                onRefresh();
                toggleMileValue();
            }
        },
        [onRefresh, toggleMileValue],
    );

    useEffect(() => {
        if (isFocused && _.isObject(account)) {
            navigation.setParams({
                updateAccount,
                Access: account.Access,
            });
        }
    }, [isFocused, account]);

    useEffect(() => {
        if (route.params?.forceRefresh) {
            setForceRefresh(true);
        }
    }, [route]);

    useEffect(() => {
        if (forceRefresh) {
            refreshData(forceRefresh);
        }
    }, [forceRefresh]);

    if (!account) {
        // onRefresh={this.onRefresh} forceRefresh={forceRefresh}
        return (
            <View style={[styles.page, isDark && styles.pageDark]}>
                <RefreshableFlatList data={[]} onRefresh={onRefresh} lastSyncDate={lastSyncDate} />
            </View>
        );
    }

    return (
        <>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <ScanBarcode type={account.BarcodeType} ref={scanBarcodeRef} onBarCodeRead={onBarcodeRead} />
                <DocumentScanCrop ref={documentScanCropRef} accountId={accountId} key='document-scan-crop' onCapture={onDocumentCapture} />
                {account.Blocks && account.Blocks.length > 0 && (
                    <RefreshableFlatList
                        data={account.Blocks}
                        extraData={account}
                        keyExtractor={keyExtractor}
                        renderItem={renderListItem}
                        ListHeaderComponent={renderListHeader}
                        ListFooterComponent={renderListFooter}
                        lastSyncDate={lastSyncDate}
                        onRefresh={refreshData}
                        refreshing={refreshing}
                        removeClippedSubviews={false}
                    />
                )}
                {_.isArray(bottomMenu) && !_.isEmpty(bottomMenu) && <BottomMenu items={bottomMenu} />}
            </View>
            {visibleMileValue && (
                <AccountMileValueModal
                    accountName={account.DisplayName}
                    accountId={account.ProviderID}
                    onClose={toggleMileValue}
                    onComplete={onComplete}
                />
            )}
        </>
    );
};

AccountDetails.getAccount = getAccount;

AccountDetails.Preview = React.memo(({accountId, subAccountId}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const {width} = useWindowDimensions();
    const {account} = useAccount(accountId, subAccountId);

    const barcode = useMemo(() => {
        let barcode;

        if (!account) {
            return null;
        }
        if (account.BarCodeCustom && account.BarCodeCustom.BarCodeData) {
            barcode = account.BarCodeCustom;
        } else if (account.BarCodeParsed && account.BarCodeParsed.BarCodeData) {
            barcode = account.BarCodeParsed;
        }

        return barcode;
    }, [account]);

    const renderPreviewItem = useCallback(
        (item, index) => {
            const Component = previewComponents[item.Kind];

            if (Component) {
                return (
                    <Component key={`row-${index}`} theme={theme} item={item} index={index} navigation={null} account={account} hasBlock={_.noop} />
                );
            }

            return null;
        },
        [theme, account],
    );

    if (!account) {
        return null;
    }

    const {Kind, Type, ProviderCode, DisplayName, UserName, FontColor, BackgroundColor, PreviewBlocks} = account;
    const icon = getProviderIcon(Kind, Type);
    // const renderDocuments = useCallback((item) => {
    //     const {id, file} = item;
    //     const filePath = `file://${Card.imageDir}/${accountId}/${id}-${file}`;
    //
    //     return (
    //         <View style={{margin: 15, height: 210}}>
    //             <Image style={[{width: '100%', height: '100%'}]} source={{uri: filePath}} />
    //         </View>
    //     );
    // }, []);

    const {ProviderLogos} = require('../../../../assets/logos');

    return (
        <View style={[styles.previewContainer, isDark && styles.previewContainerDark, {width: Math.min(width, isTablet ? 300 : 400)}]}>
            <View style={styles.previewCard}>
                <View
                    style={[
                        styles.previewTitle,
                        {backgroundColor: isDark ? DarkColors.bg : Colors.grayDark},
                        _.isString(BackgroundColor) && {backgroundColor: `#${BackgroundColor}`},
                    ]}>
                    <View style={styles.previewTitleContainer}>
                        <Icon name={icon.name} size={icon.size} style={styles.icon} color={_.isString(FontColor) ? `#${FontColor}` : Colors.white} />
                        <View style={styles.title}>
                            <Text style={[styles.previewAccountName, _.isString(FontColor) && {color: `#${FontColor}`}]}>{DisplayName}</Text>
                            {_.isString(UserName) && (
                                <Text
                                    style={[
                                        styles.previewAccountOwner,
                                        _.isString(FontColor) && {color: fromColor(`#${FontColor}`).alpha(0.6).rgb().string()},
                                    ]}
                                    numberOfLines={2}>
                                    {UserName.toUpperCase()}
                                </Text>
                            )}
                        </View>
                        {ProviderCode && ProviderLogos[ProviderCode] && <PreviewProviderLogo providerCode={ProviderCode} />}
                    </View>
                </View>
                {barcode && (
                    <View style={[styles.barcode, isDark && styles.barcodeDark]}>
                        <Barcode value={barcode.BarCodeData} format={barcode.BarCodeType} height={60} width={width * 0.8} />
                    </View>
                )}
            </View>
            {_.isArray(PreviewBlocks) && PreviewBlocks.map(renderPreviewItem)}
        </View>
    );
});

const PreviewProviderLogo = ({providerCode}) => {
    const {onLayout, ...layout} = useLayout();
    const {ProviderLogos} = require('../../../../assets/logos');
    const logo = ProviderLogos[providerCode];
    const {dimensions} = useImageDimensions(logo);
    const layoutAspectRatio = layout.width / layout.height || 1;

    return (
        <View style={{flex: 1, marginLeft: 15, maxWidth: '70%'}} onLayout={onLayout}>
            <Image
                style={[
                    {
                        alignSelf: 'flex-end',
                        flex: 1,
                        // @ts-ignore
                        aspectRatio: dimensions?.aspectRatio < layoutAspectRatio ? dimensions?.aspectRatio : layoutAspectRatio,
                        resizeMode: 'contain',
                    },
                ]}
                source={logo}
            />
        </View>
    );
};

const AccountDetailsScreen: AccountsStackScreenFunctionalComponent<'AccountDetails'> & {
    getAccountID: (route: AccountDetailsRouteProp) => string;
    getAccount: (route: AccountDetailsRouteProp) => ReturnType<typeof getAccount>;
} = ({navigation, route}) => {
    const accountId = route.params?.ID;
    const subAccountId = route.params?.SubAccountID;
    const {lastSyncDate} = useProfileData();
    const {account, parentAccount} = useAccount(accountId, subAccountId);

    return <AccountDetails account={account} parentAccount={parentAccount} lastSyncDate={lastSyncDate} navigation={navigation} route={route} />;
};

AccountDetailsScreen.getAccountID = (route) => route.params.ID;

AccountDetailsScreen.getAccount = (route) => {
    const accountId = AccountDetailsScreen.getAccountID(route);
    const subAccountId = route.params.SubAccountID;

    return getAccount(accountId, subAccountId);
};

AccountDetailsScreen.navigationOptions = ({navigation, route}) => {
    const animation = route.params?.animation ?? 'default';
    const updateAccount = route.params?.updateAccount ?? _.noop;
    const access = route.params?.Access;
    const update = access?.update;
    const edit = access?.edit;

    let headerRight = update && <HeaderRightButton iconName='update' onPress={updateAccount} />;

    if (isAndroid) {
        headerRight = (
            <>
                {edit && <HeaderRightButton iconName='footer-edit' onPress={() => navigation.navigate('AccountEdit', route.params)} />}
                {headerRight}
            </>
        );
    }

    return {
        animation,
        title: '',
        headerRight: () => headerRight,
    };
};

export {AccountDetails, AccountDetailsScreen};
