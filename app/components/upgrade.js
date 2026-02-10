import {useNavigation} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../helpers/device';
import {PathConfig} from '../navigation/linking';
import {buttonDarkStyle, buttonStyle} from '../screens/auth/signIn/styles';
import API from '../services/api';
import {navigateByPath} from '../services/navigator';
import {Colors, DarkColors, Fonts} from '../styles';
import {ThemeColors, useTheme} from '../theme';
import FAQ from './faq';
import {Button} from './form';
import Icon from './icon';

const UpgradeMessage = ({button, style, theme}) => {
    const {orange} = ThemeColors[theme];
    const isDark = theme === 'dark';

    return (
        <View style={[{flex: 1}, style]}>
            <View style={[styles.upgrade, isDark && styles.upgradeDark]}>
                <Icon name='warning' color={orange} size={17} />
                <Text style={[styles.upgradeText, isDark && styles.upgradeTextDark]}>
                    {Translator.trans('award.account.popup.need-upgrade.p1', {}, 'messages')}
                </Text>
            </View>
            {button}
        </View>
    );
};

UpgradeMessage.propTypes = {
    button: PropTypes.element,
    style: PropTypes.any,
    theme: PropTypes.string,
};

const UpgradeButton = ({onPress, style, theme}) => {
    const isDark = theme === 'dark';
    const buttonColor = isDark ? DarkColors.blue : Colors.blueDark;
    const buttonStyles = isDark ? buttonDarkStyle : buttonStyle;

    return (
        <View style={[styles.buttonContainer, isDark && styles.buttonContainerDark, style]} testID='upgrade-button'>
            <Button
                label={Translator.trans('upgrade-now', {}, 'messages')}
                customStyle={{
                    ...{buttonStyles},
                    ...{
                        button: Platform.select({android: {base: {backgroundColor: buttonColor}}}),
                        label: Platform.select({android: {base: {color: isDark ? Colors.black : Colors.white}}}),
                    },
                }}
                raised
                onPress={onPress}
                color={buttonColor}
                pressedColor='#5582bf'
                theme={theme}
            />
        </View>
    );
};

UpgradeButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    style: PropTypes.any,
    theme: PropTypes.string,
};

class UpgradeFAQ extends PureComponent {
    static propTypes = {
        theme: PropTypes.string,
    };

    state = {
        faq: null,
    };

    componentDidMount() {
        this.mounted = true;
        this.getFAQ();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getFAQ() {
        API.post('/faq', [21], {retry: 3}).then((response) => {
            const {data} = response;

            if (_.isArray(data)) {
                this.safeSetState({faq: data});
            }
        });
    }

    upgrade = () => {
        navigateByPath(PathConfig.SubscriptionPayment);
    };

    get isDark() {
        const {theme} = this.props;

        return theme === 'dark';
    }

    renderHeaderFAQ() {
        const {theme} = this.props;

        return <UpgradeMessage theme={theme} button={<UpgradeButton theme={theme} onPress={this.upgrade} />} />;
    }

    renderFooterFAQ() {
        const {theme} = this.props;

        return <UpgradeButton theme={theme} onPress={this.upgrade} style={{borderBottomWidth: 0}} />;
    }

    render() {
        const {faq} = this.state;

        return (
            <ScrollView style={[styles.pageFAQ, this.isDark && styles.pageDark]} contentInsetAdjustmentBehavior='automatic'>
                {this.renderHeaderFAQ()}
                {_.isEmpty(faq) === false && (
                    <View style={{flex: 1, overflow: 'hidden'}}>
                        <FAQ style={styles.pageFAQ} data={faq} />
                        {this.renderFooterFAQ()}
                    </View>
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    pageFAQ: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
            },
        }),
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    upgrade: {
        flexDirection: 'row',
        padding: 25,
        backgroundColor: Colors.white,
    },
    upgradeDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    upgradeText: {
        fontSize: 13,
        marginHorizontal: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    upgradeTextDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    buttonContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: Colors.gray,
            },
        }),
    },
    buttonContainerDark: {
        borderColor: DarkColors.border,
        backgroundColor: isIOS ? Colors.black : DarkColors.bgLight,
    },
});

export {UpgradeMessage, UpgradeButton};

export default () => {
    const navigation = useNavigation();
    const theme = useTheme();

    return <UpgradeFAQ theme={theme} navigation={navigation} />;
};
