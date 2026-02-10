import _ from 'lodash';
import React from 'react';
import {Polygon} from 'react-native-maps';

import countriesData from '../../assets/countries.geo.json';
import {Colors} from '../../styles';
import {getRGBColor, makeOverlays} from './utils';

const HeatMap = ({countries, theme}) => {
    if (_.isEmpty(countries)) {
        return null;
    }
    const countryCodes = countries.map((country) => country.key);
    const countriesPolygons = countriesData.features.filter((region) => countryCodes.includes(region.properties.ISO_A2));
    const overlays = makeOverlays(countriesPolygons);
    const {value: countriesMax} = countries[0];
    const {value: countriesMin} = countries[countries.length - 1];

    return (
        <>
            {overlays.map((overlay, index) => {
                if (overlay.type === 'polygon') {
                    const {
                        feature: {
                            properties: {ISO_A2},
                        },
                    } = overlay;

                    const {value} = countries.find((country) => country.key === ISO_A2);

                    return (
                        <Polygon
                            key={index}
                            coordinates={overlay.coordinates}
                            holes={overlay.holes}
                            fillColor={getRGBColor(value, countriesMin, countriesMax, theme)}
                            strokeWidth={1}
                            strokeColor={theme === 'dark' ? Colors.grayLight : Colors.blue}
                        />
                    );
                }

                return null;
            })}
        </>
    );
};

export {HeatMap};
