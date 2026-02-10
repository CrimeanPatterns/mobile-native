/* eslint-disable */
import {shallow} from 'enzyme';
import React from 'react';
import {Text as NativeText} from 'react-native';
import renderer from 'react-test-renderer';

import Text from '../../../../app/components/form/field/text';

const props = {
    label: 'First Name',
    theme: 'light',
    onChangeValue: () => {},
};

it('text, renders default', () => {
    const field = renderer.create(<Text {...props} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders required', () => {
    const field = renderer.create(<Text {...props} required={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders not required', () => {
    const field = renderer.create(<Text {...props} required={false} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders value', () => {
    const field = renderer.create(<Text {...props} value={'John'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders hint', () => {
    const field = renderer.create(<Text {...props} hint={'Test hint'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders disabled', () => {
    const field = renderer.create(<Text {...props} disabled={true} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders error', () => {
    const field = renderer.create(<Text {...props} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders error with hint', () => {
    const field = renderer.create(<Text {...props} hint={'Test hint'} error={'This field is required!'} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders additional hint', () => {
    const field = renderer.create(<Text {...props} additionalHint={() => <NativeText>{`additional hint`}</NativeText>} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders footer component', () => {
    const field = renderer.create(<Text {...props} footerComponent={() => <NativeText>{`footer component`}</NativeText>} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('text, renders custom styles', () => {
    let field = renderer
        .create(
            <Text
                {...props}
                hint={'Test hint'}
                value={'Test'}
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
                    inputContainer: {
                        base: {marginVertical: 0},
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
            <Text
                {...props}
                hint={'Test hint'}
                value={'Test'}
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
                    inputContainer: {
                        base: {marginVertical: 0},
                        errored: {marginVertical: 1},
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
            <Text
                {...props}
                hint={'Test hint'}
                value={'Test'}
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
                    inputContainer: {
                        base: {marginVertical: 0},
                        errored: {marginVertical: 1},
                        disabled: {marginVertical: 2},
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

    const wrapper = shallow(
        <Text
            {...props}
            hint={'Test hint'}
            value={'Test'}
            customStyle={{
                container: {
                    base: {margin: 10},
                    errored: {margin: 11},
                    disabled: {margin: 12},
                    focused: {margin: 13},
                },
                label: {
                    base: {fontSize: 16},
                    errored: {fontSize: 17},
                    disabled: {fontSize: 18},
                    focused: {fontSize: 19},
                },
                input: {
                    base: {color: 'blue'},
                    errored: {color: 'orange'},
                    disabled: {color: 'red'},
                    focused: {color: 'orange'},
                },
                inputContainer: {
                    base: {marginVertical: 0},
                    errored: {marginVertical: 1},
                    disabled: {marginVertical: 2},
                    focused: {marginVertical: 3},
                },
                hint: {
                    base: {fontSize: 15},
                    errored: {fontSize: 16},
                    disabled: {fontSize: 17},
                    focused: {fontSize: 18},
                },
                errorContainer: {
                    base: {margin: 11},
                    errored: {margin: 12},
                    disabled: {margin: 13},
                    focused: {margin: 14},
                },
                error: {
                    base: {color: 'blue'},
                    errored: {color: 'red'},
                    disabled: {color: 'blue'},
                    focused: {color: 'red'},
                },
            }}
        />,
    );

    wrapper.setState({focused: true});
    expect(wrapper).toMatchSnapshot('focused');
});
