import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {Image, Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import styles from './styles';

type Card = {
    id: number;
    name: string;
    image: string;
};

type FeesCardsProps = {
    name: string;
    icon: string;
    old: null;
    bold: null;
    background: null;
    link: null;
    refreshTimelineDetails: () => void;
    showMore: () => void;
    val: {
        personal?: Card[];
        business?: Card[];
        list?: Card[];
    };
};
type IFeesCards = React.FunctionComponent<FeesCardsProps>;

const FeesCards: IFeesCards = ({val}) => {
    const isDark = useDark();
    const {personal, business, list} = val;

    const renderTitle = useCallback(
        (name) => (
            <View style={[styles.container, styles.containerSmall, styles.containerSilver, isDark && styles.containerSilverDark]}>
                <Text style={[styles.text, styles.textBold, isDark && styles.textDark]}>{name}</Text>
            </View>
        ),
        [isDark],
    );

    const renderCard = useCallback(
        ({id, name, image}) => (
            <View key={id} style={[styles.containerFixedSmall, isDark && styles.containerDark]}>
                <Image style={{height: 35, width: 56}} height={35} width={56} source={{uri: image}} />
                <Text style={[styles.text, styles.marginLeft, styles.flex1, isDark && styles.textDark]} numberOfLines={2}>
                    {name}
                </Text>
            </View>
        ),
        [isDark],
    );

    const renderPersonalCard = useCallback(
        () =>
            _.isArray(personal) && (
                <>
                    {renderTitle(
                        Translator.trans(
                            /** @Desc("Personal %cards%") */ 'fees-cards.personal',
                            {cards: Translator.transChoice(/** @Desc("Card|Cards") */ 'fees-cards.cards', personal.length, {}, 'mobile-native')},
                            'mobile-native',
                        ),
                    )}
                    {personal.map(renderCard)}
                </>
            ),
        [renderCard, renderTitle, personal],
    );

    const renderBusinessCard = useCallback(
        () =>
            _.isArray(business) && (
                <>
                    {renderTitle(
                        Translator.trans(
                            /** @Desc("Business %cards%") */ 'fees-cards.business',
                            {cards: Translator.transChoice('fees-cards.cards', business.length, {}, 'mobile-native')},
                            'mobile-native',
                        ),
                    )}
                    {business.map(renderCard)}
                </>
            ),
        [renderCard, renderTitle, business],
    );

    const renderListCard = useCallback(() => _.isArray(list) && list.map(renderCard), [list, renderCard]);

    return (
        <>
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={[styles.informer, isDark && styles.informerDark]}>
                    <View style={styles.informerIcon}>
                        <Text style={[styles.informerIconText, isDark && styles.informerIconTextDark]}>i</Text>
                    </View>
                    <View style={styles.flex1}>
                        <Text style={[styles.text, styles.textBold, styles.textWhite]}>
                            {Translator.trans(/** @Desc("No Foreign-Transaction Fees") */ 'fees-cards.no-fees', {}, 'mobile-native')}
                        </Text>
                        <Text style={[styles.text, styles.textSmallest, styles.textWhite]}>
                            {Translator.trans(
                                /** @Desc("These cards don’t charge a foreign transaction fee for purchases made overseas.") */ 'fees-cards.attention',
                                {},
                                'mobile-native',
                            )}
                        </Text>
                    </View>
                    <View style={[styles.informerArrow, isDark && styles.informerArrowDark]}>
                        <View style={styles.shadowInformerArrow} />
                    </View>
                </View>
            </View>
            {renderPersonalCard()}
            {renderBusinessCard()}
            {renderListCard()}
            <View style={[styles.container, isDark && styles.containerDark]}>
                <Text style={[styles.text, styles.textSmallest, styles.textGray, isDark && styles.textGrayDark]}>
                    {Translator.trans(
                        /** @Desc("* According to our records, you have all these credit cards. We make the best effort to verify which cards don't have foreign transaction fees, but ultimately you need to confirm it with your bank. AwardWallet is not liable if you get charged a fee by your bank.") */ 'fees-cards.responsibility',
                        {},
                        'mobile-native',
                    )}
                </Text>
            </View>
        </>
    );
};

export default FeesCards;
