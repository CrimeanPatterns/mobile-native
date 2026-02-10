import Icons from '../../assets/icons';
import {TripSegmentBlock} from './index';

type BoxedVal = string;

export type BoxedBlock = {
    name: string;
    val: BoxedVal;
    old?: BoxedVal;
};

type ConfNoVal = string;

export type ConfNoBlock = {
    hint?: string;
    name: string;
    val: ConfNoVal;
    old?: ConfNoVal;
};

export type GroupBlock = {
    name: string;
    desc?: string;
};

type ImportantVal = string;

export type ImportantBlock = {
    name: string;
    icon: string;
    val: ImportantVal;
    old?: ImportantVal;
};

type LocationVal = {
    name: string;
    segmentId: string;
    code?: string;
    lounges?: number;
    stage?: 'arr' | 'dep';
};

export type LocationBlock = {
    val: LocationVal;
    old?: LocationVal;
};

export type NotesAndAttachmentsBlock = {
    id: string;
    name: string;
    val: {
        notes: string;
        files: AttachmentBlock[];
    };
};

export type OfferBlock = {
    val: string;
    link: {
        title: string;
        href: string;
    };
};

export type SavingsBlock = {
    name: string;
    refreshTimelineDetails: () => void;
    val: {
        cost: string;
        mileValue: string;
        tripSegmentId: number;
    };
};

export type ShowMoreBlock = {
    showMore: (index: number, items: TripSegmentBlock[]) => void;
    index: number;
    val: TripSegmentBlock[];
};

type StringVal = string;

export type StringBlock = {
    name: string;
    val: StringVal;
    old?: StringVal;
    background?: 'gray' | string;
    bold?: boolean;
};

export type AttachmentBlock = {
    date: string;
    description: string;
    id: number;
    name: string;
    size: string;
    time?: number;
};

export type AttachmentsBlock = {
    name?: string;
    val: AttachmentBlock[];
};

type TerminalAndGateVal = {
    gate: string;
    terminal: string;
};

export type TerminalAndGateBlock = {
    name: TerminalAndGateVal;
    val: TerminalAndGateVal;
    old?: TerminalAndGateVal;
    icon: string;
};

export type IDate = {
    fmt: {d: string; p?: string; t: string; tz: string};
    fmtParts: {d: number; h: number; i: number; m: number; y: number};
    localYMD: string;
    offset: number;
    ts: number;
};
export type TTimeAgo = {
    date: Date;
    localDate?: Date;
};

export type TOldTimeAgo = {
    date: Date;
    localDate?: Date;
};

type TimeVal = {
    date: IDate;
};

export type TimeBlock = {
    val: TimeVal;
    old?: TimeVal | undefined;
};

export type TimeReservationBlock = {
    val: {
        date: IDate;
        nights?: number;
        days?: number;
    };
};

export type TitleBlock = {
    name: string;
    val?: string;
};

export type FlightProgressBlock = {
    arrival: string;
    depart: string;
    startDate: number;
    endDate: number;
};

export type LoungeTitleView = {
    type: 'loungeTitle';
    name: string;
};

export type AccessIconView = {
    icon: string;
    isGranted?: boolean;
};

export type LoungeListItemView = {
    type: 'loungeListItem';
    id: number;
    name: string;
    isOpened: boolean;
    location?: string;
    access?: AccessIconView[];
    nextEventTs?: number;
};

export type TerminalView = {
    type: 'loungeDetails';
    icon: keyof typeof Icons;
    header: {
        type: 'terminal';
        terminalLabel: string;
        terminalValue: string;
        gateLabel?: string;
        gateValue?: string[];
    };
    description?: string;
};

export type Range = {
    start: string;
    end: string;
};

export type OpeningHoursItemView = {
    days: string[];
    openingHours: string | Range[];
};

export type OpeningHoursView = {
    type: 'loungeDetails';
    header: string;
    icon: keyof typeof Icons;
    openingHours: string | OpeningHoursItemView[];
};

export type AccessViewItem = {
    icon: string;
    description: string;
    isGranted?: boolean;
};

export type AccessView = {
    type: 'loungeDetails';
    icon: keyof typeof Icons;
    header: string;
    description: {
        type: 'access';
        items: AccessViewItem[];
    };
};

export type AirportView = {
    type: 'loungeDetails';
    icon: keyof typeof Icons;
    header: string;
    airportCode: string;
};
