import {useFocusEffect, useNavigation, useScrollToTop} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {FlashList, FlashListProps} from '@shopify/flash-list';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useRef} from 'react';
import {NativeScrollEvent, NativeSyntheticEvent, useWindowDimensions, View} from 'react-native';
import Animated, {
    ReduceMotion,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {SwipeableItemImperativeRef} from 'react-native-swipeable-item';

import DiscoveredAccountRow from '../../../components/accounts/discovered/row';
import RefreshableFlatList from '../../../components/page/refreshableFlatList';
import {TextProperty} from '../../../components/profile/overview/textProperty';
import {useDiscoveredAccounts} from '../../../hooks/accounts';
import {ColorSchemeDark, useTheme} from '../../../theme';
import {AccountsStackParamList} from '../../../types/navigation';
import styles from './styles';

export const AccountListComponents = {
    CardOffer: require('../../../components/accounts/list/cardOffer').default,
    Title: require('../../../components/accounts/list/title').default,
    SubTitle: require('../../../components/accounts/list/subTitle').default,
    UserTitle: require('../../../components/accounts/list/userTitle').default,
    Account: require('../../../components/accounts/list/account').default,
} as const;

export const AccountSwipeableList: React.FunctionComponent<
    Omit<
        FlashListProps<any> & {lastSyncDate: number} & {actionButton?: React.ReactElement} & ReturnType<typeof useDiscoveredAccounts>,
        'renderItem' | 'updateDiscoveredAccounts' | 'discoveredAccounts'
    >
> = ({deleteDiscoveredAccount, ...props}) => {
    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList, 'AccountsList'>>();
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const listRef = useRef(null);
    const swipeableRefs = useRef<
        {
            index: number;
            ref: SwipeableItemImperativeRef;
        }[]
    >([]);
    const offsetY = useSharedValue<number>(0);
    const {width: windowWidth} = useWindowDimensions();
    const contentHeight = useSharedValue<number>(0);
    const containerHeight = useSharedValue<number>(0);
    const translateY = useDerivedValue(() => (contentHeight.value - containerHeight.value - Math.max(offsetY.value, 0) < 90 ? 200 : 0));
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(translateY.value, {
                    duration: 1400,
                    dampingRatio: 0.8,
                    stiffness: 100,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 2,
                    reduceMotion: ReduceMotion.System,
                }),
            },
        ],
    }));

    useScrollToTop(listRef);

    const handleContentSizeChange = (_width, height) => {
        contentHeight.value = height;
    };

    const handleLayout = (event) => {
        containerHeight.value = event.nativeEvent.layout.height;
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        offsetY.value = event.nativeEvent.contentOffset.y;
    };

    const closeSwipeable = useCallback(
        (index?: number) => {
            swipeableRefs.current.forEach((item) => {
                if (item.index !== index) {
                    item.ref?.close();
                }
            });
        },
        [swipeableRefs],
    );

    useAnimatedReaction(
        () => offsetY.value > 0,
        (result, previous) => {
            if (result !== previous && result) {
                runOnJS(closeSwipeable)();
            }
        },
        [offsetY],
    );
    const onSwipeBegin = useCallback((index: number) => {
        closeSwipeable(index);
    }, []);
    const getItemType = useCallback((item) => item.component, []);
    const setSwipeableRef = useCallback((ref: SwipeableItemImperativeRef, index: number) => swipeableRefs.current.push({index, ref}), []);

    const navigateDiscovered = useCallback(
        (accountId?: string | number) => {
            if (!accountId) {
                return navigation.navigate('DiscoveredAccounts');
            }

            return navigation.navigate('DiscoveredAccountAdd', {accountId, backTo: 'AccountsList'});
        },
        [navigation],
    );

    const renderItem = useCallback(
        ({item, index}) => {
            const Component = AccountListComponents[item.component];

            if (item.component === 'DiscoveredTitle') {
                return (
                    <AccountListComponents.Title
                        name={Translator.trans('discovered-accounts', {}, 'mobile-native')}
                        style={[styles.discoveredHeader, isDark && styles.discoveredHeaderDark]}
                    />
                );
            }
            if (item.component === 'DiscoveredAccountRow') {
                const {id, provider, login, email} = item.props;

                return (
                    <React.Fragment key={id}>
                        <DiscoveredAccountRow
                            provider={provider}
                            login={login}
                            email={email}
                            onPress={() => navigateDiscovered(id)}
                            onDelete={() => deleteDiscoveredAccount(id)}
                            index={index}
                            setSwipeableRef={setSwipeableRef}
                            onSwipeBegin={onSwipeBegin}
                        />
                        <View style={[styles.separator, isDark && styles.separatorDark]} />
                    </React.Fragment>
                );
            }
            if (item.component === 'DiscoveredReviewMore') {
                return (
                    <TextProperty
                        theme={theme}
                        name={Translator.trans(
                            /** @Desc("Review More Discovered Accounts") */ 'discovered-accounts.review-more',
                            {},
                            'mobile-native',
                        )}
                        onPress={() => navigateDiscovered()}
                    />
                );
            }
            if (item.component === 'Account') {
                return <AccountListComponents.Account {...item.props} index={index} setSwipeableRef={setSwipeableRef} onSwipeBegin={onSwipeBegin} />;
            }

            return <Component index={index} {...item.props} />;
        },
        [deleteDiscoveredAccount, isDark, navigateDiscovered, onSwipeBegin, setSwipeableRef, theme],
    );

    useFocusEffect(() => closeSwipeable);

    return (
        <View style={{flex: 1}}>
            <RefreshableFlatList
                ref={listRef}
                onContentSizeChange={handleContentSizeChange}
                onLayout={handleLayout}
                ListComponent={FlashList}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
                contentInsetAdjustmentBehavior='automatic'
                estimatedItemSize={45}
                getItemType={getItemType}
                extraData={windowWidth}
                onScroll={handleScroll}
                {...props}
                renderItem={renderItem}
            />
        </View>
    );
};
