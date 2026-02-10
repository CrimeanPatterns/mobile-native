import Translator from 'bazinga-translator';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ViewPager from 'react-native-pager-view';

import {isAndroid, isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import HeaderButton from '../../page/header/button';
import ThemedModal from '../../page/modal';
import TransactionAnalyzerFilterBar from './filter-bar';

const TransactionAnalyzerFilterModal = ({onApply, onClose, filters, filtersData, activeFilter = 0}) => {
    const [interactionReady, setReady] = useState(isAndroid);
    const [filtersValue, setFiltersValue] = useState(filtersData);
    const [activeFilterIndex, setActiveFilterIndex] = useState(activeFilter);
    const [disabledApplySettings, setDisabledApplySettings] = useState(true);
    const viewPagerRef = useRef<ViewPager>(null);
    const isDark = useDark();

    const setFilter = useCallback(
        ({name, value}) => {
            setFiltersValue({...filtersValue, [name]: value});
            setDisabledApplySettings(false);
        },
        [setFiltersValue, setDisabledApplySettings, filtersValue],
    );

    const applySettings = useCallback(() => {
        onApply(filtersValue);
    }, [onApply, filtersValue]);

    const setActivePage = useCallback(
        (index) => {
            setActiveFilterIndex(index);
        },
        [setActiveFilterIndex],
    );

    const onPageSelected = useCallback(
        (e) => {
            if (isIOS) {
                setActivePage(e.nativeEvent.position);
            }
        },
        [setActivePage],
    );

    const renderPage = useCallback(
        (filter) => {
            const {type, name} = filter;
            const Component = TransactionAnalyzerFilterModal.components[type];

            return (
                <View key={name} collapsable={false}>
                    <Component filter={filter} filtersData={filtersValue[name]} onChangeValue={setFilter} />
                </View>
            );
        },
        [filtersValue, setFilter],
    );

    const headerButtonRight = useMemo(
        () => () => {
            const color = isDark ? DarkColors.blue : Colors.blueDark;

            return (
                <HeaderButton
                    disabled={disabledApplySettings}
                    onPress={applySettings}
                    title={isIOS ? Translator.trans(/** @Desc("Apply") */ 'button.apply', {}, 'mobile-native') : undefined}
                    iconName={isIOS ? undefined : 'android-baseline-check'}
                    color={isIOS ? color : undefined}
                />
            );
        },
        [applySettings, disabledApplySettings, isDark],
    );

    useEffect(() => {
        if (interactionReady && activeFilterIndex > -1) {
            requestAnimationFrame(() => {
                viewPagerRef.current?.setPage(activeFilterIndex);
            });
        }
    }, [activeFilterIndex]);

    useEffect(() => {
        requestAnimationFrame(() => {
            if (isAndroid) {
                viewPagerRef.current?.setPageWithoutAnimation(activeFilter);
            } else {
                setReady(true);
            }
        });
    }, []);

    return (
        <ThemedModal
            presentationStyle={isAndroid ? 'fullScreen' : 'pageSheet'}
            visible
            onClose={onClose}
            headerRight={headerButtonRight}
            headerColor={isDark ? DarkColors.bgLight : Colors.chetwodeBlue}>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <TransactionAnalyzerFilterBar
                    filters={filters}
                    filtersData={filtersValue}
                    activeFilterIndex={activeFilterIndex}
                    setActivePage={setActivePage}
                />
                <View style={styles.pager}>
                    {interactionReady && (
                        <ViewPager
                            ref={viewPagerRef}
                            scrollEnabled={isIOS}
                            initialPage={activeFilter}
                            onPageSelected={onPageSelected}
                            pageMargin={10}
                            style={styles.pager}>
                            {filters.map(renderPage)}
                        </ViewPager>
                    )}
                </View>
            </View>
        </ThemedModal>
    );
};

TransactionAnalyzerFilterModal.propTypes = {
    onApply: PropTypes.func,
    onClose: PropTypes.func,
    filters: PropTypes.array,
    categories: PropTypes.array,
    filtersData: PropTypes.object,
    activeFilter: PropTypes.number,
};

TransactionAnalyzerFilterModal.components = {
    date_range: require('./pages/dateRange').default,
    choice: require('./pages/choice').default,
    category: require('./pages/choice').default,
    amount: require('./pages/amount').default,
};

export default TransactionAnalyzerFilterModal;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    pager: {
        flex: 1,
    },
});
