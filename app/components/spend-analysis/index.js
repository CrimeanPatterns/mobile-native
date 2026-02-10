import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {withNavigation} from '../../navigation/withNavigation';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {getTouchable, RowBalance, RowEarningPotential, RowString, RowTitle, SectionRow} from '../accounts/history';
import Icon from '../icon';

class CustomRowTitle extends RowTitle {
    constructor(props) {
        super(props);

        this.openDetails = this.openDetails.bind(this);
    }

    openDetails() {
        const {navigation, name, merchant, formData} = this.props;

        navigation.navigate('SpendAnalysisDetails', {name, merchant, formData});
    }

    render() {
        const {name, value, last, rowStyle, merchant} = this.props;
        const color = this.getColor();

        return getTouchable({
            cond: _.isString(merchant),
            children: (
                <View
                    style={[styles.row, styles.rowFull, this.isDark && styles.rowDark, rowStyle, last && {borderBottomWidth: 0}]}
                    pointerEvents='box-only'>
                    <View style={styles.columnLeft}>
                        <Text style={[styles.text, styles.boldText, this.isDark && styles.textDark, {color}]}>{name}</Text>
                    </View>
                    {_.isString(value) && (
                        <View style={styles.columnRight}>
                            <Text style={[styles.bigText, styles.boldText, this.isDark && styles.textDark, {color}]}>{value}</Text>
                            <View style={styles.arrowWrap}>
                                {_.isString(merchant) && (
                                    <Icon name='arrow' style={styles.arrowMore} color={this.themeColors.grayDarkLight} size={isIOS ? 20 : 24} />
                                )}
                            </View>
                        </View>
                    )}
                </View>
            ),
            onPress: this.openDetails,
            underlayColor: this.selectColor(Colors.grayLight, DarkColors.bg),
        });
    }
}

@withTheme
class CustomRowEarningPotential extends RowEarningPotential {
    getColors() {
        const {valueColor, ...colors} = super.getColors();
        const newValueColors = {
            ...valueColor,
            yellow: null,
        };

        return {
            ...colors,
            valueColor: newValueColors,
        };
    }
}

@withTheme
class CustomSectionRow extends SectionRow {
    components = {
        title: withNavigation(CustomRowTitle),
        balance: RowBalance,
        string: RowString,
        earning_potential: withNavigation(CustomRowEarningPotential),
    };

    renderRow = (row, index) => {
        const Component = this.components[row.kind];
        const {extraData, ...rest} = row;
        const {index: sectionIndex, blocks, style, extraData: parentExtraData, ...props} = this.props;

        return (
            <Component
                {...rest}
                key={`section-${sectionIndex}-row-${index}`}
                style={style}
                rowStyle={styles.customRow}
                last={index === blocks.length - 1}
                {...props}
                extraData={{...extraData, ...parentExtraData}}
            />
        );
    };

    render() {
        const {blocks} = this.props;

        return (
            <View style={[styles.container, this.isDark && styles.bgDark]}>
                <View style={[styles.info, this.isDark && styles.bgDark]}>{blocks.map(this.renderRow)}</View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: Colors.white,
    },
    info: {
        flex: 1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        backgroundColor: Colors.white,
    },
    bgDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    columnLeft: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        marginRight: 10,
    },
    columnRight: {
        flexWrap: 'nowrap',
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
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        paddingTop: 15,
        ...Platform.select({
            ios: {
                paddingRight: 25,
            },
        }),
    },
    rowDark: {
        borderBottomColor: DarkColors.border,
    },
    bigText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 17 : 18,
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 15 : 16,
    },
    boldText: {
        color: Colors.grayDark,
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
    },
    blueText: {
        color: isIOS ? Colors.blue : Colors.blueDark,
    },
    greenText: {
        color: '#00a67c',
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
    rowFull: {
        ...Platform.select({
            ios: {
                paddingLeft: 0,
                paddingRight: 0,
            },
            android: {
                paddingLeft: 0,
            },
        }),
    },
    customRow: {
        marginLeft: 15,
    },
});

export default CustomSectionRow;
export {CustomRowEarningPotential};
