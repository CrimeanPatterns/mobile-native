import React, {useMemo} from 'react';

import TimelineShare from '../../../../services/timelineShare';
import {OutsideStackScreenFunctionalComponent} from '../../../../types/navigation';
import {TripSegmentDetails} from '../../segment/details';

const getSegment = (route) => {
    const id = route?.params?.id;

    return TimelineShare.getSegment(id);
};

const TimelineShareSegmentDetailsScreen: OutsideStackScreenFunctionalComponent<'TimelineShareSegmentDetails'> = ({navigation, route}) => {
    const lastSyncDate = useMemo(() => Date.now(), []);
    const segment = useMemo(() => getSegment(route), [route]);

    // @ts-ignore
    return <TripSegmentDetails navigation={navigation} route={route} segment={segment} lastSyncDate={lastSyncDate} />;
};

TimelineShareSegmentDetailsScreen.navigationOptions = () => ({
    title: '',
});

export default TimelineShareSegmentDetailsScreen;
