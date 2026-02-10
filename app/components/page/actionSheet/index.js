import fromColor from 'color';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Animated, Dimensions, Modal, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {isAndroid, isTablet} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Button from './button';
import Message from './message';

class ActionSheet extends BaseThemedPureComponent {
    state = {
        visible: false,
        animation: new Animated.Value(0),
        scrollEnabled: false,
    };

    onPress = (index) => {
        if (this.props.onPress !== undefined) {
            setTimeout(() => this.props.onPress(index), 250);
        }
    };

    cancel = () => {
        Animated.timing(this.state.animation, {
            toValue: 0,
            duration: this.props.duration,
            useNativeDriver: false,
        }).start(() => {
            this.setState(
                {
                    visible: false,
                },
                () => {
                    if (this.props.onCancel) {
                        this.props.onCancel();
                    } else {
                        this.onPress(-1);
                    }
                },
            );
        });
    };

    show = () => {
        this.setState(
            {
                visible: true,
            },
            () => {
                Animated.timing(this.state.animation, {
                    toValue: 1,
                    duration: this.props.duration,
                    useNativeDriver: false,
                }).start();
            },
        );
    };

    hide = (index) => {
        Animated.timing(this.state.animation, {
            toValue: 0,
            duration: this.props.duration,
            useNativeDriver: false,
        }).start(() => {
            this.setState(
                {
                    visible: false,
                },
                () => {
                    this.onPress(index);
                },
            );
        });
    };

    onContentSizeChange = (width, height) => {
        let scrollEnabled = false;
        const {height: screenHeight} = Dimensions.get('window');

        if (height > screenHeight / 2) {
            scrollEnabled = true;
        }

        this.setState({scrollEnabled});
    };

    renderOption = (option, index) => {
        const {options, tintColor, warnColor, destructiveButtonIndex, buttonUnderlayColor, buttonStyle} = this.props;
        const fontColor = destructiveButtonIndex === index ? warnColor : tintColor;
        const key = `button_${index}`;

        return (
            <Fragment key={key}>
                <Button
                    option={option}
                    index={index}
                    fontColor={fontColor}
                    buttonUnderlayColor={buttonUnderlayColor}
                    style={buttonStyle}
                    onPress={this.hide}
                />
                {index !== options.length - 1 && (
                    <View style={[styles.separatorContainer, this.isDark && styles.separatorContainerDark]}>
                        <View style={[styles.separator, this.isDark && styles.separatorDark]} />
                    </View>
                )}
                {isAndroid && index === options.length - 1 && (
                    <View style={[styles.separatorContainer, this.isDark && styles.separatorContainerDark]}>
                        <View style={[styles.separator, this.isDark && styles.separatorDark]} />
                    </View>
                )}
            </Fragment>
        );
    };

    renderOptions() {
        const {options} = this.props;

        return options.map(this.renderOption);
    }

    render() {
        const {title, message, overlayColor, cancelButton, tintColor, buttonUnderlayColor} = this.props;
        const {scrollEnabled, animation, visible} = this.state;
        const {height: screenHeight} = Dimensions.get('window');

        return (
            <Modal onRequestClose={this.cancel} visible={visible} animationType='none' transparent>
                <SafeAreaProvider>
                    <TouchableWithoutFeedback onPress={this.cancel}>
                        <Animated.View
                            style={{
                                flex: 1,
                                backgroundColor: animation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['transparent', overlayColor],
                                }),
                            }}>
                            <Animated.View
                                style={[
                                    styles.container,
                                    {
                                        bottom: animation.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-screenHeight, 0],
                                        }),
                                    },
                                    isTablet && styles.containerTablet,
                                ]}>
                                <SafeAreaView edges={['bottom']}>
                                    <View style={[styles.content, isTablet && styles.contentTablet, this.isDark && styles.contentDark]}>
                                        {title && (
                                            <Message
                                                text={title}
                                                titleStyle={[styles.titleText, this.isDark && styles.textGray]}
                                                style={[styles.message, this.isDark && styles.messageDark]}
                                            />
                                        )}
                                        {message && (
                                            <Message
                                                text={message}
                                                titleStyle={[styles.messageText, this.isDark && styles.textGray]}
                                                style={[styles.message, this.isDark && styles.messageDark]}
                                            />
                                        )}
                                        <ScrollView
                                            scrollEnabled={scrollEnabled}
                                            style={[{maxHeight: screenHeight / 2}]}
                                            onContentSizeChange={this.onContentSizeChange}
                                            contentInsetAdjustmentBehavior={'never'}
                                            automaticallyAdjustContentInsets={false}>
                                            {this.renderOptions()}
                                        </ScrollView>
                                    </View>
                                    <Button
                                        fontColor={tintColor}
                                        buttonUnderlayColor={buttonUnderlayColor}
                                        option={cancelButton}
                                        style={{
                                            container: [styles.cancelButton, isTablet && styles.cancelButtonTablet],
                                            button: [
                                                styles.cancelButtonView,
                                                this.isDark && styles.cancelButtonViewDark,
                                                isTablet && styles.cancelButtonViewTablet,
                                            ],
                                            text: styles.cancelButtonText,
                                        }}
                                        onPress={this.cancel}
                                    />
                                </SafeAreaView>
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </SafeAreaProvider>
            </Modal>
        );
    }
}

