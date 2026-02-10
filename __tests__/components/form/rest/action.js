import React from 'react';
import renderer from 'react-test-renderer';

import Action from '../../../../app/components/form/rest/action';

const props = {
    text: 'Action',
    link: 'http://',
    method: 'GET',
    theme: 'light',
};

jest.mock('../../../../app/services/api', () => ({
    get: jest.fn(),
}));

it('action, renders default', () => {
    const field = renderer.create(<Action {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});
