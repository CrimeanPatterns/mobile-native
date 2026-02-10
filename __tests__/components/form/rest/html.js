import React from 'react';
import renderer from 'react-test-renderer';

import {withDarkTheme, withLightTheme} from '../../../__utils__/theme';
import Html from '../../../../app/components/form/rest/html';

const HtmlView = <Html content={'<b>Hello, World!</b>'} cssStyles={'b {font-size: 12px;}'} />;

it('html, renders default', () => {
    const field = renderer.create(withLightTheme(HtmlView)).toJSON();

    expect(field).toMatchSnapshot();
});

it('html, renders dark', () => {
    const field = renderer.create(withDarkTheme(HtmlView)).toJSON();

    expect(field).toMatchSnapshot();
});
