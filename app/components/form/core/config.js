import _ from 'lodash';

import Barcode from '../custom/barcode';
import CardImages from '../custom/cardImages';
import GroupDesc from '../custom/groupDesc';
import Separator from '../custom/separator';
import AlertChoiceField from '../field/alertChoice';
import CheckboxField from '../field/checkbox';
import ChoiceField from '../field/choice';
import CompletionField, {withCompletion} from '../field/completion';
import DateField from '../field/date';
import MultipleChoiceField from '../field/multipleChoice';
import OauthField from '../field/oauth';
import OauthCapitalCardsField from '../field/oauth/capitalcards';
import PasswordField from '../field/password';
import PasswordComplexityField, {withPasswordComplexity} from '../field/passwordComplexity';
import PlaceField from '../field/place';
import SwitchField from '../field/switch';
import TextField from '../field/text';
import withHTMLHint from '../hoc/htmlHint';
import withPassProtect from '../hoc/passProtect';
import Action from '../rest/action';
import Html from '../rest/html';
import WarningMessage from '../rest/message';
import util from '../util';

export const formGroups = {
    CHOICE: 'choice',
    COMPLETION: 'completion',
    NOT_FORM: 'not_form',
    HTML_HINT: 'html_hint',
    NOVALIDATE: 'novalidate',
    PASSWORD_COMPLEXITY: 'password_complexity',
    TEXT: 'text',
};

const config = [
    {
        aliases: ['alertChoice'],
        component: AlertChoiceField,
        groups: [formGroups.CHOICE],
    },

    {
        aliases: ['checkbox'],
        component: CheckboxField,
    },

    {
        aliases: ['choice'],
        component: ChoiceField,
        groups: [formGroups.CHOICE],
    },

    {
        aliases: ['completion', 'text_completion'],
        component: CompletionField,
        groups: [formGroups.COMPLETION, formGroups.TEXT],
    },

    {
        aliases: ['date'],
        component: DateField,
    },

    {
        aliases: ['multipleChoice'],
        component: MultipleChoiceField,
    },

    {
        aliases: ['oauth'],
        component: OauthField,
    },

    {
        aliases: ['capitalcards_oauth_mobile'],
        component: OauthCapitalCardsField,
    },

    {
        aliases: ['passwordEdit'],
        component: PasswordField,
        groups: [formGroups.TEXT],
    },

    {
        aliases: ['passwordComplexity'],
        component: PasswordComplexityField,
        groups: [formGroups.PASSWORD_COMPLEXITY, formGroups.TEXT],
    },

    {
        aliases: ['place'],
        component: PlaceField,
    },

    {
        aliases: ['switch', 'switcher'],
        component: SwitchField,
        groups: [formGroups.NOVALIDATE],
    },

    {
        aliases: ['text', 'email', 'textarea', 'password', 'passwordMask'],
        component: TextField,
        groups: [formGroups.TEXT],
    },

    // rest

    {
        aliases: ['action'],
        component: Action,
        groups: [formGroups.NOT_FORM],
    },

    {
        aliases: ['html'],
        component: Html,
        groups: [formGroups.NOT_FORM],
    },

    {
        aliases: ['notice'],
        component: WarningMessage,
        groups: [formGroups.NOT_FORM],
    },

    {
        aliases: ['barcode'],
        component: Barcode,
        groups: [formGroups.NOVALIDATE],
    },

    {
        aliases: ['card_images'],
        component: CardImages,
        groups: [formGroups.NOVALIDATE],
    },

    {
        aliases: ['separator'],
        component: Separator,
        groups: [formGroups.NOT_FORM],
    },

    {
        aliases: ['group_desc'],
        component: GroupDesc,
        groups: [formGroups.NOT_FORM],
    },
];

const decomposedConfig = {};

config.forEach((item) => {
    item.aliases.forEach((alias) => {
        decomposedConfig[alias] = item;
    });
});

function resolveComponentByType(type) {
    return {
        component: _.get(decomposedConfig, `${type}.component`),
        groups: [..._.get(decomposedConfig, `${type}.groups`, [])],
        type,
        aliases: [..._.get(decomposedConfig, `${type}.aliases`, [])],
    };
}

export default function resolveComponent(field) {
    const {type} = field;
    let result = resolveComponentByType(type);

    if (type === 'choice') {
        if (field.multiple === true) {
            result = resolveComponentByType('multipleChoice');
        }
        if (_.isObject(field.alerts)) {
            result = resolveComponentByType('alertChoice');
        }
    }
    if (_.get(field, 'attr.class') === 'js-useragent-select' || _.get(field, 'attr.notice', '').match(/<a.*?>/)) {
        result.component = withHTMLHint(result.component);
        result.groups.push(formGroups.HTML_HINT);
    }
    if (_.indexOf(['password', 'passwordMask', 'passwordEdit'], type) !== -1 && _.get(field, 'attr.policy') === true) {
        delete field.attr.policy;
        result.component = withPasswordComplexity(result.component);
        result.groups.push(formGroups.PASSWORD_COMPLEXITY);
    }
    if (_.indexOf(['text', 'email', 'textarea'], type) !== -1 && _.has(field, 'completionLink')) {
        result.component = withCompletion(result.component);
        result.groups.push(formGroups.COMPLETION);
    }
    if (
        _.indexOf(['switch', 'switcher', 'checkbox'], type) !== -1 &&
        _.has(field, 'attr.passwordAccess.route') &&
        _.has(field, 'attr.passwordAccess.trigger_value')
    ) {
        result.component = withPassProtect(result.component);
    }

    return result;
}

