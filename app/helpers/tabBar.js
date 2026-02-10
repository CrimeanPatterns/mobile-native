import _ from 'lodash';

import {isIOS} from './device';

export const getTabBarVisible = (navigation) => {
    const navOpts = {}; // getActiveChildNavigationOptions(navigation.dangerouslyGetParent());

    return _.get(navOpts, 'tabBarVisible', false);
};

export const getTabBarHeight = () => (isIOS ? 50 : 56);
