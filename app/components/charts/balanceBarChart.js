import * as scale from 'd3-scale';
import BarChart from 'react-native-svg-charts/src/bar-chart/bar-chart';

class BalanceBarChart extends BarChart {
    calcXScale(domain) {
        const {
            horizontal,
            contentInset: {left = 0, right = 0},
            spacingInner,
            spacingOuter,
            clamp,
            chartWidth,
        } = this.props;

        if (horizontal) {
            return scale
                .scaleLinear()
                .domain(domain)
                .range([left, chartWidth - right])
                .clamp(clamp);
        }

        return scale
            .scaleBand()
            .domain(domain)
            .range([left, chartWidth - right])
            .paddingInner([spacingInner])
            .paddingOuter([spacingOuter]);
    }
}

export default BalanceBarChart;