export function mapChoices(choices, value, checkSelected = true) {
    const isEmptyValue = util.isEmpty(value);
    let newValue;
    let foundSimilar = false;

    for (const choice of choices) {
        if (checkSelected && choice.selected === true) {
            newValue = choice.value;
            break;
        } else if (!foundSimilar && (choice.value === value || (isEmptyValue && util.isEmpty(choice.value)))) {
            newValue = choice.value;
            foundSimilar = true;
        }
    }

    if (_.isUndefined(newValue)) {
        newValue = choices.length > 0 ? _.get(choices, '[0].value', null) : null;
    }

    return {choices, value: newValue};
}

export function mapProps(props, type, groups, fields) {
    const {name, value} = fields;

    if (_.has(props, 'attr.notice')) {
        props.hint = props.attr.notice;
        delete props.attr.notice;
    }

    if (_.has(props, 'attr.textContentType')) {
        const {textContentType, passwordRules} = props.attr;

        props.textContentType = textContentType;
        delete props.attr.textContentType;

        if (_.isString(passwordRules)) {
            props.passwordRules = passwordRules;
            delete props.attr.passwordRules;
        }
    }

    if (_.indexOf(groups, formGroups.CHOICE) !== -1 && _.isArray(props.choices)) {
        const {value: newValue} = mapChoices(props.choices, value);

        if (_.has(props, 'disabledChoice.value')) {
            props.disabledValue = _.get(props, 'disabledChoice.value');

            const {value: newDisabledValue} = mapChoices(props.choices, props.disabledValue, false);

            props.disabledValue = newDisabledValue;
        }

        return newValue;
    }

    if (_.indexOf(groups, formGroups.TEXT) !== -1) {
        props.multiline = type === 'textarea';
        if (props.multiline) {
            props.blurOnSubmit = false;
            props.returnKeyType = 'next';
            props.onSubmitEditing = null;
        }
        if (type === 'email') {
            props.keyboardType = 'email-address';
        }
        if (_.has(props, 'attr.autocapitalize')) {
            const autocapitalize = _.lowerCase(_.get(props, 'attr.autocapitalize'));

            if (_.indexOf(['off', 'none'], autocapitalize) !== -1) {
                props.autoCapitalize = 'none';
            } else if (_.indexOf(['on', 'sentences'], autocapitalize) !== -1) {
                props.autoCapitalize = 'sentences';
            } else if (_.indexOf(['words', 'characters'], autocapitalize) !== -1) {
                props.autoCapitalize = autocapitalize;
            } else {
                props.autoCapitalize = 'none';
            }
        } else {
            props.autoCapitalize = 'none';
        }

        if (_.has(props, 'attr.autocorrect')) {
            const autocorrect = _.lowerCase(_.get(props, 'attr.autocorrect'));

            if (_.indexOf(['on', 'off'], autocorrect) !== -1) {
                props.autoCorrect = autocorrect === 'on';
            } else {
                props.autoCorrect = true;
            }
        } else {
            props.autoCorrect = props.multiline;
        }

        if (_.indexOf(['password', 'passwordMask', 'passwordEdit'], type) !== -1) {
            props.secureTextEntry = true;
            props.autoCorrect = false;
        }
    }

    if (_.indexOf(groups, formGroups.PASSWORD_COMPLEXITY) !== -1) {
        delete props.hint;
        props.secureTextEntry = true;
        props.autoCorrect = false;
        const getFieldValue = (fieldName, form) => form.getValue(fieldName);

        props.listenFieldNames = [];
        if (!_.isFunction(props.complexityLogin)) {
            const loginField = _.get(props, 'attr.complexityLoginField', 'login');

            props.listenFieldNames.push(loginField);
            props.complexityLogin = getFieldValue.bind(this, loginField);
        }
        if (!_.isFunction(props.complexityEmail)) {
            const emailField = _.get(props, 'attr.complexityEmailField', 'email');

            props.listenFieldNames.push(emailField);
            props.complexityEmail = getFieldValue.bind(this, emailField);
        }
    }

    if (_.indexOf(['switch', 'switcher'], type) !== -1) {
        if (_.has(props, 'attr.disabledValue')) {
            props.disabledValue = _.get(props, 'attr.disabledValue');
        }
    }

    if (_.indexOf(['switch', 'switcher', 'checkbox'], type) !== -1) {
        if (_.has(props, 'attr.passwordAccess.route') && _.has(props, 'attr.passwordAccess.trigger_value')) {
            props.passwordAccess = props.passwordAccess || {};
            props.passwordAccess.route = _.get(props, 'attr.passwordAccess.route');
            props.passwordAccess.triggerValue = _.get(props, 'attr.passwordAccess.trigger_value');
        }
    }

    if (_.indexOf(groups, formGroups.NOT_FORM) !== -1) {
        if (type === 'action') {
            props.text = name;
            props.message = props.notice;
            delete props.notice;
        } else if (type === 'html') {
            props.content = value;
        }
    }

    return undefined;
}
