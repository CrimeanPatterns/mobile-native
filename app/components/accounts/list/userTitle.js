import formColor from 'color';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedComponent} from '../../baseThemed';
import Icon from '../../icon';

@withTheme
class AccountListUserTitle extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        familyName: PropTypes.string,
        userName: PropTypes.string.isRequired,
    };

    static LAYOUT_HEIGHT = 40;

    render() {
        const {familyName, userName} = this.props;

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <View style={[styles.containerItem, this.isDark && styles.containerItemDark]}>
                    <Icon name='user' color={isIOS ? Colors.blue : Colors.blueDark} size={24} />
                    {typeof familyName === 'string' && (
                        <Text numberOfLines={1} style={[styles.containerText, this.isDark && styles.containerTextDark]}>
                            {familyName.toUpperCase()}
                            <Text>{` (${userName.toUpperCase()})`}</Text>
                        </Text>
                    )}
                    {typeof familyName !== 'string' && (
                        <Text numberOfLines={1} style={[styles.containerText, this.isDark && styles.containerTextDark]}>
                            {userName.toUpperCase()}
                        </Text>
                    )}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                position: 'relative',
                borderBottomWidth: 1,
                borderColor: Colors.gray,
                height: AccountListUserTitle.LAYOUT_HEIGHT,
            },
            android: {
                height: 29,
            },
        }),
    },
    containerDark: {
        borderBottomColor: DarkColors.bg,
        borderTopColor: DarkColors.bg,
        borderBottomWidth: 1,
        paddingTop: 0,
    },
    containerItem: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                backgroundColor: formColor(Colors.grayLight).alpha(0.5).rgb().toString(),
            },
            android: {
                paddingHorizontal: 14,
                backgroundColor: Colors.grayLight,
            },
        }),
    },
    containerItemDark: {
        backgroundColor: DarkColors.bgLight,
    },
    containerText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        ...Platform.select({
            ios: {
                fontSize: 15,
                paddingLeft: 5,
            },
            android: {
                fontSize: 12,
                paddingLeft: 3,
            },
        }),
    },
    containerTextDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
});

export default AccountListUserTitle;
