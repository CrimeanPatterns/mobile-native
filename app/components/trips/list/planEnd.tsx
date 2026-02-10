import React from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {useDark} from '../../../theme';
import {IDate} from '../../../types/trips/blocks';
import styles from './style';

type PlanEndProps = {
    breakAfter: boolean;
    endDate: IDate;
    isActive: boolean;
    name: string;
    onLongPress: () => void;
    onPressOut: () => void;
    startDate: IDate;
};

type IPlanEnd = React.FunctionComponent<PlanEndProps> & {LAYOUT_HEIGHT: number};

const PlanEnd: IPlanEnd = ({name, startDate, isActive, onPressOut, onLongPress}) => {
    const isDark = useDark();

    return (
        <TouchableWithoutFeedback onLongPress={onLongPress} onPressOut={onPressOut} testID='planEnd' accessibilityLabel={name}>
            <View style={[styles.segmentBlue, styles.segmentEnd, {height: PlanEnd.LAYOUT_HEIGHT, maxHeight: PlanEnd.LAYOUT_HEIGHT}]}>
                <View
                    style={[styles.segmentTitle, styles.segmentTitleSmall, isDark && styles.segmentTitleDark, isActive && styles.segmentTitleActive]}>
                    <View style={[styles.segmentCircle, isDark && styles.segmentCircleDark]} />
                    <View style={[styles.segmentTitleWrap, styles.segmentTitleEndWrapText]}>
                        <Text
                            style={[styles.segmentTitleText, styles.segmentTitleTextSmall, isDark && styles.segmentTitleTextDark]}
                            numberOfLines={1}
                            ellipsizeMode='tail'>
                            {name}
                        </Text>
                    </View>
                    <View style={[styles.segmentEndTriangle, isDark && styles.segmentEndTriangleDark, isActive && styles.segmentEndTriangleActive]} />
                </View>
                <View style={styles.segmentDate}>
                    <Text style={[styles.segmentDateText, isDark && styles.segmentDateTextDark]}>{startDate.fmt.d}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

PlanEnd.LAYOUT_HEIGHT = isIOS ? 75 : 60;

export default PlanEnd;
