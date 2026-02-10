import React, {LegacyRef} from 'react';
import {FlatList, FlatListProps, StyleProp, View, ViewStyle} from 'react-native';

import {useDark} from '../../../theme';
import Card, {LayoutSkeletonCard, SkeletonCard} from './card';
import styles from './styles';

type CardBarProps = {
    forwardedRef?: LegacyRef<FlatList>;
    style?: StyleProp<ViewStyle>;
} & FlatListProps<any>;

type ICardBar = React.FunctionComponent<CardBarProps>;

const CardBar: ICardBar = ({data, renderItem, forwardedRef, style, children, ...props}) => {
    const isDark = useDark();

    return (
        <View style={[isDark && styles.containerBarDark, style]}>
            <FlatList horizontal ref={forwardedRef} data={data} renderItem={renderItem} showsHorizontalScrollIndicator={false} {...props} />
            {children}
        </View>
    );
};

type SkeletonCardBarProps = {
    length?: number;
    layout?: LayoutSkeletonCard;
    style?: StyleProp<ViewStyle>;
};

type ISkeletonCardBar = React.FunctionComponent<SkeletonCardBarProps>;

const SkeletonCardBar: ISkeletonCardBar = ({length = 6, layout, style, children}) => {
    const isDark = useDark();

    return (
        <View style={[styles.containerBarSkeleton, styles.containerBar, isDark && styles.containerBarDark, style]}>
            {new Array(length).fill(null).map((_value, index) => (
                <SkeletonCard key={index} layout={layout} />
            ))}
            {children}
        </View>
    );
};

export default CardBar;
export {Card, SkeletonCardBar, SkeletonCard};
