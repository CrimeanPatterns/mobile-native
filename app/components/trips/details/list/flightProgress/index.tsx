import _ from 'lodash';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../../theme';
import {FlightProgressBlock} from '../../../../../types/trips/blocks';
import DateTimeDiff from '../../../../../vendor/dateTimeDiff';
import FlightProgressBar from './progressBar';
import styles from './styles';

type IFlightProgress = React.FunctionComponent<FlightProgressBlock>;

const FlightProgress: IFlightProgress = ({arrival, depart, startDate, endDate}) => {
    const isDark = useDark();
    const [timestamp, setTimestamp] = useState(Date.now());
    const timeoutId: {current: ReturnType<typeof setTimeout> | null} = useRef(null);

    const time: {
        start: number;
        end: number;
    } = useMemo(
        () => ({
            start: new Date(startDate * 1000).getTime(),
            end: new Date(endDate * 1000).getTime(),
        }),
        [endDate, startDate],
    );

    const estimatedTime: {
        toStart: string;
        toNow: string;
        toEnd: string;
    } = useMemo(() => {
        const {start, end} = time;

        return {
            toStart: DateTimeDiff.formatDurationInHours(new Date(end), new Date(start)),
            toNow: DateTimeDiff.formatDurationInHours(new Date(start), new Date(timestamp)),
            toEnd: DateTimeDiff.formatDurationInHours(new Date(timestamp), new Date(end)),
        };
    }, [time, timestamp]);

    const updateFrequency = useMemo(() => {
        const {start, end} = time;
        const startDiff = Math.floor((start - timestamp) / 1000);
        const endDiff = Math.floor((end - timestamp) / 1000);
        const startMins = Math.floor(Math.abs(startDiff) / 60);
        const endMins = Math.floor(Math.abs(endDiff) / 60);

        return startMins === 0 || endMins === 0 ? 1 : 30;
    }, [timestamp, time]);

    const progress: number = useMemo(() => {
        const {start, end} = time;
        let progress = 0;

        if (timestamp > start) {
            progress = 1 - (end - (timestamp + updateFrequency * 1000)) / (end - start);
            if (timestamp >= end) {
                progress = 1;
            }
        }

        return progress * 100;
    }, [time, timestamp]);

    const stopTimer = useCallback(() => {
        if (!_.isNull(timeoutId.current)) {
            clearTimeout(timeoutId.current);
        }
    }, [timeoutId]);

    const runTimer = useCallback(() => {
        const now = Date.now();

        stopTimer();
        setTimestamp(now);
        if (progress !== 100) {
            timeoutId.current = setTimeout(runTimer, updateFrequency * 1000);
        }
    }, [stopTimer, updateFrequency]);

    const timeGone: string | undefined = useMemo(() => {
        const now = Date.now();
        const {start} = time;
        const {toStart, toNow} = estimatedTime;

        if ((now - start) / 1000 < 60) {
            return undefined;
        }

        if (progress === 0) {
            return undefined;
        }

        if (progress === 100) {
            return toStart;
        }

        return toNow;
    }, [estimatedTime, progress, time]);

    const timeLeft: string | undefined = useMemo(() => {
        const now = Date.now();
        const {end} = time;
        const {toStart, toEnd} = estimatedTime;

        if ((end - now) / 1000 < 60) {
            return undefined;
        }

        if (progress === 0) {
            return toStart;
        }

        if (progress === 100) {
            return undefined;
        }

        return toEnd;
    }, [estimatedTime, progress, time]);

    useEffect(() => {
        runTimer();
        return stopTimer;
    }, [runTimer, stopTimer]);

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.point, styles.pointStart]}>
                <View
                    style={[
                        styles.pointItem,
                        styles.pointItemStart,
                        isDark && styles.pointItemDark,
                        progress !== 0 && styles.pointItemActive,
                        progress !== 0 && isDark && styles.pointItemActiveDark,
                    ]}>
                    <Text style={[styles.pointText, isDark && styles.textDark]}>{depart}</Text>
                </View>
            </View>
            <View style={styles.details}>
                <FlightProgressBar progress={progress} updateFrequency={updateFrequency} timeGone={timeGone} timeLeft={timeLeft} />
            </View>
            <View style={[styles.point, styles.pointEnd]}>
                <View
                    style={[
                        styles.pointItem,
                        isDark && styles.pointItemDark,
                        progress === 100 && styles.pointItemActive,
                        progress === 100 && isDark && styles.pointItemActiveDark,
                    ]}>
                    <Text style={[styles.pointText, isDark && styles.textDark]}>{arrival}</Text>
                </View>
            </View>
        </View>
    );
};

export default FlightProgress;
