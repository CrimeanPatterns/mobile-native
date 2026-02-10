import {getTabBarVisible} from '../../../helpers/tabBar';

export const defaultForceSafeArea = {
    top: 'never',
};

export default function getForceSafeAreaSettings(navigation) {
    return {
        ...defaultForceSafeArea,
        bottom: getTabBarVisible(navigation) ? 'never' : 'always',
    };
}
