import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {IntlProvider} from 'react-intl';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export const decorators = [
    (Story) => {
        const Stack = createNativeStackNavigator();

        return (
            <SafeAreaProvider>
                <IntlProvider locale={'en-US'}>
                    <NavigationContainer independent={true}>
                        <Stack.Navigator>
                            <Stack.Screen
                                name='MyStorybookScreen'
                                options={{
                                    title: '',
                                }}
                                component={Story}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </IntlProvider>
            </SafeAreaProvider>
        );
    },
];
