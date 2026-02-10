import * as shape from 'd3-shape';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {injectIntl} from 'react-intl';
import {Platform, StyleSheet, View} from 'react-native';
import {G, Line, Rect, Text, TSpan} from 'react-native-svg';
import BarChartGrouped from 'react-native-svg-charts/src/bar-chart/bar-chart-grouped';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';

const ChartColors = Platform.select({
    ios: {
        green: 'rgb(75, 190, 160)',
        blue: 'rgb(70, 130, 195)',
        black: 'rgb(92,99,115)',
        gray: 'rgb(243, 244, 245)',
    },
    android: {
        green: '#00A67C',
        blue: '#146AC4',
        black: '#212121',
        gray: '#EEEEEE',
    },
});

class Chart extends BarChartGrouped {
    calcAreas(x, y) {
        const {horizontal, data, yAccessor} = this.props;

        // eslint-disable-next-line no-underscore-dangle
        const _data = data.map((obj) => {
            const {svg = {}} = obj;

            return {
                ...obj,
                data: obj.data.map((item) => {
                    if (typeof item === 'number') {
                        return {
                            value: item,
                            svg,
                        };
                    }

                    return {
                        ...item,
                        svg: {
                            ...svg,
                            ...item.svg,
                        },
                        value: yAccessor({item}),
                    };
                }),
            };
        });

        const areas = [];

        if (horizontal) {
            const barWidth = y.bandwidth() / data.length;

            _data.forEach((obj, collectionIndex) => {
                obj.data.forEach((item, valueIndex) => {
                    areas.push({
                        bar: item,
                        path: shape
                            .area()
                            .y((value, _index) =>
                                _index === 0 ? y(valueIndex) + 5 + barWidth * collectionIndex : y(valueIndex) + barWidth + barWidth * collectionIndex,
                            )
                            .x0(x(0))
                            .x1((value) => x(value))
                            .defined((value) => typeof value === 'number')([item.value, item.value]),
                    });
                });
            });
        } else {
            const barWidth = x.bandwidth() / data.length;

            _data.forEach((obj, collectionIndex) => {
                obj.data.forEach((item, valueIndex) => {
                    areas.push({
                        bar: item,
                        path: shape
                            .area()
                            .x((value, _index) =>
                                _index === 0 ? x(valueIndex) + barWidth * collectionIndex : x(valueIndex) + barWidth + barWidth * collectionIndex,
                            )
                            .y0(y(0))
                            .y1((value) => y(value))
                            .defined((value) => typeof value === 'number')([item.value, item.value]),
                    });
                });
            });
        }

        return areas;
    }
}

const GridVertical = ({ticks = [], x, svg, height}) => (
    <G>
        {ticks.map((tick, index) => (
            <Line key={`grid-${index}-${x(tick)}`} y1='0%' y2={height} x1={x(tick)} x2={x(tick)} strokeWidth={1} stroke='rgba(0,0,0,0.2)' {...svg} />
        ))}
    </G>
);

GridVertical.propTypes = {
    height: PropTypes.number,
    svg: PropTypes.any,
    ticks: PropTypes.array,
    x: PropTypes.func,
};

@withTheme
class SpendAnalysisChart extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        earningPotential: PropTypes.array,
        intl: PropTypes.any,
        labels: PropTypes.array,
        pointsEarned: PropTypes.array,
    };

    render() {
        const {intl, labels = [], pointsEarned = [], earningPotential = []} = this.props;
        const gridMax = Math.max(...pointsEarned, ...earningPotential);
        const colors = this.themeColors;
        const datasets = [
            {data: pointsEarned.map((value) => ({value, svg: {fill: this.selectColor(ChartColors.blue, colors.blue)}}))},
            {data: earningPotential.map((value) => ({value, svg: {fill: this.selectColor(ChartColors.green, colors.green)}}))},
        ];
        const height = Math.min(pointsEarned.length * 100, 600);
        const textColor = this.selectColor(ChartColors.black, isIOS ? Colors.white : DarkColors.text);

        const LabelsGroup = (config) => {
            const {y, width} = config;
            const nodes = [];

            labels.forEach(({name, amount}, groupIndex) => {
                nodes.push(
                    <Rect
                        key={`titleBg${groupIndex}`}
                        width={width}
                        height={30}
                        x={0}
                        y={y(groupIndex) - 25}
                        fill={this.selectColor(ChartColors.gray, DarkColors.bgLight)}
                    />,
                );
                nodes.push(
                    <Text
                        key={`title${groupIndex}`}
                        x={15}
                        y={y(groupIndex) - 8}
                        fontSize={isIOS ? 12 : 14}
                        fontFamily={Fonts.regular}
                        fill={textColor}
                        alignmentBaseline='middle'>
                        {name}
                        {_.isString(amount) && (
                            <TSpan
                                x={width - 15}
                                textAnchor='end'
                                fontSize={isIOS ? 12 : 14}
                                fontFamily={Fonts.bold}
                                fontWeight='bold'
                                fill={textColor}>
                                {amount}
                            </TSpan>
                        )}
                    </Text>,
                );
            });

            return nodes;
        };

        const Labels = (config) => {
            const {x, y, bandwidth, data} = config;
            const barWidth = bandwidth / data.length;
            const nodes = [];

            data.forEach((obj, collectionIndex) => {
                obj.data.forEach((item, valueIndex) => {
                    const {
                        value,
                        svg: {fill},
                    } = item;

                    nodes.push(
                        <Text
                            key={`label${collectionIndex}-${valueIndex}`}
                            x={x(value) + 15}
                            y={y(valueIndex) + 5 / 2 + barWidth * collectionIndex + barWidth / 2}
                            fontSize={isIOS ? 13 : 14}
                            fontFamily={Fonts.bold}
                            fontWeight='bold'
                            fill={fill}
                            alignmentBaseline='middle'>
                            {intl.formatNumber(value)}
                        </Text>,
                    );
                });
            });

            return nodes;
        };

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <View
                    style={{
                        flexDirection: 'row',
                        height,
                    }}>
                    <Chart
                        style={{flex: 1}}
                        yAccessor={({item}) => item.value}
                        data={datasets}
                        horizontal
                        animate
                        animationDuration={300}
                        contentInset={{left: 15, top: 25, bottom: 0, right: 15}}
                        spacingInner={labels.length > 1 ? 0.3 : 0}
                        spacingOuter={0}
                        gridMax={Math.round(gridMax + gridMax / 2)}
                        gridMin={0}>
                        <GridVertical svg={{stroke: this.selectColor(ChartColors.gray, DarkColors.border)}} belowChart />
                        <LabelsGroup />
                        <Labels />
                    </Chart>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    containerDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
});

const ChartWithIntl = ({...rest}) => <SpendAnalysisChart {...rest} />;

export default injectIntl(ChartWithIntl);
