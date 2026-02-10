import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import RefreshableFlatList from '../../../components/page/refreshableFlatList';
import Spinner from '../../../components/spinner';
import {isIOS} from '../../../helpers/device';
import TimelineShareService from '../../../services/timelineShare';
import {Colors, DarkColors} from '../../../styles';
import {useTheme} from '../../../theme';
import {OutsideStackScreenFunctionalComponent} from '../../../types/navigation';
import {ITripSegment} from '../../../types/trips';
import {Timeline} from '..';

class TimelineShare extends Timeline {
    static components = {
        date: require('../../../components/trips/list/date').default,
        planStart: require('../../../components/trips/list/planStart').default,
        planEnd: require('../../../components/trips/list/planEnd').default,
        trip: require('../../../components/trips/share/list/trip').default,
    };

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getTimelineShare().then(() => {
            this.safeSetState({
                loading: false,
                items: this.getList(),
            });
        });
    }

    componentWillUnmount() {
        this.mounted = false;
        TimelineShareService.clear();
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getComponent = (type) => {
        if (['date', 'planStart', 'planEnd'].indexOf(type) > -1) {
            return TimelineShare.components[type];
        }

        return TimelineShare.components.trip;
    };

    getTimeline = () => ({
        items: TimelineShareService.getList(),
    });

    getList() {
        const {items} = this.getTimeline();

        return Array.from(items.values());
    }

    getTimelineShare() {
        const {navigation, route} = this.props;
        const sharedKey = route?.params?.sharedKey;

        return TimelineShareService.getShared(sharedKey);
    }

    showMailboxes() {
        return false;
    }

    render() {
        const {items, loading} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {loading === true && (
                    <Spinner androidColor={this.selectColor(Colors.green, DarkColors.green)} style={{top: 10, alignSelf: 'center'}} />
                )}
                {!_.isEmpty(items) && (
                    <RefreshableFlatList
                        data={items}
                        extraData={this.state}
                        renderItem={this.renderItem}
                        keyExtractor={(item: ITripSegment) => item.id}
                        initialNumToRender={15}
                        contentInsetAdjustmentBehavior='automatic'
                        contentContainerStyle={{minHeight: '100%'}}
                    />
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});

const TimelineShareScreen: OutsideStackScreenFunctionalComponent<'TimelineShare'> = ({navigation, route}) => {
    const theme = useTheme();

    // @ts-ignore
    return <TimelineShare navigation={navigation} route={route} theme={theme} />;
};

TimelineShareScreen.navigationOptions = () => ({
    title: Translator.trans('menu.button.trips', {}, 'menu'),
    // headerBackTitle: Translator.trans('menu.button.trips', {}, 'menu'),
});

export default TimelineShareScreen;
