import {createNavigationContainerRef, getActionFromState} from '@react-navigation/native';
import _ from 'lodash';

import {getStateFromPath, LinkingConfig, PathConfig} from '../navigation/linking';

export const navigationRef = createNavigationContainerRef();

// Gets the current screen from navigation state
export const getActiveRoute: any = (state: any) => {
    const route = state?.routes[state?.index ?? 0];

    if (route?.state) {
        // Dive into nested navigators
        return getActiveRoute(route.state);
    }

    return route;
};

export const getActiveRouteName = (state: any): string => getActiveRoute(state)?.name;

export function navigate(name: string, params?: {[key: string]: unknown}): void {
    if (navigationRef.isReady()) {
        // @ts-ignore
        navigationRef.navigate(name, params);
    }
}

function parsePath(path, params) {
    const parsedPath = path.replace(/:([a-zA-Z0-9_]+\?{0,1})/g, (_, key) => {
        const value = params[key];

        return value !== undefined ? value : ``;
    });

    return parsedPath.replace(/\/\//g, `/`);
}

export function navigateByPath(
    path: (typeof PathConfig)[keyof typeof PathConfig],
    params: {[key: string]: unknown} = {},
    extendParams = false,
): boolean {
    if (navigationRef.isReady()) {
        const state = getStateFromPath(parsePath(path, params));
        const route = getActiveRoute(state);

        if (route) {
            if (!_.isEmpty(params)) {
                if (extendParams) {
                    route.params = {...route.params, ...params};
                } else {
                    route.params = params;
                }
            }
            // @ts-ignore
            navigationRef.dispatch(getActionFromState(state, LinkingConfig));
            console.log('navigateByPath()', path, state, route);

            return true;
        }
    }
    return false;
}

export function resetByPath(path: (typeof PathConfig)[keyof typeof PathConfig], params?: {[key: string]: unknown}): boolean {
    if (navigationRef.isReady()) {
        const state = getStateFromPath(parsePath(path, params));
        const route = getActiveRoute(state);

        if (route) {
            if (params) {
                route.params = params;
            } // @ts-ignore
            navigationRef.dispatch(getActionFromState(state));
            console.log('resetByPath()', {path, state, route});
            return true;
        }
    }
    return false;
}

export function dispatch(action: any): void {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(action);
    }
}

export default {
    dispatch,
    navigate,
};
