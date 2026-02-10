import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {useDark} from '../../../../theme';
import {GroupBlock} from '../../../../types/trips/blocks';
import Skeleton from '../../../page/skeleton';
import styles from './styles';

type IGroup = React.FunctionComponent<GroupBlock>;

const Group: IGroup = ({name, desc}) => {
    const isDark = useDark();

    return (
        <>
            <View style={[styles.group, isDark && styles.groupDark]}>
                <Text style={[styles.text, styles.textMedium, styles.textBlue, isDark && styles.textBlueDark]}>{name}</Text>
            </View>
            {_.isString(desc) && (
                <View style={[styles.container, isDark && styles.containerDark]}>
                    {_.isString(desc) && (
                        <Text style={[styles.text, styles.textSmallest, styles.textGray, isDark && styles.textGrayDark]}>{desc}</Text>
                    )}
                </View>
            )}
        </>
    );
};

const GroupSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <View style={[styles.group, isDark && styles.groupDark]}>
            <Skeleton layout={[{key: 'image', width: 150, height: 24}]} />
        </View>
    );
};

export default Group;
export {Group, GroupSkeleton};
