import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {BaseThemedPureComponent} from '../../baseThemed';
import TimeAgo from '../../timeAgo';
import styles from './styles';

class TableRow extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        header: PropTypes.bool,
        row: PropTypes.array.isRequired,
    };

    static defaultProps = {
        header: false,
    };

    constructor(props) {
        super(props);

        this.renderCell = this.renderCell.bind(this);
    }

    renderCell(cell, k) {
        const {header, row} = this.props;
        const key = `column_${k}`;
        const columns = row.length;
        let width;

        if (columns === 1) {
            width = '100%';
        } else if (columns === 2) {
            width = '75%';
        } else if (columns === 3) {
            width = '37.5%';
        } else if (columns === 4) {
            width = '25%';
        } else if (columns === 5) {
            width = '18.75%';
        } else {
            width = '12.5%';
        }

        if (k === 0 && columns > 1) {
            width = '25%';
        }

        return (
            <View style={[{width}, styles.tableCol]} key={key}>
                {this.renderValue(cell, header)}
            </View>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    renderValue(cell, header) {
        let type = 'text';

        if (_.isObject(cell) && _.has(cell, 'type')) {
            const {type: cellType} = cell;

            type = cellType;
        }

        switch (type) {
            case 'text': {
                const accessibilityLabel = _.isObject(cell) ? cell.value : cell;

                return (
                    <Text
                        accessible
                        accessibilityLabel={accessibilityLabel}
                        style={[styles.fieldNameText, header && styles.tableHeaderText, this.isDark && styles.textDark]}>
                        {accessibilityLabel}
                    </Text>
                );
            }
            case 'timeAgo': {
                const {value} = cell;

                return <TimeAgo date={value.ts * 1000} style={[this.isDark && styles.textDark]} />;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const {row} = this.props;

        return <View style={styles.tableRow}>{row.map(this.renderCell)}</View>;
    }
}

export default TableRow;
