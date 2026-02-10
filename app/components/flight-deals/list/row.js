import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {openExternalUrl} from '../../../helpers/navigation';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {withTheme} from '../../../theme';
import Icon from '../../icon';

const TouchableRowHighlight = getTouchableComponent(TouchableHighlight);
const onPress = (link) => openExternalUrl({url: link, external: true});

function touchable(children, onPress, theme) {
    return (
        <TouchableRowHighlight onPress={onPress} delayPressIn={0} underlayColor={theme !== 'dark' ? Colors.grayLight : DarkColors.bg}>
            {children}
        </TouchableRowHighlight>
    );
}

const FlightDealsRow = React.memo(
    (
        // eslint-disable-next-line react/prop-types
        {from, to, price, flight, link, theme},
    ) => {
        const isDark = theme === 'dark';

        return touchable(
            <View style={[styles.container]}>
                <View style={[styles.col, {flex: 1}]}>
                    <View style={styles.row}>
                        <View style={styles.icon}>
                            <Icon name='departure' color={isDark ? Colors.white : IconColors.grayLight} size={16} />
                        </View>
                        <View style={[styles.row, styles.rowFull]}>
                            <View style={styles.col}>
                                <Text style={[styles.text, isDark && styles.whiteDark]}>{from.place}</Text>
                                <Text style={[styles.silverText, isDark && styles.silverDark]}>{from.country}</Text>
                            </View>
                            <View style={[styles.col, styles.indent]}>
                                <View style={styles.textWrap}>
                                    <Text style={[styles.text, isDark && styles.whiteDark]}>{price.local}</Text>
                                    {_.isString(price.usd) && (
                                        <Text style={[styles.text, styles.silverText, styles.indent, styles.textRight, isDark && styles.silverDark]}>
                                            {price.usd}
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.textWrap}>
                                    <Text style={[styles.silverText, isDark && styles.silverDark]}>{price.discount}</Text>
                                    <Icon
                                        name='square-arrow'
                                        style={[styles.indent, styles.iconArrow]}
                                        color={theme === 'dark' ? DarkColors.blue : Colors.blue}
                                        size={10}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.icon}>
                            <Icon name='arrival' color={isDark ? Colors.white : IconColors.grayLight} size={16} />
                        </View>
                        <View style={[styles.row, styles.rowFull]}>
                            <View style={styles.col}>
                                <Text style={[styles.text, isDark && styles.whiteDark]}>{to.place}</Text>
                                <Text style={[styles.silverText, isDark && styles.silverDark]}>{to.country}</Text>
                            </View>
                            <View style={[styles.col, styles.indent]}>
                                <View style={[styles.textWrap, {paddingTop: 3}]}>
                                    <Text style={[styles.text, styles.silverText, styles.textRight, isDark && styles.silverDark]}>
                                        {flight.dates}
                                    </Text>
                                </View>
                                {_.isString(flight.airline) && (
                                    <View style={styles.textWrap}>
                                        <Text style={[styles.silverText, styles.textRight, isDark && styles.silverDark]}>{flight.airline}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
                <Icon name='arrow' style={[styles.arrow, isDark && styles.whiteDark]} size={20} />
            </View>,
            () => onPress(link),
            theme,
        );
    },
    (prevProps, nextProps) => prevProps.theme === nextProps.theme,
);

FlightDealsRow.displayName = 'FlightDealsRow';
FlightDealsRow.propTypes = {
    from: PropTypes.shape({
        place: PropTypes.string,
        country: PropTypes.string,
    }),
    to: PropTypes.shape({
        place: PropTypes.string,
        country: PropTypes.string,
    }),
    price: PropTypes.shape({
        local: PropTypes.string,
        usd: PropTypes.string,
        discount: PropTypes.string,
    }),
    flight: PropTypes.shape({
        dates: PropTypes.string,
        airline: PropTypes.string,
    }),
    link: PropTypes.string,
    theme: PropTypes.string,
};

export default withTheme(FlightDealsRow);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 5,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 100,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    rowFull: {
        flex: 1,
        paddingVertical: 4,
    },
    col: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    icon: {
        width: 40,
        marginTop: 8,
        paddingLeft: 8,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 15,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    whiteDark: {
        color: Colors.white,
    },
    silverText: {
        fontSize: 12,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    silverDark: {
        color: DarkColors.grayLight,
    },
    textWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    indent: {
        marginLeft: 5,
        maxWidth: '60%',
    },
    arrow: {
        color: Colors.grayDarkLight,
        marginLeft: 5,
        marginRight: 8,
    },
    textRight: {
        textAlign: 'right',
    },
    iconArrow: {
        transform: [{rotate: '180deg'}],
    },
});
