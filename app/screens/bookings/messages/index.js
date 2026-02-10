import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {FlatList, KeyboardAvoidingView as BaseKeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Message from '../../../components/booking/messages/message';
import BookingTextInput from '../../../components/booking/textInput';
import {getTabBarHeight} from '../../../helpers/tabBar';
import Booking from '../../../services/booking';
import EventEmitter from '../../../services/eventEmitter';
import {withTheme} from '../../../theme';
import BookingScreen from '../booking';
import styles from './styles';

const types = {
    userText: require('../../../components/booking/messages/userText').default,
    changeStatusRequest: require('../../../components/booking/messages/changeStatusRequest').default,
    invoice: require('../../../components/booking/messages/invoice').default,
    seatAssignments: require('../../../components/booking/messages/seatAssignments').default,
    shareAccountsRequest: require('../../../components/booking/messages/shareAccountsRequest').default,
    shareAccountsResponse: require('../../../components/booking/messages/shareAccountsResponse').default,
    updateRequest: require('../../../components/booking/messages/updateRequest').default,
    writeCheck: require('../../../components/booking/messages/writeCheck').default,
    ycb: require('../../../components/booking/messages/ycb').default,
};

const KeyboardAvoidingView = ({children, style}) => {
    const topTabBarHeight = 48; // TODO: Android height
    const bottomTabBarHeight = getTabBarHeight();
    const insets = useSafeAreaInsets();
    const safeAreaBottomPadding = Math.max(insets.bottom, 10);
    const keyboardVerticalOffset = topTabBarHeight + bottomTabBarHeight + safeAreaBottomPadding + 16;

    return (
        <BaseKeyboardAvoidingView behavior={Platform.select({ios: 'padding'})} keyboardVerticalOffset={keyboardVerticalOffset} style={style}>
            {children}
        </BaseKeyboardAvoidingView>
    );
};

@withTheme
class Index extends BookingScreen {
    static navigationOptions = () => ({
        title: Translator.trans('booking.userscomm', {}, 'booking'),
    });

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            message: '',
            loading: false,
            editContext: null,
        };

        this.addMessage = this.addMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.renderMessage = this.renderMessage.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onSubmitMessage = this.onSubmitMessage.bind(this);
        this.onPressEditMessage = this.onPressEditMessage.bind(this);
        this.closeEditMode = this.closeEditMode.bind(this);
        this.focusInput = this.focusInput.bind(this);

        this.messageInput = React.createRef();
        this.messagesRefs = {};
    }

    subscribe() {
        super.subscribe();

        this.listeners = [
            ...this.listeners,
            EventEmitter.addListener('booking:edit-message', this.onPressEditMessage),
            EventEmitter.addListener('booking:delete-message', this.deleteMessage),
        ];
    }

    focusInput() {
        if (this.messageInput) {
            this.messageInput.current.focus();
        }
    }

    async addMessage() {
        const {message} = this.state;

        try {
            this.safeSetState({loading: true});
            await Booking.addMessage(this.requestId, message);
            this.cleanForm();
            this.updateRequest();
        } catch (e) {
            this.safeSetState({loading: false});
        }
    }

    onPressEditMessage(data) {
        const {message} = data;

        this.safeSetState(
            {
                message,
                editContext: data,
            },
            this.focusInput,
        );
    }

    async updateMessage() {
        const {message, editContext} = this.state;
        const {messageId, onSubmit, onSuccess, onError} = editContext;

        try {
            this.safeSetState({loading: true});
            onSubmit();
            await Booking.editMessage(this.requestId, messageId, message);
            if (editContext === this.state.editContext) {
                onSuccess();
                this.cleanForm();
                this.updateRequest();
            }
        } catch (e) {
            if (editContext === this.state.editContext) {
                onError();
                this.safeSetState({loading: false});
            }
        }
    }

    closeEditMode() {
        if (this.isEditMode()) {
            this.state.editContext.onCancel();
            this.cleanForm();
        }
    }

    isEditMode() {
        return !_.isNull(this.state.editContext);
    }

    async deleteMessage({messageId, onError}) {
        try {
            await Booking.removeMessage(this.requestId, messageId);
            this.updateRequest();
        } catch (e) {
            onError(e);
        }
    }

    onChangeMessage(message) {
        this.safeSetState({message});
    }

    onSubmitMessage() {
        const {message} = this.state;

        if (_.isString(message) && message.length > 0) {
            if (this.isEditMode()) {
                this.updateMessage();
            } else {
                this.addMessage();
            }
        }
    }

    cleanForm() {
        this.safeSetState({
            message: '',
            loading: false,
            editContext: null,
        });
    }

    onEndReached = _.debounce(() => {
        const {request} = this.state;
        const {messages} = request;

        if (messages.length > 0 && messages[messages.length - 1].id !== 0) {
            Booking.chunked(this.requestId, messages[messages.length - 1].id).then(this.updateRequest);
        }
    }, 250);

    keyExtractor = (item) => `message_${item.id}`;

    renderMessage({item}) {
        const {navigation, theme} = this.props;
        const {id, type} = item;
        let component;

        if (_.has(types, type)) {
            component = types[type];
        } else {
            component = Message;
        }

        return React.createElement(component, {
            ref: (view) => {
                this.messagesRefs[id] = view;
            },
            ...item,
            navigation,
            theme,
        });
    }

    renderOnline() {
        const {onlineUsers} = this.state;

        if (_.isArray(onlineUsers) && onlineUsers.length > 0) {
            return (
                <View style={styles.chatUsers}>
                    <View style={styles.chatUsersItem}>
                        <View style={[styles.chatUsersOnline, this.isDark && styles.chatUsersOnlineDark]} />
                        {onlineUsers.map((name, index) => (
                            <Text key={`user_${index}`} style={[styles.chatUsersName, this.isDark && styles.chatUsersNameDark]}>
                                {name}
                            </Text>
                        ))}
                    </View>
                </View>
            );
        }

        return null;
    }

    render() {
        const {request, message, loading} = this.state;
        const {messages} = request;
        const isEditMode = this.isEditMode();

        return (
            <KeyboardAvoidingView style={[styles.page, this.isDark && styles.pageDark]}>
                <FlatList
                    data={messages}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.renderMessage}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.5}
                    inverted
                />
                <View style={[styles.footer, this.isDark && styles.footerDark]}>
                    <View style={styles.footerContainer}>
                        {this.renderOnline()}
                        <BookingTextInput
                            ref={this.messageInput}
                            message={message}
                            disabled={loading}
                            onChange={this.onChangeMessage}
                            onSubmit={this.onSubmitMessage}
                            isEditMode={isEditMode}
                            closeEditMode={this.closeEditMode}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

export default Index;
