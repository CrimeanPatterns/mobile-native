import BottomSheet from '@gorhom/bottom-sheet';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Card, CardTable, HeaderButtons, Table, TravelSummaryMailboxes, TravelSummaryMap} from '../../../components/travel-summary';
import {BottomSheetFlights} from '../../../components/travel-summary/bottomSheet/flights';
import {BottomSheetSummary} from '../../../components/travel-summary/bottomSheet/summary';
import TravelSummaryStatistics from '../../../components/travel-summary/statistics';
import TimelineService from '../../../services/timeline';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ThemeColors, useTheme} from '../../../theme';
import {TravelSummarySubscriptionPlus} from './subscription';

const createStatistics = (statistics, comparedTo, color) =>
    _.isArray(statistics) && (
        <>
            <View style={styles.indicators}>
                {statistics.map(({value, name, previousValue, percentage, hint}, index) => (
                    <TravelSummaryStatistics.Indicator
                        key={`statistic-element-${index}`}
                        bgColor={color}
                        title={name}
                        value={value}
                        previousValue={previousValue}
                        percentage={percentage}
                        hint={hint}
                    />
                ))}
            </View>
            {_.isNumber(comparedTo) && (
                <Text style={[styles.text, styles.comparedTo]}>{`* ${Translator.trans('trips.compared-to', {}, 'trips')} ${comparedTo}`}</Text>
            )}
        </>
    );

const formatStatistics = (data) =>
    data.map((item) => {
        item.previousValue = !item.previousValue ? undefined : `${item.previousValue > 0 ? '+' : ''}${item.previousValue}`;

        return item;
    });

function renderCarouselCard({item, previousStatistics = {}, theme, reload, bottomSheetSnapTo}) {
    const {
        comparedTo,
        totalFlights: previousTotalFlights,
        longHaulFlights: previousLongHaulFlights,
        shortHaulFlights: previousShortFlights,
        countries: previousCountries,
        cities: previousCities,
        continents: previousContinents,
    } = previousStatistics;
    const {color} = item;
    const isDark = theme === 'dark';
    const themeColors = ThemeColors[theme];
    let backgroundColor = isDark ? DarkColors.bg : Colors.white;

    backgroundColor = color
        ? fromColor(themeColors[color])
              .darken(isDark ? 0.2 : 0)
              .rgb()
              .string()
        : backgroundColor;

    if (item.needAwPlus) {
        return (
            <CardTable backgroundColor={Colors.blueDark}>
                <TravelSummarySubscriptionPlus reload={reload} />
            </CardTable>
        );
    }

    if (item.linkMailbox) {
        const {noData} = item;

        return (
            <CardTable>
                <TravelSummaryMailboxes noData={noData} theme={theme} owners={[]} source='travel_summary_offer' reload={reload} />
            </CardTable>
        );
    }

    if (item.flightStat) {
        const {flightStat} = item;
        const {totalFlights, longHaulFlights, shortHaulFlights} = flightStat;

        return (
            <Card backgroundColor={backgroundColor} title={Translator.trans('trips.flight-statistics', {}, 'trips')}>
                {createStatistics(
                    formatStatistics([
                        {
                            name: Translator.trans('trips.total-flights', {}, 'trips'),
                            value: totalFlights,
                            previousValue: previousTotalFlights,
                        },
                        {
                            name: Translator.trans('trips.long-haul-flights', {}, 'trips'),
                            value: longHaulFlights,
                            previousValue: previousLongHaulFlights,
                            percentage: Math.round((longHaulFlights * 100) / totalFlights),
                        },
                        {
                            name: Translator.trans('trips.short-haul-flights', {}, 'trips'),
                            value: shortHaulFlights,
                            previousValue: previousShortFlights,
                            percentage: Math.round((shortHaulFlights * 100) / totalFlights),
                        },
                    ]),
                    comparedTo,
                    backgroundColor,
                )}
            </Card>
        );
    }
    if (item.locationStat) {
        const {locationStat} = item;
        const {countries, cities, continents} = locationStat;

        return (
            <Card backgroundColor={backgroundColor} title={Translator.trans('trips.location-statistics', {}, 'trips')}>
                {createStatistics(
                    formatStatistics([
                        {
                            name: Translator.trans('trips.countries', {}, 'trips'),
                            value: countries,
                            previousValue: previousCountries,
                        },
                        {
                            name: `${Translator.trans('trips.towns', {}, 'trips')} / ${Translator.trans('trips.cities', {}, 'trips')}`,
                            value: cities,
                            previousValue: previousCities,
                        },
                        {
                            name: Translator.trans('trips.continents', {}, 'trips'),
                            value: continents,
                            previousValue: previousContinents,
                        },
                    ]),
                    comparedTo,
                    backgroundColor,
                )}
            </Card>
        );
    }

    if (item.airports) {
        return (
            <CardTable title={Translator.trans('trips.airports', {}, 'trips')}>
                <Table data={item.airports} onScroll={bottomSheetSnapTo} />
            </CardTable>
        );
    }

    if (item.countries) {
        return (
            <CardTable title={Translator.trans('trips.countries', {}, 'trips')}>
                <Table data={item.countries} onScroll={bottomSheetSnapTo} displayName={false} />
            </CardTable>
        );
    }

    if (item.airlines) {
        return (
            <CardTable title={Translator.trans('trips.airlines', {}, 'trips')}>
                <Table data={item.airlines} onScroll={bottomSheetSnapTo} displayName={false} />
            </CardTable>
        );
    }

    if (item.aroundTheWorld) {
        const {aroundTheWorld, distance} = item;
        const {aroundTheWorldFormatted: previousAroundTheWorld, distanceFormatted: previousDistance} = previousStatistics;

        return (
            <Card backgroundColor={themeColors.orange} title={Translator.trans('trips.distance', {}, 'trips')}>
                {createStatistics(
                    [
                        {
                            name: Translator.trans('trips.distance-traveled', {}, 'trips'),
                            value: distance,
                            previousValue: previousDistance,
                            hint: 'mi',
                        },
                        {
                            name: Translator.trans('trips.times-around-world', {}, 'trips'),
                            value: aroundTheWorld,
                            previousValue: previousAroundTheWorld,
                        },
                    ],
                    comparedTo,
                    themeColors.orange,
                )}
            </Card>
        );
    }

    return null;
}

