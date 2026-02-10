import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';

import DateTimeDiff from '../vendor/dateTimeDiff';

const TimeAgo: React.FunctionComponent<{
    date: Date | number | string;
    fromDate?: Date | number | string | null;
    localDate?: Date | null;
    live?: boolean;
    withoutSuffix?: boolean;
    shortFormat?: boolean;
    onlyDate?: boolean;
    fromToday?: boolean;
    capitalize?: boolean;
    locale?: string;
    style?: StyleProp<TextStyle>;
}> = ({date, fromDate, localDate, live = true, withoutSuffix = false, shortFormat = false, capitalize = false, onlyDate, fromToday, style}) => {
    const [time, setTime] = useState();
    const timeoutId: {current: ReturnType<typeof setTimeout> | null} = useRef(null);
    const tick = useCallback(
        (date) => {
            const now = new Date();
            const updateDate = new Date(date);
            const from = fromDate ? new Date(fromDate) : now;
            const diff = Math.abs(Math.floor(now.getTime() - updateDate.getTime()));

            let timeAgo;

            if (diff >= 86400000 /* 1 day */ && localDate) {
                timeAgo = DateTimeDiff.shortFormatViaDates(from, localDate);
            } else {
                timeAgo = DateTimeDiff.format(from, updateDate, {addSuffix: !withoutSuffix, shortFormat, onlyDate, fromToday});
            }

            setTime(timeAgo);

            stopTimer();

            if (live) {
                timeoutId.current = setTimeout(() => tick(date), 60 * 1000);
            }
        },
        [fromDate, localDate, onlyDate, shortFormat, date, withoutSuffix],
    );
    const stopTimer = useCallback(() => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
    }, [timeoutId]);

    useEffect(() => {
        tick(date);
        return () => {
            stopTimer();
        };
    }, [date]);

    return (
        <Text accessibilityLabel={time} style={style}>
            {capitalize ? _.capitalize(time) : time}
        </Text>
    );
};

export default TimeAgo;
