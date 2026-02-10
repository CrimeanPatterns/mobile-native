import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useDark} from '../../theme';
import Icon from '../icon';
import Skeleton from '../page/skeleton';
import SkeletonList from '../page/skeleton/skeletonList';

const layout = {
    title: [{key: 'title', width: 120, height: 21}],
    title2: [{key: 'title2', width: 80, height: 24}],
    transactions: [{key: 'transactions', width: 150, height: 16}],
    category: [{key: 'category', width: 100, height: 16}],
    points: [{key: 'points', width: 55, height: 16}],
    points2: [{key: 'points2', width: 50, height: 16}],
    points3: [{key: 'points3', width: 26, height: 26}],
};

const SpendAnalysisSkeletonList = React.memo(({length, ...props}) => {
    const isDark = useDark();

    const renderItem = useCallback(
        () => (
            <View style={[styles.container, isDark && styles.containerDark]}>
                <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                    <Skeleton layout={layout.title} />
                    <Skeleton layout={layout.title2} />
                </View>
                <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                    <Text style={[styles.text, isDark && styles.textDark]}># of transactions:</Text>
                    <Skeleton layout={layout.transactions} />
                </View>
                <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                    <Text style={[styles.text, isDark && styles.textDark]}>Category:</Text>
                    <Skeleton layout={layout.category} />
                </View>
                <View style={[styles.row, styles.border, isDark && styles.borderDark]}>
                    <Text style={[styles.text, isDark && styles.textDark]}>Points:</Text>
                    <View style={styles.points}>
                        <View style={styles.flexEnd}>
                            <Skeleton layout={layout.points} />
                            <Skeleton layout={layout.points2} style={styles.marginTop} />
                        </View>
                        <Skeleton layout={layout.points3} style={styles.marginLeft} />
                    </View>
                </View>
                <View style={[styles.row, styles.earningPotential, isDark && styles.earningPotentialDark]}>
                    <Text style={[styles.textBold, isDark && styles.textDark]}>Earning Potential:</Text>
                    <Icon name='thumbsup' size={24} color={Colors.grayDark} colorDark={isIOS ? Colors.white : DarkColors.text} />
                </View>
            </View>
        ),
        [isDark],
    );

    return <SkeletonList length={length} renderItem={renderItem} {...props} />;
});

SpendAnalysisSkeletonList.propTypes = {
    length: PropTypes.number,
};

SpendAnalysisSkeletonList.defaultProps = {
    length: 5,
};

export default SpendAnalysisSkeletonList;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingLeft: 10,
        backgroundColor: Colors.white,
    },
    containerDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
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
        fontSize: isIOS ? 11 : 12,
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
    flexEnd: {
        alignItems: 'flex-end',
    },
    marginLeft: {
        marginLeft: 8,
    },
    marginTop: {
        marginTop: 4,
    },
});
