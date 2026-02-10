import {createNativeStackNavigator} from '@react-navigation/native-stack';
import fromColor from 'color';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {HeaderBackButton} from '../../components/page/header/button';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isAndroid, isIOS} from '../../helpers/device';
import {BlogPageRedirectScreen, BlogScreen, BlogSearchScreen} from '../../screens/blog';
import {BlogAuthorScreen} from '../../screens/blog/author';
import {BlogPageScreen} from '../../screens/blog/page';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import {BlogStackParamList} from '../../types/navigation';

const BlogStack = createNativeStackNavigator<BlogStackParamList>();

export const BlogStackScreen: React.FunctionComponent = () => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const insets = useSafeAreaInsets();
    const getScreenOptions = useCallback(() => {
        const mainColorDark = '#FF1200';
        const mainColorLight = '#D42C20';
        const screenOptions = getDefaultNavigationOptions(theme, mainColorLight);

        return {
            ...screenOptions,
            mainColorDark,
            mainColorLight,
        };
    }, [theme]);

    const pageScreenOptions = useCallback(
        () => ({
            headerTransparent: true,
            title: '',
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: 'transparent',
            },
            // @ts-ignore
            headerLeft: () => (
                <HeaderBackButton
                    labelVisible={false}
                    tintColor={Colors.white}
                    style={{
                        marginLeft: 10,
                        backgroundColor: fromColor('#000').alpha(0.2).rgb().string(),
                        borderRadius: 20,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        paddingLeft: isIOS ? 13 : 0,
                    }}
                />
            ),
        }),
        [],
    );

    return (
        <BlogStack.Navigator screenOptions={getScreenOptions} initialRouteName='Blog'>
            <BlogStack.Screen
                name='Blog'
                component={BlogScreen}
                options={{
                    header: () =>
                        isAndroid ? <View style={{backgroundColor: isDark ? DarkColors.bgLight : '#FF1200', height: insets.top}} /> : null,
                }}
            />
            <BlogStack.Screen name='BlogPage' component={BlogPageScreen} options={pageScreenOptions} />
            <BlogStack.Screen name='BlogPageRedirect' component={BlogPageRedirectScreen} options={pageScreenOptions} />
            <BlogStack.Screen name='BlogAuthorPage' component={BlogAuthorScreen} options={pageScreenOptions} />
            <BlogStack.Screen name='BlogSearch' component={BlogSearchScreen} options={pageScreenOptions} />
        </BlogStack.Navigator>
    );
};
