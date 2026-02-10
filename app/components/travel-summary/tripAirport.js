import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';

import {isAndroid, isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import {withTheme} from '../../theme';
import Icon from '../icon';
import styles from '../trips/list/style';
import {ListView, Trip} from '../trips/list/trip';

const TouchableView = getTouchableComponent(TouchableWithoutFeedback);

@withTheme
class TripAirport extends Trip {
    static propTypes = {
        onPress: PropTypes.func,
        arrCode: PropTypes.string.isRequired,
        depCode: PropTypes.string.isRequired,
        depDate: PropTypes.object.isRequired,
        timelineId: PropTypes.string.isRequired,
        travelPlan: PropTypes.string,
    };

    get isDark() {
        const {theme} = this.props;

        return theme === 'dark';
    }

    onPress = () => {
        const {onPress, timelineId} = this.props;

        if (_.isFunction(onPress)) {
            onPress(timelineId);
        }
    };

    renderDate() {
        const {depDate} = this.props;
        const {d, m, y} = depDate;

        return (
            <View style={[styles.time, {marginLeft: 10}]}>
                <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, this.isDark && styles.textDark]} allowFontScaling={false}>
                        {d}
                    </Text>
                    <Text style={[styles.timeText, styles.smallTimeText, this.isDark && styles.textDark]} allowFontScaling={false}>
                        {m}
                    </Text>
                    <Text style={[styles.timeText, styles.smallTimeText, this.isDark && styles.textDark]} allowFontScaling={false}>
                        {y}
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        const {pressed} = this.state;
        const {arrCode, depCode, travelPlan} = this.props;

        return (
            <View style={[styles.segment, this.isDark && styles.segmentTripAirportDark, {height: Trip.LAYOUT_HEIGHT, maxHeight: Trip.LAYOUT_HEIGHT}]}>
                {this.renderDate()}
                <TouchableView delayPressIn={0} style={styles.flex1} onPressIn={this.onPressIn} onPressOut={this.onPressOut} onPress={this.onPress}>
                    <View
                        style={[
                            styles.details,
                            this.isDark && styles.detailsDark,
                            pressed && styles.detailsPressed,
                            pressed && this.isDark && styles.detailsPressedDark,
                        ]}>
                        <View style={styles.indent}>
                            <ListView kind='tripChain' dep={depCode} arr={arrCode} />
                        </View>
                        <View style={[styles.flex1, isAndroid && styles.indent]}>
                            <Text style={[styles.planName, this.isDark && styles.silverDark]}>{travelPlan}</Text>
                        </View>
                        <View style={{width: isIOS ? 33 : 10}}>
                            <Icon name='arrow' style={[styles.segmentArrow, this.isDark && styles.segmentArrowDark]} size={20} />
                        </View>
                    </View>
                </TouchableView>
            </View>
        );
    }
}

export default TripAirport;
