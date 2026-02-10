import Translator from 'bazinga-translator';
import {View} from 'react-native';

import Button from '../../../app/components/form/rest/button';
import BaseSubmitButton from '../../../app/components/form/rest/submitButton';
import {Colors} from '../../../app/styles';

export default {
    title: 'Form/Button',
    component: Button,
    args: {},
};

export const SubmitButton = {
    title: 'SubmitButton',
    component: BaseSubmitButton,
    args: {
        label: Translator.trans('buttons.save', {}, 'mobile'),
        color: Colors.blue,
        raised: true,
        theme: 'light',
        loading: false,
    },
    decorators: [
        (Story) => (
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
                <Story />
            </View>
        ),
    ],
};

export const SimpleButton = {
    title: 'Simple Button',
    component: Button,
    args: {
        label: 'Press me',
        color: Colors.blue,
        raised: true,
        theme: 'light',
        loading: false,
    },
    decorators: [
        (Story) => (
            <View style={{flex: 1, justifyContent: 'center', alignContent: 'center'}}>
                <Story />
            </View>
        ),
    ],
};