function getIndex(arr, val) {
    const index = 0;

    if (_.isArray(arr)) {
        return Math.max(
            arr.findIndex(([i]) => i === val),
            index,
        );
    }

    return index;
}

const TravelSummary = ({navigation, owner: initialOwner, period: initialPeriod}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';

    const prevRoutes = useRef(null);
    const prevAirports = useRef(null);

    const [currentUser, setCurrentUser] = useState(initialOwner);
    const [currentPeriod, setCurrentPeriod] = useState(initialPeriod);
    const [visibleMap, setVisibleMap] = useState(false);
    const [visibleHeatMap, setVisibleHeatMap] = useState(false);
    const [previousStatistics, setPreviousStatistics] = useState({});
    const [summary, setSummary] = useState([]);
    const [airports, setAirports] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [owners, setOwners] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [flights, setFlights] = useState(undefined);
    const [currentAirport, setCurrentAirport] = useState(null);

    const flightsModal = useRef<BottomSheet>(null);
    const bottomSheet = useRef<BottomSheet>(null);
    const onScrollIndexChanged = useMemo(
        () =>
            _.debounce((index) => {
                const {heatMap} = summary[index];

                setVisibleHeatMap(heatMap === true);
            }, 500),
        [summary],
    );

    const bottomSheetSnapTo = useCallback((position) => {
        bottomSheet.current?.snapToIndex(position);
    }, []);

    const bottomSheetSnapTop = () => bottomSheetSnapTo(2);

    const openFlights = useCallback((id) => {
        setCurrentAirport(id);
    }, []);

    const closeFlights = useCallback(() => {
        setCurrentAirport(null);
        if (prevRoutes.current) {
            setRoutes(prevRoutes.current);
        }
        if (prevAirports.current) {
            setAirports(prevAirports.current);
        }
    }, [prevRoutes, prevAirports]);

    useEffect(() => {
        if (_.isObject(flights)) {
            flightsModal.current?.snapToIndex(0);
            bottomSheetSnapTo(1);
        } else {
            flightsModal.current?.snapToIndex(-1);
        }
    }, [flights, bottomSheetSnapTo]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisibleMap(true);
        }, 250);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        setFlights(airports.find(({key}) => key === currentAirport));
    }, [currentAirport, airports]);

    const getTravelSummary = useCallback(() => {
        async function getTravelSummary(owner, period) {
            const {data} = await TimelineService.getTravelSummary(owner, period);

            if (_.isObject(data)) {
                const {
                    currentUser,
                    currentPeriod,
                    linkMailbox,
                    noData,
                    needAwPlus,
                    owners,
                    periods,
                    airlines,
                    airports,
                    routes,
                    countries,
                    flightStat,
                    locationStat,
                    aroundTheWorld,
                    distance,
                    comparedTo,
                    prevDiff,
                } = data;

                setOwners(owners);
                setPeriods(periods);

                setCurrentUser(currentUser);
                setCurrentPeriod(currentPeriod);

                setAirports(airports);
                setRoutes(routes);
                setCountries(countries);

                prevRoutes.current = routes;
                prevAirports.current = airports;

                const summary = [];

                if (!noData && !needAwPlus) {
                    if (_.isObject(flightStat)) {
                        summary.push({flightStat, color: 'green'});
                    }
                    if (linkMailbox) {
                        summary.push({linkMailbox});
                    }
                    if (_.isObject(locationStat)) {
                        summary.push({locationStat, color: 'blue'});
                    }
                    if (_.isEmpty(airports) === false) {
                        summary.push({airports});
                    }
                    if (_.isEmpty(countries) === false) {
                        summary.push({countries, heatMap: true});
                    }
                    if (_.isEmpty(airlines) === false) {
                        summary.push({airlines});
                    }

                    summary.push({aroundTheWorld, distance, color: 'orange'});
                }

                if (needAwPlus) {
                    summary.push({needAwPlus});
                }

                if (noData && !needAwPlus) {
                    summary.push({noData, linkMailbox: true});
                }

                setSummary(summary);

                if (_.isObject(prevDiff)) {
                    setPreviousStatistics({...prevDiff, comparedTo});
                } else {
                    setPreviousStatistics({});
                }
            }
        }

        getTravelSummary(currentUser, currentPeriod);
    }, [currentUser, currentPeriod]);

    const renderCardCarouselItem = useCallback(
        ({item, index}) =>
            renderCarouselCard({item, index, previousStatistics, theme, reload: getTravelSummary, bottomSheetSnapTo: bottomSheetSnapTop}),
        [theme, previousStatistics, bottomSheetSnapTo, getTravelSummary],
    );

    useEffect(() => {
        getTravelSummary();
    }, [currentUser, currentPeriod]);

    return (
        <View style={[styles.flex1, {backgroundColor: isDark ? DarkColors.bg : Colors.white}]}>
            {visibleMap && (
                <TravelSummaryMap
                    airports={airports}
                    countries={countries}
                    routes={routes}
                    visibleHeatMap={visibleHeatMap}
                    bottomSheet={bottomSheet}
                    openFlights={openFlights}
                    currentAirport={currentAirport}
                    theme={theme}
                />
            )}
            <HeaderButtons
                onClose={navigation.goBack}
                owners={owners}
                periods={periods}
                currentUser={getIndex(owners, currentUser)}
                currentPeriod={getIndex(periods, currentPeriod)}
                setCurrentUser={setCurrentUser}
                setCurrentPeriod={setCurrentPeriod}
            />
            <BottomSheetSummary ref={bottomSheet} data={summary} renderItem={renderCardCarouselItem} onScrollIndexChanged={onScrollIndexChanged} />
            <BottomSheetFlights ref={flightsModal} onClose={closeFlights} data={flights} />
        </View>
    );
};

const TravelSummaryScreen = ({route, navigation}) => {
    const owner = parseInt(route.params?.owner, 10) || null;
    const period = parseInt(route.params?.period, 10) || 1;

    return <TravelSummary route={route} navigation={navigation} owner={owner} period={period} />;
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    text: {
        fontFamily: Fonts.regular,
    },
    indicators: {
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        height: 120,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    comparedTo: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
});

export {TravelSummaryScreen};
