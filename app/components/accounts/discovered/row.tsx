import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import SwipeableItem, {SwipeableItemImperativeRef} from 'react-native-swipeable-item';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {ActionRemove} from '../../page/swipeableList/actionButton';
import {SwipeableListItemOverlay} from '../../page/swipeableList/itemOverlay';

type DiscoveredAccountRowProps = {
    provider: string;
    login: string;
    email: string;
    onPress: () => void;
    onDelete: () => void;
    disabled?: boolean;
    index?: number;
    setSwipeableRef?: (ref: SwipeableItemImperativeRef, index: number) => void;
    onSwipeBegin?: (index: number) => void;
};

const DiscoveredAccountRow: React.FunctionComponent<DiscoveredAccountRowProps> = React.memo(
    ({provider, login, email, onPress, onDelete, disabled = false, index = 0, setSwipeableRef: _setSwipeableRef, onSwipeBegin}) => {
        const isDark = useDark();
        const setSwipeableRef = useRef<((ref: SwipeableItemImperativeRef, index: number) => void) | undefined>(_setSwipeableRef);
        const renderQuickActions = useCallback(
            () => (
                <View style={styles.actionButton}>
                    <ActionRemove disabled={disabled} onPress={onDelete} />
                </View>
            ),
            [disabled, onDelete],
        );

        const setSwipeableItemRef = useCallback(
            (ref: SwipeableItemImperativeRef | null) => {
                if (!ref) {
                    return;
                }

                if (setSwipeableRef.current) {
                    setSwipeableRef.current?.(ref, index);
                }
                setSwipeableRef.current = undefined;
            },
            [index],
        );
        const renderOverlay = useCallback(() => {
            if (_.isFunction(onSwipeBegin)) {
                return <SwipeableListItemOverlay index={index} onSwipeBegin={onSwipeBegin} />;
            }
            return null;
        }, [index, onSwipeBegin]);

        return (
            <View
                style={{
                    overflow: 'hidden',
                    justifyContent: 'center',
                }}>
                <SwipeableItem
                    ref={setSwipeableItemRef}
                    item={provider}
                    snapPointsLeft={[70]}
                    renderUnderlayLeft={renderQuickActions}
                    renderOverlay={renderOverlay}>
                    <RectButton
                        enabled={!disabled}
                        style={[styles.container, isDark && styles.containerDark]}
                        rippleColor={isDark ? DarkColors.border : Colors.gray}
                        underlayColor={isDark ? DarkColors.bgLight : Colors.grayLight}
                        activeOpacity={1}
                        onPress={onPress}>
                        <View style={styles.provider}>
                            <Text numberOfLines={isIOS ? 1 : 2} style={[styles.text, isDark && styles.textDark]}>
                                {provider}
                            </Text>
                            {!_.isEmpty(login) && <Text style={[styles.smallText, isDark && styles.textDark]}>{login}</Text>}
                        </View>
                        <View style={styles.email}>
                            <Text style={[styles.text, styles.message, isDark && styles.messageDark]}>
                                {Translator.trans(/** @Desc("Set Up Now") */ 'set-up-now', {}, 'mobile-native')}
                            </Text>
                            <Text style={[styles.smallText, isDark && styles.textDark]}>{email}</Text>
                        </View>
                        {isIOS && <Icon style={styles.arrow} name='arrow' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={20} />}
                    </RectButton>
                </SwipeableItem>
            </View>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: isIOS ? 52 : 70,
        backgroundColor: Colors.white,
        paddingLeft: 15,
        paddingRight: 10,
    },
    containerDark: {
        backgroundColor: DarkColors.bg,
    },
    provider: {
        flex: 1,
    },
    email: {
        alignItems: 'flex-end',
    },
    message: {
        color: Colors.blue,
        marginLeft: 5,
        fontWeight: isIOS ? 'bold' : '500',
    },
    messageDark: {
        color: DarkColors.blue,
    },
    text: {
        fontFamily: Fonts.regular,
        color: isIOS ? Colors.textGray : Colors.grayDark,
        fontSize: isIOS ? 15 : 16,
    },
    smallText: {
        fontFamily: Fonts.regular,
        color: Colors.grayDarkLight,
        fontSize: isIOS ? 11 : 13,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    arrow: {
        marginLeft: 10,
    },
    actionButton: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default DiscoveredAccountRow;
