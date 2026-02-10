import _ from 'lodash';
import React, {useCallback} from 'react';
import {View} from 'react-native';

import {useDark} from '../../theme';
import SearchBar from '../page/searchBar';
import Skeleton from '../page/skeleton';
import SkeletonList from '../page/skeleton/skeletonList';
import SkeletonSectionList from '../page/skeleton/skeletonSectionList';
import styles from './styles';

const layout = {
    title: [{key: 'title', width: 170, height: 25}],
    program: [{key: 'program', width: 170, height: 18}],
    duration: [{key: 'duration', width: 70, height: 18}],
    tip: [{key: 'tip', width: 50, height: 16}],
};

const Header = React.memo(() => <SearchBar placeholder='Find a program' onChangeText={_.noop} editable={false} />);

const SectionHeader = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.header, styles.container, isDark && styles.containerDark]}>
            <Skeleton layout={layout.title} />
        </View>
    );
});

const TransferRow = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.row, styles.container, isDark && styles.containerDark]}>
            <Skeleton layout={layout.program} />
            <View style={styles.duration}>
                <Skeleton layout={layout.duration} containerStyle={{marginBottom: 5}} />
                <Skeleton layout={layout.tip} />
            </View>
        </View>
    );
});

const PurchaseRow = React.memo(() => {
    const isDark = useDark();

    return (
        <View style={[styles.row, styles.container, isDark && styles.containerDark]}>
            <Skeleton layout={layout.program} />
            <Skeleton layout={layout.duration} />
        </View>
    );
});

const SkeletonListTransfer = React.memo(() => (
    <SkeletonSectionList
        sections={4}
        length={5}
        renderItem={() => <TransferRow />}
        ListHeaderComponent={() => <Header />}
        renderSectionHeader={() => <SectionHeader />}
        ItemSeparatorComponent={_.stubFalse}
    />
));

const SkeletonListPurchase = React.memo(() => {
    const renderItem = useCallback(() => <PurchaseRow />, []);

    return <SkeletonList length={15} ListHeaderComponent={() => <Header />} renderItem={renderItem} />;
});

export {SkeletonListTransfer, SkeletonListPurchase};
