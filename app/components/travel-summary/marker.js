import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {Colors, Fonts} from '../../styles';
import {ThemeColors} from '../../theme';
import Icon from '../icon';

const AirportMarker = React.memo(({name, theme}) => (
    <View style={{height: 32, width: 32}}>
        <Icon name='location' color={ThemeColors[theme].blue} size={32} />
        <View style={{position: 'absolute', top: 5, left: 1, height: 32, width: 32}}>
            <Text style={{color: Colors.white, fontFamily: Fonts.bold, fontSize: 7, alignSelf: 'center'}}>{name}</Text>
        </View>
    </View>
));

AirportMarker.propTypes = {
    name: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
};

// eslint-disable-next-line react/display-name,react/prop-types
const CircleMarker = React.memo(({theme}) => <View style={{backgroundColor: ThemeColors[theme].blue, width: 10, height: 10, borderRadius: 5}} />);

export {AirportMarker, CircleMarker};
