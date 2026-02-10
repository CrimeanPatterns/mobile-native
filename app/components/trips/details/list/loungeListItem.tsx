import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import {TripStackParamList} from '../../../../types/navigation';
import {AccessIconView, LoungeListItemView} from '../../../../types/trips/blocks';
import DateTimeDiff from '../../../../vendor/dateTimeDiff';
import Icon from '../../../icon';
import Skeleton from '../../../page/skeleton';
import {TouchableBackground} from '../../../page/touchable/background';
import CreditCardImage from '../creditCardImage';
import styles, {arrowColorDark, arrowColorLight} from './styles';

type ILoungeListItem = React.FunctionComponent<LoungeListItemView>;

const LoungeListItem: ILoungeListItem = ({id, name, location, access, isOpened: defIsOpened, nextEventTs}) => {
    const isDark = useDark();
    const navigation = useNavigation<StackNavigationProp<TripStackParamList, 'TimelineLoungeList'>>();
    const timeoutId: {current: ReturnType<typeof setTimeout> | null} = useRef(null);

    const [status, setStatus] = useState<string | null>(null);
    const [isOpened, setOpened] = useState<boolean>(defIsOpened);

    const stopTimer = useCallback(() => {
        if (!_.isNull(timeoutId.current)) {
            clearTimeout(timeoutId.current);
        }
    }, [timeoutId]);

    const runTimer = useCallback(() => {
        const now = Date.now();

        stopTimer();

        if (_.isNumber(nextEventTs)) {
            if ((nextEventTs - 60) * 1000 - now < 0) {
                setOpened(!isOpened);
                setStatus(null);
            } else {
                const status = `${
                    isOpened
                        ? Translator.trans(/** @Desc("Closing in") */ 'closing-in', {}, 'mobile-native')
                        : Translator.trans(/** @Desc("Opening in") */ 'opening-in', {}, 'mobile-native')
                } ${DateTimeDiff.formatDurationInHours(new Date(nextEventTs * 1000), new Date(now))}`;

                setStatus(status);

                timeoutId.current = setTimeout(runTimer, 1000 * 60);
            }
        }
    }, [isOpened, nextEventTs, stopTimer]);

    const onPress = useCallback(() => {
        stopTimer();
        navigation.navigate('TimelineLoungeDetails', {id});
    }, [id, navigation, stopTimer]);

    const renderImage = useCallback(
        ({icon, isGranted}: AccessIconView, index) => (
            <CreditCardImage isGranted={isGranted} name={icon} height={20} width={32} style={styles.marginRight} key={index} />
        ),
        [],
    );

    const Status = useMemo(() => {
        const colorOpen = isDark ? DarkColors.green : Colors.green;
        const colorClosed = isDark ? DarkColors.red : Colors.red;

        return (
            <View style={styles.statusWidth}>
                <View style={[{alignItems: 'center', backgroundColor: isOpened ? colorOpen : colorClosed}]}>
                    <Text style={[styles.text, styles.textWhite]}>
                        {isOpened
                            ? Translator.trans(/** @Desc("Opened") */ 'opened', {}, 'mobile-native')
                            : Translator.trans(/** @Desc("Closed") */ 'closed', {}, 'mobile-native')}
                    </Text>
                </View>
                {_.isString(status) && <Text style={[styles.text, styles.textSmall, styles.status, isDark && styles.textDark]}>{status}</Text>}
            </View>
        );
    }, [isDark, isOpened, status]);

    useEffect(() => {
        runTimer();
        return stopTimer;
    }, []);

    return (
        <TouchableBackground
            onPress={onPress}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            rippleColor={isDark ? DarkColors.border : Colors.gray}
            style={[styles.container, isIOS && styles.arrowCompensation, isDark && styles.containerDark]}>
            <View style={styles.flex1}>
                <Text style={[styles.text, styles.textMedium, isDark && styles.textDark]}>{name}</Text>
                <Text style={[styles.text, isDark && styles.textDark]}>{location}</Text>
                {_.isArray(access) && <View style={[styles.onDateRight, styles.marginTop]}>{access.map(renderImage)}</View>}
            </View>
            <View style={[styles.onDateRight, styles.marginLeft]}>
                {Status}
                {isIOS && <Icon name='arrow' color={isDark ? arrowColorDark : arrowColorLight} size={20} />}
            </View>
        </TouchableBackground>
    );
};

const LoungeListItemSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <View style={[styles.container, isIOS && styles.arrowCompensation, isDark && styles.containerDark]}>
            <View style={styles.flex1}>
                <Skeleton layout={[{key: 'image', width: 200, height: 21}]} />
                <Skeleton layout={[{key: 'image', width: 150, height: 15}]} style={styles.marginTop} />
                <View style={[styles.onDateRight, styles.marginTop]}>
                    <Skeleton layout={[{key: 'image', height: 20, width: 32}]} style={styles.marginRight} />
                    <Skeleton layout={[{key: 'image', height: 20, width: 32}]} />
                </View>
            </View>
            <View style={[styles.onDateRight, styles.marginLeft]}>
                <View style={styles.skeletonStatus}>
                    <Skeleton layout={[{key: 'image', width: 80, height: 20}]} />
                </View>
                <View>{isIOS && <Icon name='arrow' color={isDark ? arrowColorDark : arrowColorLight} size={20} />}</View>
            </View>
        </View>
    );
};

export default LoungeListItem;
export {LoungeListItemSkeleton};
