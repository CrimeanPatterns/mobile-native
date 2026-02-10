import React from 'react';
import {IntlProvider} from 'react-intl';
import renderer from 'react-test-renderer';

import Date from '../../../../app/components/form/field/date';

const props = {
    label: 'Date',
    onChangeValue: () => {},
    value: '2018-01-01',
    theme: 'light',
};

it('date, renders default', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders required', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} required={true} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders not required', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} required={false} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders value', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} value={'2019-01-01'} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders hint', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} hint={'Test hint'} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders disabled', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} disabled={true} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders error', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} error={'This field is required!'} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders error with hint', () => {
    const field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date {...props} hint={'Test hint'} error={'This field is required!'} />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('date, renders custom styles', () => {
    let field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date
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
                />
            </IntlProvider>,
        )
        .toJSON();

    expect(field).toMatchSnapshot('base');

    field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date
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
                />
            </IntlProvider>,
        )
        .toJSON();
    expect(field).toMatchSnapshot('errored');

    field = renderer
        .create(
            <IntlProvider locale={'en-US'}>
                <Date
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
                />
            </IntlProvider>,
        )
        .toJSON();
    expect(field).toMatchSnapshot('disabled');
});
