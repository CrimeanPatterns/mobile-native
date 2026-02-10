import _ from 'lodash';
import React, {useEffect, useState} from 'react';

import {HeaderRightButton} from '../../../../components/page/header/button';
import {isIOS} from '../../../../helpers/device';
import EventEmitter from '../../../../services/eventEmitter';
import Session from '../../../../services/session';
import {TripsStackScreenFunctionalComponent} from '../../../../types/navigation';
import {TripSegmentDetails} from './index';

const getSegment = (route) => TripSegmentDetails.getSegment(route.params?.userAgentId, route.params?.id);

const TimelineSegmentDetailsScreen: TripsStackScreenFunctionalComponent<'TimelineSegmentDetails'> = ({navigation, route}) => {
    const [lastSyncDate, setLastSyncDate] = useState(parseInt(Session.getProperty('timestamp'), 10));
    const [segment, setSegment] = useState(getSegment(route));

    useEffect(() => {
        const listener = EventEmitter.addListener('timeline:update', () => {
            setLastSyncDate(Date.now());
            setSegment(getSegment(route));
        });

        return () => listener.remove();
    }, []);

    useEffect(() => {
        if (_.isObject(segment)) {
            navigation.setParams({shareCode: segment.menu?.shareCode});
        }
    }, [segment]);

    return <TripSegmentDetails segment={segment} lastSyncDate={lastSyncDate} />;
};

TimelineSegmentDetailsScreen.navigationOptions = ({route}) => {
    const shareCode = route.params?.shareCode;

    return {
        title: '',
        headerRight: () =>
            _.isString(shareCode) && (
                <HeaderRightButton iconName={isIOS ? 'share' : 'android-share'} onPress={() => TripSegmentDetails.share(shareCode)} />
            ),
    };
};

export default TimelineSegmentDetailsScreen;
