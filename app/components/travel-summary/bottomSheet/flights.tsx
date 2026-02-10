import BottomSheet, {BottomSheetDraggableView} from '@gorhom/bottom-sheet';
import fromColor from 'color';
import _ from 'lodash';
import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import ViewPager from 'react-native-pager-view';

import {isIOS} from '../../../helpers/device';
import {TripSegmentDetails} from '../../../screens/trips/segment/details';
import TimelineService from '../../../services/timeline';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {ColorSchemeDark, ThemeColors, useTheme} from '../../../theme';
import {HeaderBackButton} from '../../page/header/button';
import {CardScrollView} from '../cardScrollView';
import TripAirport from '../tripAirport';
import {getScreenPercentage} from './summary';

const HeaderPanel: React.FunctionComponent<{backgroundColor?: string}> = ({backgroundColor}) => {
    const theme = useTheme();

    return (
        <View style={[styles.panelHeader, _.isString(backgroundColor) && {backgroundColor}]}>
            <View
                style={[
                    styles.panelHandle,
                    {
                        backgroundColor: fromColor(theme === ColorSchemeDark ? Colors.white : ThemeColors[theme].grayDarkLight)
                            .alpha(0.5)
                            .string(),
                    },
                ]}
            />
        </View>
    );
};

const List: React.FunctionComponent<
    React.PropsWithChildren<{
        onScroll: () => void;
        renderHeader: () => React.ReactElement;
        headerHeight?: number;
    }>
> = ({onScroll, headerHeight = 0, children, renderHeader}) => (
    <View style={[styles.flex1]} collapsable={false}>
        <View style={{height: headerHeight}}>
            <HeaderPanel />
            {renderHeader && renderHeader()}
        </View>
        <CardScrollView onScroll={onScroll}>{children}</CardScrollView>
    </View>
);

const FlightList = React.memo(({code, title, segments, openDetails, snapTo}) => {
    const theme = useTheme();
    const isDark = theme === 'dark';

    const renderHeader = useCallback(
        () => (
            <View style={styles.title}>
                <Text style={[styles.text, styles.airportCode, isDark && styles.airportCodeDark]}>{code}</Text>
                <Text style={[styles.text, styles.airportTitle, isDark && styles.airportTitleDark]}>{`(${title})`}</Text>
            </View>
        ),
        [isDark, code, title],
    );

    return (
        <List onScroll={snapTo} headerHeight={80} renderHeader={renderHeader}>
            {segments.map((segment, index) => (
                <TripAirport {...segment} key={index} onPress={openDetails} />
            ))}
        </List>
    );
});

const BottomSheetTripSegmentDetails = ({data, ...rest}) => {
    const theme = useTheme();
    const renderItem = useCallback(
        (item, index) => {
            const {kind, ...props} = item;
            const Component = TripSegmentDetails.components[kind];
            const key = `${item.kind}-${index}`;

            if (Component) {
                return <Component {...props} theme={theme} key={key} />;
            }

            return null;
        },
        [theme],
    );

    return <List {...rest}>{_.isObject(data) && _.isArray(data.blocks) && data.blocks.map((item, index) => renderItem(item, index))}</List>;
};

const FlightDetails = ({snapTo, data, returnBack}) => {
    const renderHeader = useCallback(
        () => (
            <View style={{marginLeft: 15}}>
                <HeaderBackButton onPress={returnBack} />
            </View>
        ),
        [],
    );

    return <BottomSheetTripSegmentDetails onScroll={snapTo} headerHeight={80} bottomOffset={200} renderHeader={renderHeader} data={data} />;
};

const BottomSheetFlights = forwardRef<BottomSheet>(({onClose, data}, forwardRef) => {
    const theme = useTheme();
    const isDark = theme === 'dark';
    const [currentTrip, setCurrentTrip] = useState(null);
    const [segmentData, setSegmentData] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const pagerRef = useRef<ViewPager>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const dimensions = useWindowDimensions();
    const snapPoints = [getScreenPercentage(dimensions.height, dimensions.height * 0.6), isIOS ? '80%' : '70%'];
    const setPage = (pageIndex) => pagerRef.current?.setPage(pageIndex);

    const openDetails = useCallback((timelineId) => {
        setCurrentTrip(timelineId);
    }, []);

    const returnBack = useCallback(() => {
        setCurrentTrip(null);
    }, []);

    const onPageSelected = useCallback((event) => {
        const {
            nativeEvent: {position},
        } = event;

        if (position === 0) {
            setCurrentTrip(null);
        }
        setScrollEnabled(position === 1);
    }, []);

    const getTripSegment = useCallback(() => {
        async function getTripSegment() {
            const response = await TimelineService.getTripSegment(currentTrip);

            if (_.isObject(response)) {
                const {data} = response;

                if (_.isObject(data)) {
                    setSegmentData(data);
                }
            }
        }
        if (_.isString(currentTrip)) {
            getTripSegment();
        }
    }, [currentTrip]);

    const snapToTop = useCallback(() => {
        bottomSheetRef.current?.snapToIndex(1);
    }, [bottomSheetRef]);

    const renderContent = useCallback(() => {
        if (_.isObject(data)) {
            const {title, payload} = data;
            const {code, segments} = payload;

            return (
                <View style={[styles.content, {backgroundColor: isDark ? DarkColors.bg : Colors.white}]}>
                    <ViewPager
                        ref={pagerRef}
                        initialPage={0}
                        scrollEnabled={scrollEnabled}
                        style={styles.flex1}
                        onPageSelected={onPageSelected}
                        orientation='horizontal'
                        overScrollMode={'never'}>
                        <BottomSheetDraggableView>
                            <FlightList code={code} title={title} segments={segments} openDetails={openDetails} snapTo={snapToTop} />
                        </BottomSheetDraggableView>
                        <BottomSheetDraggableView>
                            <FlightDetails returnBack={returnBack} data={segmentData} snapTo={snapToTop} />
                        </BottomSheetDraggableView>
                    </ViewPager>
                </View>
            );
        }

        return null;
    }, [data, isDark, scrollEnabled, onPageSelected, openDetails, snapToTop, returnBack, segmentData]);

    // @ts-ignore
    useImperativeHandle(forwardRef, () => bottomSheetRef.current, []);

    useEffect(() => {
        setCurrentTrip(null);
    }, [data]);

    useEffect(() => {
        if (pagerRef.current) {
            setSegmentData(null);
            setPage(currentTrip ? 1 : 0);
            getTripSegment();
        }
    }, [currentTrip, getTripSegment]);

    return (
        <BottomSheet
            handleComponent={() => null}
            backgroundComponent={() => null}
            ref={bottomSheetRef}
            index={-1}
            onClose={onClose}
            snapPoints={snapPoints}
            enableContentPanningGesture
            enablePanDownToClose>
            {renderContent()}
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    flex1: {
        flex: 1,
    },
    content: {
        height: '100%',
        zIndex: 999,
    },
    panelHeader: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    panelHandle: {
        width: '10%',
        height: 5,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
    },
    text: {
        fontSize: 20,
        fontFamily: Fonts.regular,
    },
    airportCode: {
        marginRight: 5,
        color: Colors.grayDark,
    },
    airportCodeDark: {
        color: Colors.white,
    },
    airportTitle: {
        color: Colors.grayDarkLight,
    },
    airportTitleDark: {
        color: DarkColors.gray,
    },
});

export {BottomSheetFlights, List};
