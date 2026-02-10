import _ from 'lodash';

import {ITripSegment, TripSegmentBlock, TripSegmentType} from '../types/trips';
import API from './api';
import EventEmitter from './eventEmitter';

export type TUserAgentId = string;
export type TSegmentId = ITripSegment['id'];

export type BaseTimelineEntity = {
    canChange: boolean;
    canConnectMailbox: boolean;
    itineraryForwardEmail: string;
    name: string;
    needMore: boolean;
    userAgentId: number | string;
};
export type TimelineEntity = BaseTimelineEntity & {
    items: ITripSegment[];
};

export type ClientTimelineEntity = BaseTimelineEntity & {
    items: Map<TSegmentId, ITripSegment>;
};

export const timeline: Map<TUserAgentId, ClientTimelineEntity> = new Map();

const confirmChangesInBlocks = (blocks: TripSegmentBlock[]) =>
    blocks.map((block) => {
        if (_.has(block, 'old')) {
            // @ts-ignore
            block.old = null;
        }

        if (block.kind === 'showmore' && 'val' in block) {
            if (_.isArray(block.val)) {
                confirmChangesInBlocks(block.val);
            }
        }

        return block;
    });

class Timeline {
    private tempList: {[segmentId: string]: ITripSegment};

    constructor() {
        this.tempList = {};

        this.chunked = this.chunked.bind(this);
        this.chunkedAfter = this.chunkedAfter.bind(this);
        this.clear = this.clear.bind(this);

        EventEmitter.addListener('logout', this.clear);
    }

    public setList(data: TimelineEntity[]) {
        if (_.isArray(data)) {
            this.buildMap(data);
            EventEmitter.emit('timeline:update');
        }
    }

    public getTimeline = (userAgentId: TUserAgentId = 'my') => timeline.get(String(userAgentId));

    public getSegment = (userAgentId: TUserAgentId, segmentId: TSegmentId): ITripSegment | undefined => {
        // @ts-ignore
        if (this.tempList[segmentId]) {
            // @ts-ignore
            return this.tempList[segmentId];
        }

        const timeline = this.getTimeline(userAgentId);

        if (timeline && timeline.items) {
            return timeline.items.get(segmentId);
        }

        return undefined;
    };

    public deleteSegment = (segmentId: TSegmentId) => API.post(`/timeline/delete/${segmentId}`, {}, {globalError: false});

    public restoreSegment = (userAgentId: TUserAgentId, segmentId: TSegmentId): Promise<void> => {
        const segment = this.getSegment(userAgentId, segmentId);

        if (segment) {
            segment.deleted = false;

            this.setSegment(userAgentId, segmentId, segment);

            return API.post(`/timeline/restore/${segmentId}`, {}, {globalError: false});
        }

        return Promise.reject();
    };

    public deletePlan = (planId) => API.post(`/timeline/plan/delete/${planId}`, {}, {globalError: false});

    public hideAiWarning = (planId) => API.post(`/timeline/hide-ai-warning/${planId}`, {}, {globalError: false});

    public renamePlan = (planId, name) => API.post(`/timeline/plan/rename/${planId}`, {name}, {globalError: false});

    public groupPlan = (userAgentId: TUserAgentId, startTime) =>
        API.post(`timeline/plan/create/${userAgentId}/${startTime}`, {}, {globalError: false});

    public movePlan = (planId, type, nextSegmentId, nextSegmentTs) =>
        API.post(`timeline/plan/move/${planId}`, {nextSegmentId, nextSegmentTs, type}, {globalError: false});

    public getTravelers = () => timeline;

    public chunked(userAgentId: TUserAgentId, {startTime, deleted, after}): Promise<TimelineEntity> {
        return new Promise((resolve, reject) => {
            if (startTime >= 0) {
                const chunkFn = after ? 'chunkAfter' : 'chunk';
                let url = `/timeline/${chunkFn}/${startTime}/${userAgentId}`;

                if (deleted === true) {
                    url = `${url}/deleted`;
                }

                API.get<TimelineEntity>(url).then((response) => {
                    const {data} = response;

                    if (_.isObject(data) && _.isArray(data.items)) {
                        this.saveTemp(userAgentId, data.items);
                        return resolve(data);
                    }

                    return reject();
                }, reject);
            } else {
                reject();
            }
        });
    }

    public chunkedAfter(userAgentId: TUserAgentId, {startTime, deleted}) {
        return this.chunked(userAgentId, {startTime, deleted, after: true});
    }

