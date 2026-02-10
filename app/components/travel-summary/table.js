import _ from 'lodash';
import React, {useCallback} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme, withTheme} from '../../theme';
import Card from './card';
import {CardScrollView} from './cardScrollView';

const CardTable = withTheme(
    React.memo(({theme, title, backgroundColor, titleColor, children}) => {
        const isDark = theme === 'dark';

        return (
            <Card
                backgroundColor={backgroundColor || (isDark && DarkColors.bgLight)}
                titleColor={titleColor || isDark ? DarkColors.white : Colors.blue}
                handleColor={isDark ? Colors.white : Colors.gray}
                title={title}>
                {children}
            </Card>
        );
    }),
);

function getData(data) {
    let total = 0;

    return [
        data.map(({key, value, title}) => {
            total += parseInt(value, 10);
            return {
                name: key,
                title,
                value: parseInt(value, 10),
            };
        }),
        total,
    ];
}

const TableRow = React.memo(({index, name, title, value, total, theme, displayName = true}) => {
    const isDark = theme === 'dark';
    const percent = Math.round((value * 100) / total);

    return (
        <View key={name} style={[styles.row, isDark && styles.rowDark]}>
            <View style={styles.number}>
                <Text style={[styles.textNumber, isDark && styles.textNumberDark]}>{index + 1}</Text>
            </View>
            <View style={styles.main}>
                {displayName && (
                    <View>
                        <Text style={[styles.mainText, styles.textName, isDark && styles.mainTextDark]}>{name}</Text>
                        <Text style={[styles.secondaryText, isDark && styles.secondaryTextDark]}>{title}</Text>
                    </View>
                )}
                {!displayName && (
                    <View style={{alignSelf: 'center'}}>
                        <Text style={[styles.mainText, styles.singleText, isDark && styles.mainTextDark]}>{title}</Text>
                    </View>
                )}
                <View style={styles.statistic}>
                    <Text style={[styles.mainText, styles.valueText, isDark && styles.mainTextDark]}>{value}</Text>
                    {percent > 1 && <Text style={[styles.secondaryText, isDark && styles.secondaryTextDark]}>{`${percent} %`}</Text>}
                </View>
            </View>
        </View>
    );
});

const Table = ({data, onScroll: _onScroll, displayName}) => {
    const theme = useTheme();
    const [table, total] = getData(data);

    const onScroll = useCallback(() => {
        _onScroll();
    }, [_onScroll]);

    if (_.isArray(table)) {
        return (
            <CardScrollView onScroll={onScroll}>
                {table.map(({name, title, value}, index) => (
                    <TableRow
                        key={`${name}=${value}`}
                        displayName={displayName}
                        name={name}
                        title={title}
                        value={value}
                        index={index}
                        total={total}
                        theme={theme}
                    />
                ))}
            </CardScrollView>
        );
    }

    return null;
};

export default Table;
export {CardTable};

const styles = StyleSheet.create({
    table: {
        borderTopWidth: 1,
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    rowDark: {
        borderColor: DarkColors.border,
    },
    number: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
    },
    main: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 15,
    },
    textNumber: {
        fontFamily: Fonts.regular,
        fontSize: 15,
    },
    textNumberDark: {
        color: Colors.white,
    },
    textName: {
        color: Colors.black,
    },
    mainText: {
        color: Colors.textGray,
        fontFamily: Fonts.regular,
        fontSize: 16,
    },
    singleText: {
        fontSize: 15,
    },
    mainTextDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    valueText: {
        fontFamily: Fonts.bold,
    },
    secondaryText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.grayDark,
    },
    secondaryTextDark: {
        color: DarkColors.text,
    },
    statistic: {
        alignItems: 'flex-end',
    },
});
