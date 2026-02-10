import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {NativeModules, Platform, StyleSheet, View} from 'react-native';

import {BaseThemedComponent} from '../../components/baseThemed';
import Form, {IForm, stylesMaker, SubmitButton} from '../../components/form';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import {useProfileScreenReload} from '../../hooks/profile';
import API from '../../services/api';
import UserSettings, {defaultUserSettings, isVibrationSupported} from '../../services/userSettings';
import {Colors, DarkColors} from '../../styles';
import {useDark, useTheme} from '../../theme';
import {FormDataResponse} from '../../types/form';
import {ProfileStackParamList, ProfileStackScreenFunctionalComponent} from '../../types/navigation';

const SubTitle = require('../../components/profile/overview/plainSubTitle').default;

const TextProperty = Platform.select({
    ios: require('../../components/profile/overview/formLink').ProfileFormLink,
    android: require('../../components/profile/overview/textProperty').TextProperty,
});

function filterFormChildren(fields) {
    const filtered = fields.filter(
        (field) =>
            !(
                ((isIOS || (!isIOS && NativeModules.PlatformConstants.Version >= 26)) && ['sound', 'vibrate'].indexOf(field.name) !== -1) ||
                (field.name === 'vibrate' && !isVibrationSupported())
            ),
    );

    return filtered.map((field) => {
        if (['sound', 'vibrate'].indexOf(field.name) !== -1) {
            field.value = UserSettings.get(field.name);
            field.mapped = true;
        }

        return field;
    });
}

class ProfileEdit extends BaseThemedComponent<
    {
        navigation: StackNavigationProp<ProfileStackParamList, 'ProfileEdit'>;
        route: RouteProp<ProfileStackParamList, 'ProfileEdit'>;
        reload: () => void;
    },
    {
        fields: unknown[] | null;
        errors: string[];
        formExtension: string | null;
        version: number;
        submitLabel: string | null;
    }
