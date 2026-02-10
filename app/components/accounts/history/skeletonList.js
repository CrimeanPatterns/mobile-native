import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {useDark} from '../../../theme';
import Skeleton from '../../page/skeleton';
import SkeletonList from '../../page/skeleton/skeletonList';

const layout = {
    date: [{key: 'date', width: 28, height: 35}],
    title: [{key: 'title', width: 120, height: 21}],
    title2: [{key: 'title2', width: 80, height: 24}],
    points: [{key: 'points', width: 55, height: 20}],
    points2: [{key: 'points2', width: 26, height: 26}],
    potential: [{key: 'potential', width: 55, height: 20}],
    potential2: [{key: 'potential2', width: 26, height: 26}],
};

const HistorySkeletonList = React.memo(({length, ...props}) => {
    const isDark = useDark();

    const renderItem = useCallback(
        () => (
            <View style={styles.container}>
                <View style={styles.date}>
                    <Skeleton layout={layout.date} />
                </View>
                <View style={styles.flex1}>
                    <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                        <Skeleton layout={layout.title} />
                        <Skeleton layout={layout.title2} />
                    </View>
                    <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                        <Text style={[styles.text, isDark && styles.textDark]}>Points:</Text>
                        <View style={styles.points}>
                            <View style={styles.flexEnd}>
                                <Skeleton layout={layout.points} />
                            </View>
                            <View style={styles.marginLeft}>
                                <Skeleton layout={layout.points2} />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.row, styles.earningPotential, isDark && styles.earningPotentialDark]}>
                        <Text style={[styles.textBold, isDark && styles.textDark]}>Earning Potential:</Text>
                        <View style={styles.points}>
                            <View style={styles.flexEnd}>
                                <Skeleton layout={layout.potential} />
                            </View>
                            <View style={styles.marginLeft}>
                                <Skeleton layout={layout.potential2} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        ),
        [isDark],
    );

    return <SkeletonList length={length} renderItem={renderItem} {...props} />;
});

HistorySkeletonList.propTypes = {
    length: PropTypes.number,
};

HistorySkeletonList.defaultProps = {
    length: 10,
};

export default HistorySkeletonList;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
    },
    date: {
        paddingHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 3,
        paddingRight: 25,
    },
    text: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 11 : 12,
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    textBold: {
        fontFamily: Fonts.bold,
        fontWeight: isIOS ? 'bold' : '500',
        fontSize: isIOS ? 14 : 15,
        color: Colors.grayDark,
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
    },
    borderDark: {
        borderBottomColor: DarkColors.border,
    },
    points: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    earningPotential: {
        backgroundColor: Colors.grayLight,
        height: 40,
        paddingLeft: 8,
    },
    earningPotentialDark: {
        backgroundColor: isIOS ? DarkColors.bg : DarkColors.bgLight,
    },
    flex1: {
        flex: 1,
    },
    flexEnd: {
        alignItems: 'flex-end',
    },
    marginLeft: {
        marginLeft: 8,
    },
});
