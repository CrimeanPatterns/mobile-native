import _ from 'lodash';

import util from '../util';
import resolveComponent, {formGroups, mapProps} from './config';

export default function prepareFields(fields, customTypes = {}, config = {}, map = {}, prefix = []) {
    _.forEach(fields, (field) => {
        const rawConfig = _.cloneDeep(field);
        const {name, type, children, value, mapped = true, errors, ...rest} = field;

        if (_.isString(name) && !util.isEmpty(name)) {
            if (_.isArray(children) && children.length > 0 && _.has(customTypes, type) === false) {
                prepareFields(children, customTypes, config, map, [...prefix, name]);
            } else {
                let preparedValue = value;
                const fullName = [...prefix, name].join('.');

                if (_.isFunction(type)) {
                    config[fullName] = type;
                } else {
                    const resolveResult = resolveComponent(field);
                    const {type: resolvedType, aliases: resolvedAliases} = resolveResult;
                    let {component = null, groups = []} = resolveResult;

                    if (_.has(customTypes, resolvedType)) {
                        const options = customTypes[resolvedType];

                        if (_.isObject(options)) {
                            const {component: customComponent, groups: componentGroups, simpleComponent = false} = options;

                            if (!_.isUndefined(customComponent)) {
                                component = customComponent;
                                if (simpleComponent) {
                                    groups.push(formGroups.NOT_FORM);
                                } else if (_.isArray(componentGroups)) {
                                    groups = componentGroups;
                                }
                            } else {
                                component = options;
                            }
                        } else {
                            component = options;
                        }
                    }

                    preparedValue = mapProps(rest, resolvedType, groups, field) || preparedValue;

                    config[fullName] = {
                        component,
                        groups,
                        name,
                        fullName,
                        resolvedType,
                        resolvedAliases,
                        visibility: !_.isNull(component),
                        focused: false,
                        props: {...rest, value: preparedValue, children},
                        rawConfig,
                    };
                    if (_.indexOf(groups, formGroups.NOT_FORM) === -1) {
                        const error = _.isArray(errors) && errors.length > 0 ? errors[0] : null;

                        config[fullName] = {
                            ...config[fullName],
                            error,
                            isValid: util.isEmpty(error),
                            value: preparedValue,
                            mapped,
                            changed: false,
                        };
                    }
                }

                map[name] = fullName;
            }
        }
    });

    return {fields: config, map};
}

export function prepareFieldsSubmit(fields) {
    const result = {};

    _.forEach(fields, (field) => {
        if (_.indexOf(field.groups, formGroups.NOT_FORM) === -1 && field.mapped === true) {
            _.set(result, field.fullName, field.value);
        }
    });

    return result;
}
