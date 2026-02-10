import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {withNavigation} from '../../../navigation/withNavigation';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import AccountListUserTitle from '../list/userTitle';

const TouchableItem = getTouchableComponent(TouchableHighlight);

const palette = {
    yellowLight: '#fffae3',
    yellowLightDark: DarkColors.bgLight,
    yellow: '#fff094',
    yellowDark: '#e6ca2e',
    orange: '#ffaa03',
    orangeDark: '#ff9c00',
    brown: '#ff6400',
    brownDark: '#ff5900',
    red: '#ff0000',
    redDark: '#d90000',
};

function getPalette(theme) {
    const isDark = theme === 'dark';

    const backgroundColor = {
        yellow: isDark ? palette.yellowDark : palette.yellow,
        orange: isDark ? palette.orangeDark : palette.orange,
        orangedark: isDark ? palette.brownDark : palette.brown,
        red: isDark ? palette.redDark : palette.red,
        silver: isDark ? DarkColors.bgLight : Colors.grayLight,
    };
    const valueColor = {
        yellow: isDark ? Colors.white : Colors.grayDark,
        orange: Colors.white,
        orangedark: Colors.white,
        red: Colors.white,
        silver: Colors.white,
    };
    const nameColor = {
        orange: Colors.white,
        orangedark: Colors.white,
        red: Colors.white,
        silver: isDark ? Colors.white : Colors.grayDark,
    };

    return {
        backgroundColor,
        valueColor,
        nameColor,
    };
}

function getTouchable({cond, children, onPress, underlayColor}) {
    if (cond) {
        return (
            <TouchableItem underlayColor={underlayColor} onPress={onPress}>
                {children}
            </TouchableItem>
        );
    }

    return children;
}

class DateTitle extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        title: PropTypes.string.isRequired,
    };

    render() {
        const {title} = this.props;

        return (
            <View style={[styles.dateTitle, this.isDark && styles.dateTitleDark]}>
                <View style={[styles.dateTitleItem, this.isDark && styles.dateTitleItemDark]}>
                    <Text numberOfLines={1} style={[styles.dateTitleText, this.isDark && styles.textDark]}>
                        {title.toUpperCase()}
                    </Text>
                </View>
            </View>
        );
    }
}

class RowString extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        last: PropTypes.bool,
        name: PropTypes.string.isRequired,
        rowStyle: PropTypes.any,
        style: PropTypes.any,
        value: PropTypes.string.isRequired,
    };

    getColor() {
        const {style} = this.props;
        const colors = this.themeColors;

        return (
            {
                positive: colors.green,
                negative: colors.blue,
            }[style] || this.selectColor(Colors.grayDark, isIOS ? Colors.white : DarkColors.text)
        );
    }

    render() {
        const {name, value, last, rowStyle} = this.props;
        const color = this.getColor();

        return (
            <View style={[styles.row, this.isDark && styles.rowDark, rowStyle, last && {borderBottomWidth: 0}]}>
                <View style={styles.columnLeft}>
                    <Text style={[styles.smallText, this.isDark && styles.textDark]}>{name}</Text>
                </View>
                <View style={styles.columnRight}>
                    <Text style={[styles.smallText, this.isDark && styles.textDark, {color}, {textAlign: 'right'}]}>{value}</Text>
                </View>
            </View>
        );
    }
}

class RowTitle extends RowString {
    static propTypes = {
        last: PropTypes.bool,
        name: PropTypes.string.isRequired,
        rowStyle: PropTypes.any,
        style: PropTypes.any,
        value: PropTypes.string,
    };

    render() {
        const {name, value, last, rowStyle} = this.props;
        const color = this.getColor();

        return (
            <View style={[styles.row, this.isDark && styles.rowDark, rowStyle, last && {borderBottomWidth: 0}]}>
                <View style={styles.columnLeft}>
                    <Text style={[styles.text, this.isDark && styles.textDark, styles.boldText, {color}]}>{name}</Text>
                </View>
                {_.isString(value) && (
                    <View style={styles.columnRight}>
                        <Text style={[styles.bigText, this.isDark && styles.textDark, styles.boldText, {color}]}>{value}</Text>
                    </View>
                )}
            </View>
        );
    }
}

class RowBalance extends RowString {
    static propTypes = {
        last: PropTypes.bool,
        multiplier: PropTypes.string,
        name: PropTypes.string.isRequired,
        rowStyle: PropTypes.any,
        style: PropTypes.any,
        value: PropTypes.string.isRequired,
        pointsValue: PropTypes.string,
    };

