import React, {useCallback, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
import Skeleton from '../../page/skeleton';
import {TouchableBackground} from '../../page/touchable/background';
import CreditCardImage, {CreditCardImageSkeleton} from '../details/creditCardImage';
import styles from './styles';

export type CreditCard = {
    id: string;
    label: string;
    icon: string;
    selected: boolean;
    autoSelected?: boolean;
};

type RowCardProps = {
    card: CreditCard;
    index: number;
    onPress: (id: string) => void;
    disabled?: boolean;
};

type IRowCard = React.FunctionComponent<RowCardProps>;

const RowCard: IRowCard = ({card, onPress: onPressRow, disabled = false}) => {
    const isDark = useDark();
    const [isImage, setIsImage] = useState<boolean>(true);
    const checkboxColor = isDark ? DarkColors.gray : Colors.grayDarkLight;
    const selected = disabled ? card.autoSelected : card.selected;

    const checkboxActiveColor = useMemo(() => {
        if (isIOS) {
            return isDark ? DarkColors.blue : Colors.blue;
        }

        return isDark ? DarkColors.green : Colors.green;
    }, [isDark]);

    const onError = useCallback(() => setIsImage(false), []);

    const onPress = useCallback(() => onPressRow(card.id), [card.id, onPressRow]);

    return (
        <View style={{backgroundColor: isDark ? DarkColors.bg : Colors.white}}>
            <TouchableBackground
                onPress={onPress}
                disabled={disabled}
                activeBackgroundColor={isDark ? DarkColors.bgLight : Colors.gray}
                rippleColor={isDark ? DarkColors.border : Colors.gray}
                style={[styles.row, isDark && styles.rewDark, disabled && {opacity: 0.6}]}>
                <View style={styles.checkbox}>
                    {isIOS ? (
                        <Icon name={selected ? 'square-success' : 'radio-button'} color={selected ? checkboxActiveColor : checkboxColor} size={18} />
                    ) : (
                        <Checkbox
                            onPress={onPress}
                            status={selected ? 'checked' : 'unchecked'}
                            color={isDark ? DarkColors.green : Colors.green}
                            uncheckedColor={isDark ? DarkColors.gray : Colors.grayDarkLight}
                        />
                    )}
                </View>
                <View style={[styles.image]}>
                    {isImage ? (
                        <CreditCardImage name={card.icon} onError={onError} />
                    ) : (
                        <View style={styles.iconCard}>
                            <Icon name='credit-card' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={40} />
                        </View>
                    )}
                </View>
                <View style={styles.label}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{card.label}</Text>
                </View>
            </TouchableBackground>
        </View>
    );
};

const RowCardSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <View style={[styles.row, isDark && styles.rewDark]}>
            <View style={styles.checkbox}>
                {isIOS ? (
                    <Icon name='radio-button' color={isDark ? DarkColors.gray : Colors.grayDarkLight} size={18} />
                ) : (
                    <Checkbox status='unchecked' uncheckedColor={isDark ? DarkColors.gray : Colors.grayDarkLight} />
                )}
            </View>
            <View style={[styles.image]}>
                <CreditCardImageSkeleton />
            </View>
            <View style={styles.label}>
                <Skeleton layout={[{key: 'image', width: '100%', height: 14}]} />
            </View>
        </View>
    );
};

export default RowCard;
export {RowCardSkeleton};
