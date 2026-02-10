import React from 'react';
import renderer from 'react-test-renderer';

import Checkbox from '../../../../app/components/form/field/checkbox';

const props = {
    label: 'Agree',
    onChangeValue: () => {},
    theme: 'light',
};

it('checkbox, renders default', () => {
    const field = renderer.create(<Checkbox {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders required', () => {
    const field = renderer.create(<Checkbox {...props} required={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders not required', () => {
    const field = renderer.create(<Checkbox {...props} required={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders checked', () => {
    const field = renderer.create(<Checkbox {...props} value={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders unchecked', () => {
    const field = renderer.create(<Checkbox {...props} value={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders hint', () => {
    const field = renderer.create(<Checkbox {...props} hint={'Test hint'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders disabled', () => {
    const field = renderer.create(<Checkbox {...props} disabled={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders error', () => {
    const field = renderer.create(<Checkbox {...props} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders error with hint', () => {
    const field = renderer.create(<Checkbox {...props} hint={'Test hint'} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders small label', () => {
    const field = renderer.create(<Checkbox {...props} smallLabel={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('checkbox, renders custom styles', () => {
    let field = renderer
        .create(
            <Checkbox
                {...props}
                hint={'Test hint'}
                customStyle={{
                    container: {
                        base: {margin: 10},
                    },
                    label: {
                        base: {color: 'red'},
                    },
                    checkboxContainer: {
                        base: {margin: 20},
                    },
                    hint: {
                        base: {color: 'blue'},
                    },
                }}
            />,
        )
        .toJSON();

    expect(field).toMatchSnapshot('base');

    field = renderer
        .create(
            <Checkbox
                {...props}
                hint={'Test hint'}
                error={'Error'}
                customStyle={{
                    container: {
                        base: {margin: 10},
                        errored: {margin: 11},
                    },
                    label: {
                        base: {color: 'red'},
                        errored: {color: '#001122'},
                    },
                    checkboxContainer: {
                        base: {margin: 20},
                        errored: {margin: 30},
                    },
                    hint: {
                        base: {color: 'blue'},
                        errored: {color: '#001122'},
                    },
                    errorContainer: {
                        base: {marginTop: 10},
                    },
                    error: {
                        base: {fontSize: 20},
                    },
                }}
            />,
        )
        .toJSON();

    expect(field).toMatchSnapshot('errored');

    field = renderer
        .create(
            <Checkbox
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
                        base: {color: 'red'},
                        errored: {color: '#001122'},
                        disabled: {color: '#001123'},
                    },
                    checkboxContainer: {
                        base: {margin: 20},
                        errored: {margin: 30},
                        disabled: {margin: 40},
                    },
                    hint: {
                        base: {color: 'blue'},
                        errored: {color: '#001122'},
                        disabled: {color: '#001123'},
                    },
                    errorContainer: {
                        base: {marginTop: 10},
                        disabled: {marginTop: 20},
                    },
                    error: {
                        base: {fontSize: 20},
                        disabled: {fontSize: 25},
                    },
                }}
            />,
        )
        .toJSON();

    expect(field).toMatchSnapshot('disabled');
});
