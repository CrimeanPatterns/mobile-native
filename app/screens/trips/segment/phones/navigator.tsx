import {createMaterialTopTabNavigator, MaterialTopTabNavigationOptions} from '@react-navigation/material-top-tabs';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '../../../../components/icon';
import TripIcons from '../../../../components/trips/icons';
import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../../styles';
import {useDark} from '../../../../theme';
import {ITripSegment, TripSegmentPhoneGroup} from '../../../../types/trips';
import {TimelineSegmentPhones} from './index';

const Tab = createMaterialTopTabNavigator();

const TimelineSegmentPhonesNavigator: React.FunctionComponent<{
    segment: ITripSegment | undefined;
}> = ({segment}) => {
    const phones = useMemo(() => {
        if (segment) {
            return segment?.menu?.phones;
        }

        return [];
    }, [segment]);
    const isDark = useDark();
    const insets = useSafeAreaInsets();
    const screenOptions = useMemo((): MaterialTopTabNavigationOptions => {
        if (isIOS) {
            return {
                tabBarActiveTintColor: isDark ? DarkColors.blue : Colors.blue,
                tabBarInactiveTintColor: isDark ? Colors.gray : Colors.grayDark,
                tabBarIndicatorStyle: {
                    position: 'absolute',
                    bottom: -1,
                    height: 1,
                    backgroundColor: isDark ? DarkColors.blue : Colors.blue,
                },
                tabBarStyle:
                    phones && phones.length === 1
                        ? {
                              height: 0,
                          }
                        : {
                              height: 75,
                              borderTopWidth: 1,
                              borderBottomWidth: 0,
                              shadowOpacity: 0, // remove bottom border
                              backgroundColor: isDark ? DarkColors.bg : Colors.grayLight, // iOS
                              borderTopColor: isDark ? DarkColors.border : Colors.gray,
                              marginBottom: insets.bottom,
                          },
                tabBarShowIcon: true,
                tabBarLabelStyle: {
                    fontFamily: Fonts.regular,
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 13,
                    textTransform: 'capitalize',
                },
            };
        }

        return {
            tabBarStyle:
                phones && phones.length === 1
                    ? {
                          height: 0,
                      }
                    : {
                          backgroundColor: isDark ? DarkColors.bgLight : Colors.green,
                      },
            tabBarIndicatorStyle: {
                backgroundColor: isDark ? DarkColors.green : Colors.white,
            },
        };
    }, [insets.bottom, isDark, phones]);

    const renderTabScreen = useCallback(
        (item: TripSegmentPhoneGroup, index: number) => (
            <Tab.Screen
                name={`phone${index}`}
                key={`phone-${item.title}`}
                // @ts-ignore
                component={() => <TimelineSegmentPhones phones={item} />}
                options={() => ({
                    tabBarLabel: item.title,
                    tabBarIcon: ({color}) => {
                        const {icon} = item;

                        return <Icon color={color} {...TripIcons[icon.split(/\s/)[0]]} />;
                    },
                })}
            />
        ),
        [],
    );

    return (
        <Tab.Navigator initialRouteName='phone0' tabBarPosition={isIOS ? 'bottom' : 'top'} screenOptions={screenOptions}>
            {_.isArray(phones) && phones.map(renderTabScreen)}
        </Tab.Navigator>
    );
};

export {TimelineSegmentPhonesNavigator};
