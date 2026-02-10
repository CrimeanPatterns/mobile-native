import {AnimatedScrollView} from '@components/ui/scrollView';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import update from 'immutability-helper';
import _ from 'lodash';
import React, {createRef, useImperativeHandle, useRef, useState} from 'react';
import {
    Alert,
    Dimensions,
    EmitterSubscription,
    findNodeHandle,
    Keyboard,
    LayoutAnimation,
    LayoutChangeEvent,
    LayoutRectangle,
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Provider} from 'react-native-paper';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

import {Bugsnag} from '../../bugsnag';
import {isIOS} from '../../helpers/device';
import {handleOpenUrlAnyway} from '../../helpers/handleOpenUrl';
import {Colors, DarkColors, Fonts} from '../../styles';
import {ColorScheme, useTheme} from '../../theme';
import {BaseThemedComponent} from '../baseThemed';
import Icon from '../icon';
import {ScrollViewBackgroundLayer} from '../ui/scrollView/background';
import {formGroups, mapChoices} from './core/config';
import AbstractFormExtension, {IFormExtension} from './core/formExtensionInterface';
import prepareFields, {prepareFieldsSubmit} from './core/prepareFields';
import getForceSafeAreaSettings from './core/safeAreaSettings';
import KeyboardAvoidingView from './keyboardAvoidingView';
import {FormError} from './rest/error';
import util from './util';
import validator from './validator';

/** ******************* fields ********************************************** */
export {default as AlertChoiceField} from './field/alertChoice';
export {default as CheckboxField} from './field/checkbox';
export {default as ChoiceField} from './field/choice';
export {default as CompletionField, withCompletion} from './field/completion';
export {default as DateField} from './field/date';
export {default as MultipleChoiceField} from './field/multipleChoice';
export {default as OauthField} from './field/oauth';
export {default as PasswordField} from './field/password';
export {default as PasswordComplexityField, withPasswordComplexity} from './field/passwordComplexity';
export {default as PlaceField} from './field/place';
export {default as SwitchField} from './field/switch';
export {default as TextField} from './field/text';

/** ******************* HOCs ************************************************ */
export {default as withHTMLHint} from './hoc/htmlHint';
export {default as withPassProtect} from './hoc/passProtect';

/** ******************* rest ************************************************ */
export {default as Action} from './rest/action';
export {default as Button} from './rest/button';
export {default as Html} from './rest/html';
export {default as SubmitButton} from './rest/submitButton';
export {default as stylesMaker} from './stylesMaker';

export {prepareFields, prepareFieldsSubmit, getForceSafeAreaSettings};

const ENABLE_LOGS = __DEV__;

function log(...args) {
    if (ENABLE_LOGS) {
        console.log(`[FORM]`, ...args);
    }
}

const LayoutAnimationEnabled = false;

class Operation {
    actionName;

    fieldName;

    data;

    constructor(actionName, fieldName, data) {
        this.actionName = actionName;
        this.fieldName = fieldName;
        this.data = data;
    }
}

const getValue = (field, property, value) => {
    if (_.indexOf(field.groups, formGroups.CHOICE) !== -1 && property === 'label') {
        if (_.has(field, 'props.choices') && _.isArray(field.props.choices) && field.props.choices.length > 0) {
            const filtered = field.props.choices.filter((choice) => choice.label === value);

            if (filtered.length > 0) {
                return filtered[0].value;
            }
        }

        return undefined;
    }

    return value;
};

export type FormProps = {
    version?: number;
    theme: ColorScheme;
    insets: EdgeInsets;
    fields:
        | {
              type(...args: unknown[]): unknown;
              name: string;
          }
        | {
              name: string;
              children: (...args: unknown[]) => unknown | object[];
          }
        | {
              type: string;
              name: string;
              label?: string;
              required?: boolean;
              value?: any;
              mapped?: unknown;
          }[];
    customTypes?: object;
    fieldsStyles?: {[key: string]: ViewStyle};
    // global form errors, only the first error will be shown
    errors?: string[] | React.ReactNode[];
    // success message
    successMessage?: string;
    // callback that will be called when the form is ready, for example for scrolling
    onFormReady?(...args: unknown[]): unknown;
    // callback that will be called when the field value changes
    onFieldChange?(...args: unknown[]): unknown;
    // callback that will be called when the form is submitted
    onSubmit?(...args: unknown[]): unknown;
    autoSubmit?: boolean;
    autoSubmitDelay?: number;
    formExtension?: string | string[] | null;
    headerComponent?: (...args: unknown[]) => unknown | React.ReactNode;
    footerComponent?: (...args: unknown[]) => unknown | React.ReactNode;
    // for iOS
    forceSafeArea?: {
        top?: 'always' | 'never';
        bottom?: 'always' | 'never';
        left?: 'always' | 'never';
        right?: 'always' | 'never';
        horizontal?: 'always' | 'never';
        vertical?: 'always' | 'never';
    };
    customStyle?: {
        container?: {
            base: object;
        };
        fieldsContainer?: {
            base: object;
        };
        successContainer?: {
            base: object;
        };
        success?: {
            base: object;
        };
        errorContainer?: {
            base: object;
        };
        error?: {
            base: object;
        };
    };
    topBounceColor?: string;
    bottomBounceColor?: string;
};

