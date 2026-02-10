import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet} from 'react-native';
import {Text} from 'react-native-svg';

import Icons from '../../../assets/icons';
import {Colors} from '../../../styles';
import {ThemeColors, withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import {isLowBar} from './labelBar';

@withTheme
class Arrows extends BaseThemedPureComponent {
    static propTypes = {
        data: PropTypes.array,
        x: PropTypes.func,
        y: PropTypes.func,
        bandwidth: PropTypes.number,
        theme: PropTypes.string,
    };

    getColor = (changes, lowBar) => {
        const {theme} = this.props;
        const themeColors = ThemeColors[theme];
        let color = Platform.select({
            ios: Colors.white,
            android: this.selectColor(Colors.white, Colors.black),
        });

        if (lowBar && changes > 0) {
            color = themeColors.green;
        } else if (lowBar && changes < 0) {
            color = themeColors.blue;
        }

        return color;
    };

    render() {
        const {x, y, bandwidth, data} = this.props;

        return data.map((item, index, array) => {
            let changes = 0;

            if (index > 0) {
                changes = item.value - array[index - 1].value;
            }

            if (changes === 0) {
                return;
            }

            const posY = y(item.value);
            const lowBar = isLowBar(posY);

            let biasValueX;
            let biasValueY;
            let rotate;

            if (changes > 0) {
                biasValueX = x(index) + bandwidth / 2;
                biasValueY = lowBar ? posY - biasY.lowBarUp : posY + biasY.up;
                rotate = '0';
            } else {
                biasValueX = x(index) + bandwidth / 2 + 30;
                biasValueY = lowBar ? posY - biasY.lowBarDown : posY;
                rotate = '180';
            }

            // eslint-disable-next-line consistent-return
            return (
                <Text
                    key={`arrow ${index}`}
                    fontSize={30}
                    x={biasValueX}
                    y={biasValueY}
                    fill={this.getColor(changes, lowBar)}
                    style={style.icon}
                    rotate={rotate}
                    alignmentBaseline='middle'
                    textAnchor='middle'>
                    {Icons['common-arrow']}
                </Text>
            );
        });
    }
}

export default Arrows;

const style = StyleSheet.create({
    icon: {
        fontFamily: 'awardwallet',
    },
});

const biasY = {
    up: 30,
    lowBarUp: 15,
    lowBarDown: 45,
};
