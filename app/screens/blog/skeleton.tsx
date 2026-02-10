import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '../../components/icon';
import Skeleton from '../../components/page/skeleton';
import SkeletonList from '../../components/page/skeleton/skeletonList';
import {isIOS} from '../../helpers/device';
import {Colors, DarkColors} from '../../styles';
import {useDark} from '../../theme';
import {styles} from './styles';

const BlogPageSkeleton: React.FC = () => {
    const isDark = useDark();
    const insets = useSafeAreaInsets();
    const renderItem = useCallback(() => <BlogListPostSkeleton />, []);
    const topInset = isIOS ? insets.top : 0;

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.pageContainer, isDark && styles.pageContainerDark, {paddingTop: topInset + 20}]}>
            <BlogHeaderSkeleton />
            <SkeletonList length={3} renderItem={renderItem} />
        </View>
    );
};

export const BlogPageRedirectSkeleton: React.FC = () => {
    const insets = useSafeAreaInsets();
    const isDark = useDark();

    const renderItem = useCallback(() => <BlogListPostSkeleton />, []);

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.pageContainer, isDark && styles.pageContainerDark, {paddingTop: insets.top + 20}]}>
            <View style={{height: 225, backgroundColor: isDark ? DarkColors.bgLight : Colors.gray}} />
            <View style={{height: 50}} />
            <SkeletonList length={3} renderItem={renderItem} />
        </View>
    );
};

export const BlogHeaderSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 30,
                        marginRight: 15,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: isDark ? DarkColors.bgLight : Colors.gray,
                        backgroundColor: isDark ? DarkColors.bgLight : Colors.gray,
                    }}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 30,
                        width: 30,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: isDark ? DarkColors.bgLight : Colors.gray,
                        backgroundColor: isDark ? DarkColors.bgLight : Colors.gray,
                    }}
                />
            </View>
        </>
    );
};

export const BlogListPostSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Skeleton layout={[{key: 'title1', width: '100%', height: 20}]} style={styles.smallMarginBottom} />
                    <Skeleton layout={[{key: 'title2', width: '70%', height: 20}]} style={styles.smallMarginBottom} />
                </View>
            </View>
            <View style={styles.text}>
                <Skeleton layout={[{key: 'text1', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text2', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text3', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text4', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text5', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text6', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text7', width: '100%', height: 15}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text8', width: '80%', height: 15}]} style={styles.smallMarginBottom} />
            </View>
            <View style={[styles.image, isDark && styles.imageDark]} />
            <View style={[styles.comments, {justifyContent: 'space-between'}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Skeleton layout={[{key: 'image', width: 40, height: 40, borderRadius: 20}]} />
                    <Skeleton layout={[{key: 'comments', width: 50, height: 14}]} style={styles.smallMarginLeft} />
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Icon name='menu-contact-us-new' color={isDark ? DarkColors.bgLight : Colors.gray} size={18} />
                    <Skeleton layout={[{key: 'comments', width: 90, height: 14}]} style={styles.smallMarginLeft} />
                </View>
            </View>
        </>
    );
};

export const BlogPostSkeleton: React.FC = () => {
    const isDark = useDark();

    return (
        <>
            <View style={[styles.image, isDark && styles.imageDark]} />
            <View style={styles.horizontalIndents}>
                <Skeleton layout={[{key: 'title1', width: '95%', height: 30}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'title2', width: '85%', height: 30}]} style={styles.largeMarginBottom} />

                <View style={[styles.row, styles.largeMarginBottom]}>
                    <Skeleton layout={[{key: 'avatar', width: 50, height: 50, borderRadius: 25, marginRight: 10}]} />
                    <View style={styles.aboutPost}>
                        <Skeleton layout={[{key: 'name', width: 80, height: 20}]} />
                        <View style={styles.rowFlexEnd}>
                            <Icon name='date' color={isDark ? DarkColors.bgLight : Colors.gray} size={20} />
                            <Skeleton layout={[{key: 'date', width: 60, height: 20}]} style={styles.mediumMarginLeft} />
                            <Icon
                                name='menu-contact-us-new'
                                color={isDark ? DarkColors.bgLight : Colors.gray}
                                size={20}
                                style={styles.mediumMarginLeft}
                            />
                            <Skeleton layout={[{key: 'comments', width: 20, height: 20}]} style={styles.mediumMarginLeft} />
                        </View>
                    </View>
                </View>

                <Skeleton layout={[{key: 'text1', width: '100%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text2', width: '99%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text3', width: '100%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text4', width: '89%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text5', width: '96%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text6', width: '99%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text7', width: '75%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text8', width: '100%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text9', width: '98%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text10', width: '94%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text11', width: '98%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text12', width: '87%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text13', width: '88%', height: 18}]} style={styles.mediumMarginBottom} />
                <Skeleton layout={[{key: 'text14', width: '79%', height: 18}]} style={styles.mediumMarginBottom} />
            </View>
        </>
    );
};

export default BlogPageSkeleton;
