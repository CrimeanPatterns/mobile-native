import React from 'react';
import {TextStyle, View} from 'react-native';

import {isIOS} from '../../../../helpers/device';
import {Colors, DarkColors} from '../../../../styles';
import Icon from '../../../icon';
import styles from './styles';

type ITimelineDetailsIconWarning = React.FunctionComponent<{
    style?: TextStyle;
}>;

const TimelineDetailsIconChanged: ITimelineDetailsIconWarning = ({style: customStyle}) => (
    <Icon name='warning' style={[styles.timelineDetailsIconChanges, customStyle]} color={Colors.orange} colorDark={DarkColors.orange} size={13} />
);

type ITimelineDetailsIcon = React.FunctionComponent<{
    name: string;
}>;

const TimelineDetailsIcon: ITimelineDetailsIcon = ({name}) => (
    <Icon name={name} color={isIOS ? '#d6dae6' : Colors.grayDarkLight} colorDark={isIOS ? Colors.white : DarkColors.text} size={24} />
);

type ITimelineDetailsIconBlock = React.FunctionComponent<{
    changed?: boolean;
    iconName: string;
}>;

const TimelineDetailsIconBlock: ITimelineDetailsIconBlock = ({changed = false, iconName}) => (
    <View style={styles.iconItem}>
        <TimelineDetailsIcon name={iconName} />
        {changed && <TimelineDetailsIconChanged style={styles.iconWarning} />}
    </View>
);

export {TimelineDetailsIconChanged, TimelineDetailsIcon, TimelineDetailsIconBlock};
