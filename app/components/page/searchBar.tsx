import _ from 'lodash';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle} from 'react-native';
import Animated, {interpolateColor, StretchInY, StretchOutY, useAnimatedStyle, useDerivedValue, withTiming} from 'react-native-reanimated';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import Icon, {AnimatedIcon} from '../icon';

type SearchBarProps = TextInputProps & {
    styles?: ViewStyle;
    tintColor?: string;
};

const SearchBar: React.FunctionComponent<SearchBarProps> = ({
    value,
    tintColor = Colors.gray,
    styles: customStyles,
    onChangeText,
    clearButtonMode = 'never',
    underlineColorAndroid = 'transparent',
    returnKeyType = 'search',
    autoFocus = false,
    autoCorrect = false,
    onFocus: _onFocus,
    onBlur: _onBlur,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const isDark = useDark();
    const onFocus = useCallback(
        (e) => {
            setIsFocused(true);
            if (_.isFunction(_onFocus)) {
                _onFocus(e);
            }
        },
        [_onFocus],
    );
    const onBlur = useCallback(
        (e) => {
            setIsFocused(false);
            if (_.isFunction(_onBlur)) {
                _onBlur(e);
            }
        },
        [_onBlur],
    );
    const onClearPress = useCallback(() => {
        inputRef.current?.clear();
        onChangeText?.('');
    }, [onChangeText]);
    const isActive = useMemo(() => isFocused || (_.isString(value) && value.length > 0), [isFocused, value]);
    const iconColor = useMemo(() => {
        if (isIOS) {
            return isDark ? DarkColors.border : Colors.grayDark;
        }
        return isDark ? DarkColors.border : Colors.gray;
    }, [isDark]);
    const iconColorActive = useMemo(() => {
        if (isIOS) {
            return isDark ? DarkColors.blue : Colors.grayDark;
        }
        return isDark ? DarkColors.blue : Colors.blue;
    }, [isDark]);

    const progress = useDerivedValue(() => withTiming(isActive ? 1 : 0), [isActive]);
    const iconStyle = useAnimatedStyle(() => {
        const color = interpolateColor(progress.value, [0, 1], [iconColor, iconColorActive]);

        return {
            color,
            fontSize: 24,
        };
    });

    return (
        <>
            <View style={[styles.container, isDark && styles.containerDark, customStyles]}>
                <View style={styles.inputContainer}>
                    <AnimatedIcon name='search' style={iconStyle} key={`icon-search${Date.now()}`} />
                    <TextInput
                        {...rest}
                        value={value}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        ref={inputRef}
                        onChangeText={onChangeText}
                        clearButtonMode={clearButtonMode}
                        underlineColorAndroid={underlineColorAndroid}
                        returnKeyType={returnKeyType}
                        autoFocus={autoFocus}
                        autoCorrect={autoCorrect}
                        testID='searchBar'
                        style={[styles.searchInput, isDark && styles.searchInputDark]}
                        placeholderTextColor={isDark ? DarkColors.text : Colors.gray}
                    />
                    {_.isString(value) && value.length > 0 && (
                        <TouchableOpacity onPress={onClearPress}>
                            <Icon name='clear' color={tintColor} style={{paddingTop: isIOS ? 0 : 3}} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {!isActive && (
                <>
                    <View style={[styles.separatorSpace, isDark && styles.separatorSpaceDark]} />
                    <Animated.View style={[styles.separator, isDark && styles.separatorDark]} />
                </>
            )}
            {isActive && (
                <Animated.View
                    key='separator'
                    entering={StretchInY.duration(200)}
                    exiting={StretchOutY.duration(200)}
                    style={[styles.separator, styles.separatorActive, _.isString(tintColor) && {backgroundColor: tintColor}]}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        height: 47,
        backgroundColor: Colors.white,
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    separatorSpace: {
        backgroundColor: Colors.white,
        height: 2,
    },
    separatorSpaceDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.gray,
    },
    separatorDark: {
        backgroundColor: DarkColors.border,
    },
    separatorActive: {
        height: 3,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: isIOS ? 14 : 16,
    },
    searchInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        padding: 0,
        width: '90%',
        fontSize: isIOS ? 15 : 16,
        paddingLeft: 8,
    },
    searchInputDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
});

export default SearchBar;
