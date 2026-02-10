import {useDimensions} from '@react-native-community/hooks';
import {useNavigation, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {FormattedNumber} from 'react-intl';
import {StyleProp, Text, View, ViewStyle} from 'react-native';

import AccountsList from '../../../../services/accountsList';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import Icon from '../../../icon';
import CardBar from '../../../page/cardBar';
import Card from '../../../page/cardBar/card';
import Tooltip from '../../../tooltip';
import styles from './styles';

type TotalBarItem = {
    type: 'mileValue' | 'points';
    total: string;
    value: number;
    changes: number;
    tooltip?: boolean;
};

const TotalBar: React.FunctionComponent<{
    counters: {[key: string]: number};
    styleCard?: StyleProp<ViewStyle>;
}> = ({counters, styleCard}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const isDark = useDark();
    const defaultColor = isDark ? DarkColors.bgLight : Colors.grayLight;
    const {window} = useDimensions();
    const {changedPeriodDesc} = AccountsList.getAccountsOptions();

    const {totals, lastChangeTotals, mileValue, lastChangeMileValue} = counters;

    const data: TotalBarItem[] = useMemo(
        () => [
            {
                type: 'mileValue',
                total: Translator.trans(/** @Desc("Total Estimated Value") */ 'award.account.list.totals.estimated', {}, 'mobile-native'),
                value: Math.round(mileValue),
                changes: Math.round(lastChangeMileValue),
            },
            {
                type: 'points',
                total: Translator.trans(/** @Desc("Total Points") */ 'award.account.list.totals.points', {}, 'mobile-native'),
                value: Math.round(totals),
                changes: Math.round(lastChangeTotals),
                tooltip: true,
            },
        ],
        [lastChangeMileValue, lastChangeTotals, mileValue, totals],
    );

    // 38 - 2 отступа по 15px, 1 отступ 8px
    const width = useMemo(() => (window.width - 38) / data.length, [window.width, data.length]);

    // @ts-ignore
    const onPressCard = useCallback(() => navigation.navigate('AccountsTotals', route.params), [navigation, route.params]);

    const renderCard = useCallback(
        ({item, index}) => {
            const isMileValue = item.type === 'mileValue';
            const colorGreen = isDark ? DarkColors.green : Colors.green;
            const colorBlue = isDark ? DarkColors.blue : Colors.blue;

            return (
                <Card
                    activeBackgroundColor={defaultColor}
                    rippleColor={defaultColor}
                    onPress={onPressCard}
                    style={[styles.card, {width}]}
                    containerStyle={[styles.cardWrap, styleCard && styleCard]}>
                    <View style={styles.numberBlock}>
                        {!isMileValue && (
                            <View style={styles.iconDB}>
                                <Icon name={'icon-coins-new'} size={16} color={colorGreen} />
                            </View>
                        )}
                        <Text style={[styles.value, isDark && styles.textDark]}>
                            {isMileValue && '$'}
                            <FormattedNumber value={item.value} />
                        </Text>
                    </View>
                    <View style={[styles.titleWrap]}>
                        <Text style={[styles.title, isDark && styles.titleDark]}>{item.total}</Text>
                    </View>
                    {item.changes !== 0 ? (
                        <View style={styles.changesBlock}>
                            {item.changes > 0 ? (
                                <>
                                    <Icon name='square-arrow' color={colorGreen} style={styles.iconArrowUp} size={16} />
                                    <Text style={[styles.changes, {color: colorGreen}]}>
                                        {isMileValue ? '+$' : '+'}
                                        <FormattedNumber value={item.changes} />
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Icon name='square-arrow' color={colorBlue} style={styles.iconArrowDown} size={16} />
                                    <Text style={[styles.changes, {color: colorBlue}]}>
                                        {isMileValue && `-$`}
                                        <FormattedNumber value={isMileValue ? Math.abs(item.changes) : item.changes} />
                                    </Text>
                                </>
                            )}
                        </View>
                    ) : (
                        _.isObject(data.find(({changes}, itemIndex) => itemIndex !== index && changes !== 0)) && (
                            <View style={styles.changesBlock}>
                                <View style={styles.plug} />
                            </View>
                        )
                    )}
                    {item.tooltip && _.isString(changedPeriodDesc) && <Tooltip title={changedPeriodDesc} />}
                </Card>
            );
        },
        [isDark, data, onPressCard, width, changedPeriodDesc],
    );

    return <CardBar data={data} renderItem={renderCard} style={styles.cardBarWrap} />;
};

export default TotalBar;
