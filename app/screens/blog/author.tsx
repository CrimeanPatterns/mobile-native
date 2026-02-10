import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Skeleton from '../../components/page/skeleton';
import {useDark} from '../../theme';
import {BlogScreenComponent} from './index';
import {styles} from './styles';

const BlogAuthorSkeleton: React.FC = () => {
    const isDark = useDark();
    const insets = useSafeAreaInsets();

    return (
        <View style={[StyleSheet.absoluteFillObject, styles.pageContainer, isDark && styles.pageContainerDark]}>
            <View style={[styles.author, isDark && styles.authorDark, {paddingTop: insets.top + 20}]}>
                <Skeleton layout={[{key: 'avatar', width: 120, height: 120, borderRadius: 60}]} style={styles.standardMarginBottom} />
                <Skeleton layout={[{key: 'name', width: 250, height: 35}]} style={styles.standardMarginBottom} />
                <Skeleton layout={[{key: 'status', width: 150, height: 20}]} style={styles.standardMarginBottom} />
                <View style={styles.row}>
                    <Skeleton layout={[{key: 'icon1', width: 24, height: 24}]} style={styles.socialNetworkIcon} />
                    <Skeleton layout={[{key: 'icon2', width: 24, height: 24}]} style={styles.socialNetworkIcon} />
                    <Skeleton layout={[{key: 'icon3', width: 24, height: 24}]} style={styles.socialNetworkIcon} />
                    <Skeleton layout={[{key: 'icon4', width: 24, height: 24}]} style={styles.socialNetworkIcon} />
                </View>
            </View>
            <View style={styles.aboutAuthor}>
                <Skeleton layout={[{key: 'text1', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text2', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text3', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text4', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text5', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text6', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text7', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text8', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text9', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text10', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text11', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text12', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text13', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text14', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text15', width: '100%', height: 18}]} style={styles.smallMarginBottom} />
                <Skeleton layout={[{key: 'text16', width: '80%', height: 18}]} />
            </View>
            <View style={[styles.author, styles.largeMarginBottom, isDark && styles.authorDark]}>
                <Skeleton layout={[{key: 'title', width: 300, height: 27}]} />
            </View>
        </View>
    );
};

// @ts-ignore
export const BlogAuthorScreen: React.FunctionComponent = ({route, navigation}) => (
    // @ts-ignore
    <BlogScreenComponent url={route.params.url} navigation={navigation} renderLoading={() => <BlogAuthorSkeleton />} />
);
