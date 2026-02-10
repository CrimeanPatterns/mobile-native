import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import API from '../../../services/api';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ThemeColors, useTheme, withTheme} from '../../../theme';
import Icon from '../../icon';
import {AolIcon} from '../../oauth/aol';
import {AppleIcon} from '../../oauth/apple';
import {GoogleIcon} from '../../oauth/google';
import {MicrosoftIcon} from '../../oauth/microsoft';
import {YahooIcon} from '../../oauth/yahoo';
import {AppleStyleSwipeableRow} from '../../page/swipeableList/AppleStyleSwipeableRow';
import styles from './styles';
import {TextProperty} from './textProperty';

// eslint-disable-next-line react/prop-types
const ActionUnlink = React.memo(({onPress}) => {
    const theme = useTheme();
    const colors = ThemeColors[theme];

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[customStyles.swipeButton, {backgroundColor: colors.red}]}>
                <Icon name='unlink' color={Colors.white} size={25} />
                <Text style={customStyles.swipeButtonText}>{Translator.trans(/** @Desc("Unlink") */ 'unlink', {}, 'mobile-native')}</Text>
            </View>
        </TouchableOpacity>
    );
});

class LinkedAccount extends TextProperty {
    static propTypes = {
        provider: PropTypes.string,
        email: PropTypes.string,
        title: PropTypes.string,
        name: PropTypes.string,
        icon: PropTypes.string,
        id: PropTypes.number,
        type: PropTypes.string,
        group: PropTypes.string,
    };

    static icon = {
        google: <GoogleIcon size={20} />,
        yahoo: <YahooIcon size={20} />,
        microsoft: <MicrosoftIcon size={20} />,
        apple: <AppleIcon size={20} />,
        aol: <AolIcon size={24} />,
    };

    reload = () => {
        const {navigation} = this.props;

        navigation.dispatch({type: 'RELOAD'});
    };

    unlink = async () => {
        const {id, navigation} = this.props;
        const response = await API.delete(`/oauth/${id}`);

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isObject(data)) {
                const {success, error, setPassword, formLink} = data;
                const buttons = [
                    {
                        text: Translator.trans('alerts.btn.cancel'),
                    },
                ];

                if (setPassword) {
                    buttons.push({
                        text: Translator.trans('button.set-aw-password'),
                        onPress: () => {
                            navigation.navigate('ProfileEdit', {formLink});
                        },
                    });
                }

                if (error) {
                    Alert.alert(null, error, buttons);
                }

                if (success) {
                    this.reload();
                }
            }
        }
    };

    getText = () => {
        const {email} = this.props;

        return email;
    };

    getHint = () => {
        const {name} = this.props;

        return name;
    };

    renderIcon = () => {
        const {provider} = this.props;

        return LinkedAccount.icon[provider];
    };

    renderCaption = () => {
        const {title} = this.props;

        return (
            <View style={styles.containerCaption}>
                <Text style={[styles.caption, this.isDark && styles.textDark]}>{title}</Text>
            </View>
        );
    };

    renderDetails = () => {
        const {text, hint} = this.getDetails();
        const styleTextDark = this.isDark && styles.textDark;

        return (
            <View style={[styles.containerDetails, customStyles.containerDetails, styles.bgLight, this.isDark && styles.bgDark]}>
                {!_.isNil(text) && (
                    <Text numberOfLines={1} style={[styles.boldText, styleTextDark]}>
                        {text}
                    </Text>
                )}
                <View style={styles.containerDetailsRow}>{_.isString(hint) && <Text style={[styles.smallText, styleTextDark]}>{hint}</Text>}</View>
            </View>
        );
    };

    renderQuickActions = () => <ActionUnlink onPress={this.unlink} />;

    _render() {
        const {testID} = this.props;

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <View style={customStyles.row} testID={testID} accessibilityLabel={this.accessibilityLabel}>
                    <View style={customStyles.icon}>{this.renderIcon()}</View>
                    <View pointerEvents='box-only' style={customStyles.containerWrap}>
                        {this.renderCaption()}
                        {this.renderDetails()}
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <AppleStyleSwipeableRow renderQuickActions={this.renderQuickActions} maxSwipeDistance={70}>
                {this._render()}
            </AppleStyleSwipeableRow>
        );
    }
}

export default withTheme(LinkedAccount);

const customStyles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: isIOS ? 15 : 16,
    },
    containerWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerCaption: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        maxWidth: '80%',
    },
    containerDetails: {
        paddingVertical: 10,
        paddingRight: 15,
    },
    icon: {
        marginRight: 20,
    },
    quickActions: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        flexDirection: 'row',
    },
    quickActionsDark: {
        backgroundColor: DarkColors.bgLight,
    },
    swipeButton: {
        width: 70,
        paddingHorizontal: 5,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    swipeButtonText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
});
