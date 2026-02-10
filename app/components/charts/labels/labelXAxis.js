import PropTypes from 'prop-types';
import React from 'react';
import {Platform} from 'react-native';
import {Text} from 'react-native-svg';

import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';

@withTheme
class LabelXAxis extends BaseThemedPureComponent {
    static propTypes = {
        label: PropTypes.array,
        x: PropTypes.func,
        y: PropTypes.func,
        bandwidth: PropTypes.number,
        theme: PropTypes.string,
    };

    getColor = () =>
        Platform.select({
            ios: this.selectColor(Colors.textGray, Colors.white),
            android: this.selectColor(Colors.textGray, DarkColors.text),
        });

    render() {
        const {x, y, bandwidth, label} = this.props;
        const posY = y(0);

        return label.map((item, index) => {
            const [date, month, year] = item;
            const textProps = {
                x: x(index) + bandwidth / 2,
                fill: this.getColor(),
                alignmentBaseline: 'middle',
                textAnchor: 'middle',
            };

            return (
                <React.Fragment key={`labelXAxis ${index}`}>
                    <Text {...textProps} y={posY + biasY.date} fontSize={25}>
                        {date}
                    </Text>
                    <Text {...textProps} y={posY + biasY.month} fontSize={15}>
                        {month}
                    </Text>
                    <Text {...textProps} y={posY + biasY.year} fontSize={15}>
                        {year}
                    </Text>
                </React.Fragment>
            );
        });
    }
}

export default LabelXAxis;

const biasY = {
    date: 30,
    month: 55,
    year: 75,
};
