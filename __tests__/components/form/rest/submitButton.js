import React from 'react';
import renderer from 'react-test-renderer';

import {withLightTheme} from '../../../__utils__/theme';
import SubmitButton from '../../../../app/components/form/rest/submitButton';
import {isAndroid, isIOS} from '../../../../app/helpers/device';

const props = {
    label: 'Save',
};

if (isIOS) {
    it('submit button, renders default', () => {
        const field = renderer.create(withLightTheme(<SubmitButton {...props} />)).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('submit button, renders disabled', () => {
        const field = renderer.create(withLightTheme(<SubmitButton {...props} disabled={true} />)).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('submit button, renders loading', () => {
        const field = renderer.create(withLightTheme(<SubmitButton {...props} loading={true} />)).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('submit button, renders colored', () => {
        const field = renderer.create(withLightTheme(<SubmitButton {...props} color={'red'} />)).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('submit button, renders custom styles', () => {
        let field = renderer
            .create(
                withLightTheme(
                    <SubmitButton
                        {...props}
                        customStyle={{
                            button: {
                                base: {margin: 10},
                            },
                            label: {
                                base: {color: 'red'},
                            },
                        }}
                    />,
                ),
            )
            .toJSON();

        expect(field).toMatchSnapshot('base');

        field = renderer
            .create(
                withLightTheme(
                    <SubmitButton
                        {...props}
                        disabled={true}
                        customStyle={{
                            button: {
                                base: {margin: 10},
                                disabled: {margin: 15},
                            },
                            label: {
                                base: {color: 'red'},
                                disabled: {color: 'green'},
                            },
                        }}
                    />,
                ),
            )
            .toJSON();
        expect(field).toMatchSnapshot('disabled');

        field = renderer
            .create(
                withLightTheme(
                    <SubmitButton
                        {...props}
                        loading={true}
                        customStyle={{
                            button: {
                                base: {margin: 10},
                                loading: {margin: 15},
                            },
                            label: {
                                base: {color: 'red'},
                                loading: {color: 'green'},
                            },
                        }}
                    />,
                ),
            )
            .toJSON();
        expect(field).toMatchSnapshot('loading');
    });
}
if (isAndroid) {
    describe.skip('android', () => {
        it('submit button, renders icon', () => {
            const field = renderer.create(withLightTheme(<SubmitButton {...props} icon={'check'} />)).toJSON();

            expect(field).toMatchSnapshot();
        });

        it('submit button, renders raised', () => {
            const field = renderer.create(withLightTheme(<SubmitButton {...props} raised={true} />)).toJSON();

            expect(field).toMatchSnapshot();
        });

        it('submit button, renders flat', () => {
            const field = renderer.create(withLightTheme(<SubmitButton {...props} raised={false} />)).toJSON();

            expect(field).toMatchSnapshot();
        });
    });
}
