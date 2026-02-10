import Timeline from '../../app/services/timeline';

jest.mock('../../app/services/api');

const data = [
    {
        name: 'AwardWallet Developer',
        items: [
            {
                name: 'Trip to Test',
                endDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                type: 'planStart',
                startDate: {
                    ts: 1471550400,
                    fmt: {
                        tz: 'UTC',
                        p: 'PM',
                        t: '8:00',
                        d: 'Thursday, August 18, 2016',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                type: 'date',
                id: 'DAY.1471564800',
                startDate: {
                    ts: 1471564800,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Friday, August 19, 2016',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                blocks: [
                    {
                        kind: 'confno',
                        name: 'Confirmation #',
                        icon: null,
                        val: '1',
                        old: null,
                    },
                    {
                        kind: 'title',
                        name: 'АВТОВАЗ',
                        icon: 'car',
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Pick-up',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'timeRental',
                        name: null,
                        icon: null,
                        val: {
                            days: 1,
                            date: {
                                ts: 1471564800,
                                fmt: {
                                    tz: 'UTC',
                                    p: 'AM',
                                    t: '12:00',
                                    d: 'Friday, August 19, 2016',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: null,
                            name: 'г. Тольяти, ул. Автовазная 99',
                        },
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Drop-off',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'timeRental',
                        name: null,
                        icon: null,
                        val: {
                            date: {
                                ts: 1471651200,
                                fmt: {
                                    tz: 'UTC',
                                    p: 'AM',
                                    t: '12:00',
                                    d: 'Saturday, August 20, 2016',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: null,
                            name: 'г. Тольяти, ул. Автовазная 99',
                        },
                        old: null,
                    },
                ],
                icon: 'car',
                listView: {
                    kind: 'simple',
                    title: 'Pick-up @',
                    val: 'АВТОВАЗ',
                },
                menu: {
                    _keep: 1,
                    direction: {
                        address: 'г. Тольяти, ул. Автовазная 99',
                    },
                    allowConfirmChanges: false,
                },
                type: 'pickup',
                id: 'PU.610454',
                changed: false,
                startDate: {
                    ts: 1471564800,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Friday, August 19, 2016',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                type: 'date',
                id: 'DAY.1471651200',
                startDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                icon: 'car',
                listView: {
                    kind: 'simple',
                    title: 'Drop-off @',
                    val: 'АВТОВАЗ',
                },
                type: 'dropoff',
                id: 'DO.610454',
                changed: false,
                startDate: {
                    ts: 1471651200,
                    fmt: {
                        tz: 'UTC',
                        p: 'AM',
                        t: '12:00',
                        d: 'Saturday, August 20, 2016',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1495453740,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '7:49',
                        d: '5/22/17',
                    },
                },
                type: 'date',
                id: 'DAY.1495432800',
                startDate: {
                    ts: 1495447200,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '6:00',
                        d: 'Monday, May 22, 2017',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1495453740,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '7:49',
                        d: '5/22/17',
                    },
                },
                blocks: [
                    {
                        kind: 'confno',
                        name: 'Confirmation #',
                        icon: null,
                        val: 'H8BUMT',
                        old: null,
                    },
                    {
                        kind: 'title',
                        name: 'DELTA AIR LINES INC',
                        icon: 'fly icon-aircraft-default',
                        val: '4532',
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Origin',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: 'ABE',
                            name: 'Allentown, PA',
                        },
                        old: null,
                    },
                    {
                        kind: 'time',
                        name: null,
                        icon: null,
                        val: {
                            date: {
                                ts: 1495447200,
                                old: null,
                                fmt: {
                                    tz: 'EDT',
                                    p: 'AM',
                                    t: '6:00',
                                    d: '5/22/17',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'important',
                        name: 'Seats:',
                        icon: 'seats',
                        val: '02A',
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Destination',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: 'DTW',
                            name: 'Detroit, MI',
                        },
                        old: null,
                    },
                    {
                        kind: 'terminalAndGate',
                        name: {
                            terminal: 'Terminal',
                            gate: 'Gate',
                        },
                        icon: 'terminal-and-gate',
                        val: {
                            terminal: 'M',
                            gate: 'C8',
                        },
                        old: null,
                    },
                    {
                        kind: 'time',
                        name: null,
                        icon: null,
                        val: {
                            date: {
                                ts: 1495453740,
                                fmt: {
                                    tz: 'EDT',
                                    p: 'AM',
                                    t: '7:49',
                                    d: '5/22/17',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'showmore',
                        name: null,
                        icon: null,
                        val: [
                            {
                                kind: 'string',
                                name: 'Passengers',
                                icon: null,
                                val: 'ALEXI ALEXANDROV VERESCHAGA',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Cabin',
                                icon: null,
                                val: 'MAIN',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Booking class',
                                icon: null,
                                val: 'Q',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Aircraft',
                                icon: null,
                                val: 'Canadair (Bombardier) Regional Jet 100',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Base Fare',
                                icon: null,
                                val: '$837.20',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Tax',
                                icon: null,
                                val: '$108.40',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Total Charge',
                                icon: null,
                                val: '$945.60',
                                old: null,
                            },
                            {
                                kind: 'text',
                                name: 'Notes',
                                icon: null,
                                val: '&lt;a href=&quot;&quot;/&gt;',
                                old: null,
                            },
                        ],
                        old: null,
                    },
                    {
                        kind: 'offer',
                        name: null,
                        icon: null,
                        val: 'Need a place to stay?',
                        old: null,
                        link: {
                            href: 'https://awardwallet.com/out?url=http%3A//award.travel/airbnb',
                            title: 'Get $40 credit if you are new to Airbnb',
                        },
                    },
                ],
                icon: 'fly icon-aircraft-default',
                listView: {
                    kind: 'tripChain',
                    dep: 'ABE',
                    arr: 'DTW',
                    arrDate: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '7:49',
                        d: '5/22/17',
                    },
                },
                menu: {
                    flightStatus: {
                        provider: 'delta',
                        flightNumber: '4532',
                        depCode: 'ABE',
                        depDate: {
                            ts: 1495447200,
                            tz: 'EDT',
                            fmt: {
                                y: 2017,
                                m: 4,
                                d: 22,
                                h: 6,
                                i: 0,
                            },
                        },
                        arrCode: 'DTW',
                        arrDate: {
                            ts: 1495453740,
                            tz: 'EDT',
                            fmt: {
                                y: 2017,
                                m: 4,
                                d: 22,
                                h: 7,
                                i: 49,
                            },
                        },
                    },
                    alternativeFlights: {
                        main: [
                            {
                                points: ['ABE', 'DTW'],
                                dates: [
                                    {
                                        ts: 1495360800,
                                        fmt: '5/21/17',
                                    },
                                    {
                                        ts: 1495447200,
                                        fmt: '5/22/17',
                                    },
                                    {
                                        ts: 1495533600,
                                        fmt: '5/23/17',
                                    },
                                ],
                            },
                        ],
                    },
                    _keep: 1,
                    direction: {
                        lat: 40.6526229,
                        lng: -75.435292,
                        address: 'ABE, Allentown, US',
                    },
                    phones: {
                        groups: [
                            {
                                name: '1',
                                order: ['geo', '-rank'],
                            },
                        ],
                        phones: [
                            {
                                phone: '+1-404-714-2300',
                                name: 'General',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                            {
                                phone: '1-800-323-2323',
                                name: 'Reservations',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                            {
                                phone: '1-800-325-3999',
                                name: 'General',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                        ],
                        ownerCountry: 'ru',
                    },
                    allowConfirmChanges: false,
                },
                type: 'trip',
                id: 'T.17348129',
                changed: false,
                startDate: {
                    ts: 1495447200,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '6:00',
                        d: '5/22/17',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1495474500,
                    fmt: {
                        tz: 'PDT',
                        p: 'AM',
                        t: '10:35',
                        d: '5/22/17',
                    },
                },
                duration: {
                    h: 0,
                    i: 36,
                },
                icon: 'bench',
                listView: {
                    duration: {
                        h: 0,
                        i: 36,
                    },
                    kind: 'layover',
                    title: 'Layover',
                    val: '@ DTW (Detroit, MI)',
                },
                type: 'layover',
                id: 'L.17348129',
                changed: false,
                startDate: {
                    ts: 1495453740,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '7:49',
                        d: '5/22/17',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1495474500,
                    fmt: {
                        tz: 'PDT',
                        p: 'AM',
                        t: '10:35',
                        d: '5/22/17',
                    },
                },
                blocks: [
                    {
                        kind: 'confno',
                        name: 'Confirmation #',
                        icon: null,
                        val: 'H8BUMT',
                        old: null,
                    },
                    {
                        kind: 'title',
                        name: 'DELTA AIR LINES INC',
                        icon: 'fly',
                        val: '745',
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Origin',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: 'DTW',
                            name: 'Detroit, MI',
                        },
                        old: null,
                    },
                    {
                        kind: 'terminalAndGate',
                        name: {
                            terminal: 'Terminal',
                            gate: 'Gate',
                        },
                        icon: 'terminal-and-gate',
                        val: {
                            terminal: 'M',
                            gate: 'A46',
                        },
                        old: null,
                    },
                    {
                        kind: 'time',
                        name: null,
                        icon: null,
                        val: {
                            date: {
                                ts: 1495455900,
                                old: null,
                                fmt: {
                                    tz: 'EDT',
                                    p: 'AM',
                                    t: '8:25',
                                    d: '5/22/17',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'important',
                        name: 'Seats:',
                        icon: 'seats',
                        val: '26F',
                        old: null,
                    },
                    {
                        kind: 'group',
                        name: 'Destination',
                        icon: null,
                        val: null,
                        old: null,
                    },
                    {
                        kind: 'location',
                        name: null,
                        icon: null,
                        val: {
                            code: 'SFO',
                            name: 'San Francisco, CA',
                        },
                        old: null,
                    },
                    {
                        kind: 'terminalAndGate',
                        name: {
                            terminal: 'Terminal',
                            gate: 'Gate',
                        },
                        icon: 'terminal-and-gate',
                        val: {
                            terminal: '1',
                            gate: '43',
                        },
                        old: null,
                    },
                    {
                        kind: 'time',
                        name: null,
                        icon: null,
                        val: {
                            date: {
                                ts: 1495474500,
                                fmt: {
                                    tz: 'PDT',
                                    p: 'AM',
                                    t: '10:35',
                                    d: '5/22/17',
                                },
                            },
                        },
                        old: null,
                    },
                    {
                        kind: 'showmore',
                        name: null,
                        icon: null,
                        val: [
                            {
                                kind: 'string',
                                name: 'Passengers',
                                icon: null,
                                val: 'ALEXI ALEXANDROV VERESCHAGA',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Cabin',
                                icon: null,
                                val: 'MAIN',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Booking class',
                                icon: null,
                                val: 'Q',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Aircraft',
                                icon: null,
                                val: '??',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Base Fare',
                                icon: null,
                                val: '$837.20',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Tax',
                                icon: null,
                                val: '$108.40',
                                old: null,
                            },
                            {
                                kind: 'string',
                                name: 'Total Charge',
                                icon: null,
                                val: '$945.60',
                                old: null,
                            },
                            {
                                kind: 'text',
                                name: 'Notes',
                                icon: null,
                                val: '&lt;a href=&quot;&quot;/&gt;',
                                old: null,
                            },
                        ],
                        old: null,
                    },
                    {
                        kind: 'offer',
                        name: null,
                        icon: null,
                        val: 'Need a place to stay?',
                        old: null,
                        link: {
                            href: 'https://awardwallet.com/out?url=http%3A//award.travel/airbnb',
                            title: 'Get $40 credit if you are new to Airbnb',
                        },
                    },
                ],
                icon: 'fly',
                listView: {
                    kind: 'tripChain',
                    dep: 'DTW',
                    arr: 'SFO',
                    arrDate: {
                        tz: 'PDT',
                        p: 'AM',
                        t: '10:35',
                        d: '5/22/17',
                    },
                },
                menu: {
                    flightStatus: {
                        provider: 'delta',
                        flightNumber: '745',
                        depCode: 'DTW',
                        depDate: {
                            ts: 1495455900,
                            tz: 'EDT',
                            fmt: {
                                y: 2017,
                                m: 4,
                                d: 22,
                                h: 8,
                                i: 25,
                            },
                        },
                        arrCode: 'SFO',
                        arrDate: {
                            ts: 1495474500,
                            tz: 'PDT',
                            fmt: {
                                y: 2017,
                                m: 4,
                                d: 22,
                                h: 10,
                                i: 35,
                            },
                        },
                    },
                    alternativeFlights: {
                        main: [
                            {
                                points: ['DTW', 'SFO'],
                                dates: [
                                    {
                                        ts: 1495369500,
                                        fmt: '5/21/17',
                                    },
                                    {
                                        ts: 1495455900,
                                        fmt: '5/22/17',
                                    },
                                    {
                                        ts: 1495542300,
                                        fmt: '5/23/17',
                                    },
                                ],
                            },
                            {
                                points: ['DTW', 'ABE'],
                                dates: [
                                    {
                                        ts: 1495369500,
                                        fmt: '5/21/17',
                                    },
                                    {
                                        ts: 1495455900,
                                        fmt: '5/22/17',
                                    },
                                    {
                                        ts: 1495542300,
                                        fmt: '5/23/17',
                                    },
                                ],
                            },
                        ],
                    },
                    _keep: 1,
                    direction: {
                        lat: 42.2161722,
                        lng: -83.3553842,
                        address: 'DTW, Detroit, US',
                    },
                    phones: {
                        groups: [
                            {
                                name: '1',
                                order: ['geo', '-rank'],
                            },
                        ],
                        phones: [
                            {
                                phone: '+1-404-714-2300',
                                name: 'General',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                            {
                                phone: '1-800-323-2323',
                                name: 'Reservations',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                            {
                                phone: '1-800-325-3999',
                                name: 'General',
                                country: 'United States',
                                coutryCode: 'us',
                                group: '1',
                                rank: -1,
                            },
                        ],
                        ownerCountry: 'ru',
                    },
                    allowConfirmChanges: false,
                },
                type: 'trip',
                id: 'T.17348130',
                changed: false,
                startDate: {
                    ts: 1495455900,
                    fmt: {
                        tz: 'EDT',
                        p: 'AM',
                        t: '8:25',
                        d: '5/22/17',
                    },
                },
                breakAfter: false,
            },
            {
                endDate: {
                    ts: 1496696640,
                    fmt: {
                        tz: 'EDT',
                        p: 'PM',
                        t: '5:04',
                        d: '6/5/17',
                    },
                },
                type: 'date',
                id: 'DAY.1496676660',
                startDate: {
                    ts: 1496691060,
                    fmt: {
                        tz: 'EDT',
                        p: 'PM',
                        t: '3:31',
                        d: 'Monday, June 5, 2017',
                    },
                },
                breakAfter: false,
            },
        ],
        userAgentId: 'my',
        itineraryForwardEmail: 'dev@AwardWallet.com',
        needMore: false,
    },
];

describe('Timeline', () => {
    beforeEach(() => {
        Timeline.setList(JSON.parse(JSON.stringify(data)));
    });

    afterEach(() => {
        Timeline.clear();
    });

    test('getTimeline, default', () => {
        expect(Timeline.getTimeline()).toBeDefined();
    });

    test('getSegment', () => {
        expect(Timeline.getSegment('my', 'PU.610454')).toEqual(data[0].items.find((item) => item.id === 'PU.610454'));
    });

    test('getTravelers', () => {
        const travelers = Timeline.getTravelers();

        expect(Array.from(travelers.keys())).toEqual(['my']);
    });

    test('getTimeline(my)', () => {
        const traveler = Timeline.getTimeline('my');

        expect(traveler).toBeDefined();
    });

    test('getSegmentsInRange', () => {
        const startDate = new Date(data[0].items[0].startDate.ts * 1000);
        const endDate = new Date(data[0].items[data[0].items.length - 2].endDate.ts * 1000);

        expect(Timeline.getSegmentsInRange(startDate, endDate)).toEqual([]);
        jest.spyOn(Date, 'now').mockImplementation(() => new Date(data[0].items[2].startDate.ts * 1000));
        expect(Timeline.getSegmentsInRange(startDate, endDate).length).toBe(5);
    });
});
