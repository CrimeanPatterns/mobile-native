import React, {useCallback, useRef, useState} from 'react';
import {Text, TouchableWithoutFeedback, useWindowDimensions, View, ViewStyle} from 'react-native';
import Popover from 'react-native-popover-view';

import {isAndroid} from '../../helpers/device';
import {useDark} from '../../theme';
import styles from './styles';

type TooltipProps = {
    title: string;
    styles?: ViewStyle | ViewStyle[];
};

const Tooltip: React.FC<TooltipProps> = ({title, styles: customStyles}) => {
    const isDark = useDark();
    const {width} = useWindowDimensions();
    const popoverRef = useRef<TouchableWithoutFeedback>(null);
    const [isVisible, setVisible] = useState<boolean>(false);

    const togglePopover = useCallback(() => {
        setVisible(!isVisible);
    }, [isVisible]);

    return (
        <View style={[styles.container, customStyles]}>
            <TouchableWithoutFeedback onPress={togglePopover} ref={popoverRef}>
                <View style={styles.button}>
                    <View style={[styles.icon, isDark && styles.iconDark]}>
                        <Text style={[styles.textIcon, isDark && styles.textDark]}>i</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <Popover
                from={popoverRef}
                isVisible={isVisible}
                onRequestClose={togglePopover}
                popoverStyle={[styles.popover, {width: width * 0.8}, isDark && styles.popoverDark]}
                backgroundStyle={styles.backgroundStyle}
                arrowSize={styles.arrowSize}
                verticalOffset={isAndroid ? -30 : -5}
                arrowShift={-0.1}>
                <Text style={[styles.text, isDark && styles.textDark]}>{title}</Text>
            </Popover>
        </View>
    );
};

export default Tooltip;
