import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import Form, {stylesMaker, SubmitButton} from '../../../components/form';
import {HeaderRightButton} from '../../../components/page/header/button';
import {isAndroid, isIOS} from '../../../helpers/device';
import ConnectionsAPI from '../../../services/http/connections';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {ProfileEdit} from '../../profile/edit';
import {BaseConnection} from './index';

class ConnectionEdit extends BaseConnection {
    static navigationOptions = ({route}) => {
        const showActions = route.params?.showActions ?? null;
        let headerRight;

        if (_.isFunction(showActions)) {
            headerRight = <HeaderRightButton iconName={Platform.select({ios: 'more', android: 'android-more'})} onPress={showActions} />;
        }

        return {
            headerRight: () => headerRight,
            headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
            title: '',
        };
    };

    static customTypes = {
        subTitle: ProfileEdit.customTypes.subTitle,
    };

    form = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            fields: null,
            errors: null,
            formExtension: null,
            version: 1,
            loading: false,
            email: null,
            name: null,
            type: null,
            avatar: null,
            status: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getForm();
        this.subscribe();
    }

    componentWillUnmount() {
        this.mounted = false;
        this.unsubscribe();
    }

    getConnection = () => {
        const {route} = this.props;
        const id = route.params?.id;
        const {email, name, type, avatar, status} = this.state;

        return {
            id: String(id),
            email,
            name,
            type,
            avatar,
            status,
        };
    };

    setLoading = (loading) => {
        this.safeSetState({loading});
    };

    reload = (action) => {
        const {navigation, route} = this.props;

        if (action === 'delete') {
            navigation.navigate('Connections', {reload: true});
        } else {
            this.getForm();

            if (['invite', 'cancel_invite'].includes(action)) {
                const reloadCb = route.params?.reloadCb;

                if (_.isFunction(reloadCb)) {
                    reloadCb();
                }
            }
        }
    };

    showActionsSheet = () => {
        const {actions} = this.state;
        const connection = this.getConnection();

        this.showActions({connection, actions});
    };

    setButtonLoading = (loading) => {
        if (this.submitButton && this.mounted) {
            this.submitButton.setLoading(loading);
        }
    };

    getForm = async () => {
        const {navigation} = this.props;
        const connection = this.getConnection();

        if (_.isObject(connection)) {
            const {id} = connection;

            if (id) {
                this.setLoading(true);

                const response = await ConnectionsAPI.getForm(id);

                if (_.isObject(response)) {
                    const {data} = response;

                    if (_.isObject(data)) {
                        const {form, actions = [], email, name, type, avatar, status, askAccess} = data;

                        if (_.isEmpty(actions) === false) {
                            navigation.setParams({showActions: this.showActionsSheet});
                        }

                        this.safeSetState({
                            actions,
                            email,
                            name,
                            type,
                            avatar,
                            status,
                        });

                        this.setForm(form, () => {
                            const connection = this.getConnection();

                            if (askAccess) {
                                navigation.navigate('ConnectionGrantAccess', {connection});
                            }
                        });
                    }
                }

                this.setLoading(false);
            }
        }
    };

    setForm(form, cb) {
        this.safeSetState((state) => {
            const {success, error, errors, children, jsProviderExtension} = form;

            if (success === true) {
                return null;
            }

            let version;
            let formErrors;
            let formExtension;

            if (_.isArray(children)) {
                version = state.version + 1;
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
                fields: children || state.fields || [],
                errors: formErrors || [],
                formExtension: formExtension || state.formExtension,
            };
        }, cb);
    }

    onSubmit = async (fields) => {
        const {navigation} = this.props;
        const {id} = this.getConnection();

        this.setButtonLoading(true);

        try {
            const response = await ConnectionsAPI.saveForm(id, fields);

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    const {form, success} = data;

                    if (_.isObject(form)) {
                        this.setForm(form);
                    }

                    if (success) {
                        navigation.navigate('Connections', {reload: true});
                    }
                }
            }
        } finally {
            this.setButtonLoading(false);
        }
    };

    renderStatus = () => {
        const {status} = this.getConnection();
        const text = BaseConnection.getStatusTranslation(status);
        const statusIcon = this.getStatusIcon(status);

        return (
            _.isString(text) && (
                <View style={styles.userStatus}>
                    <Text style={[styles.userInfo, this.isDark && styles.textGray]}>{text}</Text>
                    {_.isNull(statusIcon) === false && statusIcon}
                </View>
            )
        );
    };

    renderHeader = () => {
        const {name, type, avatar} = this.getConnection();
        const translations = {
            family_member: Translator.trans('user.connections.family_member'),
            connected_user: Translator.trans('connected.user'),
        };

        return (
            <View style={[styles.user, this.isDark && styles.userDark]}>
                <View style={styles.userImageWrap}>
                    {this.renderAvatar(avatar)}
                    {/* <View style={styles.userEdit}> */}
                    {/*    <Text style={styles.userEditText}>EDIT</Text> */}
                    {/* </View> */}
                </View>
                <View style={styles.userDetails}>
                    <Text style={[styles.userName, this.isDark && styles.textDark]}>{name}</Text>
                    {_.isString(translations[type]) && <Text style={[styles.userInfo, this.isDark && styles.textGray]}>{translations[type]}</Text>}
                    {this.renderStatus()}
                </View>
            </View>
        );
    };

    renderFooter = () => {
        const {theme} = this.props;

        return (
            <SubmitButton
                ref={(ref) => {
                    this.submitButton = ref;
                }}
                color={isAndroid ? this.mainColor : this.selectColor(Colors.blueDark, DarkColors.blue)}
                label={Translator.trans('save-information', {}, 'messages')}
                onPress={() => this.form.current?.submit()}
                raised
                theme={theme}
            />
        );
    };

    render() {
        const {loading, fields, errors, formExtension, version} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {loading && this.renderSpinner()}
                {!loading && !_.isEmpty(fields) && (
                    <Form
                        ref={this.form}
                        key={`form${version}`}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        onSubmit={this.onSubmit}
                        fieldsStyles={!isIOS ? stylesMaker(this.mainColor) : undefined}
                        headerComponent={this.renderHeader}
                        footerComponent={this.renderFooter}
                        customStyle={{container: {base: {backgroundColor: this.selectColor(Colors.bgGray, Colors.black)}}}}
                        customTypes={ConnectionEdit.customTypes}
                    />
                )}
                {this.renderConnectionActionSheet()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.bgGray,
    },
    pageDark: {
        backgroundColor: isIOS ? DarkColors.bgLight : DarkColors.bg,
    },
    spinner: {
        marginTop: 10,
        alignSelf: 'center',
    },
    user: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                padding: 15,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
            android: {
                paddingHorizontal: 16,
                paddingVertical: 25,
            },
        }),
    },
    userDark: {
        backgroundColor: DarkColors.bg,
        ...Platform.select({
            ios: {
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    userName: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 17,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    userDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingLeft: 15,
            },
            android: {
                paddingLeft: 20,
            },
        }),
    },
    userImageWrap: {
        position: 'relative',
        overflow: 'hidden',
    },
    userInfo: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        marginRight: 10,
    },
    userStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    textGray: {
        color: DarkColors.text,
    },
});

export default withTheme(ConnectionEdit);
