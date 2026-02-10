import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isAndroid} from '../../helpers/device';
import MileValueScreen from '../../screens/mile-value';
import {ToolsScreen} from '../../screens/tools';
import {TransferTimesScreen} from '../../screens/transfer-times';
import {DarkColors} from '../../styles';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../theme';
import {ToolsStackParamList} from '../../types/navigation';
import {CommonScreens} from '../common';
import {BookingsStackScreen} from './bookings';
import {ProfileStackScreen} from './profile';

const ToolsStack = createNativeStackNavigator<ToolsStackParamList>();

export const ToolsStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const insets = useSafeAreaInsets();

    const getScreenOptions = useCallback(
        (options = {}) => {
            const mainColorDark = ThemeColors.dark.gold;
            const mainColorLight = ThemeColors.light.gold;
            const screenOptions = getDefaultNavigationOptions(theme, mainColorLight);

            return {
                ...screenOptions,
                ...options,
                mainColorDark,
                mainColorLight,
            };
        },
        [theme],
    );

    const toolsScreenOptions = useMemo(
        () =>
            getScreenOptions({
                header: () =>
                    isAndroid ? <View style={{backgroundColor: isDark ? DarkColors.bgLight : ThemeColors.light.gold, height: insets.top}} /> : null,
            }),
        [getScreenOptions, insets.top, isDark],
    );

    return (
        <ToolsStack.Navigator screenOptions={getScreenOptions} initialRouteName='Tools'>
            <ToolsStack.Screen name='Tools' component={ToolsScreen} options={toolsScreenOptions} />
            <ToolsStack.Screen
                name='Profile'
                component={ProfileStackScreen}
                options={{
                    headerShown: false,
                }}
            />
            <ToolsStack.Screen name='MileValue' component={MileValueScreen} options={MileValueScreen.navigationOptions} />
            <ToolsStack.Screen
                name='TransferTimes'
                getId={() => 'TransferTimes'}
                component={TransferTimesScreen}
                options={(props) =>
                    /* @ts-ignore */
                    TransferTimesScreen.navigationOptions({...props, theme})
                }
            />
            <ToolsStack.Screen
                name='Bookings'
                component={BookingsStackScreen}
                options={({route}) => ({
                    headerShown: false,
                    // @ts-ignore
                    animation: route.params?.animation ?? 'default',
                })}
            />
            <ToolsStack.Group key='common'>
                {CommonScreens.map(({name, component, options}) => (
                    <ToolsStack.Screen key={name} name={name} component={component} options={options} />
                ))}
            </ToolsStack.Group>
        </ToolsStack.Navigator>
    );
};
