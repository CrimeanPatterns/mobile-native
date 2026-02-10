import _ from 'lodash';
import url from 'url';

import {API_URL} from '../services/api';
import {navigateByPath} from '../services/navigator';
import {trackEmtr} from '../utils/trackEmtr';
import {trackRef} from '../utils/trackRef';
import {openExternalUrl} from './navigation';

export function handleOpenUrl(event, fallback?: (event: unknown) => void, params?: Record<string, unknown>, extendParams = false) {
    let handled = false;
    const {url: initialUrl} = event;
    const {path, query} = url.parse(initialUrl, true);

    if (_.isString(path) && _.startsWith(initialUrl, API_URL)) {
        if (_.startsWith(path, `/blog/link/`)) {
            openExternalUrl({url: initialUrl});
            return;
        }
        if (_.isObject(query)) {
            // @ts-ignore

            const {track_click, emtr} = query;
            // @ts-ignore
            let {ref} = query;

            // @ts-ignore
            ref = parseInt(ref, 10);

            if (_.isNaN(ref) === false) {
                trackRef({ref, initialUrl, track_click});
            }

            if (_.isString(emtr)) {
                trackEmtr(emtr, initialUrl);
            }
        }

        try {
            // @ts-ignore
            handled = navigateByPath(path, params, extendParams);
            // eslint-disable-next-line no-empty
        } catch {}
    }

    if (!handled && _.isFunction(fallback)) {
        return fallback(event);
    }

    return undefined;
}

export function handleOpenUrlAnyway(event) {
    // @ts-ignore
    return handleOpenUrl(event, openExternalUrl);
}
