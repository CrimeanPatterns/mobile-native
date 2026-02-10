import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';

import {isIOS, isTablet} from '../../helpers/device';
import {Colors, DarkColors} from '../../styles';
import {ThemeColors, withTheme} from '../../theme';
import {BaseThemedComponent} from '../baseThemed';
import BalanceBarChart from './balanceBarChart';
import BalanceGrid from './balanceGrid';
import Arrows from './labels/arrows';
import LabelBar from './labels/labelBar';
import LabelXAxis from './labels/labelXAxis';

@withTheme
class BarChartVerticalWithLabels extends BaseThemedComponent {
    static propTypes = {
        data: PropTypes.shape({
            data: PropTypes.array,
            label: PropTypes.array,
        }),
        theme: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {windowWidth: Dimensions.get('window').width};

        this.scrollView = React.createRef();

        this.orientationChange = this.orientationChange.bind(this);
    }

    componentDidMount() {
        if (isTablet) {
            this.dimensionsListener = Dimensions.addEventListener('change', this.orientationChange);
        }

        setTimeout(() => {
            this.scrollView.current.scrollToEnd();
        }, 0);
    }

    componentWillUnmount() {
        if (isTablet) {
            this.dimensionsListener?.remove();
        }
    }

    orientationChange() {
        this.setState({windowWidth: Dimensions.get('window').width});
    }

    getChartWidth = (length) => barWidth * length;

    getContainerWidth(length) {
        const {windowWidth} = this.state;
        const windowChart = this.getChartWidth(length);

        return [Math.max(windowWidth, windowChart), windowChart];
    }

    getColor = (changes) => {
        const {theme} = this.props;
        const themeColors = ThemeColors[theme];
        let color = this.selectColor(Colors.grayDarkLight, DarkColors.grayLight);

        if (changes > 0) {
            color = themeColors.green;
        } else if (changes < 0) {
            color = themeColors.blue;
        }

        return color;
    };

    createBars = (data) =>
        data.map((value, index, array) => {
            const changes = value - array[index - 1];

            return {
                value,
                svg: {
                    fill: this.getColor(changes),
                },
            };
        });

    render() {
        const {
            data: {data, label},
        } = this.props;
        const {windowWidth} = this.state;
        const barData = this.createBars(data);
        const [containerWidth, chartWidth] = this.getContainerWidth(data.length);

        return (
            <ScrollView ref={this.scrollView} horizontal scrollEnabled={chartWidth > windowWidth} style={styles.scrollBlock}>
                <View style={{width: containerWidth}}>
                    <BalanceBarChart
                        chartWidth={chartWidth}
                        style={[styles.chart]}
                        data={barData}
                        yAccessor={({item}) => item.value}
                        contentInset={{top: marginTop, left: marginHorizontal, right: marginHorizontal, bottom: marginBottom}}
                        spacingInner={spacingInner}
                        gridMax={Math.max(...data) * 1.2}
                        gridMin={0}>
                        <BalanceGrid svg={gridSvg} />
                        <LabelBar />
                        <Arrows />
                        <LabelXAxis label={label} />
                    </BalanceBarChart>
                </View>
            </ScrollView>
        );
    }
}

export default BarChartVerticalWithLabels;

const marginTop = 40;
const marginHorizontal = 20;
const marginBottom = 90;
const spacingInner = 0.3;
const barWidth = 70;

const gridSvg = {stroke: isIOS ? Colors.borderGray : Colors.grayDark};
const styles = StyleSheet.create({
    scrollBlock: {
        flexDirection: 'row',
        height: '100%',
    },
    chart: {
        flex: 1,
    },
});
