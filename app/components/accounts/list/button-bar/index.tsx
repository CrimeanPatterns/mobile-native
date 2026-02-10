import {TouchableBackground} from '@components/page/touchable';
import {useDimensions} from '@react-native-community/hooks';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ColorSchemeDark, useTheme} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import React, {useCallback, useMemo} from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';

import {useBottomSheetUpdateAccountsContext} from '../../../../context/updateAccounts';
import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, IconColors} from '../../../../styles';
import {AccountsStackParamList} from '../../../../types/navigation';
import Icon from '../../../icon';
import CardBar from '../../../page/cardBar';
import styles from './styles';

type ButtonBarProps = {
    stylesButton?: StyleProp<ViewStyle>;
    scrollEnabled?: boolean;
};

type ButtonBarItem = {
    testID: string;
    onPress: () => void;
    label: string;
    iconName: string;
};

const ButtonBar: React.FunctionComponent<ButtonBarProps> = ({stylesButton, scrollEnabled = true}) => {
    const navigation = useNavigation<StackNavigationProp<AccountsStackParamList>>();
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const {window} = useDimensions();
    const defaultColor = isDark ? DarkColors.bgLight : Colors.grayLight;
    const {presentBottomSheet} = useBottomSheetUpdateAccountsContext();
    const buttonData: ButtonBarItem[] = [
        {
            testID: 'accounts-list-account-update-all',
            onPress: presentBottomSheet,
            label: Translator.trans(/** @Desc("Update all Accounts") */ 'account.buttons.update-all', {}, 'mobile-native'),
            iconName: 'update-all',
        },
        {
            testID: 'accounts-list-account-add',
            onPress: () => navigation.navigate('AccountsAdd'),
            label: Translator.trans('account.buttons.add'),
            iconName: 'plus',
        },
    ];

    // 38 - 2 отступа по 15px, 1 отступ 8px
    const width = useMemo(() => (window.width - 38) / buttonData.length, [window.width, buttonData.length]);

    const renderButton = useCallback(
        ({item}) => (
            <TouchableBackground
                testID={item.testID}
                onPress={item.onPress}
                activeBackgroundColor={defaultColor}
                rippleColor={defaultColor}
                style={[styles.button, isDark && styles.buttonDark, {width}, styles.buttonWrap, stylesButton]}>
                <View style={[styles.iconBackground, isDark && styles.iconBackgroundDark]}>
                    <Icon name={item.iconName} color={IconColors.white} size={16} />
                </View>
                <Text style={[styles.label, isDark && styles.labelDark]}>{item.label}</Text>
                {isIOS ? (
                    <Icon style={styles.totalsMore} name='arrow' color={isDark ? '#757575' : Colors.grayDarkLight} size={14} />
                ) : (
                    <Icon style={[styles.totalsMore, {transform: [{rotate: '270deg'}]}]} name='small-arrow' color={Colors.grayDark} size={24} />
                )}
            </TouchableBackground>
        ),
        [defaultColor, width, stylesButton],
    );

    return <CardBar data={buttonData} renderItem={renderButton} scrollEnabled={scrollEnabled} style={styles.buttonBarWrap} />;
};

export default ButtonBar;
