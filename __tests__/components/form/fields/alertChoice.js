import {render} from '@testing-library/react-native';
import React from 'react';

import AlertChoice from '../../../../app/components/form/field/alertChoice';

const props = {
    testID: 'sex',
    label: 'Sex',
    onChangeValue: () => {},
    value: 'm',
    choices: [
        {value: 'm', label: 'Male'},
        {value: 'f', label: 'Female'},
    ],
    theme: 'light',
};

it('alert choice, renders default', () => {
    const field = render(
        <AlertChoice
            {...props}
            alerts={{
                m: 'Alert message',
            }}
        />,
    ).toJSON();

    expect(field).toMatchSnapshot();
});
