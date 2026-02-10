import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Path, Svg} from 'react-native-svg';

import {isAndroid} from '../helpers/device';
import {Colors, DarkColors, Fonts} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedComponent} from './baseThemed';

@withTheme
class Badge extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        active: PropTypes.bool,
        children: PropTypes.node,
        cornerPosition: PropTypes.string,
        style: PropTypes.shape({
            badge: PropTypes.object,
            square: PropTypes.object,
            text: PropTypes.object,
        }),
        styleActive: PropTypes.shape({
            badge: PropTypes.object,
            square: PropTypes.object,
            text: PropTypes.object,
        }),
    };

    static defaultProps = {
        style: {},
        styleActive: null,
        cornerPosition: 'left',
    };

    renderCorner(cornerPosition) {
        if (isAndroid) {
            return null;
        }

        const {active} = this.props;
        let color = '#99a0ad';

        if (active) {
            color = this.selectColor(Colors.blue, DarkColors.blue);
        }

        return (
            <View style={[{alignSelf: 'center'}, cornerPosition === 'right' && {transform: [{rotate: '180deg'}]}]}>
                <Svg height={10} width={10} fill={color} viewBox='0 0 100 100'>
                    <Path d='M 40,50 100,5 100,95 Z' fill={color} stroke={color} />
                </Svg>
            </View>
        );
    }

    render() {
        const {active, children, style, styleActive, cornerPosition} = this.props;
        const customStyle = active && styleActive ? styleActive : style;

        return (
            <View style={[styles.badge, customStyle.badge]}>
                {cornerPosition === 'left' && this.renderCorner(cornerPosition)}
                <View style={[styles.badgeSquare, active && styles.activeSquare, this.isDark && styles.activeSquareDark, customStyle.square]}>
                    <Text style={[styles.amount, active && styles.amountActive, customStyle.text]}>{children}</Text>
                </View>
                {cornerPosition === 'right' && this.renderCorner(cornerPosition)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    badge: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    badgeSquare: {
        minWidth: 25,
        height: 25,
        backgroundColor: '#99a0ad',
        justifyContent: 'center',
        alignItems: 'center',
    },
    amount: {
        padding: 3,
        fontSize: 13,
        color: Colors.white,
        fontFamily: Fonts.bold,
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
            },
            android: {
                fontWeight: '500',
            },
        }),
    },
    amountActive: {},
    activeSquareDark: Platform.select({
        ios: {
            backgroundColor: DarkColors.blue,
        },
    }),
    activeSquare: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.blue,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
});

export default Badge;
