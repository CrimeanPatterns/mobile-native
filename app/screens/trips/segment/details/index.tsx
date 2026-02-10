import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Platform, Share, ShareContent, StyleSheet, View} from 'react-native';
import Config from 'react-native-config';

import RefreshableFlatList from '../../../../components/page/refreshableFlatList';
import * as Blocks from '../../../../components/trips/details/list';
import {TripSegmentDetailsBottomMenu} from '../../../../components/trips/details/menu';
import {AttachmentsFileProvider} from '../../../../context/attachments';
import {isIOS} from '../../../../helpers/device';
import {shareUrl} from '../../../../helpers/share';
import StorageSync from '../../../../services/storageSync';
import TimelineService from '../../../../services/timeline';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {TripStackParamList} from '../../../../types/navigation';
import {ITripSegment, TripSegmentBlock} from '../../../../types/trips';

type ITimelineSegmentDetails = React.FunctionComponent<{
    lastSyncDate: number;
    segment: ITripSegment | undefined;
}> & {
    components: Record<TripSegmentBlock['kind'], React.FunctionComponent<any>>;
    getSegment: (userAgentId: string, id: ITripSegment['id']) => ITripSegment | undefined;
    share: (shareCode: string) => void;
    sharePlan: (shareCode: string) => void;
    confirmDelete: () => Promise<void>;
};

const TripSegmentDetails: ITimelineSegmentDetails = ({segment, lastSyncDate}) => {
    const navigation = useNavigation<NavigationProp<TripStackParamList, 'TimelineSegmentDetails'>>();
    const route = useRoute<RouteProp<TripStackParamList, 'TimelineSegmentDetails'>>();
    const [blocks, setBlocks] = useState(segment?.blocks || []);
    const isDark = useDark();
    const refreshData = useCallback(() => StorageSync.forceUpdate(), []);
    const showMore = useCallback(
        (index: number, items: []) => {
            if (blocks) {
                setBlocks(blocks.splice(index, 0, ...items));
            }
        },
        [blocks],
    );
    const confirmChanges = useCallback(async () => {
        const userAgentId = route.params?.userAgentId;
        const id = route.params?.id;

        await TimelineService.confirmChanged(userAgentId, id);
    }, [route.params?.id, route.params?.userAgentId]);
    const setDeleted = useCallback(
        async (deleted: boolean) => {
            if (segment) {
                const userAgentId = route.params?.userAgentId;
                const id = route.params?.id;
                const reload = route.params?.reload;

                if (deleted) {
                    await TimelineService.deleteSegment(id);
                } else {
                    await TimelineService.restoreSegment(userAgentId, id);
                }

                if (_.isFunction(reload)) {
                    setTimeout(reload, 250);
                }
            }
        },
        [segment],
    );
    const deleteSegment = useCallback((): void => {
        navigation.goBack();
        setDeleted(true);
    }, [setDeleted]);
    const restoreSegment = useCallback((): Promise<void> => setDeleted(false), [setDeleted]);
    const confirmDelete = useCallback(async (): Promise<void> => {
        await TripSegmentDetails.confirmDelete();
        deleteSegment();
    }, [deleteSegment]);
    const renderItem = useCallback(
        ({item}: {item: TripSegmentBlock}) => {
            const {kind, ...props} = item;
            const Component = TripSegmentDetails.components[kind];

            if (Component) {
                if (kind === 'ai_reservation') {
                    return (
                        <Component
                            refreshTimelineDetails={refreshData}
                            showMore={showMore}
                            confirmDelete={confirmDelete}
                            canChange={segment?.canChange}
                            deleted={segment?.deleted}
                            {...props}
                        />
                    );
                }

                return <Component refreshTimelineDetails={refreshData} showMore={showMore} {...props} />;
            }

            return null;
        },
        [refreshData, showMore],
    );
    const renderFooter = useCallback(
        () => (
            // const {menuItems} = this.state;
            // const isEmptyMenu = menuItems && menuItems.length === 0;

            // if (isIOS || (isEmptyMenu && isAndroid)) {
            <View style={{flex: 1, height: 40}} />
        ),
        // }

        // return <View style={{flex: 1, backgroundColor: isDark ? DarkColors.bg : '#eee', height: 100}} />;
        [],
    );
    const keyExtractor = useCallback((item, index) => `${item.kind}-${index}`, []);

    useEffect(() => {
        if (segment) {
            setBlocks(segment.blocks);
        }
    }, [segment]);

    if (!segment) {
        // forceRefresh={forceRefresh}
        return (
            <View style={[styles.page, isDark && styles.pageDark]}>
                <RefreshableFlatList data={[]} onRefresh={refreshData} lastSyncDate={lastSyncDate} />
            </View>
        );
    }

    return (
        <AttachmentsFileProvider>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <RefreshableFlatList
                    data={blocks}
                    extraData={segment}
                    renderItem={renderItem}
                    ListFooterComponent={renderFooter}
                    keyExtractor={keyExtractor}
                    onRefresh={refreshData}
                    lastSyncDate={lastSyncDate}
                    // forceRefresh={forceRefresh}
                    initialNumToRender={blocks.length}
                    maxToRenderPerBatch={50}
                    updateCellsBatchingPeriod={100}
                    windowSize={64}
                    removeClippedSubviews={false} // https://github.com/facebook/react-native/issues/26264#issuecomment-559986861
                />
                <TripSegmentDetailsBottomMenu
                    segment={segment}
                    confirmDelete={confirmDelete}
                    confirmChanges={confirmChanges}
                    restoreSegment={restoreSegment}
                />
            </View>
        </AttachmentsFileProvider>
    );
};

TripSegmentDetails.components = {
    flightProgress: Blocks.FlightProgress,
    separator: Blocks.Separator,
    source: Blocks.Source,
    boxed: Blocks.Boxed,
    confno: Blocks.ConfNo,
    group: Blocks.Group,
    important: Blocks.Important,
    location: Blocks.Location,
    notes_and_files: Blocks.Notes,
    offer: Blocks.Offer,
    savings: Blocks.Savings,
    showmore: Blocks.ShowMore,
    string: Blocks.String,
    terminalAndGate: Blocks.TerminalAndGate,
    time: Blocks.Time,
    timeRental: Blocks.TimeReservation,
    timeReservation: Blocks.TimeReservation,
    title: Blocks.Title,
    no_foreign_fees_cards: Blocks.FeesCards,
    ai_reservation: Blocks.AiReservation,
};

TripSegmentDetails.getSegment = (userAgentId, id) => TimelineService.getSegment(userAgentId, id);

TripSegmentDetails.share = (shareCode) => {
    const url = `${Config.API_URL}/timeline/shared/${shareCode}`;

    shareUrl(url);
};

TripSegmentDetails.sharePlan = (shareCode) => {
    const url = `${Config.API_URL}/timeline/shared-plan/${shareCode}`;
    const content: ShareContent = Platform.select({
        ios: {url},
        default: {message: url},
    });

    Share.share(content);
};

TripSegmentDetails.confirmDelete = (): Promise<void> =>
    new Promise((resolve) => {
        Alert.alert(
            '',
            Translator.trans('trips.delete.confirmation', {}, 'messages'),
            [
                {
                    text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => resolve(),
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    });

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});

export {TripSegmentDetails};