ActionSheet.propTypes = {
    message: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    options: PropTypes.array.isRequired,
    duration: PropTypes.number,
    overlayColor: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    cancelButton: PropTypes.string,
    buttonStyle: PropTypes.any,
    style: PropTypes.any,
    destructiveButtonIndex: PropTypes.number,
    tintColor: PropTypes.string,
    warnColor: PropTypes.string,
    buttonUnderlayColor: PropTypes.string,
};

ActionSheet.defaultProps = {
    duration: 330,
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    cancelButton: 'Cancel',
    tintColor: '#007aff',
    warnColor: '#ff3b30',
    buttonUnderlayColor: '#f9f9f9',
    buttonStyle: {},
    style: {},
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        zIndex: 999,
    },
    containerTablet: {
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    content: {
        overflow: 'hidden',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        ...Platform.select({
            ios: {
                marginHorizontal: 8,
                borderRadius: 12,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    contentDark: {
        ...Platform.select({
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    contentTablet: Platform.select({
        ios: {
            marginHorizontal: 8,
            borderRadius: 0,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
        },
    }),
    cancelButton: Platform.select({
        ios: {
            marginTop: 10,
        },
        android: {
            backgroundColor: Colors.white,
        },
    }),
    cancelButtonTablet: Platform.select({
        ios: {
            marginTop: 0,
        },
    }),
    cancelButtonView: {
        padding: 18,
        ...Platform.select({
            ios: {
                borderRadius: 12,
                marginHorizontal: 8,
                marginBottom: (!DeviceInfo.hasNotch() && 5) || 0,
            },
        }),
    },
    cancelButtonViewDark: {
        backgroundColor: DarkColors.bgLight,
    },
    cancelButtonViewTablet: Platform.select({
        ios: {
            borderRadius: 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        },
    }),
    cancelButtonText: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    message: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(165, 165, 165, 0.2)',
    },
    messageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
                borderBottomColor: fromColor(DarkColors.border).alpha(0.2).rgb().string(),
            },
            android: {
                backgroundColor: DarkColors.bgLight,
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        color: '#8f8f8f',
        fontFamily: Fonts.regular,
    },
    messageText: {
        color: '#8f8f8f',
        fontSize: 13,
        textAlign: 'center',
    },
    textGray: {
        color: DarkColors.grayLight,
    },
    separatorContainer: {
        backgroundColor: Colors.white,
    },
    separatorContainerDark: {
        backgroundColor: DarkColors.border,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(165, 165, 165, 0.2)',
    },
    separatorDark: {
        ...Platform.select({
            ios: {
                backgroundColor: fromColor(DarkColors.border).alpha(0.2).rgb().string(),
            },
            android: {
                backgroundColor: DarkColors.border,
            },
        }),
    },
});

const ThemedActionSheet = withTheme(ActionSheet);

export default React.forwardRef((props, forwardedRef) => React.createElement(ThemedActionSheet, {forwardedRef, ...props}));
