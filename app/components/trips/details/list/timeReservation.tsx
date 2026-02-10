import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';

import {convertFMTtoLocalDate} from '../../../../helpers/dateTime';
import {useDark} from '../../../../theme';
import {IDate, TimeReservationBlock} from '../../../../types/trips/blocks';
import TimeAgo from '../../../timeAgo';
import {TimelineDetailsIconBlock} from './row';
import styles from './styles';

type ITimeReservation = React.FunctionComponent<TimeReservationBlock>;

const getPrefix = (row: {date: IDate; nights?: number; days?: number}): RegExpMatchArray | null => {
    let text: RegExpMatchArray | null;
    const regex = /[^0-9\s]+/g;

    if (_.isUndefined(row.nights) === false || _.isUndefined(row.days) === false) {
        text = Translator.trans('check-in', {
            date: 1,
            nights: 1,
        }).match(regex);
    } else {
        text = Translator.trans('check-in.short', {
            date: 1,
        }).match(regex);
    }

    return text;
};

const TimeReservation: ITimeReservation = ({val}) => {
    const isDark = useDark();
    const prefix = useMemo((): RegExpMatchArray | null => getPrefix(val), [val]);

    /** Translations for dumper */
    // @ts-ignore
    const translation = [Translator.transChoice('nights', 0, null, 'messages'), Translator.transChoice('days', 0, null, 'messages')];
    /* @end */

    const renderBlock = useCallback(
        (transKey: 'days' | 'nights', num: number) => (
            <View>
                <View style={styles.onDateRight}>
                    <Text style={[styles.text, isDark && styles.textDark]}>{prefix ? prefix[1] : ''}</Text>
                    <Text style={[styles.blueBlock, isDark && styles.blueBlockDark]}>{`${num}`}</Text>
                    <Text style={[styles.text, styles.marginLeft, isDark && styles.textDark]}>{Translator.transChoice(transKey, num)}</Text>
                </View>
            </View>
        ),
        [isDark, prefix],
    );

    const renderRightColumn = useCallback(() => {
        if (_.isFinite(val.nights)) {
            return renderBlock('nights', val.nights as number);
        }

        if (_.isFinite(val.days)) {
            return renderBlock('days', val.days as number);
        }

        return null;
    }, [renderBlock, val]);

    const styleTextDark = useMemo(() => isDark && styles.textDark, [isDark]);
    const timeAgoProps = useMemo(() => {
        let localDate = null;

        if (_.isObject(val.date.fmtParts)) {
            localDate = convertFMTtoLocalDate(val.date.fmtParts);
        }
        return {
            date: new Date(val.date.ts * 1000),
            localDate,
        };
    }, [val.date.fmtParts, val.date.ts]);

    if (_.isObject(val.date.fmtParts)) {
        timeAgoProps.localDate = convertFMTtoLocalDate(val.date.fmtParts);
    }

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <TimelineDetailsIconBlock iconName='date' />
            <View style={styles.flex1}>
                <TimeAgo capitalize style={[styles.text, styles.textLarge, styles.textBlue, isDark && styles.textBlueDark]} {...timeAgoProps} />
                <View style={styles.on}>
                    <Text style={[styles.text, styleTextDark]}>{prefix ? prefix[0] : ''}</Text>
                    <Text style={[styles.blueBlock, isDark && styles.blueBlockDark]}>{val.date.fmt.d}</Text>
                </View>
                <View style={[styles.onDate]}>
                    <View style={styles.onDateLeft}>
                        <View style={[styles.row]}>
                            <Text style={[styles.atSmall, isDark && styles.atDark]}>@</Text>
                            <View>
                                <View style={[styles.row]}>
                                    <Text style={[styles.text, {fontSize: 17}, styleTextDark]}>{val.date.fmt.t}</Text>
                                    {_.isString(val.date.fmt.p) && (
                                        <Text style={[styles.text, styles.textGray, {fontSize: 17, marginLeft: 3}, isDark && styles.textGrayDark]}>
                                            {val.date.fmt.p}
                                        </Text>
                                    )}
                                </View>
                                {_.isString(val.date.fmt.tz) && <Text style={[styles.textTimezone, styleTextDark]}>{val.date.fmt.tz}</Text>}
                            </View>
                        </View>
                    </View>
                    {renderRightColumn()}
                </View>
            </View>
        </View>
    );
};

export default TimeReservation;
