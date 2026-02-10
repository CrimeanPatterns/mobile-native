import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {Ref, useCallback, useEffect, useRef} from 'react';
import {FlatList} from 'react-native';

import {useDark} from '../../../../theme';
import CardBar from '../../../page/cardBar';
import TransactionAnalyzerCard, {DateRange} from './filterCard';

type Choices = {
    title: string;
    value: number;
}[];

type DateRangeT = {
    name: 'date_range';
    type: 'date_range';
    title: string;
    choices: Choices;
    default: number;
};

type CreditCard = {
    name: 'credit_card';
    type: 'choice';
    title: string;
    choices: Choices &
        {
            choices: Choices;
        }[];
};

type Categories = {
    name: 'categories';
    type: 'category';
    title: string;
    choices: Choices;
};

type Amount = {
    name: 'amount';
    type: 'amount';
    title: string;
};

type PointMultiplier = {
    name: 'point_multiplier';
    type: 'choice';
    title: string;
    choices: Choices;
};

type EarningPotential = {
    name: 'earning_potential';
    type: 'choice';
    title: string;
    choices: Choices;
};

type TransactionAnalyzerFilterBarProps = {
    filters: [CreditCard, DateRangeT, Categories, Amount, PointMultiplier, EarningPotential];
    filtersData: {
        amount: {
            exactly?: string;
            greater?: string;
            less?: string;
        } | null;
        categories: string[] | null;
        credit_card: number[] | null;
        date_range: any | null;
        point_multiplier: {name: string; value: string}[] | null;
        earning_potential: {name: string; value: string}[] | null;
    };
    setActivePage: (index: number) => void;
    activeFilterIndex?: number;
};

type ITransactionAnalyzerFilterBar = React.FunctionComponent<TransactionAnalyzerFilterBarProps>;

const TransactionAnalyzerFilterBar: ITransactionAnalyzerFilterBar = ({filters, filtersData, setActivePage, activeFilterIndex}) => {
    const isDark = useDark();
    const cardBarRef: Ref<FlatList> = useRef(null);

    const getItemLayout = useCallback((_data, index) => ({length: 102, offset: 102 * index, index}), []);

    const keyExtractor = useCallback((item, index) => {
        const {name} = item;

        if (_.isString(name)) {
            return `${name}-${index}`;
        }

        return String(index);
    }, []);

    const renderCard = useCallback(
        ({item, index}) => {
            const {name, title} = item;
            const filterData = filtersData[name];

            const props = {
                index,
                title,
                isActive: activeFilterIndex === index,
                onPress: setActivePage,
                isChanged: _.isObject(filterData),
            };

            switch (name) {
                case 'date_range':
                    return <DateRange {...props} value={filterData} filtersValue={item} />;

                case 'amount': {
                    let value = Translator.trans(/** @Desc("Any") */ 'transaction-analyzer-filter.any', {}, 'mobile-native');

                    if (_.isObject(filterData)) {
                        const {exactly, greater, less} = filterData;

                        if (_.isString(exactly)) {
                            value =
                                Translator.trans(/** @Desc("Exact Amount $") */ 'transaction-analyzer-filter.amount.exact', {}, 'mobile-native') +
                                exactly;
                        }

                        if (_.isString(greater)) {
                            value =
                                Translator.trans(/** @Desc("Greater than $") */ 'transaction-analyzer-filter.amount.greater', {}, 'mobile-native') +
                                greater;
                        }

                        if (_.isString(less)) {
                            value =
                                Translator.trans(/** @Desc("Less than $") */ 'transaction-analyzer-filter.amount.less', {}, 'mobile-native') + less;
                        }
                    }

                    return <TransactionAnalyzerCard {...props} value={value} />;
                }

                case 'categories':
                case 'credit_card':
                case 'point_multiplier':
                case 'earning_potential': {
                    let value = Translator.trans(/** @Desc("All") */ 'transaction-analyzer-filter.all', {}, 'mobile-native');

                    if (_.isArray(filterData)) {
                        if (_.isEmpty(filterData)) {
                            value = '-';
                        } else if (filterData.length > 1) {
                            value = Translator.trans(
                                /** @Desc("Multiple Options Selected") */ 'transaction-analyzer-filter.multiple-selected',
                                {},
                                'mobile-native',
                            );
                        } else if (filterData.length === 1) {
                            const filter = filters.find((item) => item.name === name);

                            const filterValue = filter.choices.find((item) => {
                                const choices = item?.choices;

                                return _.isArray(choices) ? choices.find((item) => item.value === filterData[0]) : item.value === filterData[0];
                            });

                            value = filterValue.name;
                        }
                    }

                    return <TransactionAnalyzerCard {...props} value={value} />;
                }

                default:
                    return null;
            }
        },
        [filters, filtersData, activeFilterIndex, setActivePage],
    );

    useEffect(() => {
        if (_.isNumber(activeFilterIndex) && activeFilterIndex > -1) {
            const viewPosition = activeFilterIndex !== 0 && activeFilterIndex !== filters.length ? 0.1 : 0;

            requestAnimationFrame(() => {
                cardBarRef.current?.scrollToIndex({index: activeFilterIndex, viewPosition});
            });
        }
    }, [activeFilterIndex, filters, cardBarRef]);

    return <CardBar data={filters} renderItem={renderCard} getItemLayout={getItemLayout} keyExtractor={keyExtractor} forwardedRef={cardBarRef} />;
};

export default TransactionAnalyzerFilterBar;