    public getSegmentsInRange(
        startDate: Date,
        endDate: Date | -1,
        exceptTypes: TripSegmentType[] = [],
        userAgentId: TUserAgentId = 'my',
    ): ITripSegment[] {
        const list = this.getTimeline(userAgentId);
        const output: ITripSegment[] = [];

        // eslint-disable-next-line no-param-reassign
        exceptTypes = ['date', 'planStart', 'planEnd', 'layover', ...exceptTypes];

        // console.group();
        // console.log( startDate.toString(), endDate.toString())
        if (list && list.items && list.items.size > 0) {
            for (const [, segment] of list.items) {
                if (segment.startDate && segment.startDate.ts && exceptTypes.indexOf(segment.type) === -1) {
                    const segmentStartDate: Date = new Date(segment.startDate.ts * 1000);
                    let segmentEndDate: Date | undefined;

                    if (segment.endDate?.ts) {
                        segmentEndDate = new Date(segment.endDate.ts * 1000);
                    }

                    // console.group();
                    // console.log(segment.id);
                    // console.log(segment);
                    // console.log(segmentStartDate.toString(), segmentEndDate?.toString());

                    if (
                        (endDate === -1 && segmentStartDate.getTime() >= startDate.getTime()) ||
                        (endDate !== -1 &&
                            segmentEndDate &&
                            (segmentStartDate.getTime() >= startDate.getTime() || segmentEndDate.getTime() <= endDate.getTime()))
                    ) {
                        output.push(segment);
                    }
                    // console.log('inRange: ', output.includes(segment));
                    // console.groupEnd();
                }
            }
        }
        // console.groupEnd();

        return output;
    }

    public confirmChanged = (userAgentId: TUserAgentId, segmentId: TSegmentId): Promise<void> => {
        const segment = this.getSegment(userAgentId, segmentId);

        if (segment) {
            const changedSegment: ITripSegment = {
                ...segment,
                menu: {
                    ...segment.menu,
                    allowConfirmChanges: false,
                },
                changed: false,
                blocks: confirmChangesInBlocks(segment.blocks),
            };

            if (_.isObject(changedSegment.startDate) && _.isUndefined(changedSegment.startDate.old) === false) {
                delete changedSegment.startDate.old;
            }

            this.setSegment(userAgentId, segmentId, changedSegment);

            return API.post(`/timeline/confirm-changes/${segmentId}`, {}, {globalError: false});
        }

        return Promise.reject();
    };

    public getTravelSummary = (owner = null, period = 1) =>
        API.post(`/timeline/summary/data`, {
            period,
            owner,
        });

    public getTripSegment = (segmentId: TSegmentId) => API.get(`/timeline/segment/${segmentId}`);
    public getNotes = (planId: number) => API.get(`/timeline/notes/${planId}`);

    private setSegment(userAgentId: TUserAgentId, segmentId: TSegmentId, segment: ITripSegment) {
        // @ts-ignore
        if (this.tempList[segmentId]) {
            // @ts-ignore
            this.tempList[segmentId] = segment;
            EventEmitter.emit('timeline:update');
        } else {
            const timeline = this.getTimeline(userAgentId);

            if (timeline && timeline.items) {
                timeline.items.set(segmentId, segment);
                EventEmitter.emit('timeline:update');
            }
        }
    }

    private buildMap(data: TimelineEntity[]) {
        timeline.clear();
        this.process(data);
    }

    private process = (data: TimelineEntity[]) => {
        data.reduce((map, timelineEntity) => {
            const {items, ...rest} = timelineEntity;
            const entity: ClientTimelineEntity = {
                ...rest,
                items: items.reduce((mapAccumulator, segment) => {
                    segment.canChange = timelineEntity.canChange;
                    mapAccumulator.set(segment.id, segment);

                    return mapAccumulator;
                }, new Map()),
            };

            map.set(String(timelineEntity.userAgentId), entity);

            return map;
        }, timeline);
    };

    private saveTemp(userAgentId: TUserAgentId, segments: ITripSegment[]) {
        const list = this.getTimeline(userAgentId);

        if (list) {
            if (_.isArray(segments)) {
                for (let i = 0, l = segments.length; i < l; i += 1) {
                    segments[i].canChange = list.canChange;
                    this.tempList[segments[i].id] = segments[i];
                }
            }
        }
    }

    private readonly clear = (): void => {
        timeline.clear();
    };
}

export default new Timeline();
