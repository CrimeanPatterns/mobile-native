import _ from 'lodash';

import {ITripSegment} from '../types/trips';
import API from './api';
import {TSegmentId} from './timeline';

const timeline: Map<TSegmentId, ITripSegment> = new Map();

class TimelineShare {
    getLength = () => timeline.size;

    setList = (data: ITripSegment[]) => {
        timeline.clear();
        if (_.isArray(data)) {
            for (const item of data) {
                item.shared = true;
                timeline.set(item.id, item);
            }
        }
    };

    getList = () => timeline;

    getSegment = (segmentId: TSegmentId) => timeline.get(segmentId);

    getShared(sharedKey: string) {
        return new Promise<void>((resolve, reject) => {
            API.get<ITripSegment[]>(`/timeline/shared/${sharedKey}`).then((response) => {
                if (_.isObject(response) && _.isArray(response.data)) {
                    this.setList(response.data);
                    resolve();
                } else {
                    reject();
                }
            }, reject);
        });
    }

    clear = () => {
        timeline.clear();
    };
}

export default new TimelineShare();
