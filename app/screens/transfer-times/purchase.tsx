import {NativeStackNavigationOptions, NativeStackNavigationProp} from '@react-navigation/native-stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';

import {RefreshableFlatList} from '../../components/page';
import SearchBar from '../../components/page/searchBar';
import Warning from '../../components/page/warning';
import TransferTimesRow, {TransferTimesRowProps} from '../../components/transfer-times/row';
import {SkeletonListPurchase} from '../../components/transfer-times/skeletonList';
import {isAndroid} from '../../helpers/device';
import API from '../../services/api';
import {ThemeColors, useDark} from '../../theme';
import {TransferTimesParamList} from '../../types/navigation';
import styles from './styles';

type PurchaseTimesProps = {
    navigation: NativeStackNavigationProp<TransferTimesParamList, 'Purchase'>;
};

type IPurchaseTimes = React.FunctionComponent<PurchaseTimesProps> & {
    navigationOptions: ({navigation}: PurchaseTimesProps) => NativeStackNavigationOptions;
};

type PurchaseData = TransferTimesRowProps[];

const PurchaseTimes: IPurchaseTimes = () => {
    const isDark = useDark();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<PurchaseData>([]);
    const [list, setList] = useState<PurchaseData>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());

    const getData = useCallback(async () => {
        try {
            const response: {data: PurchaseData} = await API.post(`/mile-transfers/data/purchase`);
            const {data} = response;

            if (_.isObject(data)) {
                setData(data);
            }
        } finally {
            setLoading(false);
        }
    }, [setData, setLoading]);

    const search = useCallback(() => {
        if (data.length > 0 && searchQuery.length > 0) {
            const filteredData = data.filter(({program}) => program.toLowerCase().includes(searchQuery.toLowerCase()));

            setList(filteredData);
        }

        if (_.isEmpty(searchQuery)) {
            setList(data);
        }
    }, [data, searchQuery]);

    const refreshData = useCallback(async () => {
        await getData();
        setLastSyncDate(new Date());
    }, [getData]);

    const onSearchInput = useCallback(
        (searchQuery) => {
            setSearchQuery(searchQuery);
        },
        [setSearchQuery],
    );

    const keyExtractor = useCallback(({program}) => program, []);

    const renderListHeader = useCallback(() => {
        let tintColor = isDark ? ThemeColors.dark.blue : ThemeColors.light.blue;

        if (isAndroid) {
            tintColor = isDark ? ThemeColors.dark.gold : ThemeColors.light.gold;
        }

        return <SearchBar tintColor={tintColor} placeholder='Find a program' value={searchQuery} onChangeText={onSearchInput} />;
    }, [isDark, searchQuery, onSearchInput]);

    const renderEmpty = useCallback(() => <Warning />, []);

    const renderItem = useCallback(({item}) => {
        const {program, duration, info} = item;

        return <TransferTimesRow program={program} duration={duration} info={info} />;
    }, []);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        search();
    }, [searchQuery, data]);

    if (loading) {
        return <SkeletonListPurchase />;
    }

    return (
        <RefreshableFlatList
            data={list}
            renderItem={renderItem}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={renderEmpty}
            keyExtractor={keyExtractor}
            onRefresh={refreshData}
            lastSyncDate={lastSyncDate}
            keyboardDismissMode='on-drag'
            style={[styles.page, isDark && styles.pageDark]}
        />
    );
};

PurchaseTimes.navigationOptions = () => ({
    title: Translator.trans('purchase_times', {}, 'messages'),
});

export default PurchaseTimes;
