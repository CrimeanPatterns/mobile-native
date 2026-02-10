import {TouchableBackground} from '@components/page/touchable';
import React from 'react';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {IProfile} from '../../../types/profile';
import TravelSummaryStatistics from '../../travel-summary/statistics';
import {TypeCardGrid} from './index';
import styles from './styles';

type TravelStatisticsProps = {
    travelSummary: IProfile['travelSummary'];
    navigateTravelSummary: (type: TypeCardGrid) => void;
};

type ITravelStatistics = React.FunctionComponent<TravelStatisticsProps>;

const TravelStatistics: ITravelStatistics = ({navigateTravelSummary, travelSummary}) => {
    const isDark = useDark();
    const color = isIOS ? Colors.grayMild : Colors.gray;

    return (
        <TouchableBackground
            rippleColor={isDark ? DarkColors.bgLight : color}
            activeBackgroundColor={isDark ? DarkColors.bgLight : color}
            onPress={navigateTravelSummary}
            style={styles.statisticWrap}>
            <TravelSummaryStatistics travelSummary={travelSummary} />
        </TouchableBackground>
    );
};

export default TravelStatistics;
