import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

import {Colors} from '../../../styles';
import Icon from '../../icon';

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.color === nextProps.color && prevProps.onPress === nextProps.onPress && prevProps.icon === nextProps.icon;

const ActionButton = React.memo(
    ({color: backgroundColor, onPress, iconName, iconSize = 24, iconColor = Colors.white, iconColorDark = Colors.black, style}) => (
        <FAB
            animated={false}
            color={Colors.white}
            style={[
                styles.fab,
                {
                    backgroundColor,
                },
                style && style,
            ]}
            onPress={onPress}
            icon={() => <Icon name={iconName} size={iconSize} color={iconColor} colorDark={iconColorDark} />}
        />
    ),
    propsAreEqual,
);

ActionButton.displayName = 'ActionButton';

ActionButton.propTypes = {
    color: PropTypes.string,
    onPress: PropTypes.func,
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    iconColorDark: PropTypes.string,
    styl: PropTypes.object,
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default ActionButton;
