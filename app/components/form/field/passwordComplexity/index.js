import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text as NativeText, TouchableHighlight, View} from 'react-native';

import {isAndroid, isIOS} from '../../../../helpers/device';
import {getTouchableComponent} from '../../../../helpers/touchable';
import {Colors, DarkColors} from '../../../../styles';
import {BaseThemedPureComponent} from '../../../baseThemed';
import Icon from '../../../icon';
import BaseField from '../baseField';
import Text from '../text';

const TouchableItem = getTouchableComponent(TouchableHighlight);

function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g);

    return str.length + (m ? m.length : 0);
}

function checkComplexity({value, complexityLogin, complexityEmail, form}) {
    const preparedValue = _.toString(value);
    const checks = {
        checkPasswordLength: preparedValue.length >= 8 && lengthInUtf8Bytes(preparedValue) <= 72,
        checkLowerCase: preparedValue.match(/[a-z]/) != null,
        checkUpperCase: preparedValue.match(/[A-Z]/) != null,
        checkSpecialChar: preparedValue.match(/[^a-zA-Z\s]/) != null,
        checkLogin: true,
    };

    if (_.isFunction(complexityLogin) && _.isFunction(complexityEmail)) {
        const login = _.trim(_.lowerCase(complexityLogin(form)));
        const email = _.trim(_.lowerCase(complexityEmail(form).replace(/@.*$/, '')));

        checks.checkLogin =
            preparedValue !== '' &&
            (preparedValue.toLowerCase().indexOf(login) === -1 || login === '') &&
            (preparedValue.toLowerCase().indexOf(email) === -1 || email === '');
    }

    return checks;
}

function trackComplexity(props) {
    const {complexityLogin, complexityEmail} = props;
    const checks = checkComplexity(props);
    const showCheckLogin = _.isFunction(complexityLogin) && _.isFunction(complexityEmail);

    return {
        checkPasswordLength: checks.checkPasswordLength,
        checkLowerCase: checks.checkLowerCase,
        checkUpperCase: checks.checkUpperCase,
        checkSpecialChar: checks.checkSpecialChar,
        showCheckLogin,
        checkLogin: checks.checkLogin,
    };
}

