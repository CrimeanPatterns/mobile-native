import React from 'react';

import {useTheme} from '../../../theme';
import {TripsStackScreenFunctionalComponent} from '../../../types/navigation';
import {AccountAutoLogin} from '../../accounts/account/autologin';

class ItineraryAutologin extends AccountAutoLogin {
    state = {};

    // eslint-disable-next-line class-methods-use-this
    onRequestLocalPassword() {}

    start() {
        const {route} = this.props;
        const {itineraryId, type} = route.params;

        this.autoLogin.startItineraryAutologin(itineraryId, type);
    }
}

export const ItineraryAutologinScreen: TripsStackScreenFunctionalComponent<'ItineraryAutologin'> = ({navigation, route}) => {
    const theme = useTheme();

    return <ItineraryAutologin navigation={navigation} route={route} theme={theme} />;
};

ItineraryAutologinScreen.navigationOptions = () => ({title: ''});
