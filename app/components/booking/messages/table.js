import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';

@withTheme
class MessageTable extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        data: PropTypes.array.isRequired,
    };

    renderTableCell = ({name, value, index}) => {
        const colors = this.themeColors;

        return (
            <>
                <View style={[styles.tableCell, styles.tableCaptionCell]}>
                    <Text style={[styles.tableCellText, this.isDark && styles.tableCellTextDark]}>{name}</Text>
                </View>
                <View style={[styles.tableCell, styles.tableInfoCell]}>
                    <Text
                        style={[
                            styles.tableCellValue,
                            index === 0 && styles.boldText,
                            {color: index === 0 ? colors.red : this.selectColor(Colors.black, Colors.white)},
                        ]}>
                        {value}
                    </Text>
                </View>
            </>
        );
    };

    renderTableRow = (item, index) => {
        const {name, value} = item;

        return (
            <View style={styles.tableRow} key={`row_${index}`}>
                {this.renderTableCell({name, value, index})}
            </View>
        );
    };

    renderTableGroup = (item, index, groups) => {
        const rows = Object.values(item);

        return (
            <React.Fragment key={`group_${index}`}>
                <View style={styles.tableGroup}>{rows.map(this.renderTableRow)}</View>
                {index % 2 === 0 && index !== groups.length - 1 && this.renderGroupSeparator(index)}
            </React.Fragment>
        );
    };

    renderGroupSeparator = (index) => <View key={`separator_${index}`} style={styles.separator} />;

    render() {
        const {data} = this.props;

        return <View style={styles.table}>{data.map(this.renderTableGroup)}</View>;
    }
}

const styles = StyleSheet.create({
    table: {
        borderTopWidth: 2,
        borderColor: Colors.grayDark,
        marginTop: 20,
    },
    tableGroup: {
        flexDirection: 'column',
        flex: 1,
        paddingVertical: 10,
    },
    tableRow: {
        flex: 1,
        flexDirection: 'row',
    },
    tableCell: {
        flexDirection: 'column',
        paddingVertical: 5,
    },
    tableCaptionCell: {
        width: 100,
        paddingTop: 8,
    },
    tableInfoCell: {
        flex: 1,
    },
    tableCellText: {
        fontSize: 11,
        fontFamily: Fonts.regular,
        color: Colors.textGray,
    },
    tableCellTextDark: {
        color: DarkColors.text,
    },
    tableCellValue: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    boldText: {
        fontWeight: '700',
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
});

export default MessageTable;