type FormState = {
    fields: {[key: string]: unknown};
    map: unknown;
    error: string | React.ReactNode;
    successMessage: string | null;
    focused: boolean;
    frameHeight: string | number;
};

export interface IForm {
    subscribe(eventName: 'onFormReady' | 'onFieldChange' | 'onFormProcessing', fn: (...args: any[]) => void): void;

    unsubscribe(eventName: 'onFormReady' | 'onFieldChange' | 'onFormProcessing', fn: (...args: any[]) => void): void;

    setError(error: string): void;

    setSuccessMessage(successMessage: string): void;

    submit(): void;

    getRef(fieldName: string): any;

    /** Start Form Extension Methods */

    setValue(fieldName: string, value, property?: string): void;

    getValue<T>(fieldName: string): T;

    isVisibleField(fieldName: string): boolean;

    showField(fieldName: string, visible: boolean): Promise<void>;

    requireField(fieldName: string, required: boolean): void;

    setFieldCaption(fieldName: string, caption): void;

    setFieldNotice(fieldName: string, notice): void;

    disableField(fieldName: string, disable: boolean): void;

    setFieldError(fieldName: string, error: string): void;

    setOptions(fieldName: string, options): void;

    getOptions(fieldName): undefined | null;

    getInput(fieldName: string): any;

    getField(fieldName: string): any;

    setField(fieldName: string, newField): void;

    setFieldType(fieldName: string, fieldType, props): void;

    setMapped(fieldName: string, mapped: boolean): void;

    scrollToField(fieldName: string, focus?: boolean): void;

    scrollToFirstError(exceptFormError?: boolean): void;
}

class Form extends BaseThemedComponent<FormProps, FormState> implements IForm {
    static defaultProps = {
        autoSubmit: false,
        autoSubmitDelay: 750,
        customTypes: {},
        fieldsStyles: {},
        errors: [],
    };

    keyboardShown = false;

    contentHeight = 0;

    currentOffset = 0;

    operationsQueue = [];

    handlers = {
        onFormReady: [],
        onFieldChange: [],
        onFormProcessing: [],
    };

    private extensions: IFormExtension[] = [];
    private _scrollViewRef = createRef<AnimatedScrollView>();
    private dimensionsListener: EmitterSubscription | undefined;
    private _keyboardListeners: EmitterSubscription[] | undefined;
    private mounted: boolean = false;
    private _onLoadPromises: {[key: string]: Promise<void>};
    private _formErrorRef: React.RefObject<View>;
    private _formSuccessRef: React.RefObject<View>;
    private _fieldRefs: {[key: string]: unknown};
    private _fieldViewRefs: {[key: string]: unknown};
    private _delayedSubmit: _.DebouncedFunc<() => void> | undefined;
    private _onChangeCallbacks: {[key: string]: (...args: any[]) => void} = {};
    private _onSubmitEditingCallbacks: {[key: string]: (...args: any[]) => void} = {};
    private _onFocusCallbacks: {[key: string]: (...args: any[]) => void} = {};
    private _onBlurCallbacks: {[key: string]: (...args: any[]) => void} = {};
    private skipHide: boolean = false;
    private frame: LayoutRectangle | undefined;

    constructor(props) {
        super(props);

        this.state = {
            ...prepareFields(props.fields, props.customTypes),
            error: null,
            successMessage: null,
            focused: null,
            frameHeight: '100%',
        };

        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardWillHide = this._keyboardWillHide.bind(this);

        this._orientationDidChange = this._orientationDidChange.bind(this);
        this._onContentSizeChange = this._onContentSizeChange.bind(this);
        this._onLayoutScrollView = this._onLayoutScrollView.bind(this);
        this._onScroll = this._onScroll.bind(this);
        this.submit = this.submit.bind(this);
        this._formErrorRef = createRef();
        this._formSuccessRef = createRef();

        this._fieldRefs = {};
        this._fieldViewRefs = {};
        this._onLoadPromises = {};

        this._prepareCallbacks();
    }

    componentDidMount() {
        this.mounted = true;

        this._keyboardListeners = [
            Keyboard.addListener('keyboardDidShow', this._keyboardDidShow),
            Keyboard.addListener('keyboardDidHide', this._keyboardDidHide),
            // keyboardWillShow & keyboardWillHide works only iOS
            Keyboard.addListener('keyboardWillShow', this._keyboardWillShow),
            Keyboard.addListener('keyboardWillHide', this._keyboardWillHide),
        ];

        this.dimensionsListener = Dimensions.addEventListener('change', this._orientationDidChange);
        this.initForm();
    }

    componentWillUnmount() {
        this.mounted = false;
        this._delayedSubmit?.flush();
        if (this._keyboardListeners) {
            this._keyboardListeners.forEach((sub) => sub.remove());
        }
        this.dimensionsListener?.remove();
    }

