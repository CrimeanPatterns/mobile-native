import {getPathFromState} from '@react-navigation/native';
import _ from 'lodash';

import {PathConfig} from '../navigation/linking';
import Booking from '../services/booking';
import {navigateByPath} from '../services/navigator';
import Timeline from '../services/timeline';

const log = (...args) => {
    console.log('initialRedirect()', ...args);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, consistent-return
export const initialRedirect = ({navigation}) => {
    if (getPathFromState(navigation.getState()).indexOf('AccountsList') > -1) {
        const lastUnreadRequest = Booking.getUnread();

        if (lastUnreadRequest) {
            log('open booking', {lastUnreadRequest});
            navigation.navigate('ToolsTab', {screen: 'Bookings'});
            return navigateByPath(PathConfig.BookingDetails, {requestId: lastUnreadRequest});
        }

        const userAgentId = 'my';
        const now = Date.now();
        const hourMs = 1000 * 60 * 60;
        const dayMs = hourMs * 24;
        const startDate = now - 7 * dayMs; /* 7 days */
        const endDate = now + dayMs; /* 1 day */

        const segments = Timeline.getSegmentsInRange(new Date(startDate), new Date(endDate));

        if (!_.isEmpty(segments)) {
            let initialSegment;
            // let initialSegments: ITripSegment[] = [];

            // eslint-disable-next-line guard-for-in, no-restricted-syntax
            for (const segment of segments) {
                if (segment.endDate && segment.endDate.ts) {
                    const segmentStartDate = segment.startDate.ts * 1000;
                    const segmentEndDate = segment.endDate.ts * 1000;

                    if (segmentStartDate >= now && segmentStartDate <= endDate) {
                        initialSegment = segment;
                        // initialSegments.push(segment);
                        break;
                    }

                    if (segmentEndDate >= now && segmentEndDate <= endDate && now - segmentStartDate < 7 * dayMs) {
                        initialSegment = segment;
                        // initialSegments.push(segment);
                    }
                }
            }

            // console.log('initialSegments', initialSegments)
            if (initialSegment) {
                const {id, menu, startDate} = initialSegment;

                log('open future trip', {userAgentId, id, initialSegment});

                navigation.navigate('TripsTab');
                navigateByPath(PathConfig.TimelineSegment, {userAgentId, id});

                if (menu.boardingPassUrl && startDate.ts * 1000 <= now + hourMs) {
                    log('open boarding pass', menu.boardingPassUrl);
                    navigation.navigate('InternalPage', {
                        url: menu.boardingPassUrl,
                    });
                }
            }
        }
    }
};
