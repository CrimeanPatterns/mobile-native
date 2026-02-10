import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useState} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import API from '../../../../services/api';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {SavingsBlock} from '../../../../types/trips/blocks';
import Icon from '../../../icon';
import {TouchableBackground} from '../../../page/touchable/background';
import AlternativeFlight from '../alternative-flight';
import {AlternativeFlightsData} from '../alternative-flight/types';
import styles from './styles';

type ISavings = React.FunctionComponent<SavingsBlock>;

const Savings: ISavings = ({name, refreshTimelineDetails, val}) => {
    const isDark = useDark();
    const [visible, setVisible] = useState(false);
    const [data, setData]: [AlternativeFlightsData | null, (AlternativeFlightsData) => void] = useState(null);

    const onPress = useCallback(async () => {
        const response: {data} = await API.get(`/timeline/alternative-flights/${val.tripSegmentId}`);
        const {data} = response;

        setData(data);
        setVisible(true);
    }, [val.tripSegmentId]);

    const onClose = useCallback(() => setVisible(false), []);

    return (
        <>
            <TouchableBackground
                onPress={onPress}
                activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                rippleColor={isDark ? DarkColors.border : Colors.gray}
                style={[styles.container, styles.arrowCompensation, isDark && styles.containerDark]}>
                <View style={[{flex: 1}]}>
                    <View
                        style={[
                            {
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            },
                        ]}>
                        <Text style={[styles.text, isDark && styles.textDark]}>{name}</Text>
                        <View style={[styles.info]}>
                            <View style={styles.marginRight}>
                                <Text style={[styles.text, styles.textSmall, styles.textBold, styles.textRight, isDark && styles.textDark]}>
                                    {val.mileValue}
                                </Text>
                                <Text style={[styles.text, styles.textSmallest, styles.textBold, styles.textRight, isDark && styles.textDark]}>
                                    {Translator.trans('per-mile', {}, 'trips')}
                                </Text>
                            </View>
                            <Text style={[styles.blueBlock, isDark && styles.blueBlockDark]}>{val.cost}</Text>
                            {isIOS && (
                                <Icon name='arrow' style={styles.textMargin} color={Colors.grayDarkLight} colorDark={DarkColors.gray} size={24} />
                            )}
                        </View>
                    </View>
                    <Text style={[styles.text, styles.textSmallest, styles.textGray, styles.marginTop, isDark && styles.textGrayDark]}>
                        {Translator.trans(
                            /** @Desc("We estimated your savings based on a similar flight, tap here to view it or to set your own value of an alternative flight") */ 'alternative-flight.savings-hint',
                            {},
                            'mobile-native',
                        )}
                    </Text>
                </View>
            </TouchableBackground>
            {visible && _.isObject(data) && (
                <AlternativeFlight data={data} tripSegmentId={val.tripSegmentId} onClose={onClose} refreshTimelineDetails={refreshTimelineDetails} />
            )}
        </>
    );
};

export default Savings;
