import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import HTML from 'react-native-render-html';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import styles from './styles';

const baseFontStyle = {
    fontSize: 16,
    fontFamily: Fonts.regular,
};

const containerStyle = {
    margin: 0,
    paddingVertical: 12,
};

export default class Table extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        rows: PropTypes.array.isRequired,
    };

    renderCell = (value) => (
        <HTML
            baseFontStyle={baseFontStyle}
            tagsStyles={{
                p: {
                    margin: 0,
                    padding: 0,
                },
                rawtext: {
                    color: this.isDark ? DarkColors.text : Colors.grayDark,
                },
            }}
            classesStyles={{
                red: {
                    color: this.isDark ? DarkColors.red : Colors.red,
                },
                big: {
                    fontSize: 20,
                },
            }}
            containerStyle={containerStyle}
            source={{html: value}}
        />
    );

    renderItem = (row, i) => (
        <React.Fragment key={`row_${i}`}>
            <View style={styles.tableRow}>
                <View style={styles.columnCaption}>{this.renderCell(row[0])}</View>
                <View style={styles.columnValue}>{this.renderCell(row[1])}</View>
            </View>
            <View style={[styles.separator, this.isDark && styles.separatorDark]} />
        </React.Fragment>
    );

    render() {
        const {rows} = this.props;

        return rows.map(this.renderItem);
    }
}
