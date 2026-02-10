import {fireEvent, render} from '@testing-library/react-native';
import React from 'react';

import Choice from '../../../../app/components/form/field/choice';
import {isIOS} from '../../../../app/helpers/device';

const props = {
    testID: 'sex',
    label: 'Sex',
    onChangeValue: jest.fn(),
    value: 'm',
    choices: [
        {value: 'm', label: 'Male'},
        {value: 'f', label: 'Female'},
    ],
    theme: 'light',
};

if (isIOS) {
    it('choice, change value', () => {
        const {testID} = props;
        const componentProps = {...props};
        const onChangeValue = jest.fn((value) => {
            componentProps.value = value;
        });
        const {getByTestId} = render(
            <Choice
                theme={'light'}
                testID={componentProps.testID}
                label={componentProps.label}
                value={componentProps.value}
                choices={componentProps.choices}
                onChangeValue={onChangeValue}
            />,
        );

        expect(componentProps.value).toBe('m');

        fireEvent(getByTestId(`picker-${testID}-dropdown`), 'onPress');
        fireEvent(getByTestId(`picker-${testID}`), 'onValueChange', 'f');
        fireEvent(getByTestId(`picker-${testID}-done`), 'onPress');

        expect(onChangeValue).toHaveBeenCalledWith('f');
        expect(componentProps.value).toBe('f');

        fireEvent(getByTestId(`picker-${testID}-dropdown`), 'onPress');
        fireEvent(getByTestId(`picker-${testID}`), 'onValueChange', 'm');
        fireEvent(getByTestId(`picker-${testID}-done`), 'onPress');

        expect(onChangeValue).toHaveBeenCalledWith('m');
        expect(componentProps.value).toBe('m');

        fireEvent(getByTestId(`picker-${testID}-dropdown`), 'onPress');
        fireEvent(getByTestId(`picker-${testID}`), 'onValueChange', 'f');
        fireEvent(getByTestId(`picker-${testID}-cancel`), 'onPress');

        expect(onChangeValue).toHaveBeenCalledWith('f');
        expect(componentProps.value).toBe('m');
    });
}

it('choice, renders default', () => {
    const field = render(<Choice {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders required', () => {
    const field = render(<Choice {...props} required={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders not required', () => {
    const field = render(<Choice {...props} required={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders hint', () => {
    const field = render(<Choice {...props} hint={'Test hint'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders disabled', () => {
    const field = render(<Choice {...props} disabled={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders error', () => {
    const field = render(<Choice {...props} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders error with hint', () => {
    const field = render(<Choice {...props} hint={'Test hint'} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('choice, renders custom styles', () => {
    let field = render(
        <Choice
            {...props}
            hint={'Test hint'}
            customStyle={{
                container: {
                    base: {margin: 10},
                },
                label: {
                    base: {fontSize: 16},
                },
                input: {
                    base: {color: 'blue'},
                },
                hint: {
                    base: {fontSize: 15},
                },
                errorContainer: {
                    base: {margin: 11},
                },
                error: {
                    base: {color: 'blue'},
                },
            }}
        />,
    ).toJSON();

    expect(field).toMatchSnapshot('base');

    field = render(
        <Choice
            {...props}
            hint={'Test hint'}
            error={'Error'}
            customStyle={{
                container: {
                    base: {margin: 10},
                    errored: {margin: 11},
                },
                label: {
                    base: {fontSize: 16},
                    errored: {fontSize: 17},
                },
                input: {
                    base: {color: 'blue'},
                    errored: {color: 'orange'},
                },
                hint: {
                    base: {fontSize: 15},
                    errored: {fontSize: 16},
                },
                errorContainer: {
                    base: {margin: 11},
                    errored: {margin: 12},
                },
                error: {
                    base: {color: 'blue'},
                    errored: {color: 'red'},
                },
            }}
        />,
    ).toJSON();
    expect(field).toMatchSnapshot('errored');

    field = render(
        <Choice
            {...props}
            hint={'Test hint'}
            error={'Error'}
            disabled={true}
            customStyle={{
                container: {
                    base: {margin: 10},
                    errored: {margin: 11},
                    disabled: {margin: 12},
                },
                label: {
                    base: {fontSize: 16},
                    errored: {fontSize: 17},
                    disabled: {fontSize: 18},
                },
                input: {
                    base: {color: 'blue'},
                    errored: {color: 'orange'},
                    disabled: {color: 'red'},
                },
                hint: {
                    base: {fontSize: 15},
                    errored: {fontSize: 16},
                    disabled: {fontSize: 17},
                },
                errorContainer: {
                    base: {margin: 11},
                    errored: {margin: 12},
                    disabled: {margin: 13},
                },
                error: {
                    base: {color: 'blue'},
                    errored: {color: 'red'},
                    disabled: {color: 'blue'},
                },
            }}
        />,
    ).toJSON();
    expect(field).toMatchSnapshot('disabled');
});
