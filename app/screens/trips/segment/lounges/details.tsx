import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, ListRenderItem} from 'react-native';

import SkeletonList from '../../../../components/page/skeleton/skeletonList';
import * as Blocks from '../../../../components/trips/details/list';
import API from '../../../../services/api';
import {useDark} from '../../../../theme';
import {TripsStackScreenFunctionalComponent} from '../../../../types/navigation';
import {AccessView, LoungeTitleView, OpeningHoursView, TerminalView} from '../../../../types/trips/blocks';
import styles from '../details/styles';

type ITimelineLoungeDetails = TripsStackScreenFunctionalComponent<'TimelineLoungeDetails'> & {
    components: Record<'loungeTitle' | 'loungeDetails', React.FunctionComponent<any>>;
};

type LoungeDetailsBlock = LoungeTitleView | AccessView | OpeningHoursView | TerminalView;

const TimelineLoungeDetails: ITimelineLoungeDetails = ({route}) => {
    const isDark = useDark();
    const [loungeDetails, setLoungeDetails] = useState<LoungeDetailsBlock[] | null>(null);

    const getLoungeDetails = useCallback(async () => {
        const id = route.params?.id;

        const response = await API.get<{blocks: LoungeDetailsBlock[]}>(`/timeline/lounge/${id}`);

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isObject(data) && _.isArray(data.blocks)) {
                setLoungeDetails(data.blocks);
            }
        }
    }, [route]);

    const keyExtractor = useCallback((item, index) => `${item.type}-${index}`, []);

    const renderItem: ListRenderItem<LoungeDetailsBlock> = useCallback(({item}) => {
        const {type, ...props} = item;
        const Component = TimelineLoungeDetails.components[type];

        if (Component) {
            return <Component {...props} />;
        }

        return null;
    }, []);

    useEffect(() => {
        getLoungeDetails();
    }, []);

    return _.isArray(loungeDetails) ? (
        <FlatList style={[styles.list, isDark && styles.listDark]} data={loungeDetails} renderItem={renderItem} keyExtractor={keyExtractor} />
    ) : (
        <TimelineLoungeDetailsSkeleton />
    );
};

TimelineLoungeDetails.navigationOptions = () => ({title: ''});
TimelineLoungeDetails.components = {
    loungeTitle: Blocks.AirportListItem,
    loungeDetails: Blocks.LoungeDetails,
};

const TimelineLoungeDetailsSkeleton: React.FunctionComponent = () => {
    const isDark = useDark();

    const renderItem = useCallback(({item}) => {
        if (item === 'AirportListItem') {
            return <Blocks.AirportListItemSkeleton />;
        }

        return <Blocks.LoungeDetailsSkeleton type={item} />;
    }, []);

    return (
        <SkeletonList
            data={['AirportListItem', 'AirportView', 'TerminalView', 'OpeningHoursView', 'AccessView']}
            renderItem={renderItem}
            ItemSeparatorComponent={() => null}
            style={[styles.list, isDark && styles.listDark]}
        />
    );
};

export default TimelineLoungeDetails;
