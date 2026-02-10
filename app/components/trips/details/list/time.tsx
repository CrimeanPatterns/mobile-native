import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';

import {convertFMTtoLocalDate} from '../../../../helpers/dateTime';
import {useDark} from '../../../../theme';
import {TimeBlock, TOldTimeAgo, TTimeAgo} from '../../../../types/trips/blocks';
import TimeAgo from '../../../timeAgo';
import {TimelineDetailsIconBlock} from './row';
import styles from './styles';

const dayMillisecond = 86400000;

type ITime = React.FunctionComponent<TimeBlock>;

const Time: ITime = ({val, old}) => {
    const isDark = useDark();

    const styleTextDark = useMemo(() => isDark && styles.textDark, [isDark]);

    const translations = useMemo(
        () => ({
            date: Translator.trans('on.date', {date: val.date.fmt.d}, 'mobile'),
            dateOld: _.isObject(old) && old.date && Translator.trans('on.date', {date: old.date.fmt.d}, 'mobile'),
        }),
        [old, val.date.fmt.d],
    );

    const timeAgoProps = useMemo((): TTimeAgo => {
        const props: TTimeAgo = {
            date: new Date(val.date.ts * 1000),
        };

        if (_.isObject(val.date.fmtParts)) {
            props.localDate = convertFMTtoLocalDate(val.date.fmtParts);
        }

        return props;
    }, [val.date.fmtParts, val.date.ts]);

    const oldTimeAgoProps = useMemo((): TOldTimeAgo | undefined => {
        let props: TOldTimeAgo | undefined;

        if (_.isObject(old)) {
            props = {
                date: new Date(old.date.ts * 1000),
            };
            if (_.isObject(old.date.fmtParts)) {
                props.localDate = convertFMTtoLocalDate(old.date.fmtParts);
            }
        }

        return props;
    }, [old]);

    const diff = useMemo(() => Math.abs(timeAgoProps.date.getTime() - Date.now()), [timeAgoProps.date]);

    const isEqual = useCallback((val, old) => val !== old, []);

    const isChanged = useMemo(
        () => _.isObject(old) && (isEqual(val.date.fmt.t, old.date.fmt.t) || isEqual(val.date.fmt.p, old.date.fmt.p)),
        [isEqual, old, val.date.fmt.p, val.date.fmt.t],
    );

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <TimelineDetailsIconBlock iconName='date' changed={_.isObject(old)} />
            <View style={styles.flex1}>
                {diff < dayMillisecond && (
                    <TimeAgo capitalize style={[styles.text, styles.textBlue, styles.textLarge, isDark && styles.textBlueDark]} {...timeAgoProps} />
                )}
                <View style={styles.details}>
                    <View style={styles.row}>
                        {diff < dayMillisecond && <Text style={[styles.at, isDark && styles.atDark]}>@</Text>}
                        <View>
                            <View style={styles.dateItem}>
                                <Text
                                    style={[
                                        styles.date,
                                        isChanged && styles.accentDate,
                                        isDark && styles.blueBlockDark,
                                        isDark && isChanged && styles.accentDateDark,
                                    ]}>
                                    {val.date.fmt.t}
                                </Text>
                                {_.isString(val.date.fmt.p) && (
                                    <Text style={[styles.text, styles.textMedium, styles.textGray, isDark && styles.textGrayDark]}>
                                        {val.date.fmt.p}
                                    </Text>
                                )}
                            </View>
                            {isChanged && (
                                <View style={styles.dateItem}>
                                    <Text style={[styles.date, styles.dateOld, isDark && styles.silverBlockDark]}>{old?.date.fmt.t}</Text>
                                    {_.isString(old?.date.fmt.p) && (
                                        <Text
                                            style={[
                                                styles.text,
                                                styles.textMedium,
                                                styles.textGray,
                                                isEqual(old?.date.fmt.p, val.date.fmt.p) && styles.textOld,
                                                isDark && styles.textGrayDark,
                                            ]}>
                                            {old?.date.fmt.p}
                                        </Text>
                                    )}
                                </View>
                            )}
                            {_.isString(val.date.fmt.tz) && <Text style={[styles.textTimezone, styleTextDark]}>{val.date.fmt.tz}</Text>}
                        </View>
                    </View>
                </View>
            </View>
            <View>
                {diff >= dayMillisecond && <TimeAgo style={[styles.text, styles.textRight, styleTextDark]} {...timeAgoProps} />}
                {diff >= dayMillisecond && (
                    <Text style={[styles.text, styles.textSmall, styles.textGray, styles.textMargin, styles.textRight, styleTextDark]}>
                        {`(${translations.date})`}
                    </Text>
                )}
                {diff < dayMillisecond && <Text style={[styles.textDate, styleTextDark]}>{val.date.fmt.d}</Text>}
                {_.isObject(old) && _.isObject(old.date) && isEqual(val.date.fmt.d, old.date.fmt.d) && (
                    <>
                        {_.isObject(oldTimeAgoProps) && <TimeAgo style={[styles.textOld, styles.textRight]} {...oldTimeAgoProps} />}
                        {diff >= dayMillisecond && (
                            <Text style={[styles.text, styles.textSmall, styles.textOld, styles.textMargin, styleTextDark, styles.textRight]}>
                                {`(${translations.dateOld})`}
                            </Text>
                        )}
                        {diff < dayMillisecond && (
                            <Text style={[styles.text, styles.textSmall, styles.textOld, styles.textMargin, styleTextDark, styles.textRight]}>
                                {old.date.fmt.d}
                            </Text>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

export default Time;
