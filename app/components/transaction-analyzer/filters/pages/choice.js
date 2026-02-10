import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import Checkbox from '../../checkbox';
import CheckboxGroup from '../../checkboxGroup';

const Separator = React.memo(({iaShort, iaGroup}) => {
    const isDark = useDark();

    return <View style={[styles.separator, iaShort && styles.shortSeparator, iaGroup && styles.groupSeparator, isDark && styles.separatorDark]} />;
});

Separator.propTypes = {
    iaShort: PropTypes.bool,
    iaGroup: PropTypes.bool,
};

const Choice = React.memo(({filter, filtersData, onChangeValue}) => {
    const isDark = useDark();
    const {name, choices} = filter;

    const onPressAll = useCallback(() => {
        const value = _.isNull(filtersData) ? [] : null;

        onChangeValue({name, value});
    }, [name, filtersData, onChangeValue]);

    const setFiltersData = useCallback(
        (value) => {
            let filters = null;
            const defaultFilters = [];

            choices.forEach((item) => {
                const {value, choices} = item;

                if (_.isArray(choices)) {
                    choices.forEach(({value}) => {
                        defaultFilters.push(value);
                    });
                } else {
                    defaultFilters.push(value);
                }
            });

            if (_.isArray(filtersData)) {
                if (_.isArray(value)) {
                    if (_.intersection(filtersData, value).length < value.length) {
                        const filter = [...filtersData, ..._.difference(value, filtersData)];

                        filters = filter.length === defaultFilters.length ? null : filter;
                    } else {
                        filters = _.difference(filtersData, value);
                    }
                } else if (_.includes(filtersData, value)) {
                    filters = filtersData.filter((item) => item !== value);
                } else {
                    const filter = [...filtersData, value];

                    filters = filter.length === defaultFilters.length ? null : filter;
                }
            } else if (_.isArray(value)) {
                filters = _.difference(defaultFilters, value);
            } else {
                filters = defaultFilters.filter((item) => item !== value);
            }

            onChangeValue({name, value: filters});
        },
        [name, choices, filtersData, onChangeValue],
    );

    const keyExtractor = useCallback((item, index) => `${item.value}-${index}`, []);

    const renderHeader = useCallback(
        () => (
            <>
                <View style={[styles.container, styles.checkboxAll, isDark && styles.containerDark]}>
                    <Checkbox label='All' value={_.isNull(filtersData)} onChangeValue={onPressAll} />
                </View>
                <Separator />
            </>
        ),
        [filtersData, onPressAll, isDark],
    );

    const renderFooter = useCallback(() => <Separator />, []);

    const renderItem = useCallback(
        ({item, index}) => {
            const isLast = index === choices.length - 1;
            const {name, value, choices: itemChoices} = item;

            if (_.isArray(itemChoices)) {
                return (
                    <>
                        <View style={[styles.container, isDark && styles.containerDark]}>
                            <CheckboxGroup onChangeValue={setFiltersData} data={item} filtersData={filtersData} />
                        </View>
                        {!isLast && <Separator iaGroup />}
                    </>
                );
            }

            return (
                <View style={[styles.container, isDark && styles.containerDark]}>
                    <Checkbox
                        label={name}
                        value={_.isNull(filtersData) || _.includes(filtersData, value)}
                        onChangeValue={() => setFiltersData(value)} // TODO: unwanted arrow func
                    />
                    {!isLast && <Separator iaShort />}
                </View>
            );
        },
        [filtersData, choices, setFiltersData, isDark],
    );

    return (
        <FlatList
            data={choices}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            renderItem={renderItem}
            contentInsetAdjustmentBehavior='automatic'
        />
    );
});

Choice.propTypes = {
    filter: PropTypes.object,
    filtersData: PropTypes.any,
    onChangeValue: PropTypes.func,
};

export default Choice;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
    },
    containerDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
        borderColor: DarkColors.border,
    },
    shortSeparator: {
        marginLeft: isIOS ? 15 : 24,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    checkboxAll: {
        marginBottom: 25,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    list: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    groupSeparator: {
        height: 25,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    separatorDark: {
        borderColor: DarkColors.border,
    },
});
