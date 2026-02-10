import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';

import {testChangeTheme, withDarkTheme, withLightTheme} from '../../__utils__/theme';
import MicrosoftButton, {signInMicrosoft} from '../../../app/components/oauth/microsoft';
import {BASE_URL} from '../../../app/services/api';

const nock = require('nock');

it('<MicrosoftButton/>, renders default', () => {
    const field = render(withLightTheme(<MicrosoftButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<MicrosoftButton/>, change theme', () => {
    const onPress = jest.fn();
    const button = <MicrosoftButton onPress={onPress} />;

    testChangeTheme(button);
});

it('<MicrosoftButton/>, render, dark theme', () => {
    const field = render(withDarkTheme(<MicrosoftButton onPress={() => {}} />)).toJSON();

    expect(field).toMatchSnapshot();
});

it('<MicrosoftButton/>, onPress is invoked', () => {
    const onPress = jest.fn();
    const field = render(withLightTheme(<MicrosoftButton onPress={onPress} />));
    const button = field.getByTestId('oauth-microsoft');

    fireEvent(button, 'onPress');
    expect(onPress).toHaveBeenCalledTimes(1);
});

it('signIn(microsoft) works', async () => {
    const request = nock(BASE_URL).post('/oauth/microsoft').reply(200, {consentUrl: 'https://api.login.microsoft.com'});
    const response = await signInMicrosoft();

    expect(response).toMatchObject({microsoft: {code: 'y6wj8ra'}});

    request.done();
});
