import _ from 'lodash';
import React, {ReactElement, RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StatusBar, StyleSheet, useWindowDimensions, View} from 'react-native';
import MapView from 'react-native-map-clustering';
import {Marker, Polyline} from 'react-native-maps';

import {isAndroid} from '../../helpers/device';
import {Fonts} from '../../styles';
import {ThemeColors} from '../../theme';
import {MAP_DARK_THEME} from '../storeLocation/themes/dark';
import {HeatMap} from './heatMap';
import {AirportMarker} from './marker';

const INITIAL_REGION = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 60,
    longitudeDelta: 0.1,
};

const markerCenterOffset = {x: 0, y: -10};

const measureElement = (element): Promise<{x: number; y: number}> =>
    new Promise((resolve) => {
        element.measureInWindow((x, y) => resolve({x, y}));
    });

function getStatusBarHeight() {
    // @ts-ignore
    return parseInt(StatusBar.currentHeight, 10) || 0;
}

const moveMapCamera = async (map, centerPointY, coordinate) => {
    const camera = await map.getCamera();
    const {center: centerCamera} = camera;
    const centerPointCamera = await map.pointForCoordinate(centerCamera);
    const {x, y} = await map.pointForCoordinate(coordinate);
    const offsetY = centerPointY - y;
    const newY = centerPointCamera.y - offsetY - getStatusBarHeight();
    const newPosition = await map.coordinateForPoint({x, y: newY});

    map.animateCamera({center: newPosition});
};

const emptyMarkers = [];

const TravelSummaryMap = ({airports, routes, countries, visibleHeatMap, theme, openFlights, currentAirport}) => {
    const [mapReady, setMapReady] = useState(false);
    const [centerPointY, setCenterPointY] = useState(0);
    const dimensions = useWindowDimensions();
    const centerPoint = useRef<View>(null);
    const mapRef = useRef<MapView>(null);
    const markers = useMemo(() => {
        if (_.isArray(airports)) {
            return airports.map((airport) => {
                const {
                    payload: {latitude, longitude, segments},
                    ...rest
                } = airport;

                return {...rest, segments, coordinate: {latitude, longitude}};
            });
        }

        return emptyMarkers;
    }, [airports]);
    const onMarkerPress = useCallback(
        (e) => {
            const {coordinate, id} = e.nativeEvent;

            const open = async () => {
                await moveMapCamera(mapRef.current, centerPointY, coordinate);
                if (openFlights) {
                    openFlights(id);
                }
            };

            open();
        },
        [centerPointY, openFlights],
    );

    const onMapReady = useCallback(() => {
        setMapReady(true);
    }, []);

    useEffect(() => {
        if (mapReady) {
            const getCenterPoint = async () => {
                const {y: centerPointY} = await measureElement(centerPoint.current);

                setCenterPointY(centerPointY);
            };

            getCenterPoint();
        }
    }, [mapReady]);

    useEffect(() => {
        if (mapReady && centerPointY) {
            if (_.isEmpty(markers) === false) {
                let index = 0;

                if (currentAirport) {
                    index = Math.max(
                        index,
                        markers.findIndex((point) => point.key === currentAirport),
                    );
                }
                moveMapCamera(mapRef.current, centerPointY, markers[index].coordinate);
            }
        }
    }, [mapReady, airports, centerPointY, currentAirport, markers]);

    // const getInitialRegion = useCallback(() => {
    //     if (_.isEmpty(markers)) {
    //         return INITIAL_REGION;
    //     }
    //
    //     return {
    //         ...INITIAL_REGION,
    //         ...markers[0].coordinate,
    //     };
    // }, [markers]);

    return (
        <>
            <MapView
                animationEnabled={false}
                ref={mapRef}
                onMapReady={onMapReady}
                initialRegion={INITIAL_REGION}
                rotateEnabled={false}
                pitchEnabled={false}
                moveOnMarkerPress={false}
                radius={20}
                style={styles.flex1}
                customMapStyle={isAndroid && theme === 'dark' ? MAP_DARK_THEME : undefined}
                clusterColor={ThemeColors[theme].blue}
                clusterFontFamily={Fonts.regular}>
                {mapReady &&
                    !visibleHeatMap &&
                    _.isArray(markers) &&
                    markers.map((marker) => {
                        const {coordinate, key: name} = marker;

                        return (
                            <Marker identifier={name} centerOffset={markerCenterOffset} onPress={onMarkerPress} coordinate={coordinate} key={name}>
                                <AirportMarker name={name} theme={theme} />
                            </Marker>
                        );
                    })}

                {mapReady &&
                    !visibleHeatMap &&
                    _.isArray(routes) &&
                    routes.map(({arr, dep}) => (
                        <Polyline
                            key={`route-${arr.latitude}-${arr.longitude}-${dep.latitude}-${dep.longitude}`}
                            coordinates={[arr, dep]}
                            strokeColor='rgba(255,0,0,0.5)'
                            strokeWidth={2}
                            geodesic
                        />
                    ))}
                {mapReady && visibleHeatMap && <HeatMap countries={countries} theme={theme} />}
            </MapView>
            <View ref={centerPoint} style={[styles.centerPoint, {top: (dimensions.height * 0.45) / 2, left: dimensions.width / 2}]} />
        </>
    );
};

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    centerPoint: {
        width: 1,
        height: 1,
        position: 'absolute',
        backgroundColor: 'transparent',
    },
});

export {TravelSummaryMap};
