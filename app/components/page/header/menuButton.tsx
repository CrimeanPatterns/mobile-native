import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {Platform, View} from 'react-native';

import {Colors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import Icon from '../../icon';
import {HeaderLeftButton} from './button';

const defaultIconColor = Platform.select({ios: IconColors.gray, android: Colors.white});

const HeaderMenuButton = React.memo(
    ({color, onPress}) => {
        const backImage = useCallback(() => <Icon name='menu' color={color} size={24} />, [color]);

        return (
            <View testID='header-menu' accessibilityRole='button'>
                <HeaderLeftButton buttonImage={backImage} onPress={onPress} />
            </View>
        );
    },
    (prevProps, nextProps) => prevProps.color === nextProps.color && prevProps.onPress === nextProps.onPress,
);

HeaderMenuButton.displayName = 'HeaderMenuButton';

HeaderMenuButton.defaultProps = {
    color: defaultIconColor,
};

HeaderMenuButton.propTypes = {
    color: PropTypes.string,
    onPress: PropTypes.func,
};

export default HeaderMenuButton;
