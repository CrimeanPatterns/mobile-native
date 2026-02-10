import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import ProviderRow from '../../components/accounts/add/providerRow';
import RefreshableFlatList from '../../components/page/refreshableFlatList';
import {isIOS} from '../../helpers/device';
import AccountsList from '../../services/accountsList';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';
import BaseSpendAnalysis from './baseSpendAnalysis';
import {styles} from './styles';

class SpendAnalysisStub extends BaseSpendAnalysis {
    static propTypes = {
        navigation: PropTypes.object,
        eligibleProviders: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.renderHeader = this.renderHeader.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    haveAccounts(providerId) {
        const haveAccounts = this.getAddedAccounts();

        if (!_.isUndefined(providerId) && !_.isEmpty(haveAccounts)) {
            return haveAccounts.includes(providerId);
        }

        return !_.isEmpty(haveAccounts);
    }

    getAddedAccounts() {
        const {eligibleProviders} = this.props;
        const accounts = AccountsList.getAccounts();
        const haveAccounts = [];

        eligibleProviders.forEach((provider) => {
            // eslint-disable-next-line no-restricted-syntax,guard-for-in
            for (const key in accounts) {
                if (+provider.id === +accounts[key].ProviderID) {
                    haveAccounts.push(+accounts[key].ProviderID);
                    break;
                }
            }
        });

        return haveAccounts;
    }

    onPress(providerId) {
        const {navigation} = this.props;

        navigation.navigate('AccountAdd', {
            providerId,
        });
    }

    renderHeader() {
        const title = Translator.trans('credit-card.ccsa_title', {}, 'messages');
        let subTitle;
        let helperSubTitle;

        if (this.haveAccounts()) {
            subTitle = Translator.trans(
                /** @Desc('None of your credit card accounts have any valid transactions that can be analyzed for this report. If you have other banking accounts, please add them and then come back to view the report.') */ 'analysis.stub.no-analytics',
                {},
                'mobile-native',
            );
            helperSubTitle = Translator.trans(/** @Desc('You can add some more credit cards:') */ 'analysis.stub.add-more', {}, 'mobile-native');
        } else {
            helperSubTitle = Translator.trans(
                /** @Desc('To view your report, please add one or more of the following accounts:') */ 'analysis.stub.add-accounts',
                {},
                'mobile-native',
            );
        }

        return this.createHeader({title, subTitle, helperSubTitle, isStub: true});
    }

    renderItem = ({item: {id, name}}) => (
        <ProviderRow key={`provider-${id}`} name={name} added={this.haveAccounts(id)} onPress={() => this.onPress(id)} />
    );

    renderListFooter = () => (
        <View style={[styles.bottomLinkWrap, styles.bottomLink]}>
            <Text style={[styles.subText, this.isDark && styles.textDark]}>
                {Translator.trans(
                    /** @Desc('Once you have added one or more of these accounts, please come back to this screen to see your personal Credit Card Spend Analysis report!') */ 'analysis.stub.come-back',
                    {},
                    'mobile-native',
                )}
            </Text>
        </View>
    );

    render() {
        const {eligibleProviders, onRefresh, loadingTime} = this.props;

        return (
            <>
                <RefreshableFlatList
                    style={{backgroundColor: this.selectColor(Colors.white, isIOS ? Colors.black : DarkColors.bg)}}
                    windowSize={21}
                    maxToRenderPerBatch={10}
                    scrollEventThrottle={16}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    contentInsetAdjustmentBehavior='automatic'
                    data={eligibleProviders}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderListFooter}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    lastSyncDate={loadingTime}
                    onRefresh={onRefresh}
                />
                {this.renderFooter()}
            </>
        );
    }
}

export default withTheme(SpendAnalysisStub);
export {SpendAnalysisStub};