    public subscribe(eventName, fn) {
        if (!_.isArray(this.handlers[eventName])) {
            return;
        }

        this.handlers[eventName].push(fn);
    }

    public unsubscribe(eventName, fn) {
        if (!_.isArray(this.handlers[eventName])) {
            return;
        }

        this.handlers[eventName] = this.handlers[eventName].filter((handler) => {
            if (handler === fn) {
                return false;
            }

            return true;
        });
    }

    private fire(eventName, ...args) {
        if (!_.isArray(this.handlers[eventName])) {
            return;
        }

        this.handlers[eventName].forEach((handler) => {
            handler(...args);
        }, this);
    }

    public setError(error) {
        this.setState({error, successMessage: null});
    }

    public setSuccessMessage(successMessage) {
        this.setState({successMessage, error: null});
    }

    public submit() {
        let isValidForm = true;

        const preSubmit = (state) => {
            const updateFields = {};

            _.forEach(state.fields, (field) => {
                if (!_.isObject(field)) {
                    return;
                }

                const canValidate =
                    field.visibility === true &&
                    !_.get(field, 'props.disabled', false) &&
                    !_.isNull(field.component) &&
                    _.indexOf(field.groups, formGroups.NOT_FORM) === -1 &&
                    _.indexOf(field.groups, formGroups.NOVALIDATE) === -1;

                if (!canValidate) {
                    return;
                }

                let isValid = true;

                updateFields[field.fullName] = {
                    error: {$set: null},
                    isValid: {$set: true},
                };

                if (_.get(field, 'props.required', true) === true) {
                    const error = validator.checkRequired(field.value);

                    isValid = _.isNull(error);
                    isValidForm = isValidForm && isValid;
                    updateFields[field.fullName] = {
                        error: {$set: error},
                        isValid: {$set: isValid},
                    };
                }

                if (isValid && _.isObject(this._fieldRefs[field.fullName]) && _.isFunction(this._fieldRefs[field.fullName].onValidate)) {
                    const {error, isValid} = this._fieldRefs[field.fullName].onValidate();

                    isValidForm = isValidForm && isValid;
                    updateFields[field.fullName] = {
                        error: {$set: error},
                        isValid: {$set: isValid},
                    };
                }
            });

            return update(state, {
                fields: updateFields,
            });
        };

        const postSubmit = async () => {
            if (!isValidForm) {
                if (this.mounted) {
                    //scroll to error before submit
                    this.scrollToFirstError(true);
                }
                return;
            }

            if (this.mounted) {
                Keyboard.dismiss();
            }

            const {fields} = this.state;
            const {onSubmit = _.noop} = this.props;

            onSubmit(prepareFieldsSubmit(fields));
        };

        if (this.mounted) {
            this.setState(preSubmit, postSubmit);
        } else {
            preSubmit(this.state);
            postSubmit();
        }
    }

    getRef(fieldName) {
        const field = this._getField(this.state, fieldName);

        if (!_.isObject(field)) {
            return null;
        }

        return _.get(this._fieldRefs, field.fullName, null);
    }

    /** Start Form Extension Methods */

    public setValue(fieldName, value, property) {
        const fieldBefore = this._getField(this.state, fieldName, true);

        if (!_.isObject(fieldBefore)) {
            return;
        }

        const operation = new Operation('setValue', fieldName, getValue(fieldBefore, property, value));

        this.operationsQueue.push(operation);

        this.setState(
            (state) => {
                const field = this._getField(state, fieldName, true);

                if (!_.isObject(field)) {
                    return null;
                }

                const newValue = getValue(field, property, value);

                if (!_.isUndefined(newValue)) {
                    return update(state, {
                        fields: {
                            [field.fullName]: {
                                $merge: {
                                    value: newValue,
                                    changed: true,
                                    error: null,
                                    isValid: true,
                                },
                            },
                        },
                    });
                }

                return null;
            },
            () => {
                _.pull(this.operationsQueue, operation);
            },
        );
    }

    public getValue(fieldName: string) {
        const field = this._getField(this.state, fieldName, true);

        if (!_.isObject(field)) {
            return null;
        }

        const operation = _.find(this.operationsQueue, {actionName: 'setValue', fieldName});

        if (!_.isUndefined(operation)) {
            return operation.data;
        }

        return field.value;
    }

    public showField(fieldName: string, visible: boolean): Promise<void> {
        return new Promise<void>((resolve) => {
            this.setState(
                (state) => {
                    const field = this._getField(state, fieldName, true);

                    if (!_.isObject(field)) {
                        return null;
                    }

                    return update(state, {
                        fields: {
                            [field.fullName]: {
                                $merge: {
                                    visibility: visible,
                                },
                            },
                        },
                    });
                },
                () => resolve(),
            );
        });
    }

    public isVisibleField(fieldName: string) {
        const {fields} = this.state;
        const field = this._getField(this.state, fieldName, true);

        if (!_.isObject(field)) {
            return null;
        }

        return fields[field.fullName]?.visibility === true ?? false;
    }

    public requireField(fieldName, required) {
        this._setFieldProperty(fieldName, 'required', required);
    }

