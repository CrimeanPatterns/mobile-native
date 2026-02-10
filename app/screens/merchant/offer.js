import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Platform} from 'react-native';
import Config from 'react-native-config';

import HeaderButton from '../../components/page/header/button';
import {withRecaptcha} from '../../components/recaptcha';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {shareUrl} from '../../helpers/share';
import API from '../../services/api';
import GlobalError from '../../services/globalError';
import {withTheme} from '../../theme';
import {BaseAccountHistoryOffer} from '../accounts/account/history/offer';

@withRecaptcha
@withTheme
class MerchantOffer extends BaseAccountHistoryOffer {
    static propTypes = {
        recaptcha: PropTypes.object,
        navigation: PropTypes.object,
        route: PropTypes.object,
        theme: PropTypes.string,
    };

    loadOffer(recaptcha) {
        const {route} = this.props;
        const nameToUrl = route?.params?.nameToUrl;

        this._loadOffer(nameToUrl, recaptcha);
    }

    _loadOffer(nameToUrl, recaptcha) {
        if (_.isString(nameToUrl)) {
            const headers = {};

            if (recaptcha) {
                headers['x-recaptcha'] = recaptcha;
            }

            API.get(`/account/merchants/offer-name/${nameToUrl}`, {headers, globalError: false})
                .then((response) => {
                    const {data} = response;

                    if (_.isString(data)) {
                        this.safeSetState({
                            source: data,
                        });
                    }
                })
                .catch((rejection) => {
                    if (_.isObject(rejection)) {
                        const {
                            response: {headers, status},
                        } = rejection;

                        if (headers['x-recaptcha-failed']) {
                            const recaptchaKey = headers['x-recaptcha-key'];

                            this.requestRecaptcha(recaptchaKey);
                        } else {
                            GlobalError.show(status);
                        }
                    }
                });
        }
    }

    async _requestRecaptcha(siteKey) {
        const {recaptcha} = this.props;

        return new Promise((resolve, reject) => {
            recaptcha.open(siteKey, resolve, reject);
        });
    }

    requestRecaptcha = async (recaptchaKey) => {
        const recaptcha = await this._requestRecaptcha(recaptchaKey);

        this.loadOffer(recaptcha);
    };
}

export default class extends PureComponent {
    // eslint-disable-next-line react/sort-comp
    static displayName = 'MerchantOffer';

    static navigationOptions = ({route}) => {
        const nameToUrl = route?.params?.nameToUrl;
        let url = null;

        if (_.isString(nameToUrl)) {
            url = `${Config.API_URL}/merchants/${nameToUrl}`;
        }

        return {
            title: null,
            headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
            headerRight: () =>
                _.isString(url) && (
                    <HeaderButton size={24} iconName={Platform.select({ios: 'share', android: 'android-share'})} onPress={() => shareUrl(url)} />
                ),
        };
    };

    // eslint-disable-next-line class-methods-use-this
    render() {
        const {navigation, route} = this.props;

        return <MerchantOffer navigation={navigation} route={route} />;
    }
}
