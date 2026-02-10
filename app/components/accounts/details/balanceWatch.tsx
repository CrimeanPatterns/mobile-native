import Translator from 'bazinga-translator';
import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import {isIOS} from '../../../helpers/device';
import {Colors, DarkColors, Fonts} from '../../../styles';
import TimerCountdown from '../../timerCountdown';
import {AccountNotice} from './notice';
import {AccountBlockItem, AccountKind} from './row';

type AccountBalanceWatch = AccountBlockItem<
    AccountKind.balanceWatch,
    {
        EndDate: string;
    }
>;

class BalanceWatchNotice extends AccountNotice<AccountBalanceWatch> {
    // eslint-disable-next-line class-methods-use-this
    get messageIcon() {
        return 'info';
    }

    // eslint-disable-next-line class-methods-use-this
    get baseColor() {
        const colors = this.themeColors;

        return isIOS ? colors.blue : Colors.blueDark;
    }

    render() {
        const {item} = this.props;
        const EndDate = item.Val?.EndDate;

        return (
            <>
                <View style={[message.container, message.hasBorder, this.isDark && message.hasBorderDark]}>
                    <View style={message.row}>
                        <View style={message.icon}>{this.renderIcon()}</View>
                        <View style={message.titleContainer}>
                            <Text style={[message.title, this.isDark && message.textDark]}>
                                {Translator.trans('account.list.balancewatch.monitored-changes', {}, 'messages')}
                            </Text>
                        </View>
                    </View>
                    <View style={[message.message, {backgroundColor: this.baseColor}]}>
                        <View style={message.messageItem}>
                            <Text style={message.text}>{`${Translator.trans('remaining-time-col', {}, 'messages')} `}</Text>
                            <TimerCountdown style={message.boldText} date={EndDate} />
                        </View>
                    </View>
                </View>
                {this.renderBottomSeparator()}
            </>
        );
    }
}

const message = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                marginTop: 10,
            },
        }),
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginLeft: Platform.select({
            ios: 12,
            android: 0,
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                fontSize: 16,
                color: DarkColors.text,
            },
        }),
    },
    title: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                color: Colors.textGray,
            },
            android: {
                fontSize: 16,
                color: Colors.grayDark,
            },
        }),
    },
    message: {
        flex: 1,
        flexDirection: 'column',
        ...Platform.select({
            ios: {
                marginTop: 10,
                paddingVertical: 8,
                paddingHorizontal: 20,
            },
            android: {
                marginTop: 8,
                paddingVertical: 10,
                paddingHorizontal: 26,
            },
        }),
    },
    messageItem: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
    },
    boldText: {
        color: Colors.white,
        fontFamily: Fonts.bold,
        fontWeight: Platform.select({
            ios: 'bold',
            android: '500',
        }),
    },
    hasBorder: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
                borderBottomColor: Colors.gray,
            },
        }),
    },
    hasBorderDark: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    text: {
        color: Colors.white,
        fontFamily: Fonts.regular,
        fontSize: Platform.select({
            ios: 15,
            android: 12,
        }),
    },
    icon: {
        ...Platform.select({
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
});

export default BalanceWatchNotice;
