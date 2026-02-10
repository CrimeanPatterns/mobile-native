import _ from 'lodash';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {DateTitle, RowBalance, RowString, RowTitle, SectionRow} from '../../components/accounts/history';
import {BaseThemedPureComponent} from '../../components/baseThemed';
import {CustomRowEarningPotential} from '../../components/spend-analysis';
import Spinner from '../../components/spinner';
import {isIOS} from '../../helpers/device';
import {withNavigation} from '../../navigation/withNavigation';
import SpendAnalysisHttp from '../../services/http/spendAnalysis';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import {SpendAnalysis} from './index';

const analyticsData = {source: SpendAnalysis.ANALYTIC_TAG};

@withTheme
class CustomSectionRow extends SectionRow {
    components = {
        title: RowTitle,
        balance: RowBalance,
        string: RowString,
        earning_potential: withNavigation(CustomRowEarningPotential),
    };
}

@withTheme
class SpendAnalysisDetailsScreen extends BaseThemedPureComponent {
    static navigationOptions = ({route}) => {
        console.log(route);
        return {
            title: route.params?.name,
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            rows: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getMerchantDetails();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getMerchantDetails() {
        const {navigation, route} = this.props;
        const merchant = route.params?.merchant;
        const formData = route.params?.formData;

        this.safeSetState({loading: true});

        SpendAnalysisHttp.getByMerchant(merchant, formData).then((response) => {
            const {data} = response;

            if (_.isObject(data)) {
                const {rows} = data;

                if (_.isArray(rows)) {
                    this.safeSetState({
                        rows,
                        loading: false,
                    });
                }
            }
        });
    }

    renderItem = ({item, index}) => {
        const {theme} = this.props;
        const {rows} = this.state;

        if (item.kind === 'row') {
            const hasArrow = rows[index - 1] && rows[index - 1].kind === 'date';

            return <CustomSectionRow {...item} theme={theme} index={index} arrow={hasArrow} extraData={analyticsData} />;
        }

        return <DateTitle theme={theme} title={item.value} />;
    };

    keyExtractor = (item, index) => {
        if (_.isObject(item) && item.date) {
            const {d, m} = item.date;

            return `${d}-${m}-${index}`;
        }

        return String(index);
    };

    render() {
        const {loading, rows} = this.state;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        if (loading) {
            return (
                <View style={containerStyle}>
                    <Spinner androidColor={this.selectColor(Colors.chetwodeBlue, DarkColors.chetwodeBlue)} style={{top: 10, alignSelf: 'center'}} />
                </View>
            );
        }

        return (
            <FlatList
                style={containerStyle}
                windowSize={21}
                maxToRenderPerBatch={10}
                scrollEventThrottle={16}
                contentInsetAdjustmentBehavior='automatic'
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='never'
                data={rows}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
            />
        );
    }
}

export {SpendAnalysisDetailsScreen};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});
