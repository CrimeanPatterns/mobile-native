/* eslint-disable no-underscore-dangle */
import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import {isIOS} from '../../app/helpers/device';
import API, {BASE_URL} from '../../app/services/api';
import EventEmitter from '../../app/services/eventEmitter';
import GlobalError, {httpErrors} from '../../app/services/globalError';
import Translator from '../../app/services/translator';

const nock = require('nock');

nock.disableNetConnect();

const testGlobalError = (code, error) => {
    const requestUrl = '/test';
    const scope = nock(BASE_URL).persist().get(requestUrl).reply(code, {error});
    const showMessage = jest.spyOn(GlobalError, 'showMessage');

    return API.get(requestUrl, {retry: 1}).catch((rejection) => {
        const {
            response: {status},
        } = rejection;

        expect(showMessage).toBeCalledTimes(1);
        expect(showMessage).toBeCalledWith(error || httpErrors[status]);
        expect(status).toBe(code);

        scope.done();

        showMessage.mockReset();
        showMessage.mockRestore();
    });
};

describe('API', () => {
    beforeEach(() => {
        jest.setTimeout(30000);
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test('default headers', async () => {
        const scopes = [nock(BASE_URL).get('/data').reply(200, {})];

        const deviceToken = await DeviceInfo.getDeviceToken();
        const response = await API.get('/data');
        const {config} = response;
        const {headers} = config;

        expect(headers['x-aw-version']).toBe(DeviceInfo.getVersion());
        // eslint-disable-next-line no-undef
        expect(headers['x-aw-platform']).toBe(Platform.OS);
        expect(headers['accept-timezone']).toBe(String(-new Date().getTimezoneOffset() / 60));
        expect(headers['accept-language']).toBe(Translator.getLocale());
        expect(headers['x-aw-device-uuid']).toBe(DeviceInfo.getUniqueId());
        if (isIOS) {
            expect(headers['x-aw-device-token']).toBe(deviceToken);
        }
        scopes.forEach((s) => s.done());
    });

    test('default config', async () => {
        const scopes = [nock(BASE_URL).get('/data').reply(200, {})];

        const response = await API.get('/data');
        const {config} = response;

        expect(config.retry).toBe(3);
        expect(config.timeout).toBe(30000);
        expect(config.baseURL).toBe(BASE_URL);

        scopes.forEach((s) => s.done());
    });

    test('set config, retry: 5, timeout: 60000', async () => {
        const scopes = [nock(BASE_URL).get('/data').reply(200, {})];

        const response = await API.get('/data', {retry: 5, timeout: 60000});
        const {config} = response;

        expect(config.retry).toBe(5);
        expect(config.timeout).toBe(60000);

        scopes.forEach((s) => s.done());
    });

    // No more retries for 500 response code
    /**
    test('retries interceptor, default 3 retries, all response 500', () => {
        const scopes = [nock(BASE_URL).persist().get('/data').reply(500, {})];

        return API.get('/data').catch((error) => {
            expect(error.config.__retryCount).toBe(3);
            expect(error.response.status).toBe(500);
            scopes.forEach((s) => s.done());
        });
    });

    test('retries interceptor, 5 retries, all response 500', () => {
        const scopes = [nock(BASE_URL).persist().get('/data').reply(500, {})];

        return API.get('/data', {retry: 5}).catch((error) => {
            expect(error.config.__retryCount).toBe(5);
            expect(error.response.status).toBe(500);
            scopes.forEach((s) => s.done());
        });
    });

    test('retries interceptor, 2 failed retries, 1 success', () => {
        const scopes = [
            nock(BASE_URL).get('/data').reply(500, {}),
            nock(BASE_URL).get('/data').reply(500, {}),
            nock(BASE_URL).get('/data').reply(200, {success: true}),
        ];

        return API.get('/data').then((response) => {
            expect(response.config.__retryCount).toBe(2);
            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            scopes.forEach((s) => s.done());
        });
    });
    */

    test('retries interceptor, retries stopped on first 403 response', () => {
        const scopes = [nock(BASE_URL).persist().get('/data').reply(403, {})];

        return API.get('/data').catch((error) => {
            // expect(error.config.__isRetryRequest).toBe(undefined);
            expect(error.config.__retryCount).toBe(undefined);
            expect(error.response.status).toBe(403);
            scopes.forEach((s) => s.done());
        });
    });

    test('xsrf interceptor', () => {
        const scopes = [
            nock(BASE_URL).get('/data').reply(403, {}, {'x-xsrf-failed': true, 'x-xsrf-token': 'qwerty'}),
            nock(BASE_URL).get('/data').reply(200, {success: true}),
        ];

        return API.get('/data').then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.config.headers['x-xsrf-token']).toEqual('qwerty');
            scopes.forEach((s) => s.done());
        });
    });

    test('logout interceptor', () => {
        const scopes = [nock(BASE_URL).get('/data').reply(403, {logout: true})];
        const emit = jest.spyOn(EventEmitter, 'emit');

        return API.get('/data').catch(() => {
            expect(emit).toHaveBeenCalledWith('doLogout');
            scopes.forEach((s) => s.done());
        });
    });

    test('secure token exchange', () => {
        const scopes = [
            // request x-aw-secure-value from client
            nock(BASE_URL).get('/login_check').reply(403, {}, {'x-aw-secure-token': 'x_aw_secure_token'}),
            // x-aw-secure-value from prev request not valid, create new x-aw-secure-value on client
            nock(BASE_URL).get('/login_check').reply(403, {}, {'x-aw-secure-token': 'x_aw_secure_token2'}),
            // x-aw-secure-value passed
            nock(BASE_URL).get('/login_check').reply(200, {success: true}),
        ];

        return API.get('/login_check').then((response) => {
            expect(response.data.success).toBe(true);
            scopes.forEach((s) => s.done());
        });
    });

    test('working all interceptors', () => {
        const scopes = [
            nock(BASE_URL).get('/login_check').reply(403, {}, {'x-aw-secure-token': 'c94a1c6938e1083da5f'}),
            nock(BASE_URL).get('/login_check').reply(
                403,
                {},
                {
                    'x-aw-secure-token': '8e1083da5fc94a1c693',
                    'x-aw-secure-value': 'c94a1c6938e1083da5f',
                    'x-xsrf-failed': true,
                    'x-xsrf-token': 'qwerty',
                },
            ),
            nock(BASE_URL).get('/login_check').reply(200, {success: true}),
        ];

        return API.get('/login_check').then((response) => {
            expect(response.status).toBe(200);
            expect(response.data.success).toBe(true);
            expect(response.config.headers['x-xsrf-token']).toEqual('qwerty');
            scopes.forEach((s) => s.done());
        });
    });

    test('global error, custom message', () => testGlobalError(429, 'Custom error message'));

    test('all global errors', () => [403, 404, 500, 429].forEach(testGlobalError));
});
