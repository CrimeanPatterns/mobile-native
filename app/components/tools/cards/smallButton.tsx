import Icon from '@components/icon';
import {TouchableBackground} from '@components/page/touchable';
import styles from '@components/tools/cards/styles';
import formColor from 'color';
import React, {useCallback} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';

type SmallButtonProps = {
    icon: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

type IButton = React.FunctionComponent<SmallButtonProps>;

const SmallButton: IButton = ({icon, onPress, style: customStyle}) => {
    const isDark = useDark();
    const iconColor = isDark ? Colors.white : Colors.grayDark;

    const renderIcon = useCallback(() => <Icon name={icon} color={formColor(iconColor).alpha(0.5).rgb().toString()} />, [icon, iconColor]);

    return (
        <>
            {isIOS ? (
                <TouchableOpacity style={[styles.buttonWrap, customStyle && customStyle]} onPress={onPress}>
                    {renderIcon()}
                </TouchableOpacity>
            ) : (
                <View style={[styles.buttonWrap, customStyle && customStyle]}>
                    <TouchableBackground
                        rippleColor={isDark ? DarkColors.bgLight : Colors.gray}
                        activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                        style={styles.padding}
                        onPress={onPress}>
                        {renderIcon()}
                    </TouchableBackground>
                </View>
            )}
        </>
    );
};

export default SmallButton;
