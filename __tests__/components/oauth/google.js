import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';

import {testChangeTheme, withDarkTheme, withLightTheme} from '../../__utils__/theme';
import GoogleButton, {signInGoogle} from '../../../app/components/oauth/google';
import {BASE_URL} from '../../../app/services/api';

const nock = require('nock');

it('<GoogleButton/>, renders default', () => {
    const field = render(withLightTheme(<GoogleButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<GoogleButton/>, render, dark theme', () => {
    const field = render(withDarkTheme(<GoogleButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<GoogleButton/>, change theme', () => {
    const onPress = jest.fn();
    const button = <GoogleButton onPress={onPress} />;

    testChangeTheme(button);
});

it('<GoogleButton/>, onPress is invoked', () => {
    const onPress = jest.fn();
    const field = render(withLightTheme(<GoogleButton onPress={onPress} />));
    const button = field.getByTestId('oauth-google');

    fireEvent(button, 'onPress');
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('signIn(google) works', async () => {
    const request = nock(BASE_URL).post('/oauth/google').reply(200, {consentUrl: 'https://api.login.google.com'});
    const response = await signInGoogle();

    expect(response).toMatchObject({google: {serverAuthCode: 'serverAuthCode'}});

    request.done();
});
