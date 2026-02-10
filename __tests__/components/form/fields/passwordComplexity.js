import React from 'react';
import renderer from 'react-test-renderer';

import PasswordComplexity from '../../../../app/components/form/field/passwordComplexity';

const props = {
    label: 'Password',
    onChangeValue: () => {},
    theme: 'light',
};

it('password, renders default', () => {
    const field = renderer.create(<PasswordComplexity {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders required', () => {
    const field = renderer.create(<PasswordComplexity {...props} required={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders not required', () => {
    const field = renderer.create(<PasswordComplexity {...props} required={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders value', () => {
    const field = renderer.create(<PasswordComplexity {...props} value={'12345'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders hint', () => {
    const field = renderer.create(<PasswordComplexity {...props} hint={'Test hint'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders disabled', () => {
    const field = renderer.create(<PasswordComplexity {...props} disabled={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders error', () => {
    const field = renderer.create(<PasswordComplexity {...props} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders error with hint', () => {
    const field = renderer.create(<PasswordComplexity {...props} hint={'Test hint'} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('password, renders custom styles', () => {
    let field = renderer
        .create(
            <PasswordComplexity
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
        )
        .toJSON();

    expect(field).toMatchSnapshot('base');

    field = renderer
        .create(
            <PasswordComplexity
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
        )
        .toJSON();
    expect(field).toMatchSnapshot('errored');

    field = renderer
        .create(
            <PasswordComplexity
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
        )
        .toJSON();
    expect(field).toMatchSnapshot('disabled');
});
