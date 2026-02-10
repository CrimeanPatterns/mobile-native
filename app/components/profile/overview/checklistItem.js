import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors} from '../../../styles';
import {withTheme} from '../../../theme';
import Icon from '../../icon';
import styles from './styles';
import {TextProperty} from './textProperty';

@withTheme
class ChecklistItem extends TextProperty {
    static propTypes = {
        checked: PropTypes.bool.isRequired,
        formLink: PropTypes.string,
        formTitle: PropTypes.string,
        help: PropTypes.string,
        name: PropTypes.string.isRequired,
        navigation: PropTypes.object,
        testID: PropTypes.string,
        attrs: PropTypes.object,
        separators: PropTypes.object,
    };

    getAccessibilityStates = (checked) => {
        const states = [];

        if (checked) {
            states.push('selected');
        }

        return states;
    };

    getTouchableProps() {
        const {checked} = this.props;

        return {
            ...super.getTouchableProps(),
            accessibilityStates: this.getAccessibilityStates(checked),
        };
    }

    getDetails = () => {
        const {checked} = this.props;

        return {
            checked,
        };
    };

    getIcon = (checked) => {
        const colors = this.themeColors;
        const size = 13;
        const style = {backgroundColor: isIOS ? Colors.white : this.selectColor(Colors.white, Colors.black), width: size, height: size};

        if (checked) {
            return <Icon name='square-success' color={colors.green} size={size} style={style} />;
        }

        return <Icon name='square-error' color={colors.red} size={size} style={style} />;
    };

    _renderDetails = ({checked}) => <View style={[styles.containerDetails, styles.containerDetailsRight]}>{this.getIcon(checked)}</View>;

    render() {
        return this.renderRow({
            containerWrap: styles.containerWrapColumn,
        });
    }
}

export default ChecklistItem;
