import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {View} from 'react-native';

import RefreshableFlatList from '../../../components/page/refreshableFlatList/index';
import Session from '../../../services/session';
import StorageSync from '../../../services/storageSync';
import {withTheme} from '../../../theme';
import BookingScreen from '../booking';
import styles from './styles';

const detailsComponents = {
    field: require('../../../components/booking/details/field').default,
    header: require('../../../components/booking/details/header').default,
    subheader: require('../../../components/booking/details/subheader').default,
    note: require('../../../components/booking/details/note').default,
    timeAgo: require('../../../components/booking/details/timeAgo').default,
    tableRow: require('../../../components/booking/details/tableRow').default,
    toggle: true,
};

@withTheme
class BookingDetails extends BookingScreen {
    static navigationOptions = () => ({
        title: Translator.trans(/** @Desc("Details") */ 'details', {}, 'mobile-native'),
    });

    keyExtractor = (item) => `${item.key}`;

    renderItem({item}) {
        const {field, key} = item;
        const {type, ...props} = field;

        if (!_.has(detailsComponents, type)) {
            return null;
        }

        return React.createElement(detailsComponents[type], {
            ...props,
            key,
        });
    }

    renderSeparator = ({leadingItem}) => {
        const {
            field: {type},
        } = leadingItem;

        return ['header', 'subheader'].includes(type) === false && <View style={[styles.separator, this.isDark && styles.separatorDark]} />;
    };

    render() {
        const {request} = this.state;
        const {details} = request;

        return (
            <RefreshableFlatList
                style={[styles.container, this.isDark && styles.containerDark]}
                data={details}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                initialNumToRender={10}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='never'
                contentInsetAdjustmentBehavior='automatic'
                onRefresh={StorageSync.forceUpdate}
                lastSyncDate={Session.getProperty('timestamp')}
                ItemSeparatorComponent={this.renderSeparator}
                windowSize={details.length}
            />
        );
    }
}

export default BookingDetails;
