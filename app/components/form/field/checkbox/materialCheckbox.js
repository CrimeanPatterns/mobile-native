import color from 'color';
import PropTypes from 'prop-types';
import * as React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {TouchableRipple, withTheme} from 'react-native-paper';

import Icon from '../../../icon';

class Checkbox extends React.Component {
    static propTypes = {
        ...TouchableRipple.propTypes,
        checked: PropTypes.bool,
        color: PropTypes.string,
        disabled: PropTypes.bool,
        onPress: PropTypes.func,
        theme: PropTypes.object,
        uncheckedColor: PropTypes.string,
    };

    static defaultProps = {
        checked: false,
        disabled: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            scaleAnim: new Animated.Value(1),
            checkedAnim: new Animated.Value(props.checked ? 1 : 0),
        };
    }

    componentDidUpdate(prevProps) {
        const {checked} = this.props;
        const {scaleAnim, checkedAnim} = this.state;

        if (prevProps.checked === checked) {
            return;
        }

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.85,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(checkedAnim, {
                toValue: checked ? 1 : 0,
                duration: 0,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    }

    render() {
        const {checked, disabled, onPress, theme, color: propColor, uncheckedColor: propUncheckedColor, ...rest} = this.props;
        const {scaleAnim, checkedAnim} = this.state;
        const checkedColor = propColor || theme.colors.accent;
        const uncheckedColor =
            propUncheckedColor ||
            color(theme.colors.text)
                .alpha(theme.dark ? 0.7 : 0.54)
                .rgb()
                .string();

        let rippleColor;
        const disabledColor = theme.colors.disabled;

        if (disabled) {
            rippleColor = color(theme.colors.text).alpha(0.16).rgb().string();
        } else {
            rippleColor = color(checkedColor).fade(0.32).rgb().string();
        }

        const borderWidth = scaleAnim.interpolate({
            inputRange: [0.81, 1],
            outputRange: [9, 0],
        });
        const borderColor = checkedAnim.interpolate({
            inputRange: [0, 1],
            outputRange: disabled ? [disabledColor, disabledColor] : [uncheckedColor, checkedColor],
        });
        const uncheckedAnim = checkedAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
        });

        return (
            <TouchableRipple {...rest} borderless rippleColor={rippleColor} onPress={disabled ? undefined : onPress} style={styles.container}>
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{scale: scaleAnim}],
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Animated.View key='checked' style={{position: 'absolute', opacity: checkedAnim}}>
                        <Icon name='android-check_box' color={checkedColor} size={24} style={styles.icon} />
                    </Animated.View>
                    <Animated.View key='unchecked' style={{position: 'absolute', opacity: uncheckedAnim}}>
                        <Icon name='android-check_box_outline_blank' color={uncheckedColor} size={24} style={styles.icon} />
                    </Animated.View>
                    <View key='border' style={[StyleSheet.absoluteFill, styles.fillContainer]}>
                        <Animated.View style={[styles.fill, {borderColor}, {borderWidth}]} />
                    </View>
                </Animated.View>
            </TouchableRipple>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        width: 36,
        height: 36,
    },
    icon: {
        margin: 6,
    },
    fillContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        height: 15,
        width: 14,
    },
});

export default withTheme(Checkbox);
