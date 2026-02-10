import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Animated, TouchableWithoutFeedback, View} from 'react-native';

import styles from './styles/camera';

const buttonWidth = 55;

class ShootButton extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.onPressIn = this.onPressIn.bind(this);
        this.onPressOut = this.onPressOut.bind(this);

        this.state = {
            width: new Animated.Value(buttonWidth),
            borderRadius: new Animated.Value(buttonWidth / 2),
        };
    }

    onPressIn() {
        const {width, borderRadius} = this.state;

        Animated.parallel([
            Animated.timing(width, {
                duration: 300,
                toValue: 50,
                useNativeDriver: false,
            }),
            Animated.timing(borderRadius, {
                duration: 300,
                toValue: 50 / 2,
                useNativeDriver: false,
            }),
        ]).start();
    }

    onPressOut() {
        const {width, borderRadius} = this.state;

        Animated.parallel([
            Animated.timing(width, {
                duration: 300,
                toValue: buttonWidth,
                useNativeDriver: false,
            }),
            Animated.timing(borderRadius, {
                duration: 300,
                toValue: buttonWidth / 2,
                useNativeDriver: false,
            }),
        ]).start();
    }

    render() {
        const {onPress = _.noop} = this.props;
        const {width, borderRadius} = this.state;

        return (
            <TouchableWithoutFeedback onPress={onPress} onPressIn={this.onPressIn} onPressOut={this.onPressOut}>
                <View style={styles.shootButton}>
                    <Animated.View style={[styles.shootInnerCircle, {height: width, width, borderRadius}]} />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default ShootButton;
