import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {isAndroid, isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import Badge from '../../badge';
import {BaseThemedComponent} from '../../baseThemed';

const touchable = (children, onPress) => {
    if (isIOS && _.isFunction(onPress)) {
        return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
    }

    return children;
};

@withTheme
class Title extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        onPress: PropTypes.func,
        title: PropTypes.string.isRequired,
        amount: PropTypes.number,
        children: PropTypes.node,
        amountColor: PropTypes.string,
        amountColorDark: PropTypes.string,
        style: PropTypes.any,
    };

    static defaultProps = {
        amountColor: Colors.blueDark,
    };

    render() {
        const {onPress, title, amount, amountColor, amountColorDark, children, style} = this.props;
        const baseColor = this.isDark ? amountColorDark : amountColor;
        const badgeColor = this.isDark && {
            square: {
                backgroundColor: Platform.select({
                    ios: DarkColors.blue,
                    android: baseColor,
                }),
            },
        };

        return touchable(
            <View style={[styles.container]} testID='header-title' accessible accessibilityLabel={`${title} ${amount}`}>
                <Text style={[styles.textTitle, style, this.isDark && styles.textTitleDark]} ellipsizeMode='tail' nubmerOfLines={1}>
                    {title}
                </Text>
                {_.isNumber(amount) && (
                    <Badge
                        style={{
                            ...badgeStyles,
                            ...badgeColor,
                        }}
                        active>
                        <Text style={isAndroid && {color: this.selectColor(baseColor, Colors.black)}}>{String(amount)}</Text>
                    </Badge>
                )}
                {children}
            </View>,
            onPress,
        );
    }
}

export default Title;

const badgeStyles = Platform.select({
    ios: {
        badge: {
            marginLeft: 5,
        },
    },
    android: {
        badge: {
            marginLeft: 16,
        },
    },
});

const styles = StyleSheet.create({
    container: Platform.select({
        ios: {
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
        },
        android: {
            flexDirection: 'row',
            alignItems: 'center',
        },
    }),
    textTitle: Platform.select({
        ios: {
            color: Colors.grayDark,
            fontFamily: Fonts.regular,
            fontSize: 17,
            fontWeight: 'normal',
        },
        android: {
            color: Colors.white,
            fontFamily: Fonts.bold,
            fontSize: 20,
            fontWeight: '500',
        },
    }),
    textTitleDark: {
        color: Colors.white,
    },
});
