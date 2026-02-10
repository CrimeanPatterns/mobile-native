import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Image, ScrollView, Text, View} from 'react-native';
import {Switch} from 'react-native-paper';

import {isAndroid, isIOS} from '../../../helpers/device';
import API from '../../../services/api';
import {Colors, DarkColors} from '../../../styles';
import {ThemeColors, useDark} from '../../../theme';
import HeaderButton from '../../page/header/button';
import {Modal} from '../../page/modal';
import Skeleton from '../../page/skeleton';
import SkeletonList from '../../page/skeleton/skeletonList';
import RowCard, {CreditCard, RowCardSkeleton} from './rowCard';
import styles from './styles';

type ResponseData = {
    description: string;
    cards: CreditCard[];
    autoDetectCards: {
        enabled: boolean;
        label: string;
    };
};

type ModalSelectCardsProps = {
    onClose: () => void;
};

type IModalSelectCards = React.FunctionComponent<ModalSelectCardsProps>;

const ModalSelectCards: IModalSelectCards = ({onClose}) => {
    const isDark = useDark();
    const [description, setDescription] = useState<string | null>(null);
    const [cards, setCards] = useState<CreditCard[] | null>(null);
    const [disabled, setDisabled] = useState<boolean>(true);
    const [isEnabledAutoDetected, setIsEnabledAutoDetected] = useState<boolean>(false);
    const [autoDetectedText, setAutoDetectedText] = useState<string>('');
    const getCards = useCallback(async () => {
        const response = await API.get<ResponseData>('/timeline/lounge/select-cards');

        if (_.isObject(response)) {
            const {data} = response;

            if (_.isString(data.description)) {
                setDescription(data.description);
            }

            if (_.isObject(data.autoDetectCards)) {
                setIsEnabledAutoDetected(data.autoDetectCards.enabled);
                setAutoDetectedText(data.autoDetectCards.label);
            }

            if (_.isArray(data.cards)) {
                setCards(data.cards);
            }

            setDisabled(false);
        }
    }, []);

    const submit = useCallback(async () => {
        if (_.isArray(cards)) {
            const selectedCards = _.compact(cards.map((card) => (card.selected ? card.id : null)));
            const autoDetect = isEnabledAutoDetected ? 1 : 0;

            await API.post('/timeline/lounge/select-cards', {selectedCards, autoDetect});
        }

        onClose();
    }, [cards, onClose, isEnabledAutoDetected]);

    const onPress = useCallback(
        (id) => {
            // @ts-ignore
            const changedCards = cards.map((card) => (card.id === id ? {...card, selected: !card.selected} : card));

            setCards(changedCards);
        },
        [cards],
    );

    const headerLeft = useMemo(() => <HeaderButton onPress={onClose} iconName='android-clear' />, [onClose]);

    const headerRight = useMemo(() => {
        const color = isDark ? DarkColors.blue : Colors.blueDark;
        const title = Translator.trans('form.button.save', {}, 'messages');

        return (
            <HeaderButton
                disabled={disabled}
                onPress={submit}
                title={isIOS ? title : undefined}
                iconName={isIOS ? undefined : 'android-baseline-check'}
                color={isIOS ? color : undefined}
            />
        );
    }, [isDark, disabled, submit]);

    const keyExtractor = useCallback((item) => item.id, []);

    const renderSeparator = useCallback(() => <View style={[styles.separator, isDark && styles.separatorDark]} />, [isDark]);
    const onToggleSwitch = () => setIsEnabledAutoDetected(!isEnabledAutoDetected);

    const renderHeader = useCallback(
        () => (
            <>
                <View style={styles.header}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{description}</Text>
                </View>

                <View style={[styles.autoDetectWrap, isDark && styles.autoDetectWrapDark]}>
                    <Image source={require('@assets/aw.png')} style={styles.awLogo} />
                    <Text style={[styles.autoDetectText, isDark && styles.autoDetectTextDark]}>{autoDetectedText}</Text>
                    <View style={styles.switchWrap}>
                        <Switch
                            style={{transform: [{scaleX: 0.75}, {scaleY: 0.75}]}}
                            ios_backgroundColor={isDark ? DarkColors.bgLight : Colors.white}
                            color={isDark ? DarkColors.green : Colors.green}
                            tintColor={isDark ? Colors.white : Colors.black}
                            value={isEnabledAutoDetected}
                            onValueChange={onToggleSwitch}
                        />
                    </View>
                </View>
                {renderSeparator()}
            </>
        ),
        [description, isDark, renderSeparator, isEnabledAutoDetected, autoDetectedText],
    );

    const renderItem = useCallback(
        ({item, index}) => (
            <RowCard card={item} index={index} onPress={onPress} disabled={isEnabledAutoDetected && !_.isUndefined(item.autoSelected)} />
        ),
        [onPress, isEnabledAutoDetected],
    );

    const renderFooter = useCallback(
        () => (
            <>
                {renderSeparator()}
                <View style={styles.footer} />
            </>
        ),
        [renderSeparator],
    );

    const headerColor = useMemo(() => {
        if (isAndroid) {
            return isDark ? DarkColors.bgLight : ThemeColors.light.green;
        }

        return isDark ? DarkColors.bg : Colors.grayLight;
    }, [isDark]);

    useEffect(() => {
        getCards();
    }, [getCards]);

    return (
        <Modal
            visible
            title={Translator.trans(/** @Desc("Select the Cards You Have") */ 'timeline.select-cards', {}, 'mobile-native')}
            presentationStyle={isIOS ? 'formSheet' : 'overFullScreen'}
            headerLeft={headerLeft}
            headerRight={headerRight}
            headerColor={headerColor}
            onClose={onClose}>
            {renderSeparator()}
            {_.isArray(cards) ? (
                <ScrollView showsVerticalScrollIndicator={false} style={[styles.scrollViewWrap, isDark && styles.scrollViewWrapDark]}>
                    {renderHeader()}
                    <FlatList
                        scrollEnabled={false}
                        data={cards}
                        renderItem={renderItem}
                        ListFooterComponent={renderFooter}
                        ItemSeparatorComponent={renderSeparator}
                        keyExtractor={keyExtractor}
                        style={[styles.list, isDark && styles.listDark]}
                    />
                </ScrollView>
            ) : (
                <ModalSelectCardsSkeleton />
            )}
        </Modal>
    );
};