export function withPasswordComplexity(Component = Text) {
    class PasswordComplexity extends BaseThemedPureComponent {
        static displayName = `withPasswordComplexity(${Component.displayName || Component.name || 'Component'})`;

        static propTypes = {
            ...Component.propTypes,
            ...BaseThemedPureComponent.propTypes,
            complexityLogin: PropTypes.func,
            complexityEmail: PropTypes.func,
        };

        static defaultProps = {
            ...Component.defaultProps,
        };

        static getDerivedStateFromProps(nextProps, prevState) {
            const {value: propValue} = nextProps;
            const {value: prevValue} = prevState;

            return {
                value: propValue,
                ...(propValue !== prevValue ? trackComplexity(nextProps) : {}),
            };
        }

        constructor(props) {
            super(props);

            this.state = {
                value: props.value,
                secure: props.secureTextEntry,
                ...trackComplexity(props),
            };

            this._handleInnerRef = this._handleInnerRef.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._renderComplexity = this._renderComplexity.bind(this);
            this._onChangeLoginOrEmail = this._onChangeLoginOrEmail.bind(this);
            this.showPassword = this.showPassword.bind(this);
        }

        componentDidMount() {
            const {form} = this.props;

            if (!_.isObject(form) || !_.isFunction(form.subscribe)) {
                return;
            }

            form.subscribe('onFieldChange', this._onChangeLoginOrEmail);
        }

        componentWillUnmount() {
            const {form} = this.props;

            if (!_.isObject(form) || !_.isFunction(form.unsubscribe)) {
                return;
            }

            form.unsubscribe('onFieldChange', this._onChangeLoginOrEmail);
        }

        _onChangeLoginOrEmail(form, fieldName) {
            const {listenFieldNames} = this.props;

            if (!_.isArray(listenFieldNames) || listenFieldNames.length === 0) {
                return;
            }

            if (_.indexOf(listenFieldNames, fieldName) !== -1) {
                this.setState({
                    ...trackComplexity(this.props),
                });
            }
        }

        onValidate() {
            const checks = checkComplexity(this.props);
            const isValid = !(_.indexOf(_.values(checks), false) !== -1);
            const error = isValid
                ? null
                : Translator.trans(/** @Desc("Not all password requirements have been met") */ 'password_requirements', {}, 'validators');

            return {
                error,
                isValid,
            };
        }

        focus() {
            this._input.focus();
        }

        isFocused() {
            return this._input.isFocused();
        }

        blur() {
            this._input.blur();
        }

        _handleInnerRef(ref) {
            const {innerRef = _.noop} = this.props;

            this._input = ref;
            innerRef(this._input);
        }

        _onFocus() {
            const {onFocus = _.noop} = this.props;

            this.setState({
                ...trackComplexity(this.props),
            });
            onFocus();
        }

        showPassword() {
            const {secure} = this.state;

            this.setState({secure: !secure});
        }

        getIcon = (isHidden) => (isHidden ? 'eye-hidden' : 'eye-show');

        getIconColor = () => {
            const {customStyle} = this.props;

            if (isIOS) {
                return this.selectColor(Colors.grayDark, Colors.white);
            }

            return BaseField.getPrimaryColor(customStyle, {});
        };

        _renderComplexity() {
            const {checkPasswordLength, checkLowerCase, checkUpperCase, checkSpecialChar, showCheckLogin, checkLogin} = this.state;
            const colors = this.themeColors;
            const styles = StyleSheet.create({
                container: {
                    ...Platform.select({
                        ios: {
                            paddingVertical: 5,
                        },
                    }),
                },
                item: {
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    ...Platform.select({
                        ios: {
                            paddingVertical: 5,
                        },
                        android: {
                            paddingVertical: 5,
                            paddingHorizontal: 0,
                        },
                    }),
                },
                iconContainer: {
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...Platform.select({
                        ios: {
                            width: 24,
                        },
                        android: {
                            width: 25,
                            marginEnd: 7,
                        },
                    }),
                },
                iconChecked: {
                    color: colors.green,
                },
                iconUnchecked: {
                    color: this.selectColor('#9e9e9e', Colors.white),
                },
                text: {
                    flex: 1,
                    fontSize: 13,
                },
                checked: {
                    color: colors.green,
                },
                unchecked: {
                    color: this.selectColor('#9e9e9e', Colors.white),
                },
            });

            return (
                <View key='complexity' style={styles.container}>
                    {this.renderComplexityItem('password-length', Translator.trans('password.size', {}, 'messages'), checkPasswordLength, styles)}
                    {this.renderComplexityItem('lower-case', Translator.trans('password.lowercase', {}, 'messages'), checkLowerCase, styles)}
                    {this.renderComplexityItem('upper-case', Translator.trans('password.uppercase', {}, 'messages'), checkUpperCase, styles)}
                    {this.renderComplexityItem('special-char', Translator.trans('password.special_char', {}, 'messages'), checkSpecialChar, styles)}
                    {showCheckLogin && this.renderComplexityItem('login', Translator.trans('password.login', {}, 'messages'), checkLogin, styles)}
                </View>
            );
        }

        renderComplexityItem(key, text, checked, styles) {
            return (
                <View style={styles.item}>
                    <View style={styles.iconContainer}>
                        {checked ? (
                            <Icon name='success' style={styles.iconChecked} size={14} />
                        ) : (
                            <Icon name='ring' style={styles.iconUnchecked} size={22} />
                        )}
                    </View>
                    <NativeText key={key} style={[styles.text, checked ? styles.checked : styles.unchecked]}>
                        {text}
                    </NativeText>
                </View>
            );
        }

        render() {
            const {complexityLogin, complexityEmail, listenFieldNames, ...rest} = this.props;
            const {secure} = this.state;

            return (
                <>
                    <Component
                        {...rest}
                        secureTextEntry={secure}
                        footerComponent={() => this._renderComplexity()}
                        onFocus={this._onFocus}
                        innerRef={this._handleInnerRef}
                    />
                    <TouchableItem
                        underlayColor={this.selectColor(Colors.white, DarkColors.bg)}
                        style={isIOS && styles.button}
                        onPress={this.showPassword}>
                        <View style={isAndroid && styles.button}>
                            <Icon name={this.getIcon(secure)} style={{color: this.getIconColor()}} size={24} />
                        </View>
                    </TouchableItem>
                </>
            );
        }
    }

    return PasswordComplexity;
}

export default withPasswordComplexity();

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 2,
        ...Platform.select({
            ios: {
                right: 19,
                top: 38,
                padding: 8,
            },
            android: {
                padding: 4,
                right: 20,
                top: 31,
            },
        }),
    },
});
