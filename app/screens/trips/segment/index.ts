import TimelineService from '../../../services/timeline';

export const getSegment = (route) => {
    const userAgentId = route?.params?.userAgentId;
    const id = route?.params?.id;

    return TimelineService.getSegment(userAgentId, id);
};