    render() {
        const {name, value, pointsValue, multiplier, last, rowStyle} = this.props;
        const color = this.getColor();

        return (
            <View style={[styles.row, this.isDark && styles.rowDark, rowStyle, last && {borderBottomWidth: 0}]}>
                <View style={styles.columnLeft}>
                    <Text style={[styles.smallText, this.isDark && styles.textDark]}>{name}</Text>
                </View>
                <View style={styles.columnRight}>
                    <View style={styles.columnPoints}>
                        <Text style={[styles.text, styles.boldText, this.isDark && styles.textDark, {color}, {textAlign: 'right'}]}>{value}</Text>
                        {_.isString(pointsValue) && (
                            <Text style={[styles.smallText, this.isDark && styles.textDark, {textAlign: 'right'}]}>{pointsValue}</Text>
                        )}
                    </View>
                    {_.isString(multiplier) && (
                        <Text
                            style={[
                                styles.text,
                                styles.multiplier,
                                this.isDark && {backgroundColor: DarkColors.bgLight},
                                this.isDark && styles.textDark,
                                styles.boldText,
                            ]}>
                            {multiplier}
                        </Text>
                    )}
                </View>
            </View>
        );
    }
}

class RowEarningPotential extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        color: PropTypes.string,
        extraData: PropTypes.any,
        headerColor: PropTypes.string,
        multiplier: PropTypes.string,
        name: PropTypes.string.isRequired,
        navigation: PropTypes.any,
        offerFilterIds: PropTypes.arrayOf(PropTypes.number),
        rowStyle: PropTypes.any,
        type: PropTypes.string,
        uuid: PropTypes.string,
        value: PropTypes.string,
        pointsValue: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.openOffer = this.openOffer.bind(this);
    }

    openOffer() {
        const {navigation, uuid, extraData, offerFilterIds, headerColor} = this.props;

        navigation.navigate('AccountHistoryOffer', {
            uuid,
            extraData: {...extraData, offerFilterIds},
            headerColor: headerColor || Colors.blueDark,
        });
    }

    get color() {
        const {color} = this.props;

        return color || 'silver';
    }

    render() {
        const colors = this.themeColors;
        const {type, name, value, pointsValue, uuid, multiplier, rowStyle, theme} = this.props;
        const {backgroundColor, valueColor, nameColor} = getPalette(theme);
        const arrowColor = (this.color === 'yellow' && colors.grayDarkLight) || Colors.white;
        const containerStyle = [
            styles.row,
            this.isDark && styles.rowDark,
            styles.rowFull,
            this.isDark && styles.rowFullDark,
            {backgroundColor: backgroundColor[this.color]},
            rowStyle,
            {borderBottomWidth: 0},
        ];

        const nameStyle = {color: nameColor[this.color] || this.selectColor(Colors.black, Colors.white)};
        const valueStyle = {color: valueColor[this.color] || Colors.black};

        if (type === 'offer') {
            return getTouchable({
                cond: _.isString(uuid),
                children: (
                    <View style={containerStyle} pointerEvents='box-only'>
                        <View style={styles.columnLeft}>
                            <Text style={[styles.smallText, this.isDark && styles.textDark, nameStyle]}>{name}</Text>
                        </View>
                        <View style={styles.columnRight}>
                            <View style={styles.columnPoints}>
                                <Text style={[styles.bigText, styles.boldText, this.isDark && styles.textDark, valueStyle, {textAlign: 'right'}]}>
                                    {value}
                                </Text>
                                {_.isString(pointsValue) && (
                                    <Text style={[styles.smallText, this.isDark && styles.textDark, valueStyle, {textAlign: 'right'}]}>
                                        {pointsValue}
                                    </Text>
                                )}
                            </View>
                            {_.isString(multiplier) && (
                                <Text
                                    style={[
                                        styles.text,
                                        styles.multiplier,
                                        this.isDark && {backgroundColor: DarkColors.bgLight},
                                        styles.boldText,
                                        this.isDark && styles.textDark,
                                    ]}>
                                    {multiplier}
                                </Text>
                            )}
                            <View style={styles.arrowWrap}>
                                {_.isString(uuid) && <Icon name='arrow' style={styles.arrowMore} color={arrowColor} size={isIOS ? 20 : 24} />}
                            </View>
                        </View>
                    </View>
                ),
                onPress: this.openOffer,
                underlayColor: this.selectColor(Colors.grayLight, DarkColors.bg),
            });
        }

        return (
            <View style={containerStyle}>
                {_.isString(name) && (
                    <View style={styles.columnLeft}>
                        <Text style={[styles.smallText, this.isDark && styles.textDark, nameStyle]}>{name}</Text>
                    </View>
                )}
                <View style={styles.columnRight}>
                    <Icon name='thumbsup' size={24} style={[styles.like, this.isDark && styles.likeDark]} />
                </View>
            </View>
        );
    }
}

