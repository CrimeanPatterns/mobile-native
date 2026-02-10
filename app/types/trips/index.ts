import {
    BoxedBlock,
    ConfNoBlock,
    GroupBlock,
    ImportantBlock,
    LocationBlock,
    NotesAndAttachmentsBlock,
    OfferBlock,
    SavingsBlock,
    ShowMoreBlock,
    StringBlock,
    TerminalAndGateBlock,
    TimeBlock,
    TimeReservationBlock,
    TitleBlock,
} from './blocks';

export type LocationDirection = {
    address: string;
    lat: string;
    lng: string;
};
export type TripSegmentBlock = (
    | BoxedBlock
    | ConfNoBlock
    | GroupBlock
    | ImportantBlock
    | LocationBlock
    | NotesAndAttachmentsBlock
    | OfferBlock
    | SavingsBlock
    | ShowMoreBlock
    | StringBlock
    | TerminalAndGateBlock
    | TimeBlock
    | TimeReservationBlock
    | TitleBlock
) & {
    kind:
        | 'boxed'
        | 'confno'
        | 'group'
        | 'important'
        | 'location'
        | 'offer'
        | 'savings'
        | 'showmore'
        | 'source'
        | 'string'
        | 'terminalAndGate'
        | 'notes_and_files'
        | 'time'
        | 'timeRental'
        | 'timeReservation'
        | 'title'
        | 'flightProgress'
        | 'separator'
        | 'no_foreign_fees_cards'
        | 'ai_reservation';
};

export type TripSegmentBlocks = TripSegmentBlock[];

export type TripSegmentPhone = {
    country?: string;
    countryCode?: string;
    group: string;
    name: string;
    phone: string;
    rank: number;
    region?: string;
};

export type TripSegmentPhonesListItem = {
    groups: {name: string; order: string[]}[];
    icon: string;
    title: string;
    ownerCountry: string;
    phones: TripSegmentPhone[];
};

export type TripSegmentPhoneGroup = {
    title: string;
    icon: string;
    phonesLists: TripSegmentPhonesListItem[];
};

export type TripSegmentMenu = {
    boardingPassUrl?: string;
    phones?: TripSegmentPhoneGroup[];
    alternativeFlights?: {[key: string]: unknown};
    itineraryAutologin?: {
        itineraryId: string;
        type: 'desktop' | 'mobile';
    };
    direction?: LocationDirection;
    allowConfirmChanges?: boolean;
    shareCode?: string;
};

export type TripSegmentDateFMT = {
    d: string;
    t: string;
    p?: string;
    tz?: string;
};
export type TripSegmentDate = {
    old?: {[key: string]: unknown};
    fmt?: TripSegmentDateFMT;
    ts: number;
};

export type TripSegmentType =
    | 'date'
    | 'planStart'
    | 'planEnd'
    | 'layover'
    | 'parkingStart'
    | 'parkingEnd'
    | 'pickup'
    | 'dropoff'
    | 'checkin'
    | 'checkout'
    | 'trip';

export type TripSegmentListView =
    | {kind: 'simple'; title: string; val: string}
    | {
          kind: 'tripChain';
          arr?: string;
          arrDate: TripSegmentDateFMT;
          dep?: string;
          duration: string;
      }
    | {
          kind: 'layover';
          duration: {
              h: number;
              i: number;
          };
          title: string;
          val: string;
      }
    | {
          kind: 'tripPoint';
          arr: string;
          dep: string;
          hint: string;
      };

export interface ITripSegment {
    type: TripSegmentType;
    blocks: TripSegmentBlocks;
    breakAfter: boolean;
    changed: boolean;
    createPlan: boolean;
    deleted: boolean;
    icon: string;
    id: string;
    menu: TripSegmentMenu;
    startDate: TripSegmentDate;
    endDate?: TripSegmentDate;
    canChange: boolean;
    listView?: TripSegmentListView;
    shared?: boolean;
}
