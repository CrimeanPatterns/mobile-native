import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';

import {Warning} from '../../components/warning';

// eslint-disable-next-line react/display-name,react/prop-types
const TimelineEmptyList = React.memo(
    ({hasPastTravel}) => (
        <View>
            <Warning
                text={
                    hasPastTravel
                        ? Translator.trans('trips.no-trips.text', {}, 'messages')
                        : Translator.trans('trips.list.no-trips.titile', {}, 'mobile')
                }
            />
        </View>
    ),
    (prevProps, nextProps) => prevProps.hasPastTravel === nextProps.hasPastTravel,
);

TimelineEmptyList.propTypes = {
    hasPastTravel: PropTypes.bool,
};

export default TimelineEmptyList;