export default ModalSelectCards;

const ModalSelectCardsSkeleton: React.FC = () => {
    const isDark = useDark();

    const renderSeparator = useCallback(() => <View style={[styles.separator, isDark && styles.separatorDark]} />, [isDark]);

    const renderHeader = useCallback(
        () => (
            <View style={[isAndroid && styles.headerAndroid, isAndroid && isDark && styles.headerAndroidDark]}>
                <View style={styles.header}>
                    <Skeleton layout={[{key: 'image', width: '100%', height: 14}]} />
                    <Skeleton layout={[{key: 'image', width: '70%', height: 14}]} style={{marginTop: 10}} />
                </View>

                <View style={[styles.autoDetectWrap, isDark && styles.autoDetectWrapDark]}>
                    <Skeleton layout={[{key: 'image', width: 28, height: 28}]} style={{marginHorizontal: 15}} />
                    <View style={{flex: 1}}>
                        <Skeleton layout={[{key: 'image', width: '100%', height: 14}]} />
                        <Skeleton layout={[{key: 'image', width: '70%', height: 14}]} style={{marginTop: 10}} />
                    </View>
                    <Skeleton layout={[{key: 'image', width: 35, height: 26}]} style={{marginHorizontal: 15}} />
                </View>
                {renderSeparator()}
            </View>
        ),
        [isDark, renderSeparator],
    );

    const renderItem = useCallback(() => <RowCardSkeleton />, []);

    return (
        <SkeletonList
            length={10}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ItemSeparatorComponent={renderSeparator}
            style={[styles.list, isDark && styles.listDark]}
        />
    );
};
