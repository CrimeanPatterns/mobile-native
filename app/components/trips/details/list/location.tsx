import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {TripStackParamList} from '../../../../types/navigation';
import {LocationBlock} from '../../../../types/trips/blocks';
import Icon from '../../../icon';
import SelectableText from '../../../page/selectableText';
import {TouchableBackground} from '../../../page/touchable/background';
import {TimelineDetailsIconBlock} from './row';
import styles, {arrowColorDark, arrowColorLight} from './styles';

type ILocation = React.FunctionComponent<LocationBlock>;

const Location: ILocation = ({val, old}) => {
    const isDark = useDark();
    const navigation = useNavigation<StackNavigationProp<TripStackParamList, 'TimelineSegmentDetails'>>();

    const isTouchable = useMemo(() => _.isNumber(val.lounges), [val.lounges]);

    const TouchableView = useMemo(() => (isTouchable ? TouchableBackground : View), [isTouchable]);

    const onPress = useCallback(() => {
        const {segmentId, stage} = val;

        navigation.navigate('TimelineLoungeList', {segmentId, stage});
    }, [navigation, val]);

    return (
        <TouchableView
            onPress={onPress}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={[styles.container, isIOS && styles.arrowCompensation, isDark && styles.containerDark]}>
            <View style={[styles.info, isTouchable && styles.maxWidth]}>
                <TimelineDetailsIconBlock iconName='marker' changed={_.isObject(old) && (_.isString(old.code) || _.isString(old.name))} />
                {_.isString(val.code) && val.code.length > 0 && (
                    <SelectableText style={[styles.place, isDark && styles.blueBlockDark]}>{val.code}</SelectableText>
                )}
                <SelectableText style={[styles.text, isDark && styles.textDark]}>{val.name}</SelectableText>
            </View>
            {_.isNumber(val.lounges) && (
                <View style={styles.onDateRight}>
                    <View style={styles.flexEnd}>
                        <Text style={[styles.text, styles.textBold, styles.textBlue, isDark && styles.textBlue]}>{val.lounges}</Text>
                        <Text style={[styles.text, styles.textGray, styles.textSmallest, isDark && styles.textDark]}>
                            {Translator.transChoice(/** @Desc("Lounge|Lounges") */ 'timeline.lounge', val.lounges, {}, 'mobile-native')}
                        </Text>
                    </View>
                    {isIOS && <Icon name='arrow' color={isDark ? arrowColorDark : arrowColorLight} style={styles.marginArrow} size={20} />}
                </View>
            )}
        </TouchableView>
    );
};

export default Location;
