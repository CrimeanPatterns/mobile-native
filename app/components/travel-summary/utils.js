import fromColor from 'color';

import {Colors} from '../../styles';

export const makeOverlays = (features) => {
    const points = features
        .filter((f) => f.geometry && (f.geometry.type === 'Point' || f.geometry.type === 'MultiPoint'))
        .map((feature) => makeCoordinates(feature).map((coordinates) => makeOverlay(coordinates, feature)))
        .reduce(flatten, [])
        .map((overlay) => ({...overlay, type: 'point'}));

    const lines = features
        .filter((f) => f.geometry && (f.geometry.type === 'LineString' || f.geometry.type === 'MultiLineString'))
        .map((feature) => makeCoordinates(feature).map((coordinates) => makeOverlay(coordinates, feature)))
        .reduce(flatten, [])
        .map((overlay) => ({...overlay, type: 'polyline'}));

    const multipolygons = features
        .filter((f) => f.geometry && f.geometry.type === 'MultiPolygon')
        .map((feature) => makeCoordinates(feature).map((coordinates) => makeOverlay(coordinates, feature)))
        .reduce(flatten, []);

    const polygons = features
        .filter((f) => f.geometry && f.geometry.type === 'Polygon')
        .map((feature) => makeOverlay(makeCoordinates(feature), feature))
        .reduce(flatten, [])
        .concat(multipolygons)
        .map((overlay) => ({...overlay, type: 'polygon'}));

    return points.concat(lines).concat(polygons);
};

const makeCoordinates = (feature) => {
    const g = feature.geometry;

    if (g.type === 'Point') {
        return [makePoint(g.coordinates)];
    } else if (g.type === 'MultiPoint') {
        return g.coordinates.map(makePoint);
    } else if (g.type === 'LineString') {
        return [makeLine(g.coordinates)];
    } else if (g.type === 'MultiLineString') {
        return g.coordinates.map(makeLine);
    } else if (g.type === 'Polygon') {
        return g.coordinates.map(makeLine);
    } else if (g.type === 'MultiPolygon') {
        return g.coordinates.map((p) => p.map(makeLine));
    } else {
        return [];
    }
};

const makePoint = (c) => ({latitude: c[1], longitude: c[0]});

const makeLine = (l) => l.map(makePoint);

const flatten = (prev, curr) => prev.concat(curr);

const makeOverlay = (coordinates, feature) => {
    let overlay = {
        feature,
    };

    if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        overlay.coordinates = coordinates[0];
        if (coordinates.length > 1) {
            overlay.holes = coordinates.slice(1);
        }
    } else {
        overlay.coordinates = coordinates;
    }
    return overlay;
};

function transformValue(value, sourceMin, sourceMax, destMin, destMax) {
    return ((value - sourceMin) / (sourceMax - sourceMin)) * (destMax - destMin) + destMin;
}

export function getRGBColor(value, countriesMin, countriesMax, theme) {
    const isDark = theme === 'dark';
    let r;
    let g;
    let b;

    function toString(...args) {
        return fromColor(...args)
            .alpha(0.9)
            .rgb()
            .string();
    }

    let maxBaseColor = [38, 74, 119];
    let minBaseColor = [255 * 0.32, 255 * 0.62, 255];

    if (isDark) {
        maxBaseColor = fromColor(Colors.grayLight).darken(0.5).rgb().color;
        minBaseColor = fromColor(Colors.grayLight).rgb().color;
    }

    if (countriesMax > countriesMin) {
        r = transformValue(value, countriesMin, countriesMax, minBaseColor[0], maxBaseColor[0]);
        g = transformValue(value, countriesMin, countriesMax, minBaseColor[1], maxBaseColor[1]);
        b = transformValue(value, countriesMin, countriesMax, minBaseColor[2], maxBaseColor[2]);
    } else {
        return toString(maxBaseColor);
    }

    return toString([r, g, b]);
}
