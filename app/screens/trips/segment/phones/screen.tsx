import React from 'react';

import {TripStackScreenFunctionalComponent} from '../../../../types/navigation';
import {getSegment} from '../index';
import {TimelineSegmentPhonesNavigator} from './navigator';

const TimelineSegmentPhonesScreen: TripStackScreenFunctionalComponent<'TimelineSegmentPhones'> = ({route}) => {
    const segment = getSegment(route);

    return <TimelineSegmentPhonesNavigator segment={segment} />;
};

TimelineSegmentPhonesScreen.navigationOptions = () => ({title: ''});

export default TimelineSegmentPhonesScreen;