    public setFieldCaption(fieldName, caption) {
        this._setFieldProperty(fieldName, 'label', caption);
    }

    public setFieldNotice(fieldName, notice) {
        this._setFieldProperty(fieldName, 'hint', notice);
    }

    public disableField(fieldName, disable) {
        this._setFieldProperty(fieldName, 'disabled', disable);
    }

    public setFieldError(fieldName, error) {
        this.setState((state) => {
            const field = this._getField(state, fieldName, true);

            if (!_.isObject(field)) {
                return null;
            }

            return update(state, {
                fields: {
                    [field.fullName]: {
                        $merge: {
                            error,
                        },
                    },
                },
            });
        });
    }

    public setOptions(fieldName, options) {
        this.setState((state) => {
            const field = this._getField(state, fieldName);

            if (!_.isObject(field) || _.indexOf(field.groups, formGroups.CHOICE) === -1) {
                return null;
            }

            const {choices, value} = mapChoices(options, field.value);

            return update(state, {
                fields: {
                    [field.fullName]: {
                        $merge: {
                            value,
                            changed: false,
                            error: null,
                            isValid: true,
                        },
                        props: {
                            choices: {
                                $set: choices,
                            },
                        },
                    },
                },
            });
        });
    }

    public getOptions(fieldName) {
        const field = this._getField(this.state, fieldName);

        if (!_.isObject(field)) {
            return null;
        }

        return _.get(field, 'props.choices');
    }

    public getInput(fieldName) {
        return this.getField(fieldName);
    }

    public getField(fieldName) {
        const field = this._getField(this.state, fieldName, true);

        if (!_.isObject(field)) {
            return null;
        }

        return field.rawConfig;
    }

    public setField(fieldName, newField) {
        this.setState((state) => {
            const field = this._getField(state, fieldName, true);

            if (!_.isObject(field)) {
                return null;
            }

            return update(state, {
                fields: {
                    [field.fullName]: {
                        rawConfig: {
                            $set: newField,
                        },
                    },
                },
            });
        });
    }

    setFieldType(fieldName, fieldType, props = {}) {
        this.setState((state) => {
            const field = this._getField(state, fieldName, true);

            if (!_.isObject(field)) {
                return null;
            }

            const {fullName} = field;
            const {fields} = prepareFields([
                {
                    ...field.rawConfig,
                    value: field.value,
                    errors: [],
                    type: fieldType,
                    ...props,
                },
            ]);

            if (!fields[fieldName]) {
                return null;
            }

            return update(state, {
                fields: {
                    [fullName]: {
                        $set: {
                            ...fields[fieldName],
                            fullName,
                        },
                    },
                },
            });
        });
    }

    public setMapped(fieldName, mapped) {
        this.setState((state) => {
            const field = this._getField(state, fieldName);

            if (!_.isObject(field)) {
                return null;
            }

            return update(state, {
                fields: {
                    [field.fullName]: {
                        $merge: {
                            mapped,
                        },
                    },
                },
            });
        });
    }

    public getTranslator() {
        return Translator;
    }

    public navigate(url) {
        handleOpenUrlAnyway({url});
    }

    public showDialog({title, message, buttons}) {
        Alert.alert(title, message, buttons);
    }

    private _getField(state, fieldName, allowCustomComponent = false) {
        const fullName = _.get(state, `map.${fieldName}`);

        if (!_.isString(fullName)) {
            return null;
        }

        if (!allowCustomComponent && _.indexOf(_.get(state.fields, `[${fullName}].groups`, []), formGroups.NOT_FORM) !== -1) {
            return null;
        }

        return state.fields[fullName];
    }

    private _setFieldProperty(fieldName, property, value) {
        this.setState((state) => {
            const field = this._getField(state, fieldName);
            const prop = {};

            if (!_.isObject(field)) {
                return null;
            }

            prop[property] = value;

            return update(state, {
                fields: {
                    [field.fullName]: {
                        props: {
                            $merge: prop,
                        },
                    },
                },
            });
        });
    }

    /** End Form Extension Methods */

    private initForm() {
        const {onFormReady = _.noop, formExtension, autoSubmitDelay} = this.props;

        this.operationsQueue = [];
        this._delayedSubmit = _.debounce(this.submit, autoSubmitDelay);

        if (!_.isNil(formExtension)) {
            this._prepareExtension(formExtension);
        }

        this._scrollToFirstError();

        onFormReady(this);

        this.fire('onFormReady', this);
    }

    private _scrollToFirstError() {
        Promise.all(Object.values(this._onLoadPromises)).finally(() => {
            this.scrollToFirstError();
        });
    }

    public scrollToFirstError(exceptFormError = false) {
        const {fields, error} = this.state;
        const {errors} = this.props;
        const formError = !util.isEmpty(error) || (errors && errors.length > 0);

        if (!this.mounted) {
            return;
        }

        if (!exceptFormError && formError && this._formErrorRef.current) {
            this.scrollToView(this._formErrorRef.current);
            return;
        }

        _.forEach(fields, (field) => {
            if (_.indexOf(field.groups, formGroups.NOT_FORM) === -1 && field.isValid === false && field.visibility === true) {
                this.scrollToField(field.name);
                return false;
            }

            return true;
        });
    }

