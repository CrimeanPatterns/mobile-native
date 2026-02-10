import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import ProviderIcons from '../../../config/providerIcons';
import {isIOS} from '../../../helpers/device';
import {PathConfig} from '../../../navigation/linking';
import {navigateByPath} from '../../../services/navigator';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedComponent} from '../../baseThemed';
import Icon from '../../icon';
import {TouchableBackground} from '../../page/touchable';

@withTheme
class AccountListTitle extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
        name: PropTypes.string.isRequired,
        kind: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        isFirst: PropTypes.bool,
    };

    static LAYOUT_HEIGHT = 50;

    handlePress = (kind) => {
        navigateByPath(PathConfig.AccountAddListProvider, {kindId: kind});
    };

    renderPlus = () => {
        const {kind} = this.props;

        if (_.isNil(ProviderIcons[kind]) || kind === 11) {
            return null;
        }

        if (isIOS) {
            return (
                <TouchableOpacity style={styles.iconWrap} onPress={() => this.handlePress(kind)}>
                    <Icon name={'plus'} size={18} color={this.isDark ? Colors.white : Colors.grayDark} />
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.touchableIconWrap}>
                <TouchableBackground
                    onPress={() => this.handlePress(kind)}
                    backgroundColor={this.isDark ? DarkColors.bgLight : Colors.white}
                    activeBackgroundColor={this.isDark ? DarkColors.grayDark : Colors.grayLight}
                    rippleColor={this.isDark ? DarkColors.border : Colors.grayLight}
                    style={styles.iconWrap}>
                    <Icon name={'plus'} size={18} color={this.isDark ? Colors.white : Colors.grayDark} />
                </TouchableBackground>
            </View>
        );
    };

    render() {
        const {name, kind, style, isFirst} = this.props;
        const iconColor = this.selectColor(isIOS ? Colors.borderGray : DarkColors.grayLight, DarkColors.grayLight);

        return (
            <View
                style={[
                    styles.titleWrap,
                    this.isDark && styles.titleWrapDark,
                    ..._.flatMapDeep(style),
                    isFirst && styles.firstTitle,
                    isFirst && this.isDark && styles.firstTitleDark,
                ]}>
                <View style={[styles.title, this.isDark && styles.titleDark]}>
                    <View style={styles.titleTextBlock}>
                        {_.isObject(ProviderIcons[kind]) && <Icon {...ProviderIcons[kind]} color={iconColor} />}

                        <Text
                            numberOfLines={1}
                            style={[styles.titleText, this.isDark && styles.titleTextDark, _.isNil(ProviderIcons[kind]) && styles.titleTextNoIcon]}>
                            {name}
                        </Text>
                    </View>

                    {this.renderPlus()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleWrap: {
        backgroundColor: Colors.white,
        ...Platform.select({
            android: {
                height: 48,
            },
            ios: {
                height: 62,
                borderBottomWidth: 1,
                borderBottomColor: Colors.gray,
            },
        }),
    },
    titleWrapDark: {
        backgroundColor: DarkColors.bgLight,
        borderBottomColor: DarkColors.bg,
        ...Platform.select({
            android: {
                borderBottomWidth: 1,
            },
        }),
    },
    firstTitle: {
        ...Platform.select({
            ios: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderWidth: 1,
                borderColor: Colors.gray,
            },
        }),
    },
    firstTitleDark: {
        ...Platform.select({
            ios: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: DarkColors.bg,
            },
        }),
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingLeft: 15,
                height: AccountListTitle.LAYOUT_HEIGHT,
            },
            android: {
                paddingLeft: 14,
                height: 54,
            },
        }),
    },
    titleDark: {
        borderBottomWidth: 0,
    },
    titleTextBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                marginLeft: 15,
                fontSize: 22,
            },
            android: {
                marginLeft: 8,
                fontSize: 18,
            },
        }),
    },
    titleTextDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    titleTextNoIcon: {
        marginLeft: 0,
    },
    touchableIconWrap: {
        overflow: 'hidden',
        borderRadius: 100,
        marginRight: 4,
    },
    iconWrap: {
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            android: {
                padding: 10,
            },
        }),
    },
});

export default AccountListTitle;
