import React, {useMemo} from 'react';

import TimelineShare from '../../../../services/timelineShare';
import {TripsStackScreenFunctionalComponent} from '../../../../types/navigation';
import {ITripSegment} from '../../../../types/trips';
import {TimelineSegmentPhonesNavigator} from '../../segment/phones/navigator';

const getSegment = (route) => TimelineShare.getSegment(route?.params?.id);

const TimelineShareSegmentPhonesScreen: TripsStackScreenFunctionalComponent<'TimelineShareSegmentPhones'> = ({route}) => {
    const segment: ITripSegment | undefined = useMemo(() => getSegment(route), [route]);

    return <TimelineSegmentPhonesNavigator segment={segment} />;
};

TimelineShareSegmentPhonesScreen.navigationOptions = () => ({title: ''});

export {TimelineShareSegmentPhonesScreen};
