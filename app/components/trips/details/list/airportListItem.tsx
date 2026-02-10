import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {LoungeTitleView} from '../../../../types/trips/blocks';
import Icon from '../../../icon';
import Skeleton from '../../../page/skeleton';
import styles, {iconColors, iconColorsDark, iconSize} from './styles';

type IAirportListItem = React.FunctionComponent<LoungeTitleView>;

const AirportListItem: IAirportListItem = ({name}) => {
    const isDark = useDark();

    return (
        <View style={[styles.container, styles.title, styles.flexStart, isDark && styles.containerDark]}>
            <Icon name='lounges' color={isDark ? iconColorsDark : iconColors} style={styles.marginIcon} size={iconSize} />
            <Text style={[styles.flex1, styles.text, styles.textMedium, isDark && styles.textDark]} numberOfLines={2}>
                {name}
            </Text>
        </View>
    );
};

const AirportListItemSkeleton: React.FunctionComponent = () => (
    <View style={[styles.container, styles.title, styles.flexStart]}>
        <Skeleton layout={[{key: 'image', width: 30, height: 30}]} style={styles.marginRight} />
        <Skeleton layout={[{key: 'image', width: 250, height: 21}]} style={styles.marginLeft} />
    </View>
);

export default AirportListItem;
export {AirportListItemSkeleton};