> {
    static customTypes = {
        groupTitle: {
            component: require('../../components/profile/overview/groupTitle').default,
            simpleComponent: true,
        },
        paragraph: {
            component: require('../../components/profile/overview/paragraph').default,
            simpleComponent: true,
        },
        subTitle: {
            component: React.forwardRef((props, ref) => {
                const isDark = useDark();
                const color = isDark ? DarkColors.gold : Colors.gold;

                return <SubTitle ref={ref} color={isAndroid ? color : null} {...props} />;
            }),
            simpleComponent: true,
        },
        table: {
            component: require('../../components/profile/overview/table').default,
            simpleComponent: true,
        },
        textProperty: {
            component: React.forwardRef((props, ref) => (
                <TextProperty
                    ref={ref}
                    style={{
                        ...Platform.select({
                            android: {
                                borderBottomWidth: 0,
                            },
                        }),
                    }}
                    {...props}
                />
            )),
            simpleComponent: true,
        },
        warningLink: {
            component: require('../../components/profile/overview/warningLink').default,
            simpleComponent: true,
        },
    };

    private mounted = false;

    private submitButton = React.createRef<typeof SubmitButton>();

    private form = React.createRef<IForm>();

    constructor(props) {
        super(props);

        this._submit = this._submit.bind(this);
        this._renderFooter = this._renderFooter.bind(this);

        this.state = {
            fields: null,
            errors: [],
            formExtension: null,
            version: 1,
            submitLabel: null,
        };
    }

    componentDidMount() {
        const {route} = this.props;
        const formLink = route?.params?.formLink;

        if (formLink) {
            this._getForm(formLink);
        }

        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    reload = () => {
        const {reload} = this.props;

        reload();
    };

    onFormReady = (form) => {
        const {route} = this.props;
        const scrollTo = route?.params?.scrollTo;

        if (scrollTo) {
            form.scrollToField(scrollTo);
        }
    };

    _getForm(formLink) {
        const {navigation} = this.props;

        API.get<FormDataResponse>(formLink).then((response) => {
            const {data} = response;

            if (_.isObject(data)) {
                const {formTitle} = data;

                if (_.isString(formTitle)) {
                    navigation.setOptions({title: formTitle});
                }
                this._setForm(data);
            }
        });
    }

    _setForm(data: FormDataResponse) {
        if (!this.mounted || !_.isObject(data)) {
            return;
        }

        const {navigation} = this.props;
        const {success, next, submitLabel, error, errors, children, needUpdate, jsProviderExtension} = data;

        if (success === true) {
            if (_.isObject(next) && _.has(next, 'params.formLink')) {
                navigation.push('ProfileEdit', {
                    formLink: _.get(next, 'params.formLink'),
                });
            } else {
                navigation.navigate('Profile', {
                    reload: needUpdate,
                });
            }

            return;
        }

        this.setState((state) => {
            let version;
            let fields;
            let formErrors;
            let formExtension;
            const formSubmitLabel = submitLabel ?? null;

            if (_.isArray(children)) {
                version = state.version + 1;
                fields = filterFormChildren(children);
                if (_.isArray(errors)) {
                    formErrors = errors;
                }
            }
            if (_.isString(jsProviderExtension) || _.isArray(jsProviderExtension)) {
                formExtension = jsProviderExtension;
            }
            if (_.isString(error) && !_.isEmpty(error)) {
                formErrors = [error];
            }

            return {
                ...state,
                version: version || state.version,
                fields: fields || state.fields || [],
                errors: formErrors || [],
                formExtension: formExtension || state.formExtension,
                submitLabel: formSubmitLabel || state.submitLabel,
            };
        });
    }

    _submit(fields) {
        const {route} = this.props;
        const formLink = route?.params?.formLink;

        if (_.isNil(formLink)) {
            return;
        }

        this._setLoading(true);

        const newUserSettings = {};

        _.forEach(fields, (value, name) => {
            if (_.isBoolean(value) && _.isUndefined(defaultUserSettings[name]) === false) {
                newUserSettings[name] = value;
            }
        });

        if (_.size(newUserSettings) > 0) {
            UserSettings.extend(newUserSettings);
        }

        API.put<FormDataResponse>(formLink, fields).then(
            (response) => {
                this._setLoading(false);
                if (!this._isAutoSubmit()) {
                    this._setForm(response.data);
                } else {
                    this.reload();
                }
            },
            () => {
                this._setLoading(false);
            },
        );
    }

    _setLoading(loading) {
        this.submitButton?.current?.setLoading(loading);
    }

    _isAutoSubmit() {
        const {submitLabel} = this.state;

        return !_.isString(submitLabel);
    }

    _renderFooter() {
        const {fields, submitLabel} = this.state;
        const {theme} = this.props;

        if (this._isAutoSubmit() || (_.isArray(fields) && fields.length === 0)) {
            return null;
        }

        return (
            <SubmitButton
                ref={this.submitButton}
                color={isIOS ? this.selectColor(Colors.blueDark, DarkColors.blue) : this.selectColor(Colors.gold, DarkColors.gold)}
                onPress={() => this.form?.current?.submit()}
                label={submitLabel}
                raised
                theme={theme}
            />
        );
    }

    render() {
        const {fields, errors, formExtension, version} = this.state;
        const isLoading = !_.isArray(fields);

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {isLoading && <Spinner androidColor={this.selectColor(Colors.gold, DarkColors.gold)} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && (
                    <Form
                        ref={this.form}
                        version={version}
                        autoSubmit={this._isAutoSubmit()}
                        fields={fields}
                        customTypes={ProfileEdit.customTypes}
                        errors={errors}
                        formExtension={formExtension}
                        footerComponent={this._renderFooter}
                        onSubmit={this._submit}
                        fieldsStyles={isAndroid ? stylesMaker(this.selectColor(Colors.gold, DarkColors.gold)) : undefined}
                        onFormReady={this.onFormReady}
                    />
                )}
            </View>
        );
    }
}

const ProfileEditScreen: ProfileStackScreenFunctionalComponent<'ProfileEdit'> = ({navigation, route}) => {
    const theme = useTheme();
    const reload = useProfileScreenReload();

    return <ProfileEdit theme={theme} navigation={navigation} route={route} reload={reload} />;
};

ProfileEditScreen.navigationOptions = () => ({
    title: '',
    headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
});

export {ProfileEditScreen, ProfileEdit};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
});
