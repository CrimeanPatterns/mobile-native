import TimelineShare from '../../../../services/timelineShare';
import {withTheme} from '../../../../theme';
import {TimelineSegmentFlights} from '../../segment/flights';

class TimelineShareSegmentFlights extends TimelineSegmentFlights {
    getSegment() {
        const {route} = this.props;

        return TimelineShare.getSegment(route?.params?.id);
    }
}

export default withTheme(TimelineShareSegmentFlights);
