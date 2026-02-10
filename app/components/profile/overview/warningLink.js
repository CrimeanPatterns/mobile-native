import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {Colors} from '../../../styles';
import Icon from '../../icon';
import styles from './styles';

export default class WarningLink extends PureComponent {
    static propTypes = {
        attr: PropTypes.any,
        href: PropTypes.string.isRequired,
        message: PropTypes.string.isRequired,
        navigation: PropTypes.any,
        testID: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
    }

    _onPress() {
        const {navigation, attr} = this.props;

        if (attr && attr.page) {
            navigation.navigate(attr.page);
        }
    }

    render() {
        const {testID, message} = this.props;

        return (
            <TouchableOpacity testID={testID} style={styles.warningLinkContainer} onPress={this._onPress} accessibilityLabel={message}>
                <View style={styles.warningLinkCol}>
                    <Text style={styles.warningLinkText}>{message}</Text>
                </View>
                <Icon style={styles.arrow} name='arrow' color={Colors.white} size={20} />
            </TouchableOpacity>
        );
    }
}
