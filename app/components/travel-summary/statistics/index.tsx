import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';

import {useProfileData} from '../../../hooks/profile';
import Translator from '../../../services/translator';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {IProfile} from '../../../types/profile';
import Indicator, {IIndicator} from './indicator';
import styles from './styles';

type StatisticsProps = {
    size?: number;
    bgColor?: string;
    travelSummary: IProfile['travelSummary'];
};

type IStatistics = React.FunctionComponent<StatisticsProps> & {
    Indicator: IIndicator;
};

const TravelSummaryStatistics: IStatistics = ({travelSummary, size, bgColor: bgColorCustom}) => {
    const isDark = useDark();
    const badges = useMemo(
        () => ({
            totalFlights: {
                title: Translator.trans('trips.total-flights', {}, 'trips'),
                color: isDark ? DarkColors.blue : Colors.blue,
            },
            longHaulFlights: {
                title: Translator.trans('trips.long-haul-flights', {}, 'trips'),
                color: isDark ? DarkColors.green : Colors.green,
            },
            shortHaulFlights: {
                title: Translator.trans('trips.short-haul-flights', {}, 'trips'),
                color: isDark ? DarkColors.orange : Colors.orange,
            },
        }),
        [isDark],
    );

    const bgColor = useMemo(() => {
        if (_.isString(bgColorCustom)) {
            return bgColorCustom;
        }

        return isDark ? DarkColors.bgLight : Colors.grayLight;
    }, [bgColorCustom, isDark]);

    const renderStatistic = useCallback(
        () =>
            // @ts-ignore
            Object.entries(travelSummary).map(([key, {value, percentage}]) => {
                const {color, title} = badges[key];

                return (
                    <Indicator
                        key={`statistic-element-${key}`}
                        color={color}
                        bgColor={bgColor}
                        titleColor={isDark ? Colors.white : Colors.grayDark}
                        title={title}
                        value={value}
                        percentage={percentage}
                        size={size}
                    />
                );
            }),
        [travelSummary, badges, isDark, bgColor, size],
    );

    if (_.isObject(travelSummary)) {
        return <View style={[styles.container]}>{renderStatistic()}</View>;
    }

    return null;
};

TravelSummaryStatistics.Indicator = (props) => <Indicator {...props} />;

const ProfileOwnerTravelSummaryStatistics: React.FunctionComponent<Omit<StatisticsProps, 'travelSummary'>> = (props) => {
    const {travelSummary} = useProfileData();

    if (_.isObject(travelSummary) && Object.keys(travelSummary).length > 0) {
        return <TravelSummaryStatistics travelSummary={travelSummary} {...props} />;
    }
    return null;
};

export {ProfileOwnerTravelSummaryStatistics};
export default TravelSummaryStatistics;
