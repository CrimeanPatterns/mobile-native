import {shallow} from 'enzyme';
import * as _ from 'lodash';
import React from 'react';

import {FormWithoutNavigation as Form, PasswordComplexityField} from '../../../app/components/form';

function prepareWrapper() {
    // const componentInstance = wrapper.instance();
    // componentInstance.componentDidMount();
}

function stateValue(wrapper, fieldName, path) {
    return _.get(wrapper.state('fields'), `${fieldName}.${path}`);
}

describe('prepare fields', () => {
    it('form, check state of alert choice field', () => {
        const rawConfig = {
            name: 'sex',
            type: 'choice',
            label: 'Sex',
            value: 'm',
            choices: [
                {value: 'm', label: 'Male'},
                {value: 'f', label: 'Female'},
            ],
            alerts: {
                m: 'Alert message',
            },
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of checkbox field', () => {
        const rawConfig = {
            name: 'agree',
            type: 'checkbox',
            label: 'Agree',
            value: true,
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of choice field', () => {
        const rawConfig = {
            name: 'sex',
            type: 'choice',
            label: 'Sex',
            value: 'm',
            choices: [
                {value: 'm', label: 'Male'},
                {value: 'f', label: 'Female'},
            ],
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of completion field', () => {
        const rawConfig = {
            name: 'firstName',
            type: 'text_completion',
            label: 'First Name',
            value: 'Billy',
            completionLink: 'http://',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of date field', () => {
        const rawConfig = {
            name: 'birthday',
            type: 'date',
            label: 'Birthday',
            value: '2018-01-01',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of password field', () => {
        const rawConfig = {
            name: 'password',
            type: 'passwordEdit',
            label: 'Password',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of password complexity field', () => {
        const complexityLogin = () => {};
        const complexityEmail = () => {};
        const rawConfig = {
            name: 'password',
            type: 'passwordComplexity',
            label: 'Password',
            attr: {},
            complexityLogin,
            complexityEmail,
        };
        let wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();

        wrapper = shallow(
            <Form
                theme={'light'}
                version={1}
                fields={[
                    {
                        name: 'password',
                        type: 'password',
                        label: 'Password',
                        complexityLogin,
                        complexityEmail,
                        attr: {
                            policy: true,
                        },
                    },
                ]}
            />,
        );
        prepareWrapper(wrapper);
        expect(_.get(wrapper.state('fields'), 'password.component').displayName).toEqual(PasswordComplexityField.displayName);
    });

    it('check state of switch field', () => {
        const rawConfig = {
            name: 'agree',
            type: 'switch',
            label: 'Agree',
            value: true,
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of text field', () => {
        const rawConfig1 = {
            name: 'firstName',
            type: 'text',
            label: 'First Name',
            value: 'Billy',
        };
        const rawConfig2 = {
            name: 'lastName',
            type: 'text',
            label: 'Last Name',
            value: 'Villy',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig1, rawConfig2]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of action rest', () => {
        const rawConfig = {
            name: 'Action',
            type: 'action',
            notice: 'Success',
            link: 'http://',
            method: 'POST',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });

    it('check state of html rest', () => {
        const rawConfig = {
            name: 'html',
            type: 'html',
            value: '<b>Hello, World!</b>',
        };
        const wrapper = shallow(<Form version={1} fields={[rawConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const fields = wrapper.state('fields');

        expect(_.isObject(fields)).toBeTruthy();
        expect(fields).toMatchSnapshot();
    });
});

describe('form extension', () => {
    function getWrapper() {
        return shallow(
            <Form
                theme={'light'}
                version={1}
                fields={[
                    {
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        value: 'Billy',
                    },
                ]}
            />,
        );
    }

    it('methods setValue, getValue', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(el.getValue('name')).toEqual('Billy');
        el.setValue('name', 'John');
        expect(el.getValue('name')).toEqual('John');
    });

    it('methods setValue, getValue, choice', () => {
        const wrapper = shallow(
            <Form
                theme={'light'}
                version={1}
                fields={[
                    {
                        name: 'sex',
                        type: 'choice',
                        label: 'Sex',
                        value: 'm',
                        choices: [
                            {value: 'm', label: 'Male'},
                            {value: 'f', label: 'Female'},
                        ],
                    },
                ]}
            />,
        );

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(el.getValue('sex')).toEqual('m');
        el.setValue('sex', 'f');
        expect(el.getValue('sex')).toEqual('f');
        el.setValue('sex', 'Male', 'label');
        expect(el.getValue('sex')).toEqual('m');
    });

    it('method showField', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(stateValue(wrapper, 'name', 'visibility')).toBeTruthy();
        el.showField('name', false);
        expect(stateValue(wrapper, 'name', 'visibility')).toBeFalsy();
        el.showField('name', true);
        expect(stateValue(wrapper, 'name', 'visibility')).toBeTruthy();
    });

    it('method requireField', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(stateValue(wrapper, 'name', 'props.required')).toBeUndefined();
        el.requireField('name', false);
        expect(stateValue(wrapper, 'name', 'props.required')).toBeFalsy();
        el.requireField('name', true);
        expect(stateValue(wrapper, 'name', 'props.required')).toBeTruthy();
    });

    it('method setFieldCaption', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(stateValue(wrapper, 'name', 'props.label')).toEqual('Name');
        el.setFieldCaption('name', 'Last Name');
        expect(stateValue(wrapper, 'name', 'props.label')).toEqual('Last Name');
    });

    it('method setFieldNotice', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(stateValue(wrapper, 'name', 'props.hint')).toBeUndefined();
        el.setFieldNotice('name', 'Test hint');
        expect(stateValue(wrapper, 'name', 'props.hint')).toEqual('Test hint');
    });

    it('method disableField', () => {
        const wrapper = getWrapper();

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(stateValue(wrapper, 'name', 'props.disabled')).toBeUndefined();
        el.disableField('name', true);
        expect(stateValue(wrapper, 'name', 'props.disabled')).toBeTruthy();
        el.disableField('name', false);
        expect(stateValue(wrapper, 'name', 'props.disabled')).toBeFalsy();
    });

    it('methods setOptions, getOptions', () => {
        const choices = [
            {value: 'm', label: 'Male'},
            {value: 'f', label: 'Female'},
        ];
        const wrapper = shallow(
            <Form
                theme={'light'}
                version={1}
                fields={[
                    {
                        name: 'sex',
                        type: 'choice',
                        label: 'Sex',
                        value: 'm',
                        choices,
                    },
                ]}
            />,
        );

        prepareWrapper(wrapper);
        const el = wrapper.instance();

        expect(el.getOptions('sex')).toEqual(choices);
        expect(el.getValue('sex')).toEqual('m');

        choices.push({value: 'third', name: 'Third'});
        el.setOptions('sex', choices);
        expect(el.getOptions('sex')).toEqual(choices);
        expect(el.getValue('sex')).toEqual('m');

        choices[1].selected = true;
        el.setOptions('sex', choices);
        expect(el.getOptions('sex')).toEqual(choices);
        expect(el.getValue('sex')).toEqual('f');
    });

    it('methods setField, getField', () => {
        const fieldConfig = {
            name: 'name',
            type: 'text',
            label: 'Name',
            value: 'Billy',
        };
        const wrapper = shallow(<Form version={1} fields={[fieldConfig]} theme={'light'} />);

        prepareWrapper(wrapper);
        const el = wrapper.instance();
        const field = el.getField('name');

        expect(field).toEqual(fieldConfig);
        field.newProp = 'test';
        el.setField('name', field);
        expect(el.getField('name')).toEqual(field);
    });
});
