import {NativeStackNavigationOptions, NativeStackNavigationProp} from '@react-navigation/native-stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';

import {RefreshableSectionList} from '../../components/page';
import SearchBar from '../../components/page/searchBar';
import Warning from '../../components/page/warning';
import TransferTimesRow, {TransferTimesRowProps} from '../../components/transfer-times/row';
import {SkeletonListTransfer} from '../../components/transfer-times/skeletonList';
import {isAndroid} from '../../helpers/device';
import API from '../../services/api';
import {ThemeColors, useDark} from '../../theme';
import {TransferTimesParamList} from '../../types/navigation';
import styles from './styles';

type TransferTimesProps = {
    navigation: NativeStackNavigationProp<TransferTimesParamList, 'Transfer'>;
};

type ITransferTimes = React.FunctionComponent<TransferTimesProps> & {
    navigationOptions: ({navigation}: TransferTimesProps) => NativeStackNavigationOptions;
};

type TransferDataRows = TransferTimesRowProps[];
type TransferData = {program: string; data: TransferDataRows}[];

const TransferTimes: ITransferTimes = () => {
    const isDark = useDark();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<TransferData>([]);
    const [list, setList] = useState<TransferData>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());

    const getData = useCallback(async () => {
        try {
            const response: {data: TransferData} = await API.post(`/mile-transfers/data/transfer`);
            const {data} = response;

            if (_.isArray(data)) {
                setData(data);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const search = useCallback(() => {
        const filteredData: TransferData = [];

        if (data.length > 0 && searchQuery.length > 0) {
            data.forEach(({program, data}) => {
                if (program.toLowerCase().includes(searchQuery.toLowerCase())) {
                    filteredData.push({program, data});
                } else {
                    const rows: TransferDataRows = data.filter(({program}) => program.toLowerCase().includes(searchQuery.toLowerCase()));

                    if (!_.isEmpty(rows)) {
                        filteredData.push({program, data: rows});
                    }
                }
            });
        }

        setList(filteredData);

        if (_.isEmpty(searchQuery)) {
            setList(data);
        }
    }, [data, searchQuery]);

    const refreshData = useCallback(async () => {
        await getData();
        setLastSyncDate(new Date());
    }, [getData]);

    const onSearchInput = useCallback((searchQuery) => {
        setSearchQuery(searchQuery);
    }, []);

    const keyExtractor = useCallback(({program}) => program, []);

    const renderListHeader = useCallback(() => {
        let tintColor = isDark ? ThemeColors.dark.blue : ThemeColors.light.blue;

        if (isAndroid) {
            tintColor = isDark ? ThemeColors.dark.gold : ThemeColors.light.gold;
        }
        // `autoFocus={!!searchQuery}` bug fix with lose focus when list is empty https://github.com/facebook/react-native/issues/14249
        return <SearchBar tintColor={tintColor} placeholder='Find a program' value={searchQuery} onChangeText={onSearchInput} />;
    }, [isDark, searchQuery, onSearchInput]);

    const renderSectionHeader = useCallback(({section}) => {
        const {program} = section;

        return <TransferTimesRow.Title program={program} />;
    }, []);

    const renderEmpty = useCallback(() => <Warning />, []);

    const renderItem = useCallback(({item, index}) => {
        const {program, duration, tip, info} = item;

        if (index === 0) {
            return <TransferTimesRow.SubTitle program={program} duration={duration} tip={tip} info={info} />;
        }

        return <TransferTimesRow program={program} duration={duration} tip={tip} info={info} />;
    }, []);

    useEffect(() => {
        refreshData();
    }, []);

    useEffect(() => {
        search();
    }, [searchQuery, data]);

    if (loading) {
        return <SkeletonListTransfer />;
    }

    return (
        <RefreshableSectionList
            sections={list}
            renderItem={renderItem}
            ListHeaderComponent={renderListHeader}
            renderSectionHeader={renderSectionHeader}
            ListEmptyComponent={renderEmpty}
            keyExtractor={keyExtractor}
            onRefresh={refreshData}
            lastSyncDate={lastSyncDate}
            keyboardDismissMode='on-drag'
            style={[styles.page, isDark && styles.pageDark]}
        />
    );
};

TransferTimes.navigationOptions = () => ({
    title: Translator.trans('transfer_times', {}, 'messages'),
});

export default TransferTimes;
