import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Platform} from 'react-native';
import Config from 'react-native-config';
import HTML from 'react-native-render-html';

import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import {Colors, Fonts} from '../../styles';

const tagsStyles = {
    p: {
        paddingBottom: 10,
    },
    a: {
        color: Colors.white,
    },
};

const baseFontStyle = {
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 10,
};

const Message = React.memo(({callback}) => {
    const onLinkPress = useCallback(
        (event, href) => {
            handleOpenUrl({url: href});
            callback();
        },
        [callback],
    );

    return (
        <HTML
            source={{
                html: Translator.trans(
                    /** @Desc("%p_on%AwardWallet Plus is a subscription-based service, the subscription length is 1 year and when you subscribe it will be set to auto-renew every year thereafter. The cost of the subscription is $29.99 per year without a an early supporter discount, and $9.99 per year with an early supporter discount.%p_off%%p_on%AwardWallet Plus subscriptions purchased from the app will be charged to your %store% account and will automatically renew within 24 hours prior to the end of the current subscription period, unless auto-renewal is disabled beforehand. To manage your subscriptions or to disable auto-renewal, after purchase, go to your %store% account settings. No refunds will be issued after the annual subscription fee has been charged. Any unused portion of a free trial period will be forfeited once a subscription is purchased.%p_off%%p_on%For more details please feel free to review our %link_1%Terms of Use%link_off% and our %link_2%Privacy Policy%link_off%.%p_off%") */
                    'subscription.terms',
                    {
                        p_on: '<p>',
                        p_off: '</p>',
                        link_1: `<a href="${Config.API_URL}/page/terms">`,
                        link_2: `<a href="${Config.API_URL}/page/privacy">`,
                        link_off: '</a>',
                        store: Platform.select({ios: 'iTunes', android: 'Google Play'}),
                    },
                    'mobile-native',
                ),
            }}
            onLinkPress={onLinkPress}
            tagsStyles={tagsStyles}
            baseFontStyle={baseFontStyle}
        />
    );
});

Message.propTypes = {
    callback: PropTypes.func,
};

export {Message};
