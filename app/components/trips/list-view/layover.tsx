import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {useDark} from '../../../theme';
import TimeAgo from '../../timeAgo';
import styles from '../list/style';

type LayoverProps = {
    title: string;
    val: string;
    lounges?: number;
    duration: {
        h: number;
        i: number;
    };
};

type ILayover = React.FunctionComponent<LayoverProps>;

const Layover: ILayover = ({title, val, duration, lounges}) => {
    const isDark = useDark();

    const renderDuration = useCallback(() => {
        if (_.isObject(duration) === false) {
            return null;
        }

        const endDate = new Date(0, 0, 0, duration.h, duration.i);
        const fromDate = new Date(0, 0, 0, 0, 0, 0);

        return (
            <>
                <TimeAgo style={[styles.titleBlue, isDark && styles.titleBlueDark]} date={endDate} fromDate={fromDate} withoutSuffix />
                <Text> </Text>
            </>
        );
    }, [duration, isDark]);

    return (
        <View style={[styles.info, isIOS ? styles.detailsRight : styles.layoverRight]}>
            <View style={styles.row}>
                <View style={styles.flex1}>
                    <Text style={[styles.title, isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                        {renderDuration()}
                        {title}
                    </Text>
                    <Text style={[styles.silver, isDark && styles.silverDark]} numberOfLines={1} ellipsizeMode='tail'>
                        {val}
                    </Text>
                </View>
                {_.isNumber(lounges) && (
                    <View style={styles.lounges}>
                        <Text style={[styles.boldBlue, isDark && styles.titleBlueDark]}>{lounges}</Text>
                        <Text style={[styles.silver, styles.smallText, isDark && styles.silverDark]}>
                            {Translator.transChoice(/** @Desc("Lounge|Lounges") */ 'timeline.lounge', lounges, {}, 'mobile-native')}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Layover;
