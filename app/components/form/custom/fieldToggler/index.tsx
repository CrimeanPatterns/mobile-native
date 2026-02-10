import {useScrollEvent} from '@components/ui/scrollView/hooks/useScrollHandler';
import {Colors, DarkColors} from '@styles/index';
import update from 'immutability-helper';
import _ from 'lodash';
import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {FlatList, Platform, View} from 'react-native';
import {Portal} from 'react-native-paper';
import Animated, {Easing, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {isAndroid, isIOS} from '../../../../helpers/device';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../../../theme';
import {IForm} from '../../index';
import {FormFieldTogglerButton} from './button';

export const FormFieldToggler = forwardRef<
    View,
    {
        onChangeValue: (value: string) => void;
        value: string;
        form: IForm;
        [key: string]: unknown;
    }
>(({value, form}, _ref) => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const buttons = useRef<FormFieldTogglerButton[]>([]);
    const [activeIds, setActiveIds] = useState<number[]>([]);
    const {lastContentOffset} = useScrollEvent();
    const currentContentOffset = useSharedValue(0);
    const positionY = useSharedValue(0);
    const translateY = useSharedValue(-100);
    const actionBarStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withTiming(translateY.value, {
                    duration: 750,
                    easing: Easing.inOut(Easing.ease),
                }),
            },
        ],
    }));
    const setActiveId = (index: number) => {
        if (activeIds.includes(index)) {
            setActiveIds(update(activeIds, {$splice: [[activeIds.indexOf(index), 1]]}));
        } else {
            setActiveIds(update(activeIds, {$push: [index]}));
        }
    };

    useAnimatedReaction(
        () => lastContentOffset.value,
        (currentValue, previousValue) => {
            if (currentValue !== previousValue) {
                if (currentValue > positionY.value) {
                    translateY.value = 0;
                } else if (currentValue < positionY.value) {
                    translateY.value = -100;
                }
            }
            currentContentOffset.value = currentValue;
        },
    );

    const measureElement = (event) => {
        event.target.measure((_x, _y, _width, height, _pageX, pageY) => {
            if (positionY.value === 0) {
                // issue with measure element, after scan barcode, for some reason pageY is decreasing
                positionY.value = pageY + height / 2;
            }
        });
    };

    const toggleFields = (activeIds: number[], initial: boolean = false) => {
        const fields = buttons.current.map((button) => button.fields).flat();
        const toggledFields: string[] = [];
        const promises: Promise<void>[] = [];

        activeIds.forEach((id) => {
            toggledFields.push(...buttons.current[id].fields);
        });

        fields.forEach(function (fieldName) {
            const toggled = toggledFields.includes(fieldName);

            form.setMapped(fieldName, toggled);
            promises.push(form.showField(fieldName, toggled));
        });

        if (toggledFields[toggledFields.length - 1]) {
            Promise.all(promises).then(() => {
                if (!initial) {
                    form.scrollToField(toggledFields[toggledFields.length - 2], false); // exclude separator field to scroll
                }
            });
        }
    };

    useEffect(() => {
        const initial = _.isEmpty(buttons.current);
        let ids = activeIds;

        if (_.isArray(value)) {
            value.forEach((field, index) => {
                if (field.toggled) {
                    ids.push(index);
                }
            });

            buttons.current = value;
        }

        toggleFields(ids, initial);
    }, [activeIds]);

    const borderColor = Platform.select({
        ios: isDark ? DarkColors.border : Colors.graySoft,
        android: isDark ? DarkColors.bg : Colors.gray,
    });

    return (
        <>
            <Portal>
                <Animated.View
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: isDark ? DarkColors.bgLight : Colors.white,
                            borderBottomWidth: isDark ? 1 : 0,
                            borderBottomColor: isDark ? DarkColors.border : 'transparent',
                            paddingVertical: 13,
                            shadowColor: '#000',
                            shadowOffset: {width: 1, height: 1},
                            shadowOpacity: 0.1,
                            shadowRadius: 3,
                            elevation: 5,
                        },
                        actionBarStyle,
                    ]}>
                    <Animated.ScrollView
                        contentContainerStyle={{paddingHorizontal: 15}}
                        horizontal={true}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}>
                        {buttons.current.map((button, index) => (
                            <FormFieldTogglerButton
                                key={button.icon}
                                onPress={() => setActiveId(index)}
                                containerStyle={{height: 46, paddingLeft: index > 0 ? 4 : 0}}
                                icon={button.icon}
                                label={button.label}
                                labelStyle={[
                                    {
                                        paddingLeft: 8,
                                        textAlign: 'left',
                                        lineHeight: 15,
                                        color: ThemeColors[theme].blue,
                                    },
                                ]}
                                labelContainerStyle={{maxWidth: 115}}
                                style={[
                                    {
                                        borderWidth: 1.5,
                                        flexDirection: 'row',
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                    },
                                    activeIds.includes(index) && {
                                        borderWidth: 1.5,
                                        borderColor: ThemeColors[theme].blue,
                                    },
                                ]}
                            />
                        ))}
                    </Animated.ScrollView>
                </Animated.View>
            </Portal>
            <>
                <View style={{height: isIOS ? 1 : 5, backgroundColor: borderColor, marginTop: 10}} />
                <View
                    ref={_ref}
                    onLayout={measureElement}
                    style={{
                        paddingTop: 18,
                        paddingBottom: 10,
                        paddingHorizontal: 12,
                    }}>
                    <FlatList
                        data={buttons.current}
                        numColumns={3}
                        scrollEnabled={false}
                        renderItem={({item: button}) => {
                            const index = buttons.current.indexOf(button);
                            const toggled = activeIds.includes(index);

                            return (
                                <FormFieldTogglerButton
                                    key={button.icon}
                                    label={button.label}
                                    icon={button.icon}
                                    iconStyle={{paddingBottom: 6}}
                                    labelStyle={[
                                        toggled &&
                                            isAndroid && {
                                                color: ThemeColors[theme].blue,
                                            },
                                    ]}
                                    containerStyle={{
                                        flex: 1 / 3, // 3 column in row,
                                        height: 88,
                                    }}
                                    style={[
                                        toggled && {
                                            borderWidth: 2,
                                            borderColor: ThemeColors[theme].blue,
                                        },
                                        {
                                            margin: 4,
                                        },
                                    ]}
                                    onPress={() => setActiveId(index)}
                                />
                            );
                        }}
                    />
                </View>
            </>
        </>
    );
});
