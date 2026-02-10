import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import {Dimensions, Platform} from 'react-native';
import {Text} from 'react-native-svg';

import {Colors, DarkColors, Fonts} from '../../../styles';
import {ThemeColors, withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';

@withTheme
class LabelBar extends BaseThemedPureComponent {
    static propTypes = {
        data: PropTypes.array,
        x: PropTypes.func,
        y: PropTypes.func,
        bandwidth: PropTypes.number,
        theme: PropTypes.string,
        intl: PropTypes.object,
    };

    getColor = (changes) => {
        const {theme} = this.props;
        const themeColors = ThemeColors[theme];
        let color = Platform.select({
            ios: this.selectColor(Colors.textGray, Colors.white),
            android: this.selectColor(Colors.textGray, DarkColors.text),
        });

        if (changes > 0) {
            color = themeColors.green;
        } else if (changes < 0) {
            color = themeColors.blue;
        }

        return color;
    };

    renderBalanceText = (element) => {
        const {x, y, bandwidth, intl} = this.props;
        const {
            item: {value},
            index,
            changes,
        } = element;

        const posY = y(value);
        let biasY = bias.onlyBalance;

        if (changes !== 0) {
            biasY = isLowBar(posY) ? bias.lowBarBalance : bias.balance;
        }

        return (
            <Text
                key={`balance ${index}`}
                x={x(index) + bandwidth / 2}
                y={posY - biasY}
                fill={this.getColor()}
                fontSize={12}
                style={{fontFamily: Fonts.bold, fontWeight: 'bold'}}
                alignmentBaseline='middle'
                textAnchor='middle'>
                {intl.formatNumber(value)}
            </Text>
        );
    };

    renderChangeText = (element) => {
        const {x, y, bandwidth, intl} = this.props;
        const {
            item: {value},
            index,
            changes,
        } = element;

        const posY = y(value);
        const biasY = isLowBar(posY) ? bias.lowBarChange : bias.change;

        const color = this.getColor(changes);
        let changesValue = intl.formatNumber(changes);

        if (changes > 0) {
            changesValue = `+${changesValue}`;
        }

        return (
            <Text
                key={`change ${index}`}
                x={x(index) + bandwidth / 2}
                y={posY - biasY}
                fill={color}
                fontSize={12}
                alignmentBaseline='middle'
                textAnchor='middle'>
                {changesValue}
            </Text>
        );
    };

    render() {
        const {data} = this.props;

        return data.map((item, index, array) => {
            let changes = 0;

            if (index > 0) {
                changes = item.value - array[index - 1].value;
            }

            const element = {item, index, changes};

            if (changes === 0) {
                return this.renderBalanceText(element);
            }

            return (
                <React.Fragment key={`label ${index}`}>
                    {this.renderBalanceText(element)}
                    {this.renderChangeText(element)}
                </React.Fragment>
            );
        });
    }
}

export default injectIntl(LabelBar);

export const isLowBar = (y) => y > Dimensions.get('window').height - 320;

const bias = {
    onlyBalance: 13,
    balance: 26,
    lowBarBalance: 54,
    change: 13,
    lowBarChange: 42,
};
