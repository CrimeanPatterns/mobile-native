import Translator from 'bazinga-translator';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';

import {isAndroid} from '../../helpers/device';
import {Colors, DarkColors} from '../../styles';
import {useDark} from '../../theme';
import {useNavigationMainColor} from '../../theme/navigator';
import Icon from '../icon';
import CardBar, {Card, SkeletonCardBar} from '../page/cardBar';
import Skeleton from '../page/skeleton';
import {TouchableBackground} from '../page/touchable/background';
import styles from './styles';

type MileValueCardBarProps = {
    data: {
        name: string;
        value: {
            primary: {
                value: string;
            };
        };
    }[];
};

// @ts-ignore
const MileValueCardBar: React.FunctionComponent<MileValueCardBarProps> = ({data, navigation}) => {
    const isDark = useDark();
    const mainColor = useNavigationMainColor();

    const onPressCard = useCallback(
        (index) => {
            const item = data[index];

            navigation.navigate('MileValue', {search: item.name});
        },
        [data, navigation],
    );

    const onPressMessage = useCallback(() => {
        navigation.navigate('MileValue');
    }, [navigation]);

    const renderCard = useCallback(
        ({item, index}) => (
            <Card onPress={() => onPressCard(index)} rippleColor={mainColor}>
                <Text style={[styles.textTitle, isDark && styles.textTitleDark]}>{item.name}</Text>
                <Text numberOfLines={2} style={[styles.textValue, isDark && styles.textValueDark, isAndroid && {color: mainColor}]}>
                    {item.value.primary.value}
                </Text>
            </Card>
        ),
        [onPressCard, isDark],
    );

    return (
        <CardBar data={data} renderItem={renderCard}>
            <TouchableBackground
                onPress={onPressMessage}
                style={styles.message}
                activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                rippleColor={isDark ? DarkColors.bgLight : Colors.gray}>
                <Text style={[styles.textMessage, isDark && styles.textMessageDark]}>
                    {Translator.trans(
                        /** @Desc("We estimate the value of points based on travel redemptions.") */ 'mile-value-bar.message',
                        {},
                        'mobile-native',
                    )}
                    {Translator.trans(/** @Desc("Tap to see more values, or set your own.") */ 'mile-value-bar.more-value', {}, 'mobile-native')}
                </Text>
                <Icon name='arrow' style={styles.arrow} color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={20} />
            </TouchableBackground>
        </CardBar>
    );
};

type SkeletonProps = {
    length: number;
};

type ISkeleton = React.FunctionComponent<SkeletonProps>;

const skeletonLayout = [{key: 'message', width: 300, height: 28}];

const MileValueCardBarSkeleton: ISkeleton = () => (
    <SkeletonCardBar>
        <View style={styles.message}>
            <Skeleton layout={skeletonLayout} />
        </View>
    </SkeletonCardBar>
);

export default MileValueCardBar;
export {MileValueCardBarSkeleton};
