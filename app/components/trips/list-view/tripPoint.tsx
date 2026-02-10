import _ from 'lodash';
import React from 'react';
import {Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors} from '../../../styles';
import {useDark} from '../../../theme';
import Icon from '../../icon';
// @ts-ignore
import styles from '../list/style';

const TripPoint: React.FunctionComponent<{
    arr: string;
    dep: string;
    hint: string;
}> = ({arr, dep, hint}) => {
    const isDark = useDark();

    return (
        <View style={styles.info}>
            <View style={[styles.way, {flexWrap: 'wrap', alignContent: 'center'}]}>
                <View style={{maxWidth: '45%'}}>
                    <Text style={[styles.title, isDark && styles.textDark]} numberOfLines={1}>
                        {dep}
                    </Text>
                </View>
                <Icon name='arrow' style={[styles.wayTo, isDark && {color: isIOS ? Colors.white : DarkColors.text}]} size={24} />
                <View style={{maxWidth: '45%'}}>
                    <Text style={[styles.title, isDark && styles.textDark]} numberOfLines={1}>
                        {arr}
                    </Text>
                </View>
                <View style={{width: '100%', flexDirection: 'row'}}>
                    {_.isString(hint) && (
                        <Text style={[styles.silver, isDark && styles.silverDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {hint}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

export default TripPoint;
