import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, TouchableHighlight, View} from 'react-native';

import {isAndroid, isIOS} from '../../../../helpers/device';
import {getTouchableComponent} from '../../../../helpers/touchable';
import API from '../../../../services/api';
import {Colors, DarkColors} from '../../../../styles';
import Icon from '../../../icon';
import BaseField from '../baseField';
import Text from '../text';

const TouchableItem = getTouchableComponent(TouchableHighlight);

export default class Password extends Text {
    static displayName = 'PasswordField';

    static defaultProps = {
        ...Text.defaultProps,
        secureTextEntry: true,
        autoCorrect: true,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {value: propValue} = nextProps;
        const {value: prevValue, changed} = prevState;

        return {
            changed: changed || propValue !== prevValue,
            focused: prevState.focused,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
            secure: props.secureTextEntry,
            changed: false,
            focused: false,
        };
    }

    componentDidMount() {
        const {form, name} = this.props;

        if (_.isObject(form)) {
            form.setMapped(name, false);
        }
    }

    componentDidUpdate(prevProps, {changed: prevChanged}) {
        const {form, name} = this.props;
        const {changed} = this.state;

        if (_.isObject(form) && !prevChanged && changed) {
            form.setMapped(name, true);
        }
    }

    getStyles() {
        const styles = super.getStyles();

        return {
            ...styles,
            fieldContainer: {
                ...styles.fieldContainer,
                paddingRight: 38,
            },
        };
    }

    getValue() {
        const {changed, focused, secure} = this.state;

        if (!changed && focused) {
            if (this.hasAccessReveal() && secure) {
                return '';
            }

            return '';
        }
        return super.getValue();
    }

    showPassword = async () => {
        const {value} = this.props;
        const {secure} = this.state;
        const passwordHidden = !secure;

        if (!passwordHidden) {
            const {data} = await API.post(this.revealUrl);

            if (data?.password) {
                this._onChangeValue(data.password);
            }
        } else {
            this._onChangeValue(value);
        }
        this.setState({secure: passwordHidden});
    };

    get revealUrl() {
        const {attr} = this.props;

        return attr?.revealUrl;
    }

    hasAccessReveal = () => _.isString(this.revealUrl);

    getRevealIcon = (isHidden) => (isHidden ? 'eye-hidden' : 'eye-show');

    getInputProps() {
        const {secure} = this.state;

        return {
            ...super.getInputProps(),
            secureTextEntry: secure,
        };
    }

    renderRevealButton() {
        const {secure} = this.state;
        const {customStyle} = this.props;
        const androidColor = BaseField.getPrimaryColor(customStyle);

        return (
            this.hasAccessReveal() && (
                <TouchableItem
                    underlayColor={this.selectColor(Colors.white, DarkColors.bg)}
                    style={isIOS && styles.button}
                    onPress={this.showPassword}>
                    <View style={isAndroid && styles.button}>
                        <Icon
                            name={this.getRevealIcon(secure)}
                            color={isIOS ? Colors.grayDark : androidColor}
                            colorDark={isIOS ? Colors.white : androidColor}
                            size={24}
                        />
                    </View>
                </TouchableItem>
            )
        );
    }

    render() {
        return (
            <>
                {super.render()}
                {this.renderRevealButton()}
            </>
        );
    }
}

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
