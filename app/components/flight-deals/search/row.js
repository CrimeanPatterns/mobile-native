import React from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ThemeColors} from '../../../theme';

const TouchableRow = getTouchableComponent(TouchableHighlight);
const propsAreEqual = (prevProps, nextProps) =>
    prevProps.theme === nextProps.theme &&
    prevProps.onChangeOrigin === nextProps.onChangeOrigin &&
    prevProps.airname === nextProps.airname &&
    prevProps.countryname === nextProps.countryname &&
    prevProps.cityname === nextProps.cityname &&
    prevProps.aircode === nextProps.aircode &&
    prevProps.isActive === nextProps.isActive;

const FlightDealsSearchRow = React.memo(
    (
        // eslint-disable-next-line react/prop-types
        {onChangeOrigin, theme, isActive, airname, countryname, cityname, aircode},
    ) => {
        const isDark = theme === 'dark';
        const textActive = isActive && {color: ThemeColors[theme].blue};

        return (
            <TouchableRow
                delayPressIn={0}
                underlayColor={isDark ? DarkColors.bgLight : Colors.grayLight}
                onPress={() => onChangeOrigin(aircode, airname)}>
                <View style={[styles.container, isDark && styles.containerDark]} pointerEvents='box-only'>
                    <View style={[styles.aircode, isDark && styles.aircodeDark]}>
                        <Text style={[styles.text, isDark && styles.textDark, textActive]}>{aircode}</Text>
                    </View>
                    <View style={styles.details}>
                        <Text style={[styles.text, isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {airname}
                        </Text>
                        <Text style={[styles.silverText, isDark && styles.silverDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {`${cityname}, ${countryname}`}
                        </Text>
                    </View>
                </View>
            </TouchableRow>
        );
    },
    propsAreEqual,
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    containerDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    aircode: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: '100%',
        backgroundColor: Colors.grayLight,
    },
    aircodeDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    details: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                paddingLeft: 10,
                paddingRight: 15,
            },
            android: {
                paddingLeft: 10,
                paddingRight: 16,
            },
        }),
    },
    text: {
        fontSize: 17,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    silverText: {
        fontSize: 12,
        color: Colors.grayDarkLight,
        fontFamily: Fonts.regular,
    },
    silverDark: {
        color: DarkColors.grayLight,
    },
    textDark: {
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

export default FlightDealsSearchRow;
