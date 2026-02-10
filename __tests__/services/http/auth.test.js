import MockAdapter from 'axios-mock-adapter';

import API from '../../../app/services/api';
import Auth from '../../../app/services/http/auth';
import Session from '../../../app/services/session';

const mock = new MockAdapter(API);

jest.mock('../../../app/services/session', () => {
    const properties = {
        authorized: null,
    };

    return {
        setProperty: (property, value) => (properties[property] = value),
        getProperty: (property) => properties[property],
        authorized: () => properties.authorized,
    };
});

describe('Auth', () => {
    beforeEach(() => {
        Session.setProperty('authorized', null);
    });

    afterEach(() => {
        mock.reset();
    });

    test('is not logged in', async () => {
        mock.onGet('/login_status').replyOnce(200, {authorized: false});

        expect(Session.authorized()).toBe(null);

        try {
            await Auth.isLoginIn();
        } catch (e) {
            expect(Session.authorized()).toBe(false);
        }
    });

    test('is logged in', () => {
        mock.onGet('/login_status').replyOnce(200, {authorized: true});
        expect(Session.authorized()).toBe(null);

        return Auth.isLoginIn().then(() => {
            expect(Session.authorized()).toBe(true);
        });
    });

    test('login', () => {
        mock.onGet('/login_status').replyOnce(200, {authorized: false}, {'x-scripted': '42+18'});
        mock.onPost('/login_check').replyOnce(200, {});
        jest.spyOn(API, 'post');

        return Auth.login({login: 'test', password: 'test'}).then(() => {
            expect(API.post).toBeCalledWith(
                '/login_check',
                {
                    _remember_me: 1,
                    login: 'test',
                    password: 'test',
                },
                {
                    headers: {
                        'x-scripted': 60,
                    },
                },
            );
        });
    });
});
