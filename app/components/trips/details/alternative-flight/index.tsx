import Translator from 'bazinga-translator';
import fromColor from 'color';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

import {isIOS} from '../../../../helpers/device';
import API from '../../../../services/api';
import {Colors, DarkColors} from '../../../../styles';
import {useDark} from '../../../../theme';
import HeaderButton from '../../../page/header/button';
import ThemedModal from '../../../page/modal';
import CustomValue from './customValue';
import AlternativeFlightSegment from './segment';
import styles from './styles';
import {AlternativeFlightsData} from './types';

type AlternativeFlightProps = {
    data: AlternativeFlightsData;
    tripSegmentId: number;
    onClose: () => void;
    refreshTimelineDetails: () => void;
};

type IAlternativeFlight = React.FunctionComponent<AlternativeFlightProps>;

const Components = {
    cheapest: AlternativeFlightSegment,
    exactMatch: AlternativeFlightSegment,
    custom: CustomValue,
};

const AlternativeFlight: IAlternativeFlight = ({data, tripSegmentId, onClose, refreshTimelineDetails}) => {
    const isDark = useDark();
    const {choices, selected} = data;
    const [active, setActive] = useState(selected);
    const [customValue, setCustomValue] = useState('');
    const [disabledApply, setDisabledApply] = useState(true);

    const onChange = useCallback((active, customValue) => {
        setActive(active);
        setCustomValue(customValue);
    }, []);

    const keyExtractor = useCallback((item, index) => `${item.kind}-${index}`, []);

    const saveValue = useCallback(async () => {
        const data = {
            selected: active,
            customValue,
        };

        await API.post(`/timeline/alternative-flights/${tripSegmentId}`, data);
    }, [active, customValue, tripSegmentId]);

    const onApply = useCallback(async () => {
        await saveValue();
        refreshTimelineDetails();

        onClose();
    }, [onClose, refreshTimelineDetails, saveValue]);

    const headerRight = useCallback(() => {
        const color = isDark ? DarkColors.blue : Colors.blueDark;

        return (
            <HeaderButton
                disabled={disabledApply}
                disabledColor={isIOS ? undefined : fromColor(Colors.gray).alpha(0.3).rgb().string()}
                onPress={onApply}
                title={Translator.trans('button.apply', {}, 'mobile-native')}
                color={isIOS ? color : undefined}
            />
        );
    }, [disabledApply, isDark, onApply]);

    const onChangeValue = useCallback(
        (value) =>
            ({customValue}) => {
                onChange(value, customValue);
            },
        [onChange],
    );

    useEffect(() => {
        if (selected === active || (active === 2 && customValue.length === 0)) {
            setDisabledApply(true);
        } else {
            setDisabledApply(false);
        }
    }, [active, customValue, selected]);

    const renderItem = useCallback(
        ({item}) => {
            const {type, value, ...props} = item;
            const Component = Components[type];

            if (Component) {
                return <Component type={type} active={active === value} onChange={onChangeValue(value)} {...props} />;
            }

            return null;
        },
        [active, onChangeValue],
    );

    const renderFooter = useCallback(
        () => (
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.logo}>
                    <Image source={require('../../../../assets/images/skyscanner-logo.png')} />
                </View>
            </View>
        ),
        [isDark],
    );

    return (
        <ThemedModal
            visible
            title={Translator.trans('choose-alternative-flight', {}, 'trips')}
            headerRight={headerRight}
            onClose={onClose}
            presentationStyle={isIOS ? 'pageSheet' : 'fullScreen'}>
            <View style={[styles.page, isDark && styles.pageDark]}>
                <KeyboardAwareFlatList
                    enableOnAndroid
                    enableAutomaticScroll
                    extraScrollHeight={isIOS ? 0 : 100}
                    keyExtractor={keyExtractor}
                    data={choices}
                    renderItem={renderItem}
                    ListFooterComponent={renderFooter}
                    automaticallyAdjustContentInsets
                />
            </View>
        </ThemedModal>
    );
};

export default AlternativeFlight;
