import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Image, Text, View} from 'react-native';
import Config from 'react-native-config';
import {Polygon, Svg} from 'react-native-svg';
import {WebView} from 'react-native-webview';

import {isAndroid, isIOS} from '../../../helpers/device';
import {handleOpenUrlAnyway} from '../../../helpers/handleOpenUrl';
import Popover from '../../../helpers/popover';
import EventEmitter from '../../../services/eventEmitter';
import LocaleManager from '../../../services/localeManager';
import {Colors, DarkColors} from '../../../styles';
import {BaseThemedPureComponent} from '../../baseThemed';
import HTML from '../../html';
import Icon from '../../icon';
import {TouchableBackground, TouchableItem} from '../../page/touchable';
import TimeAgo from '../../timeAgo';
import styles, {htmlStyles, palette, tagsStyles} from './style';

let menuWidth = 250;

if (LocaleManager.get() === 'ru') {
    menuWidth = 300;
}

function prepareMessage(text) {
    return text.replace(/(<br(\s*)?\/?>)|(<\s*a[^>]*>)|(<\s*\/\s*a\s*>)/g, '');
}

export default class Message extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        date: PropTypes.shape({
            fmt: PropTypes.string.isRequired,
            ts: PropTypes.number.isRequired,
        }).isRequired,
        body: PropTypes.string,
        box: PropTypes.oneOf(['in', 'out']),
        author: PropTypes.string.isRequired,
        readed: PropTypes.bool.isRequired,
        requestUpdateDate: PropTypes.shape({
            fmt: PropTypes.string.isRequired,
            ts: PropTypes.number.isRequired,
        }).isRequired,
        canEdit: PropTypes.bool.isRequired,
        canDelete: PropTypes.bool.isRequired,
        lastUpdate: PropTypes.shape({
            fmt: PropTypes.string.isRequired,
            ts: PropTypes.number.isRequired,
        }),
        avatar: PropTypes.string,
        internalDate: PropTypes.number,
    };

    static getDerivedStateFromProps({body, canEdit, canDelete}, prevState) {
        const menus = [];
        let actionDropdown = null;

        if (canEdit && _.isString(body)) {
            menus.push({
                label: Translator.trans('edit-message', {}, 'booking'),
                icon: 'footer-edit',
                key: 'edit',
            });
        }
        if (canDelete) {
            menus.push({
                label: Translator.trans('delete-message', {}, 'booking'),
                icon: 'footer-delete',
                key: 'delete',
            });
        }

        if (!_.isEmpty(menus)) {
            actionDropdown = [
                {
                    menus,
                },
            ];
        }

        return {
            ...prevState,
            actionDropdown,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            processing: false,
            actionDropdown: null,
        };

        this.openExternalUrl = this.openExternalUrl.bind(this);
        this.openActions = this.openActions.bind(this);
        this.onMenuItemPress = this.onMenuItemPress.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.onSubmitEdit = this.onSubmitEdit.bind(this);
        this.onErrorDelete = this.onErrorDelete.bind(this);

        this.actionDropdownRef = React.createRef();

        this.menuFunctions = {
            edit: this.editMessage.bind(this),
            delete: this.deleteMessage.bind(this),
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    openExternalUrl(url) {
        const {navigation} = this.props;

        if (_.startsWith(url, Config.API_URL) && _.startsWith(url, `${Config.API_URL}/blog/`) === false) {
            return navigation.navigate('InternalPage', {url});
        }

        return handleOpenUrlAnyway({url});
    }

    editMessage() {
        const {id: messageId, body} = this.props;

        EventEmitter.emit('booking:edit-message', {
            messageId,
            message: prepareMessage(body),
            onCancel: this.cancelEdit,
            onSubmit: this.onSubmitEdit,
            onSuccess: this.cancelEdit,
            onError: this.cancelEdit,
        });
    }

    cancelEdit() {
        this.safeSetState({processing: false});
    }

    onSubmitEdit() {
        this.safeSetState({processing: true});
    }

    deleteMessage() {
        const {id: messageId} = this.props;

        this.safeSetState({processing: true});
        EventEmitter.emit('booking:delete-message', {
            messageId,
            onError: this.onErrorDelete,
        });
    }

    onErrorDelete() {
        this.safeSetState({processing: false});
    }

    isInbox() {
        const {box} = this.props;

        return box === 'in';
    }

    isAutoMessage() {
        const {id} = this.props;

        return id === 0;
    }

    isVisibleActions() {
        const {canEdit, canDelete} = this.props;

        return (canEdit || canDelete) && !this.isAutoMessage();
    }

    openActions() {
        const {processing, actionDropdown: menus} = this.state;
        const {theme} = this.props;

        if (this.isVisibleActions() && !processing) {
            Popover.show(this.actionDropdownRef.current, {
                onDone: this.onMenuItemPress,
                menus,
                menuWidth,
                theme,
            });
        }
    }

    onMenuItemPress(selectionIndex, groupIndex = 0) {
        const {actionDropdown} = this.state;

        Popover.onMenuItemPress(actionDropdown, selectionIndex, groupIndex, this.menuFunctions);
    }

    getMessageColors() {
        const {type} = this.props;
        const system = type !== 'userText';
        const colors = this.themeColors;

        if (this.isInbox()) {
            return {
                backgroundColor: system
                    ? this.selectColor(palette.systemBg, DarkColors.bgLight)
                    : this.selectColor(palette.inboxBg, DarkColors.bgLight),
                color: system ? this.selectColor(palette.systemText, DarkColors.text) : this.selectColor(palette.inboxText, Colors.white),
                linkColor: colors.blue,
            };
        }

        return {
            backgroundColor: system ? this.selectColor(palette.systemBg, DarkColors.bgLight) : this.selectColor(palette.outboxBg, DarkColors.border),
            color: system ? this.selectColor(palette.systemText, DarkColors.text) : palette.outboxText,
            linkColor: Colors.white,
        };
    }

    renderMessageInbox() {
        const {author, readed} = this.props;
        const newMessage = !readed;
        const {backgroundColor} = this.getMessageColors();
        const colors = this.themeColors;

        return (
            <View style={styles.message}>
                <View style={styles.messageHead}>
                    <View style={styles.author}>
                        <View style={styles.authorThumb}>{this.renderAvatar()}</View>
                        <View style={styles.authorName}>
                            <Text style={[styles.authorText, this.isDark && styles.textDark]}>{author}</Text>
                        </View>
                    </View>
                    {this.renderDateTime()}
                </View>
                <View style={styles.messageContainer}>
                    <View style={[styles.messageBody, {backgroundColor}]}>
                        {newMessage && <Icon name='booking-new' size={34} color={colors.green} style={styles.newMessage} />}
                        <View style={styles.inboxCorner}>{this.renderCorner(backgroundColor)}</View>
                        {this.renderMessage()}
                    </View>
                    {this.renderMessageFooter()}
                </View>
            </View>
        );
    }

    renderMessageFooter() {
        const button = this.renderFooterButton();

        return button && <View style={[styles.buttonView, this.isDark && styles.buttonViewDark]}>{button}</View>;
    }

    // eslint-disable-next-line class-methods-use-this
    renderFooterButton() {
        return null;
    }

    renderMessageOutbox() {
        const {author} = this.props;
        const {backgroundColor} = this.getMessageColors();
        const visibleActions = this.isVisibleActions();
        const authorName = (
            <View style={[styles.authorName, styles.outboxAuthor]}>
                <Text style={[styles.authorText, this.isDark && styles.textDark]}>{author}</Text>
                {visibleActions && isAndroid && (
                    <TouchableItem style={styles.arrowContainer} onPress={this.openActions} delayPressIn={0} borderless>
                        <Icon
                            ref={this.actionDropdownRef}
                            name={isIOS ? 'small-arrow' : 'android-more'}
                            size={24}
                            style={[styles.arrow, this.isDark && styles.textDark]}
                        />
                    </TouchableItem>
                )}
                {visibleActions && isIOS && (
                    <Icon
                        ref={this.actionDropdownRef}
                        name={isIOS ? 'small-arrow' : 'android-more'}
                        size={24}
                        style={[styles.arrowContainer, styles.arrow, this.isDark && styles.textDark]}
                    />
                )}
            </View>
        );

        return (
            <View style={[styles.message, styles.messageOut]}>
                <View style={styles.messageHead}>
                    {this.renderDateTime(styles.outboxDate, styles.outboxDateIcon, 'outbox')}
                    {visibleActions && isIOS && (
                        <TouchableBackground
                            activeBackgroundColor={this.selectColor(Colors.grayLight, 'transparent')}
                            onPress={this.openActions}
                            style={styles.author}>
                            {authorName}
                        </TouchableBackground>
                    )}
                    {visibleActions && isAndroid && authorName}
                    {!visibleActions && <View style={[styles.author]}>{authorName}</View>}
                </View>
                <View style={styles.messageContainer}>
                    <View style={[styles.messageBody, {backgroundColor}]}>
                        <View style={styles.outboxCorner}>{this.renderCorner(backgroundColor)}</View>
                        {this.renderMessage()}
                    </View>
                    {this.renderMessageFooter()}
                </View>
            </View>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    renderCorner(backgroundColor) {
        return (
            <Svg height={7} width={14} fill={backgroundColor} viewBox='0 0 100 50'>
                <Polygon points='0,50 50,0 100,50' fill={backgroundColor} />
            </Svg>
        );
    }

    renderMessage() {
        const {body} = this.props;

        return this.renderAsNative(body);
    }

    // eslint-disable-next-line class-methods-use-this
    renderAsNative(body, {fontStyle} = {}) {
        const {color, linkColor} = this.getMessageColors();
        const {theme} = this.props;

        return (
            <HTML
                key={`message_text_${theme}`}
                html={body}
                renderers={{
                    iframe: this.renderIframe,
                }}
                baseFontStyle={{
                    ...htmlStyles.messageText,
                    color,
                    ...fontStyle,
                }}
                containerStyle={{
                    backgroundColor: 'transparent',
                }}
                tagsStyles={{
                    ...tagsStyles,
                    a: {
                        ...tagsStyles.a,
                        color: linkColor,
                    },
                    ul: {
                        ...tagsStyles.ul,
                        color: this.selectColor(Colors.grayDark, Colors.white),
                    },
                }}
            />
        );
    }

    // eslint-disable-next-line class-methods-use-this
    renderIframe(attrs) {
        if (!_.has(attrs, 'src')) {
            return null;
        }

        let height = 900;

        if (_.has(attrs, 'style') && _.isString(attrs.style)) {
            const matches = attrs.style.match(/height:\s*(\d+)px/);

            if (matches && _.has(matches, 1)) {
                height = parseInt(matches[1], 10);
            }
        }

        return (
            <WebView
                key='iframe'
                style={{height}}
                source={{uri: attrs.src}}
                originWhitelist={['*']}
                javaScriptEnabled
                contentInsetAdjustmentBehavior='automatic'
                keyboardDismissMode='on-drag'
                automaticallyAdjustContentInsets={false}
                contentInset={{left: 0, top: 0, right: 0, bottom: 0}}
                useWebKit={false}
            />
        );
    }

    renderAvatar() {
        const {avatar} = this.props;

        if (!avatar) {
            return null;
        }

        return <Image style={{height: 20, width: 20, resizeMode: 'contain'}} source={{uri: avatar}} />;
    }

    renderDateTime(customStyles, customIconStyle, type = 'inbox') {
        const colors = this.themeColors;
        const {date: creationDate, lastUpdate} = this.props;
        const iconUpdated = <Icon name='updated' size={24} color={colors.green} style={[styles.updatedMessage, customIconStyle]} />;
        const messageUpdated = _.isObject(lastUpdate);
        let date = creationDate;

        if (messageUpdated) {
            date = lastUpdate;
        }

        return (
            <View style={[styles.date, customStyles]}>
                {type !== 'inbox' && messageUpdated && iconUpdated}
                <View style={styles.dateCol}>
                    <TimeAgo date={date.ts * 1000} style={[styles.dateText, this.isDark && styles.textDark, styles.bold]} />
                    <Text style={[styles.dateText, this.isDark && styles.textDark]}>({date.fmt})</Text>
                </View>
                {type === 'inbox' && messageUpdated && iconUpdated}
            </View>
        );
    }

    render() {
        if (this.isInbox()) {
            return this.renderMessageInbox();
        }

        return this.renderMessageOutbox();
    }
}
