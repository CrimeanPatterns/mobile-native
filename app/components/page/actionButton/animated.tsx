import formColor from 'color';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import {TouchableBackground} from '../touchable/background';

type AnimatedActionButtonProps = {
    color: string;
    onPress: () => any;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    iconColorDark?: string;
};

const AnimatedActionButton: React.FunctionComponent<AnimatedActionButtonProps> = ({
    color,
    onPress,
    iconName,
    iconSize = 18,
    iconColor = Colors.white,
}) => {
    const isDark = useDark();

    return (
        <TouchableBackground
            style={[styles.fab, isDark && styles.fabDark]}
            onPress={onPress}
            activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
            rippleColor={isDark ? DarkColors.bgLight : Colors.gray}>
            <View style={[styles.entryContainer, isDark && styles.entryContainerDark]}>
                <View style={[styles.iconBackground, {backgroundColor: color}]}>
                    <Icon name={iconName} size={iconSize} color={iconColor} colorDark={iconColor} />
                </View>
            </View>
        </TouchableBackground>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'relative',
        borderRadius: 12,
        marginVertical: 5,
        padding: 2,
        backgroundColor: Colors.white,
        shadowOffset: {width: 5, height: 0},
        shadowColor: Colors.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    fabDark: {
        backgroundColor: DarkColors.grayDark,
    },
    entryContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.graySoft,
    },
    entryContainerDark: {
        borderColor: formColor(Colors.white).alpha(0.1).rgb().toString(),
    },
    iconBackground: {
        padding: 5,
        borderRadius: 100,
        backgroundColor: Colors.blue,
    },
});

export default AnimatedActionButton;
