import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import {TouchableOpacity} from '../touchable/opacity';

const TouchableButton = getTouchableComponent(TouchableOpacity);

class Button extends BaseThemedPureComponent {
    state = {
        pressed: false,
    };

    onPress = () => this.props.onPress(this.props.index);

    onPressIn = () => this.setState({pressed: true});

    onPressOut = () => this.setState({pressed: false});

    renderOptionComponent() {
        const {option, index, style = {}, fontColor, buttonUnderlayColor} = this.props;

        if (_.isObject(option)) {
            const {component: Component, option: caption} = option;

            if (React.isValidElement(Component)) {
                return Component;
            }

            return (
                <Component
                    option={caption}
                    style={style}
                    styles={styles}
                    fontColor={fontColor}
                    index={index}
                    buttonUnderlayColor={buttonUnderlayColor}
                />
            );
        }

        return <Text style={[styles.buttonTitle, {color: fontColor}, style.text]}>{option}</Text>;
    }

    renderOption = () => {
        const {pressed} = this.state;
        const {option, style = {}, buttonUnderlayColor} = this.props;

        return (
            <View
                style={[
                    styles.buttonContainer,
                    this.isDark && styles.buttonContainerDark,
                    _.isObject(option) === false && styles.buttonCentered,
                    style.button,
                    isIOS && pressed && {backgroundColor: buttonUnderlayColor},
                ]}>
                {this.renderOptionComponent()}
            </View>
        );
    };

    render() {
        const {index, buttonUnderlayColor, style = {}} = this.props;
        let props = {
            activeOpacity: 0.9,
        };

        if (!isIOS) {
            props = {
                underlayColor: buttonUnderlayColor,
            };
        }

        return (
            <TouchableButton key={index} onPress={this.onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut} delayPressIn={0} {...props}>
                <View style={[style.container]} pointerEvents='box-only'>
                    {this.renderOption()}
                </View>
            </TouchableButton>
        );
    }
}

Button.propTypes = {
    buttonUnderlayColor: PropTypes.string,
    fontColor: PropTypes.string,
    index: PropTypes.number,
    onPress: PropTypes.func,
    option: PropTypes.any,
    style: PropTypes.any,
};

const styles = StyleSheet.create({
    buttonContainer: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.white,
            },
        }),
        padding: 18,
    },
    buttonContainerDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    buttonTitle: {
        fontSize: Platform.select({
            ios: 20,
            android: 18,
        }),
        textAlign: 'center',
        fontFamily: Fonts.regular,
    },
    buttonCentered: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default withTheme(Button);
