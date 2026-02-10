import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {FlatList, FlatListProps, ListRenderItem, View} from 'react-native';

import {useDark} from '../../../theme';
import styles from './styles';

type IFlatList<T> = Omit<FlatListProps<T>, 'data' | 'renderItem' | 'ItemSeparatorComponent'>;

type SkeletonListProps = {
    length?: number;
    data?: any[];
    renderItem?: ListRenderItem<any>;
    ItemSeparatorComponent?: true | React.ComponentType<any>;
} & IFlatList<any>;

type ISkeletonList = React.FunctionComponent<React.PropsWithChildren<SkeletonListProps>>;

const SkeletonList: ISkeletonList = ({
    length = 1,
    data: items,
    ItemSeparatorComponent: renderSeparatorComponent,
    renderItem: renderItemComponent,
    keyExtractor: _keyExtractor,
    ...props
}) => {
    const isDark = useDark();
    const data = useMemo(() => items || new Array(length).fill(null), [items, length]);

    const keyExtractor = useCallback(
        (item, index) => {
            if (_.isFunction(_keyExtractor)) {
                return _keyExtractor(item, index);
            }

            return `skeleton-${index}`;
        },
        [_keyExtractor],
    );

    const renderSeparator = useCallback(
        (props) => {
            if (_.isFunction(renderSeparatorComponent)) {
                return renderSeparatorComponent(props);
            }

            if (renderSeparatorComponent) {
                return <View style={[styles.separator, isDark && styles.separatorDark]} />;
            }

            return null;
        },
        [renderSeparatorComponent, isDark],
    );

    const renderItem = useCallback(
        (props) => {
            if (_.isFunction(renderItemComponent)) {
                return renderItemComponent(props);
            }

            return null;
        },
        [renderItemComponent],
    );

    return <FlatList data={data} renderItem={renderItem} ItemSeparatorComponent={renderSeparator} keyExtractor={keyExtractor} {...props} />;
};

export default SkeletonList;
