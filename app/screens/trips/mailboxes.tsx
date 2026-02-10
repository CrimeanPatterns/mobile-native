import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import React from 'react';
import {GestureResponderEvent, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

import {TextField} from '../../components/form';
import {PathConfig} from '../../navigation/linking';
import CentrifugeProvider from '../../services/centrifuge';
import {navigateByPath} from '../../services/navigator';
import Storage from '../../storage';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme} from '../../theme';
import {MailboxAdd} from '../mailboxes/add';

class BaseTimelineMailboxes extends MailboxAdd {
    centrifugeSubscription;

    constructor(props) {
        super(props);

        this.onCentrifugeMessage = this.onCentrifugeMessage.bind(this);
    }

    subscribe() {
        const {UserID} = Storage.getItem('profile');
        const centrifuge = CentrifugeProvider.getConnection();

        console.log('[TIMELINE]', 'centrifuge', 'wait for messages');
        this.centrifugeSubscription = centrifuge.subscribe(`$mailboxes_${UserID}`, this.onCentrifugeMessage);
    }

    unsubscribe() {
        if (this.centrifugeSubscription) {
            this.centrifugeSubscription.unsubscribe();
        }
    }

    onCentrifugeMessage(message) {
        console.log('[TIMELINE]', 'centrifuge', message);

        this.reload();
    }

    reload() {
        const {reload} = this.props;

        if (_.isFunction(reload)) {
            reload();
        }
    }

    openMailboxAdd = (event: GestureResponderEvent) => {
        const {owners, source} = this.props;

        event.stopPropagation();
        navigateByPath(PathConfig.MailboxAdd, {showNotice: false, email: true, owners, source});
    };

    submit = this.openMailboxAdd;

    // eslint-disable-next-line class-methods-use-this
    get headerText() {
        return 'Please link your mailbox to start using the trip management part of AwardWallet';
    }

    renderHeaderText() {
        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <Text style={[styles.text, this.isDark && styles.textDark]}>{this.headerText}</Text>
            </View>
        );
    }

    renderForm() {
        const {theme} = this.props;
        const {fields} = this.state;
        const [email] = fields;

        return (
            <>
                {this.renderHeader()}
                <TouchableWithoutFeedback onPress={this.openMailboxAdd} style={{flex: 1}}>
                    <View pointerEvents='box-only'>
                        <TextField theme={theme} onChangeValue={_.noop} {...email} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.empty} />
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.white,
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: Colors.gray,
            },
            android: {
                paddingHorizontal: 16,
                backgroundColor: Colors.grayLight,
            },
        }),
    },
    containerDark: {
        borderColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: DarkColors.bg,
                borderTopWidth: 1,
            },
            android: {
                backgroundColor: DarkColors.bgLight,
            },
        }),
    },
    text: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        lineHeight: 18,
        color: Colors.grayDark,
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
    empty: {
        height: 40,
    },
});

export {BaseTimelineMailboxes};
export const TimelineMailboxes: React.FunctionComponent = ({reload, owners, source}) => {
    const navigation = useNavigation();
    const route = useRoute();
    const theme = useTheme();

    // @ts-ignore
    return <BaseTimelineMailboxes theme={theme} navigation={navigation} route={route} reload={reload} owners={owners} source={source} />;
};
