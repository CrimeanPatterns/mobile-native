import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import ScalableText from '../../scalableText';
import styles from '../list/style';

@withTheme
class TripChain extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        arrDate: PropTypes.object,
        duration: PropTypes.string,
        arr: PropTypes.string.isRequired,
        dep: PropTypes.string.isRequired,
    };

    state = {
        minFontSize: 20,
    };

    handleLayout = ({nativeEvent}) => {
        this.setState({minFontSize: Math.min(this.state.minFontSize, Math.floor(nativeEvent.lines[0].ascender))});
    };

    render() {
        const {arr, dep, arrDate, duration} = this.props;
        const {minFontSize} = this.state;
        const placeStyle = [styles.dynamicPlace, this.isDark && styles.placeDark];

        return (
            <View style={styles.info}>
                <View style={styles.way}>
                    <View style={placeStyle}>
                        <ScalableText
                            style={[styles.placeText, this.isDark && styles.blackText, {fontSize: minFontSize}]}
                            onTextLayout={this.handleLayout}>
                            {dep}
                        </ScalableText>
                    </View>
                    <View style={styles.dynamicMiddle}>
                        <Icon name='arrow' style={[styles.wayTo, this.isDark && {color: isIOS ? Colors.white : DarkColors.text}]} size={24} />
                        {_.isString(duration) && <Text style={[styles.duration, this.isDark && styles.durationDark]}>{duration}</Text>}
                    </View>
                    <View style={placeStyle}>
                        <ScalableText
                            style={[styles.placeText, this.isDark && styles.blackText, {fontSize: minFontSize}]}
                            onTextLayout={this.handleLayout}>
                            {arr}
                        </ScalableText>
                    </View>
                    {_.isObject(arrDate) && (
                        <View style={styles.placeTime}>
                            <View style={styles.placeTimeRow}>
                                <Text style={[styles.placeTimeText, this.isDark && styles.textDark]}>{[arrDate.t, arrDate.p].join(' ')}</Text>
                            </View>
                            <Text style={[styles.timeZone, this.isDark && styles.textDark]}>{arrDate.tz}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }
}

export default TripChain;
