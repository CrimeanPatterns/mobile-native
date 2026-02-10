import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';

import Switch from '../../../../app/components/form/field/switch';
import {isIOS} from '../../../../app/helpers/device';

const props = {
    label: 'Agree',
    testID: 'switcher',
    onChangeValue: () => {},
    theme: 'light',
};

it('switch, renders default', () => {
    const field = render(<Switch {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('switch, renders checked', () => {
    const field = render(<Switch {...props} value={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('switch, renders unchecked', () => {
    const field = render(<Switch {...props} value={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('switch, renders hint', () => {
    const field = render(<Switch {...props} hint={'Test hint'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('switch, renders disabled', () => {
    const field = render(<Switch {...props} disabled={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('switch, renders custom styles', () => {
    let field = render(
        <Switch
            {...props}
            hint={'Test hint'}
            customStyle={{
                container: {
                    base: {margin: 10},
                },
                label: {
                    base: {color: 'red'},
                },
                hint: {
                    base: {color: 'blue'},
                },
            }}
        />,
    ).toJSON();

    expect(field).toMatchSnapshot('base');

    field = render(
        <Switch
            {...props}
            hint={'Test hint'}
            disabled={true}
            customStyle={{
                container: {
                    base: {margin: 10},
                    disabled: {margin: 11},
                },
                label: {
                    base: {color: 'red'},
                    disabled: {color: '#001122'},
                },
                hint: {
                    base: {color: 'blue'},
                    disabled: {color: '#001122'},
                },
            }}
        />,
    ).toJSON();

    expect(field).toMatchSnapshot('disabled');
});

if (isIOS) {
    it('switch, toggle to ON', () => {
        const onChange = jest.fn();
        const field = render(<Switch {...props} value={false} onChangeValue={onChange} />);
        const switcher = field.getByA11yLabel(props.label);

        fireEvent(switcher, 'onValueChange', {});
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('switch, toggle to OFF', () => {
        const onChange = jest.fn();
        const field = render(<Switch {...props} value={true} onChangeValue={onChange} />);
        const switcher = field.getByA11yLabel(props.label);

        fireEvent(switcher, 'onValueChange', {});
        expect(onChange).toHaveBeenCalledWith(false);
    });
}