    scrollToField(fieldName: string, focus?: boolean) {
        const field = this._getField(this.state, fieldName, true);

        if (!_.isObject(field) || !_.has(this._fieldViewRefs, field.fullName)) {
            return;
        }

        if (focus) {
            this.focusOnField(fieldName);
        } else {
            this.scrollToView(this._fieldViewRefs[field.fullName]);
        }
    }

    private async focusOnField(fieldName: string) {
        const field = this._getField(this.state, fieldName, true);

        if (!_.isObject(field) || !_.has(this._fieldViewRefs, field.fullName)) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));

        if (_.isObject(this._fieldRefs, field.fullName) && _.isFunction(this._fieldRefs[field.fullName].focus)) {
            if (_.isFunction(this._fieldRefs[field.fullName].isFocused) && this._fieldRefs[field.fullName].isFocused()) {
                this.scrollToView(this._fieldViewRefs[field.fullName]);
            } else {
                this._fieldRefs[field.fullName].focus();
            }
        }
    }

    private get canScroll() {
        return this.mounted && this._scrollViewRef.current;
    }

    private async scrollToView(view, forceTop = false) {
        // without delay sometimes crashed on view.measureLayout
        await new Promise((resolve) => setTimeout(resolve, 100));
        this._scrollToView(view, forceTop);
    }

    private _scrollToView(view, forceTop) {
        view.measureLayout(findNodeHandle(this._scrollViewRef.current), (x, y, _width, height) => {
            if (!this.canScroll) {
                return;
            }

            let coordY = y;

            if (this.frame && this.frame.height > 0) {
                const topOffset = this.currentOffset;
                const bottomOffset = this.currentOffset + this.frame.height;

                if (!forceTop) {
                    if (!(coordY >= topOffset && coordY + height <= bottomOffset)) {
                        if (coordY + height > bottomOffset && this.frame.height > height) {
                            coordY -= this.frame.height - height;
                        }
                    }
                }

                if (this.contentHeight > 0 && this.contentHeight >= this.frame.height) {
                    const maxOffset = this.contentHeight - this.frame.height;

                    coordY = coordY > maxOffset ? maxOffset : coordY;
                }

                if (coordY <= 50 && this.frame.height >= y + height) {
                    coordY = 0;
                } else if (!forceTop && y === coordY && coordY >= topOffset && coordY + height <= bottomOffset) {
                    return;
                }
            }

            this._scrollViewRef.current?.scrollTo({x, y: Math.max(0, coordY), animated: true});
        });
    }

    private _prepareCallbacks() {
        const {fields} = this.state;

        this._onChangeCallbacks = {};
        this._onSubmitEditingCallbacks = {};
        this._onFocusCallbacks = {};
        this._onBlurCallbacks = {};

        _.forEach(fields, (field) => {
            if (_.isObject(field)) {
                const {fullName, name, groups} = field;

                if (_.indexOf(groups, formGroups.NOT_FORM) === -1) {
                    const {
                        props: {onChangeValue = _.noop},
                    } = field;

                    this._onChangeCallbacks[fullName] = (value) => {
                        this._onChangeValue(fullName, name, value);
                        onChangeValue(value);
                    };

                    if (_.indexOf(groups, formGroups.TEXT) !== -1) {
                        this._onSubmitEditingCallbacks[fullName] = this._onSubmitEditing.bind(this, fullName, name);
                    }

                    this._onFocusCallbacks[fullName] = this._onChangeFocus.bind(this, fullName, name, true);
                    this._onBlurCallbacks[fullName] = this._onChangeFocus.bind(this, fullName, name, false);
                }
            }
        });
    }

    private _onChangeValue(fullName, shortName, value) {
        let updated = false;
        const prevValue = this.getValue(fullName);

        if (value !== prevValue) {
            this.setState(
                (state) => {
                    if (!_.has(state.fields, fullName)) {
                        return null;
                    }
                    updated = true;
                    return update(state, {
                        fields: {
                            [fullName]: {
                                $merge: {
                                    value,
                                    changed: true,
                                    error: null,
                                    isValid: true,
                                },
                            },
                        },
                    });
                },
                () => {
                    if (!updated) {
                        return;
                    }

                    const {onFieldChange = _.noop, autoSubmit} = this.props;

                    onFieldChange(this, shortName);
                    this.fire('onFieldChange', this, shortName);

                    if (autoSubmit) {
                        this._delayedSubmit?.();
                    }
                },
            );
        }
    }

    private _onChangeFocus(fullName, _shortName, focused) {
        this.setState(
            (state) => {
                if (!_.has(state.fields, fullName)) {
                    return null;
                }
                return update(state, {
                    fields: {
                        [fullName]: {
                            $merge: {
                                focused,
                            },
                        },
                    },
                    focused: {
                        $set: focused ? fullName : null,
                    },
                });
            },
            () => {
                if (!focused) {
                    return;
                }

                this.scrollToField(fullName);
            },
        );
    }

    private _onSubmitEditing(fullName) {
        const {fields: stateFields} = this.state;
        const fields = _.values(stateFields);
        const currentIndex = _.findIndex(fields, (field) => field.fullName === fullName);

        if (currentIndex === -1) {
            return;
        }

        const nextIndex = _.findIndex(
            fields,
            (field) =>
                !_.isFunction(field) &&
                _.indexOf(field.groups, formGroups.NOT_FORM) === -1 &&
                !_.isNull(field.component) &&
                field.visibility === true &&
                !_.get(field, 'props.disabled', false),
            currentIndex + 1,
        );
        const nextField = fields[nextIndex];

        if (!_.isObject(nextField)) {
            this.submit();
        } else {
            this.scrollToField(nextField.name, true);
        }
    }

    private _prepareExtension(formExtension: string | string[]) {
        let extensions: string[] = [];

        if (_.isArray(formExtension)) {
            extensions = formExtension;
        } else {
            extensions = [formExtension];
        }

        // unsubscribe
        if (!_.isEmpty(this.extensions)) {
            this.extensions.forEach((extension) => {
                if (_.isFunction(extension.onFormReady)) {
                    this.unsubscribe('onFormReady', extension.onFormReady);
                }
                if (_.isFunction(extension.onFieldChange)) {
                    this.unsubscribe('onFieldChange', extension.onFieldChange);
                }
            });
        }

        this.extensions = [];

        function safeFunction(fn) {
            return (...args) => {
                try {
                    fn(...args);
                } catch (e) {
                    Bugsnag.notify(e);
                    log(e);
                }
            };
        }

        try {
            _.forEach(extensions, (extension) => {
                let addFormExtension;

                try {
                    // eslint-disable-next-line no-eval
                    addFormExtension = eval(`${extension};
                    addFormExtension`);
                } catch (e) {
                    log(e);
                }

                const formExtension = new AbstractFormExtension();

                if (_.isFunction(addFormExtension)) {
                    addFormExtension(formExtension);

                    // subscribe
                    if (_.isFunction(formExtension.onFormReady)) {
                        formExtension.onFormReady = formExtension.onFormReady.bind(formExtension);
                        formExtension.onFormReady = safeFunction(formExtension.onFormReady);
                        this.subscribe('onFormReady', formExtension.onFormReady);
                    }

                    if (_.isFunction(formExtension.onFieldChange)) {
                        formExtension.onFieldChange = formExtension.onFieldChange.bind(formExtension);
                        formExtension.onFieldChange = safeFunction(formExtension.onFieldChange);
                        this.subscribe('onFieldChange', formExtension.onFieldChange);
                    }

                    this.extensions.push(formExtension);
                }
            });
        } catch (e) {
            Bugsnag.notify(e);
            log(e);
        }
    }

    private _getFieldStyles(field, fieldsStyles: {[key: string]: ViewStyle}) {
        if (!_.isString(field.resolvedType) || !_.isObject(fieldsStyles) || Object.keys(fieldsStyles).length === 0) {
            return null;
        }

        if (_.isObject(fieldsStyles[field.resolvedType])) {
            return fieldsStyles[field.resolvedType];
        }
        if (_.isArray(field.resolvedAliases)) {
            const alias = _.find(field.resolvedAliases, (alias) => _.isObject(fieldsStyles[alias]));

            return fieldsStyles[alias];
        }

        return null;
    }

    private _onContentSizeChange(_width, height) {
        this.contentHeight = height;
        log('onContentSizeChange');
        log('this.contentHeight =', this.contentHeight);
    }

    private _onLayoutScrollView({nativeEvent: {layout}}: LayoutChangeEvent) {
        this.frame = layout;

        this.setState({
            frameHeight: this.frame.height,
        });

        log('onLayoutScrollView');
        log('state.frameHeight:', this.frame.height);
    }

    private _onScroll({
        nativeEvent: {
            contentOffset: {y},
        },
    }) {
        this.currentOffset = y;
    }

    private _keyboardWillShow = (e) => {
        if (!e || _.get(e, 'easing', 'keyboard') !== 'keyboard') {
            return;
        }

        const {duration} = e;

        if (LayoutAnimationEnabled) {
            LayoutAnimation.configureNext({
                duration,
                update: {
                    type: LayoutAnimation.Types.keyboard,
                },
            });
        }
    };

    private _keyboardWillHide(event) {
        const {isEventFromThisApp} = event;

        if (!isEventFromThisApp) {
            return;
        }

        if (this.skipHide) {
            this.skipHide = false;
            return;
        }

        if (!event || _.get(event, 'easing', 'keyboard') !== 'keyboard') {
            return;
        }

        const {duration} = event;

        if (LayoutAnimationEnabled) {
            LayoutAnimation.configureNext({
                duration,
                update: {
                    type: LayoutAnimation.Types.keyboard,
                },
            });
        }
    }

    private _keyboardDidShow(event) {
        const {focused} = this.state;
        const {isEventFromThisApp} = event;

        if (!isEventFromThisApp) {
            return;
        }

        this.keyboardShown = true;

        if (_.isString(focused) && this._fieldViewRefs[focused] && _.isObject(event) && _.get(event, 'easing', 'keyboard') === 'keyboard') {
            this.scrollToView(this._fieldViewRefs[focused]);
        }
    }

    private _keyboardDidHide() {
        this.keyboardShown = false;
    }

    private _orientationDidChange() {
        if (!this.keyboardShown) {
            if (LayoutAnimationEnabled) {
                LayoutAnimation.configureNext({
                    duration: 100,
                    update: {
                        type: LayoutAnimation.Types.keyboard,
                    },
                });
            }
        } else {
            this.skipHide = true;
        }
    }

    private _renderFields(fields) {
        const {fieldsStyles, theme, navigation, route} = this.props;
        const items = [];
        const isVisible = (field) => !_.isNull(field.component) && field.visibility === true;
        const isCustom = (field) => _.indexOf(field.groups, formGroups.NOT_FORM) !== -1;
        const isTextInput = (field) => _.indexOf(field.groups, formGroups.TEXT) !== -1;
        const isDisabled = (field) => _.get(field, 'props.disabled', false);

        _.forEach(fields, (field, k) => {
            const preparedK = _.toNumber(k);

            if (_.isFunction(field)) {
                items.push(field(this));
            } else if (isVisible(field)) {
                let key;
                let fieldComponent;

                if (isCustom(field)) {
                    key = `${field.fullName}-custom`;
                    fieldComponent = React.createElement(field.component, {
                        theme,
                        navigation,
                        route,
                        ...field.props,
                        name: field.name,
                        form: this,
                        ref: (view) => {
                            if (view && _.isFunction(view.listenReadyState)) {
                                this._onLoadPromises[field.fullName] = view.listenReadyState();
                            }
                        },
                    });
                } else {
                    key = `${field.fullName}[${_.get(field, 'rawConfig.type') || field.component.displayName}]`;
                    const commonProps = {
                        theme,
                        navigation,
                        route,
                        ref: (view) => {
                            if (view) {
                                if (_.isFunction(view.getWrappedInstance)) {
                                    this._fieldRefs[field.fullName] = view.getWrappedInstance();
                                }

                                this._fieldRefs[field.fullName] = this._fieldRefs[field.fullName] || view;
                            }

                            if (view && _.isFunction(view.listenReadyState)) {
                                this._onLoadPromises[field.fullName] = view.listenReadyState();
                            }
                        },
                        customStyle: this._getFieldStyles(field, fieldsStyles),
                        value: field.value,
                        error: field.error,
                        onChangeValue: this._onChangeCallbacks?.[field.fullName] || _.noop,
                        onFocus: this._onFocusCallbacks?.[field.fullName] || _.noop,
                        onBlur: this._onBlurCallbacks?.[field.fullName] || _.noop,
                        name: field.name,
                        form: this,
                        testID: field.name,
                    };

                    if (isTextInput(field)) {
                        const nextIndex = _.findIndex(
                            fields,
                            (field) => !_.isFunction(field) && !isCustom(field) && isVisible(field) && !isDisabled(field),
                            preparedK + 1,
                        );
                        const nextField = fields[nextIndex];

                        fieldComponent = React.createElement(field.component, {
                            blurOnSubmit: !(_.isObject(nextField) && isTextInput(nextField)),
                            returnKeyType: nextIndex === -1 ? 'done' : 'next',
                            onSubmitEditing: this._onSubmitEditingCallbacks?.[field.fullName] || _.noop,
                            ...field.props,
                            ...commonProps,
                        });
                    } else {
                        fieldComponent = React.createElement(field.component, {
                            ...field.props,
                            ...commonProps,
                        });
                    }
                }

                items.push(
                    // @ts-ignore
                    React.createElement(
                        View,
                        {
                            key,
                            style: {
                                ...Platform.select({
                                    ios: {
                                        zIndex: field.focused ? 2 : 1,
                                    },
                                }),
                            },
                            ref: (view) => {
                                this._fieldViewRefs[field.fullName] = view;
                            },
                        },
                        fieldComponent,
                    ),
                );
            }
        });

        return items;
    }

    private renderErrors(
        error: string | React.ReactNode,
        styles: {
            errorContainer: StyleProp<ViewStyle>;
            errorIcon: StyleProp<ViewStyle>;
            errorIconPane: StyleProp<ViewStyle>;
            error: StyleProp<ViewStyle>;
            errorText: StyleProp<TextStyle>;
        },
    ) {
        const {version = 0} = this.props;

        return <FormError ref={this._formErrorRef} form={this as IForm} error={error} styles={styles} key={`error-${version}`} />;
    }

    private renderSuccessMessage(
        successMessage: string,
        styles: {
            successContainer: StyleProp<ViewStyle>;
            successIcon: StyleProp<ViewStyle>;
            success: StyleProp<ViewStyle>;
            successText: StyleProp<TextStyle>;
        },
    ) {
        return (
            <View style={styles.successContainer} ref={this._formSuccessRef} key='success'>
                <View style={styles.successIcon}>
                    <Icon name='success' color={Colors.white} size={18} />
                </View>
                <View style={styles.success}>
                    <Text style={styles.successText}>{successMessage}</Text>
                </View>
            </View>
        );
    }

    render() {
        const {fields, error: stateError, successMessage: stateSuccessMessage} = this.state;
        const {
            errors: propErrors,
            successMessage: propSuccessMessage,
            headerComponent,
            footerComponent,
            customStyle,
            insets,
            topBounceColor,
            bottomBounceColor,
        } = this.props;
        const colors = this.themeColors;
        const styles = StyleSheet.create({
            container: {
                flexGrow: 1,
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                backgroundColor: Colors.white,
                ..._.get(customStyle, 'container.base'),
            },
            containerDark: {
                backgroundColor: DarkColors.bgLight,
                ..._.get(customStyle, 'containerDark.base'),
            },
            fieldsContainer: {
                flex: 8,
                ...Platform.select({
                    ios: {
                        paddingVertical: 0,
                    },
                }),
                ..._.get(customStyle, 'fieldsContainer.base'),
            },
            successContainer: {
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
                paddingHorizontal: 12,
                paddingVertical: 15,
                marginBottom: 10,
                backgroundColor: colors.green,
                ..._.get(customStyle, 'successContainer.base'),
            },
            success: {
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                ..._.get(customStyle, 'success.base'),
            },
            successText: {
                fontFamily: Fonts.regular,
                fontSize: 16,
                color: Colors.white,
            },
            successIcon: {
                flexWrap: 'nowrap',
                justifyContent: 'center',
                marginRight: 8,
                paddingTop: 2,
            },
            errorContainer: {
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
                paddingHorizontal: 12,
                paddingVertical: 15,
                marginBottom: 10,
                backgroundColor: colors.red,
                ..._.get(customStyle, 'errorContainer.base'),
            },
            errorIcon: {
                flexWrap: 'nowrap',
                justifyContent: 'center',
                marginRight: 8,
                paddingTop: 2,
            },
            errorIconPane: {
                position: 'absolute',
                width: 2,
                top: 4,
                left: 8,
                height: 14,
                backgroundColor: 'white',
            },
            error: {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'wrap',
                ..._.get(customStyle, 'error.base'),
            },
            errorText: {
                fontFamily: Fonts.regular,
                fontSize: 16,
                color: Colors.white,
            },
        });
        let error;

        if (!util.isEmpty(stateError)) {
            error = stateError;
        } else {
            error = _.isArray(propErrors) && propErrors.length > 0 ? propErrors[0] : null;
        }

        const successMessage = !util.isEmpty(stateSuccessMessage) ? stateSuccessMessage : propSuccessMessage;
        const success = !util.isEmpty(successMessage);

        let formContent = (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                {_.isFunction(headerComponent) ? headerComponent() : headerComponent}
                {!success && !_.isNil(error) && this.renderErrors(error, styles)}
                {success && _.isNil(error) && _.isString(successMessage) && this.renderSuccessMessage(successMessage, styles)}

                <View style={styles.fieldsContainer}>{this._renderFields(_.values(fields))}</View>
                {_.isFunction(footerComponent) ? footerComponent() : footerComponent}
            </View>
        );

        const {frameHeight} = this.state;
        const minHeight = _.isNumber(frameHeight) ? frameHeight - insets.bottom : frameHeight;

        // @ts-ignore
        formContent = <View style={{minHeight}}>{formContent}</View>;

        const scrollView = (
            <>
                {(_.isString(topBounceColor) || _.isString(bottomBounceColor)) && (
                    <ScrollViewBackgroundLayer topBounceColor={topBounceColor} bottomBounceColor={bottomBounceColor} />
                )}
                <AnimatedScrollView
                    ref={this._scrollViewRef}
                    onContentSizeChange={this._onContentSizeChange}
                    onLayout={this._onLayoutScrollView}
                    onScroll={this._onScroll}
                    scrollEventThrottle={16}
                    scrollIndicatorInsets={{right: 1}}
                    contentContainerStyle={{
                        paddingBottom: insets.bottom,
                    }}
                    showsVerticalScrollIndicator
                    alwaysBounceVertical
                    automaticallyAdjustContentInsets={false}
                    automaticallyAdjustKeyboardInsets={false}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'>
                    {formContent}
                </AnimatedScrollView>
            </>
        );

        if (isIOS) {
            return <KeyboardAvoidingView>{scrollView}</KeyboardAvoidingView>;
        }

        return scrollView;
    }
}

export default React.memo(
    React.forwardRef<IForm, Omit<FormProps, 'theme' | 'insets'>>((props, ref) => {
        const theme = useTheme();
        const navigation = useNavigation();
        const route = useRoute();
        const insets = useSafeAreaInsets();
        const [isFocused, setIsFocused] = useState(false);
        const formRef = useRef<IForm>();

        useImperativeHandle(ref, () => formRef.current!);

        useFocusEffect(() => {
            setIsFocused(true);
        });

        return (
            <Provider>{isFocused && <Form {...props} theme={theme} navigation={navigation} route={route} insets={insets} ref={formRef} />}</Provider>
        );
    }),
);