class SectionRow extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        index: PropTypes.number,
        arrow: PropTypes.bool,
        blocks: PropTypes.array.isRequired,
        date: PropTypes.object,
        last: PropTypes.bool,
        sectionIndex: PropTypes.number,
        style: PropTypes.any,
    };

    components = {
        title: RowTitle,
        balance: RowBalance,
        string: RowString,
        earning_potential: withNavigation(RowEarningPotential),
    };

    renderDate = (date) => {
        const {d, m} = date;

        return (
            <View style={styles.date}>
                <Text style={[styles.dateNumber, this.isDark && styles.textDark]}>{d}</Text>
                <Text style={[styles.dateMonth, this.isDark && styles.textDark]}>{m.toUpperCase()}</Text>
            </View>
        );
    };

    renderRow = (row, index) => {
        const {index: sectionIndex, blocks, style, date, arrow, last, ...props} = this.props;
        const Component = this.components[row.kind];

        return (
            <Component
                {...row}
                key={`section-${sectionIndex}-row-${index}`}
                style={style}
                rowStyle={!_.isObject(date) && {paddingLeft: 20}}
                last={index === blocks.length - 1}
                {...props}
            />
        );
    };

    render() {
        const {index: sectionIndex, blocks, date, arrow} = this.props;

        return (
            <>
                <View style={styles.container} key={`section-${sectionIndex}`}>
                    {isIOS && arrow === true && (
                        <View style={{position: 'absolute', top: 0, left: 24}}>
                            <View style={[styles.arrowOuter, this.isDark && styles.arrowOuterDark]} />
                            <View style={[styles.arrowInner, this.isDark && styles.arrowInnerDark]} />
                        </View>
                    )}
                    {_.isObject(date) && this.renderDate(date)}
                    <View style={styles.info}>{blocks.map(this.renderRow)}</View>
                </View>
                <View style={[styles.separator, this.isDark && styles.separatorDark]} key={`section-separator-${sectionIndex}`} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    dateTitle: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        height: isIOS ? AccountListUserTitle.LAYOUT_HEIGHT : 34,
    },
    dateTitleDark: {
        borderBottomColor: DarkColors.border,
    },
    dateTitleItem: {
        backgroundColor: Colors.grayLight,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingHorizontal: isIOS ? 15 : 16,
    },
    dateTitleItemDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    dateTitleText: {
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 13 : 14,
        color: isIOS ? '#8e9199' : Colors.grayDarkLight,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        paddingTop: 12,
    },
    date: {
        flexWrap: 'nowrap',
        flexDirection: 'column',
        alignItems: 'center',
        width: isIOS ? 48 : 57,
    },
    dateNumber: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 20,
    },
    dateMonth: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: 12,
        ...Platform.select({
            ios: {
                marginTop: 4,
            },
        }),
    },
    info: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
    },
    columnLeft: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        marginRight: 10,
    },
    columnRight: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        maxWidth: '70%',
        paddingRight: isIOS ? 9 : 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        alignItems: 'center',
        minHeight: 26,
        paddingVertical: 3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        ...Platform.select({
            ios: {
                paddingRight: 25,
            },
        }),
    },
    rowDark: {
        borderBottomColor: DarkColors.border,
    },
    rowFull: {
        minHeight: 40,
        backgroundColor: Colors.grayLight,
        ...Platform.select({
            ios: {
                paddingLeft: 8,
                paddingRight: 0,
            },
            android: {
                paddingLeft: 10,
            },
        }),
    },
    rowFullDark: {
        backgroundColor: DarkColors.bgLight,
    },
    bigText: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 17 : 18,
    },
    text: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 15 : 16,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    smallText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: isIOS ? Colors.grayDarkLight : '#9e9e9e',
    },
    boldText: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
    multiplier: {
        color: Colors.white,
        backgroundColor: Colors.grayDark,
        paddingVertical: 2,
        paddingHorizontal: 4,
        marginLeft: 8,
    },
    separator: {
        backgroundColor: Colors.grayDarkLight,
        height: 1,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    arrowInner: Platform.select({
        ios: {
            position: 'absolute',
            left: 0,
            top: -2,
            width: 0,
            height: 0,
            borderLeftColor: 'transparent',
            borderLeftWidth: 7,
            borderTopWidth: 7,
            borderTopColor: Colors.grayLight,
            borderRightWidth: 7,
            borderRightColor: 'transparent',
            zIndex: 999,
        },
        android: {
            width: 0,
            height: 0,
            opacity: 0,
        },
    }),
    arrowInnerDark: {
        borderTopColor: DarkColors.bg,
    },
    arrowOuter: Platform.select({
        ios: {
            position: 'absolute',
            left: 0,
            top: -1,
            width: 0,
            height: 0,
            borderLeftColor: 'transparent',
            borderLeftWidth: 7,
            borderTopWidth: 7,
            borderTopColor: Colors.gray,
            borderRightWidth: 7,
            borderRightColor: 'transparent',
            zIndex: 998,
        },
        android: {
            width: 0,
            height: 0,
            opacity: 0,
        },
    }),
    arrowOuterDark: {
        borderTopColor: DarkColors.border,
    },
    arrowWrap: {
        ...Platform.select({
            ios: {
                width: 25,
            },
        }),
    },
    arrowMore: {
        marginLeft: isIOS ? 5 : 10,
    },
    like: Platform.select({
        ios: {
            marginLeft: 5,
            marginRight: 25,
            color: Colors.grayDark,
        },
        android: {
            marginLeft: 10,
            color: '#9e9e9e',
        },
    }),
    likeDark: {
        color: Colors.white,
    },
    columnPoints: {
        flexDirection: 'column',
    },
});

export {SectionRow, DateTitle, RowTitle, RowString, RowBalance, RowEarningPotential, getTouchable, styles, palette, getPalette};
