import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';

import {testChangeTheme, withDarkTheme, withLightTheme} from '../../__utils__/theme';
import YahooButton, {signInYahoo} from '../../../app/components/oauth/yahoo';
import {BASE_URL} from '../../../app/services/api';

const nock = require('nock');

it('<YahooButton/>, renders default', () => {
    const field = render(withLightTheme(<YahooButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<YahooButton/>, change theme', () => {
    const onPress = jest.fn();
    const button = <YahooButton onPress={onPress} />;

    testChangeTheme(button);
});

it('<YahooButton/>, render, dark theme', () => {
    const field = render(withDarkTheme(<YahooButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<YahooButton/>, onPress is invoked', () => {
    const onPress = jest.fn();
    const field = render(withLightTheme(<YahooButton onPress={onPress} />));
    const button = field.getByTestId('oauth-yahoo');

    fireEvent(button, 'onPress');
    expect(onPress).toHaveBeenCalledTimes(1);
});

it.skip('signInYahoo() works', async () => {
    const request = nock(BASE_URL).post('/oauth/yahoo').reply(200, {consentUrl: 'https://api.login.yahoo.com'});
    const response = await signInYahoo();

    expect(response).toMatchObject({yahoo: {code: 'y6wj8ra'}});

    request.done();
});
