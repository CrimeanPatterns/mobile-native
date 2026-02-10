import React from 'react';

import {renderLight} from '../../../__utils__/render';
import Button from '../../../../app/components/form/rest/button';
import {isAndroid, isIOS} from '../../../../app/helpers/device';

const props = {
    label: 'Save',
};

if (isIOS) {
    it('button, renders default', () => {
        const field = renderLight(<Button {...props} />).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('button, renders disabled', () => {
        const field = renderLight(<Button {...props} disabled={true} />).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('button, renders loading', () => {
        const field = renderLight(<Button {...props} loading={true} />).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('button, renders colored', () => {
        const field = renderLight(<Button {...props} color={'red'} />).toJSON();

        expect(field).toMatchSnapshot();
    });

    it('button, renders custom styles', () => {
        let field = renderLight(
            <Button
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
        ).toJSON();

        expect(field).toMatchSnapshot('base');

        field = renderLight(
            <Button
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
        ).toJSON();
        expect(field).toMatchSnapshot('disabled');

        field = renderLight(
            <Button
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
        ).toJSON();
        expect(field).toMatchSnapshot('loading');
    });
}

if (isAndroid) {
    describe.skip('android', () => {
        it('button, renders icon', () => {
            const field = renderLight(<Button {...props} icon={'check'} />).toJSON();

            expect(field).toMatchSnapshot();
        });

        it('button, renders raised', () => {
            const field = renderLight(<Button {...props} raised={true} />).toJSON();

            expect(field).toMatchSnapshot();
        });

        it('button, renders flat', () => {
            const field = renderLight(<Button {...props} raised={false} />).toJSON();

            expect(field).toMatchSnapshot();
        });
    });
}
