import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ListRenderItem, View} from 'react-native';

import {HeaderRightButton} from '../../../../components/page/header/button';
import SkeletonList from '../../../../components/page/skeleton/skeletonList';
import * as Blocks from '../../../../components/trips/details/list';
import ModalSelectCards from '../../../../components/trips/modal-select-cards';
import {isIOS} from '../../../../helpers/device';
import {useProfileData} from '../../../../hooks/profile';
import API from '../../../../services/api';
import StorageSync from '../../../../services/storageSync';
import {useDark} from '../../../../theme';
import {TripsStackScreenFunctionalComponent} from '../../../../types/navigation';
import {LoungeListItemView} from '../../../../types/trips/blocks';
import styles from '../details/styles';

type AirportListItem = {
    type: 'airportListItem';
    name: string;
};

type TerminalListItem = {
    type: 'terminalListItem';
    name: string;
};

type LoungeListBlock = AirportListItem | TerminalListItem | LoungeListItemView;

type ITimelineLoungeList = TripsStackScreenFunctionalComponent<'TimelineLoungeList'> & {
    components: Record<'airportListItem' | 'terminalListItem' | 'loungeListItem', React.FunctionComponent<any>>;
};

const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000;

const TimelineLoungeList: ITimelineLoungeList = ({navigation, route}) => {
    const isDark = useDark();
    const {AvailableCardsUpdateDate} = useProfileData();

    const [loungeList, setLoungeList] = useState<LoungeListBlock[] | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const getLoungeList = useCallback(async () => {
        const {params} = route;
        const segmentId = params?.segmentId;
        const arrTerminal = params?.arrivalTerminal;
        const depTerminal = params?.departureTerminal;
        const stage = params?.stage;

        const response = await API.post<{blocks: LoungeListBlock[]}>('/timeline/lounge/list', {segmentId, arrTerminal, depTerminal, stage});

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isObject(data) && _.isArray(data.blocks)) {
                setLoungeList(data.blocks);
            }
        }
    }, [route]);

    const checkTime = useCallback(() => {
        if (!_.isNumber(AvailableCardsUpdateDate)) {
            return true;
        }

        const latestDate = AvailableCardsUpdateDate * 1000;
        const today = new Date().getTime();

        return today - latestDate > YEAR_IN_MILLISECONDS;
    }, [AvailableCardsUpdateDate]);

    const toggleModal = useCallback(() => {
        setVisible(!visible);
    }, [visible]);

    const onClose = useCallback(() => {
        getLoungeList();
        toggleModal();
        StorageSync.forceUpdate();
    }, [getLoungeList, toggleModal]);

    const keyExtractor = useCallback((item, index) => `${item.type}-${index}`, []);

    const renderItem: ListRenderItem<LoungeListBlock> = useCallback(({item}) => {
        const {type, ...props} = item;

        const Component = TimelineLoungeList.components[type];

        if (Component) {
            return <Component {...props} />;
        }

        return null;
    }, []);

    const renderFooter = useCallback(() => <View style={styles.footer} />, []);

    useEffect(() => {
        if (checkTime()) {
            toggleModal();
        } else {
            getLoungeList();
        }
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => toggleModal && <HeaderRightButton onPress={toggleModal} iconName={isIOS ? 'settings' : 'icon-android-settings'} />,
        });
    }, [navigation, toggleModal]);

    return (
        <>
            {_.isArray(loungeList) ? (
                <FlatList
                    data={loungeList}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={renderFooter}
                    style={[styles.list, isDark && styles.listDark]}
                />
            ) : (
                <TimelineLoungeListSkeleton />
            )}
            {visible && <ModalSelectCards onClose={onClose} />}
        </>
    );
};

TimelineLoungeList.navigationOptions = () => ({
    title: '',
});

TimelineLoungeList.components = {
    airportListItem: Blocks.AirportListItem,
    terminalListItem: Blocks.Group,
    loungeListItem: Blocks.LoungeListItem,
};

export default TimelineLoungeList;

const TimelineLoungeListSkeleton: React.FunctionComponent = () => {
    const isDark = useDark();

    const renderSeparator = useCallback(() => null, []);

    const renderItem = useCallback(({index}) => {
        if (index === 0) {
            return <Blocks.AirportListItemSkeleton />;
        }

        if (index === 1 || index % 4 === 0) {
            return <Blocks.GroupSkeleton />;
        }

        return <Blocks.LoungeListItemSkeleton />;
    }, []);

    return (
        <SkeletonList length={10} renderItem={renderItem} ItemSeparatorComponent={renderSeparator} style={[styles.list, isDark && styles.listDark]} />
    );
};
