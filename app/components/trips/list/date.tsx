import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {convertFMTtoLocalDate} from '../../../helpers/dateTime';
import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import {IDate} from '../../../types/trips/blocks';
import TimeAgo from '../../timeAgo';
import styles from './style';

type TimelineListDateProps = {
    startDate: IDate;
    disabled: boolean;
};

type ITimelineListDate = React.FunctionComponent<TimelineListDateProps> & {LAYOUT_HEIGHT: number};

const TimelineListDate: ITimelineListDate = ({startDate, disabled}) => {
    const isDark = useDark();

    let date = new Date(startDate.ts * 1000);

    if (_.isObject(startDate.fmtParts)) {
        date = convertFMTtoLocalDate(startDate.fmtParts);
    }

    return (
        <View
            style={[styles.date, {height: TimelineListDate.LAYOUT_HEIGHT, maxHeight: TimelineListDate.LAYOUT_HEIGHT}]}
            testID='date'
            accessible
            accessibilityLabel={startDate.fmt.d}>
            <View style={styles.dateInner}>
                <View style={styles.dateCol}>
                    <View style={[styles.dateCircle, isDark && styles.dateCircleDark]} />
                    <Text style={[styles.dateAgo, isDark && styles.textDark]}>
                        <TimeAgo date={date} capitalize onlyDate fromToday />
                    </Text>
                </View>
                <View style={styles.dateDetails}>
                    <Text
                        style={[
                            styles.dateDay,
                            {color: isDark ? DarkColors.gray : Colors.grayDarkLight},
                            isDark && {color: isIOS ? Colors.white : DarkColors.gray},
                        ]}>
                        {startDate.fmt.d}
                    </Text>
                </View>
                {disabled && <View style={[styles.overlay, isDark && styles.overlayDark]} />}
            </View>
        </View>
    );
};

TimelineListDate.LAYOUT_HEIGHT = isIOS ? 70 : 60;

export default TimelineListDate;
