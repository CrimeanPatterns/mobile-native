import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {G, Line} from 'react-native-svg';

class BalanceGrid extends Component {
    static propTypes = {
        width: PropTypes.number,
        svg: PropTypes.object,
        ticks: PropTypes.array,
        y: PropTypes.func,
    };

    static defaultProps = {
        belowChart: true,
    };

    render() {
        const {ticks = [], y, svg, width} = this.props;

        return (
            <G>
                {ticks.map((tick) => (
                    <Line key={tick} x1='0%' x2={width} y1={y(tick)} y2={y(tick)} strokeWidth={0.3} stroke='rgba(0,0,0,0.2)' {...svg} />
                ))}
            </G>
        );
    }
}

export default BalanceGrid;
