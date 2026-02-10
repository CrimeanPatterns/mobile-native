import {Backdrop} from '@components/accounts/list/bottomSheet/backdrop';
import {GradientIcon} from '@components/icon';
import {TouchableBackground, TouchableOpacity} from '@components/page/touchable';
import {BottomSheetModal, useBottomSheetDynamicSnapPoints} from '@gorhom/bottom-sheet';
import {useAccounts} from '@hooks/accounts';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors, DarkColors} from '@styles/index';
import {ThemeColors} from '@theme/colors';
import {ColorSchemeDark, useTheme} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

import {useBottomSheetUpdateAccountsContext} from '../../../../context/updateAccounts';
import {isIOS} from '../../../../helpers/device';
import {AccountsStackParamList} from '../../../../types/navigation';
import styles from './styles';

const BottomSheetAccountsUpdate = () => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const {bottomSheetRef, dismissBottomSheet} = useBottomSheetUpdateAccountsContext();
    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList, 'AccountsList'>>();
    const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
    const {animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout} = useBottomSheetDynamicSnapPoints(initialSnapPoints);
    const [totalAccounts, setTotalAccounts] = useState<string[]>([]);
    const [outdatedAccounts, setOutdatedAccounts] = useState<string[]>([]);
    const {accounts} = useAccounts();
    const selectColor = (light, dark) => (isDark ? dark : light);
    const blueButtonColor = isIOS ? selectColor(Colors.shadow, DarkColors.blueDark) : selectColor(Colors.blue, DarkColors.chetwodeBlue);

    const getAccountsCounter = () => {
        const totalAccount = new Array<string>();
        const outdatedAccount = new Array<string>();

        for (const accountKey in accounts) {
            if (accounts[accountKey].TableName === 'Account' && accounts[accountKey].Access?.update) {
                if (accounts[accountKey].Access?.updateAll) {
                    outdatedAccount.push(accountKey);
                }

                totalAccount.push(accountKey);
            }
        }

        setOutdatedAccounts(outdatedAccount);
        setTotalAccounts(totalAccount);
    };

    const renderAccountsCounterBlock = (title, count, style) => (
        <View style={[styles.accountCounterWrap, isDark && styles.accountCounterWrapDark]}>
            <Text style={[styles.largeText, isDark && styles.whiteText]}>{count}</Text>
            <Text style={[styles.middleText, isDark && styles.whiteOpacityText, !isIOS && {fontSize: 13}, style]}>{title}</Text>
        </View>
    );

    const getUpdatePartOfAccountsContent = () => (
        <>
            <View style={styles.progressWrap}>
                <CircularProgress
                    value={Math.floor((outdatedAccounts.length * 100) / totalAccounts.length)}
                    maxValue={100}
                    inActiveStrokeOpacity={0.3}
                    activeStrokeWidth={3}
                    inActiveStrokeWidth={3}
                    radius={50}
                    delay={250}
                    showProgressValue={false}
                    progressValueColor={'transparent'}
                    strokeLinecap={'butt'}
                    inActiveStrokeColor={ThemeColors[theme].blue}
                    activeStrokeColor={ThemeColors[theme].blue}
                />
                <View style={[styles.awLogoWrap, isDark && styles.awLogoWrapDark]}>
                    <View style={[styles.awLogo]}>
                        <GradientIcon colors={[Colors.awLogo1, Colors.awLogo2]} name={'aw-logo'} size={50} />
                        <View style={{position: 'absolute', top: 8, left: 5}}>
                            <GradientIcon
                                colors={[
                                    fromColor(Colors.awLogo1).alpha(0.3).rgb().toString(),
                                    fromColor(Colors.awLogo2).alpha(0.3).rgb().toString(),
                                ]}
                                name={'logo-path1'}
                                size={33}
                                style={{position: 'absolute'}}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <Text style={[styles.largeText, {marginVertical: 18}, isDark && styles.whiteText]}>
                {Translator.trans(/** @Desc("Update Your Accounts") */ 'update-accounts.title-outdated', {}, 'mobile-native')}
            </Text>
            <Text
                style={[
                    styles.smallText,
                    {
                        marginBottom: 32,
                    },
                    isDark && styles.whiteOpacityText,
                ]}>
                {Translator.trans(
                    /** @Desc("Choose to update either all of your accounts or just the enabled accounts that haven't been updated in the last 30 days.") */ 'update-accounts.description-outdated',
                    {},
                    'mobile-native',
                )}
            </Text>
            <View style={styles.counterWrap}>
                {renderAccountsCounterBlock(
                    Translator.trans(/** @Desc("Total Accounts") */ 'update-accounts.total-accounts', {}, 'mobile-native'),
                    totalAccounts.length,
                    {width: 70},
                )}
                <View style={{width: 8}} />
                {renderAccountsCounterBlock(
                    Translator.trans(/** @Desc("Accounts Not Updated in 30 Days") */ 'update-accounts.outdated-accounts', {}, 'mobile-native'),
                    outdatedAccounts.length,
                    {},
                )}
            </View>
            <View style={[styles.outdatedUpdateButtonWrap, isDark && styles.outdatedUpdateButtonWrapDark]}>
                <TouchableBackground
                    rippleColor={
                        isIOS
                            ? selectColor(Colors.gray, DarkColors.bgLight)
                            : selectColor(Colors.gray, fromColor(DarkColors.bgLight).alpha(0.5).rgb().toString())
                    }
                    activeBackgroundColor={
                        isIOS
                            ? selectColor(Colors.gray, DarkColors.bgLight)
                            : selectColor(Colors.gray, fromColor(DarkColors.bgLight).alpha(0.5).rgb().toString())
                    }
                    onPress={() => {
                        dismissBottomSheet();
                        navigation.navigate('AccountsUpdate', {accountsKeys: outdatedAccounts});
                    }}
                    style={styles.outdatedUpdateButton}>
                    <Text style={[styles.outdatedUpdateButtonText, isDark && styles.outdatedUpdateButtonTextDark]}>
                        {Translator.trans(
                            /** @Desc("Update %counter% Outdated Accounts") */ 'update-accounts.outdated-accounts-counter',
                            {counter: outdatedAccounts.length},
                            'mobile-native',
                        )}
                    </Text>
                </TouchableBackground>
            </View>
        </>
    );

    const getUpdateAllAccountsContent = () => (
        <>
            <Text style={[styles.largeText, {marginBottom: 18}, isDark && styles.whiteText]}>
                {Translator.trans(/** @Desc("Update All Accounts") */ 'update-accounts.title-non-outdated', {}, 'mobile-native')}
            </Text>
            <Text
                style={[
                    styles.smallText,
                    {
                        marginBottom: 32,
                    },
                    isDark && styles.whiteOpacityText,
                ]}>
                {Translator.trans(
                    /** @Desc("Are you sure you want to update all of your accounts?") */ 'update-accounts.description-non-outdated',
                    {},
                    'mobile-native',
                )}
            </Text>
        </>
    );

    const renderBlueButton = () => {
        const isEmptyAccountsList = totalAccounts.length === 0;
        const text = isEmptyAccountsList
            ? Translator.trans('button.ok', {}, 'messages')
            : Translator.trans(
                  /** @Desc("Update All %counter% Accounts") */ 'update-accounts.total-accounts-counter',
                  {counter: totalAccounts.length},
                  'mobile-native',
              );

        return (
            <View style={[styles.buttonWrap, isEmptyAccountsList && {marginBottom: 16}]}>
                <TouchableBackground
                    style={[styles.blueButton, isDark && styles.blueButtonDark]}
                    onPress={() => {
                        dismissBottomSheet();
                        if (!isEmptyAccountsList) {
                            navigation.navigate('AccountsUpdate', {accountsKeys: totalAccounts});
                        }
                    }}
                    rippleColor={blueButtonColor}
                    activeBackgroundColor={blueButtonColor}>
                    <Text style={[styles.middleText, styles.blueButtonText]}>{text}</Text>
                </TouchableBackground>
            </View>
        );
    };

    const renderEmptyAccountsListContent = () => (
        <>
            <Text style={[styles.largeText, {textAlign: 'center', marginBottom: 32}, isDark && styles.whiteText]}>
                {Translator.trans(
                    /** @Desc("You don't have any accounts that can be updated.") */ 'update-accounts.title-empty',
                    {},
                    'mobile-native',
                )}
            </Text>
            {renderBlueButton()}
        </>
    );

    const renderNonEmptyAccountsListContent = () => (
        <>
            {totalAccounts.length > 20 && outdatedAccounts.length > 0 ? (
                <>{getUpdatePartOfAccountsContent()}</>
            ) : (
                <>{getUpdateAllAccountsContent()}</>
            )}
            {renderBlueButton()}
            <TouchableOpacity style={styles.cancelButton} onPress={dismissBottomSheet}>
                <Text style={[styles.middleText, !isIOS && styles.textGray, isDark && styles.whiteOpacityText]}>
                    {Translator.trans('button.cancel', {}, 'messages')}
                </Text>
            </TouchableOpacity>
        </>
    );

    useEffect(() => {
        getAccountsCounter();
    }, [bottomSheetRef]);

    return (
        <BottomSheetModal
            snapPoints={animatedSnapPoints}
            ref={bottomSheetRef}
            backdropComponent={(props) => Backdrop({...props, onPress: dismissBottomSheet})}
            backgroundStyle={{backgroundColor: isDark ? DarkColors.bg : Colors.grayLight}}
            handleStyle={[styles.bottomSheetHandle, isDark && styles.bottomSheetHandleDark]}
            handleIndicatorStyle={[styles.bottomSheetIndicator, isDark && !isIOS && styles.bottomSheetIndicatorDark]}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}>
            <View style={[styles.bottomSheetContentWrap, isDark && styles.bottomSheetContentWrapDark]} onLayout={handleContentLayout}>
                {totalAccounts.length > 0 ? <>{renderNonEmptyAccountsListContent()}</> : <>{renderEmptyAccountsListContent()}</>}
            </View>
        </BottomSheetModal>
    );
};

export default BottomSheetAccountsUpdate;
