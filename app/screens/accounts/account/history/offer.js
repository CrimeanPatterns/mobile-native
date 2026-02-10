import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {BaseThemedPureComponent} from '../../../../components/baseThemed';
import OfferWebView from '../../../../components/offerWebview';
import API from '../../../../services/api';
import {Colors, DarkColors} from '../../../../styles';
import {withTheme} from '../../../../theme';

class AccountHistoryOffer extends BaseThemedPureComponent {
    static navigationOptions = () => ({
        title: '',
        // headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
    });

    constructor(props) {
        super(props);

        this.state = {
            source: null,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.loadOffer();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    loadOffer() {
        const {route} = this.props;
        const uuid = route?.params?.uuid;
        const extraData = route?.params?.extraData ?? {};

        API.post('/account/spent-analysis/transaction-offer', {
            uuid,
            ...extraData,
        }).then((response) => {
            const {data} = response;

            if (_.isString(data)) {
                this.safeSetState({
                    source: data,
                });
            }
        });
    }

    render() {
        const {navigation} = this.props;
        const {source} = this.state;
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        return (
            <View style={containerStyle}>
                <OfferWebView source={source} navigation={navigation} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        flex: 1,
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

export {AccountHistoryOffer as BaseAccountHistoryOffer};
export default withTheme(AccountHistoryOffer);
