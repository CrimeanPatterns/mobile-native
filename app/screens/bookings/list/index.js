import Translator from 'bazinga-translator';
import React from 'react';
import {Alert, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Config from 'react-native-config';

import {BaseThemedComponent} from '../../../components/baseThemed';
import Icon from '../../../components/icon';
import ActionButton from '../../../components/page/actionButton';
import Title from '../../../components/page/header/title';
import RefreshableFlatList from '../../../components/page/refreshableFlatList/index';
import TimeAgo from '../../../components/timeAgo';
import {isAndroid, isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import Booking from '../../../services/booking';
import EventEmitter from '../../../services/eventEmitter';
import Session from '../../../services/session';
import StorageSync from '../../../services/storageSync';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {ThemeColors, withTheme} from '../../../theme';
import styles from './styles';

const TouchableRow = getTouchableComponent(TouchableHighlight);

@withTheme
class Bookings extends BaseThemedComponent {
    static navigationOptions = ({route}) => ({
        title: Translator.trans('menu.button.bookings', {}, 'menu'),
        headerTitle: () => (
            <Title
                title={Translator.trans('menu.button.bookings', {}, 'menu')}
                amount={route.params?.amount ?? 0}
                amountColor={ThemeColors.light.gold}
                amountColorDark={ThemeColors.dark.gold}
            />
        ),
    });

    constructor(props) {
        super(props);

        this.openNewBookingRequest = this.openNewBookingRequest.bind(this);
        this.setRequests = this.setRequests.bind(this);

        this.state = {
            requests: Booking.getRequests(),
        };
    }

    componentDidMount() {
        this.updateAmount();
        this.listener = EventEmitter.addListener('booking:update', this.setRequests);
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    updateAmount() {
        const {navigation} = this.props;
        const amount = Booking.getAmount();

        navigation.setParams({amount});
    }

    setRequests() {
        this.updateAmount();
        this.setState({
            requests: Booking.getRequests(),
        });
    }

    _getRequestIcon = (status) => {
        const {themeColors} = this;
        const colors = {
            opened: themeColors.blue,
            booked: themeColors.blue,
            canceled: this.selectColor(Colors.gray, isIOS ? Colors.white : DarkColors.gray),
            future: themeColors.orange,
            paid: themeColors.green,
            'not-verified': themeColors.red,
        };

        return (
            <Icon
                style={[styles.icon, this.isDark && styles.iconStatus, this.isDark && status === 'canceled' && {backgroundColor: Colors.black}]}
                name={`booking-${status}`}
                size={24}
                color={colors[status]}
            />
        );
    };

    openAwardBookingAdd = () => {
        const {navigation} = this.props;

        navigation.navigate('InternalPage', {
            url: `${Config.API_URL}/awardBooking/add?fromapp=1&KeepDesktop=1`,
        });
    };

    openNewBookingRequest() {
        const buttons = [];
        const closeButton = {text: Translator.trans('button.close', {}, 'messages')};
        const openButton = {
            text: Translator.trans('menu.booking.add', {}, 'menu'),
            onPress: this.openAwardBookingAdd,
        };

        if (isIOS) {
            buttons.push(...[openButton, closeButton]);
        } else {
            buttons.push(...[closeButton, openButton]);
        }

        Alert.alert(null, Translator.trans('booking.add-request', {}, 'mobile'), buttons, {cancelable: true});
    }

    _renderItem = ({item, index}) => {
        const disabled = item.active !== true && styles.disabled;
        const {startDate} = item;
        const colors = this.themeColors;

        return (
            <TouchableRow
                testID={`booking-request-${index}`}
                accessibilityLabel={item.listTitle}
                delayPressIn={0}
                underlayColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                onPress={() => this.props.navigation.navigate('BookingDetails', {requestId: item.id})}>
                <View style={[styles.container, this.isDark && styles.containerDark, {}]} pointerEvents='box-only'>
                    <View style={[styles.col, {flex: 1}]}>
                        <View style={styles.caption}>
                            <Text style={[styles.title, this.isDark && styles.textDark, disabled]} numberOfLines={1} ellipsizeMode='tail'>
                                {item.listTitle}
                            </Text>
                        </View>
                        <View style={styles.details}>
                            <View style={[styles.row, styles.status]}>
                                {this._getRequestIcon(item.statusIcon)}
                                <View style={[styles.col, {flex: 1}]}>
                                    <Text style={[styles.text, this.isDark && styles.textDark, disabled]}>{item.status}</Text>
                                    <Text style={[styles.silverText, this.isDark && styles.textDark, disabled]}>{`#${item.id}`}</Text>
                                </View>
                            </View>
                            <View style={[styles.row, styles.flight]}>
                                <Icon
                                    style={[styles.icon, styles.iconSilver, this.isDark && styles.textDark, disabled]}
                                    name='menu-trips'
                                    size={24}
                                />
                                <View style={styles.col}>
                                    <Text style={[styles.date, this.isDark && styles.textDark, disabled]}>{startDate.fmt.d}</Text>
                                    <Text style={[styles.text, this.isDark && styles.textDark, styles.bigText, disabled]}>{startDate.fmt.m}</Text>
                                </View>
                            </View>
                            {item.newMessage === false && (
                                <View style={[styles.row, styles.action]}>
                                    <Icon
                                        style={[styles.icon, styles.iconSilver, this.isDark && styles.textDark, disabled]}
                                        name='booking-envelope-opened'
                                        size={24}
                                    />
                                    <View style={[styles.col, {flex: 1}]}>
                                        <Text style={[styles.silverText, styles.boldText, this.isDark && styles.textDark, disabled]}>
                                            {`${Translator.trans('booking.table.headers.last-update', {}, 'booking').toUpperCase()}:`}
                                        </Text>
                                        <View style={styles.row}>
                                            <Text style={[styles.text, styles.bigText, this.isDark && styles.textDark, disabled]}>
                                                {item.lastUpdateDate.fmt.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {item.newMessage === true && (
                                <View style={[styles.row, styles.action]}>
                                    <Icon style={styles.icon} name='booking-envelope' color={Colors.orange} size={24} />
                                    <View style={[styles.col, {flex: 1}]}>
                                        <Text style={[styles.silverText, styles.boldText, this.isDark && styles.textDark, {color: colors.orange}]}>
                                            {Translator.trans('new.message', {}, 'booking').toUpperCase()}
                                        </Text>
                                        <View style={styles.row}>
                                            <TimeAgo
                                                date={item.lastUpdateDate.ts * 1000}
                                                style={[styles.text, styles.bigText, styles.boldText, this.isDark && styles.textDark]}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                    <Icon name='arrow' style={styles.arrow} color='#d6d9e4' size={20} />
                </View>
            </TouchableRow>
        );
    };

    _renderFooter = () => {
        const TouchableRow = getTouchableComponent(TouchableOpacity);
        const buttonLabel = Translator.trans('menu.booking.add', {}, 'menu');

        return (
            <>
                {isAndroid && <View style={{flex: 1, height: 80}} />}
                {isIOS && (
                    <TouchableRow
                        testID='add-request'
                        accessibilityRole='button'
                        accessibilityComponentType='button'
                        accessibilityTraits='button'
                        accessibilityLabel={buttonLabel}
                        onPress={this.openNewBookingRequest}>
                        <View style={[styles.addAccount, this.isDark && styles.addAccountDark]} pointerEvents='box-only'>
                            <Icon name='plus' color={IconColors.gray} size={24} />
                            <Text style={[styles.addAccountText, this.isDark && styles.textDark]}>{buttonLabel}</Text>
                        </View>
                    </TouchableRow>
                )}
            </>
        );
    };

    _renderEmpty = () => {
        const noRequestLabel = Translator.trans('booking.no-requests', {}, 'mobile');

        return (
            <View style={[styles.noFound, this.isDark && styles.noFoundDark]} testID='no-requests' accessible accessibilityLabel={noRequestLabel}>
                <Icon name='warning' color={this.themeColors.orange} size={17} />
                <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>{noRequestLabel}</Text>
            </View>
        );
    };

    keyExtractor = ({id}) => String(id);

    render() {
        const {requests} = this.state;

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <RefreshableFlatList
                    style={styles.containerWrap}
                    data={requests}
                    extraData={this.props}
                    keyExtractor={this.keyExtractor}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._renderFooter}
                    ListEmptyComponent={this._renderEmpty}
                    initialNumToRender={10}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    contentInsetAdjustmentBehavior='automatic'
                    onRefresh={StorageSync.forceUpdate}
                    lastSyncDate={Session.getProperty('timestamp')}
                />
                {isAndroid && (
                    <ActionButton color={this.selectColor(Colors.gold, DarkColors.gold)} onPress={this.openNewBookingRequest} iconName='plus' />
                )}
            </View>
        );
    }
}

export default Bookings;
