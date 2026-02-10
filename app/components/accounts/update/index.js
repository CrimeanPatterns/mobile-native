import {useLayout} from '@react-native-community/hooks';
import Translator from 'bazinga-translator';
import fromColor from 'color';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {Platform, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import Config from 'react-native-config';
import Animated, {
    Easing,
    interpolate,
    ReduceMotion,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';

import {isIOS} from '../../../helpers/device';
import AccountsList from '../../../services/accountsList';
import Updater from '../../../services/updater';
import {Colors, DarkColors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {withAutoLoginUpdate} from '../../autologin/update';
import {BaseThemedPureComponent} from '../../baseThemed';
import * as Form from '../../form';
import Icon from '../../icon';
import {KeepAwake} from '../../keepAwake';
import RateApp from '../../rateApp';
import WarningMessage from '../../warningMessage';
import AccountDisplayName from '../details/displayName';
import {AccountDisabled, AccountNotice} from '../details/index';
import {LocalPasswordPopup, SecurityQuestionPopup} from './popups';

const AnimatedBar: React.FunctionComponent<{
    duration: number,
    progress: number,
    borderColor: string,
    fillColor: string,
    height: number,
    borderWidth: number,
    onProgressComplete(): void,
}> = ({onProgressComplete, duration, progress, borderColor, fillColor, barColor, height, borderWidth}) => {
    const {onLayout, width} = useLayout();
    const animatedProgress = useSharedValue(0);
    const progressBar = useAnimatedStyle(
        () => ({
            width: interpolate(animatedProgress.value, [0, 1], [0, width]),
        }),
        [width],
    );

    useAnimatedReaction(
        () => animatedProgress.value,
        (currentValue, previousValue) => {
            if (currentValue === 1) {
                runOnJS(onProgressComplete)();
            }
        },
    );

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: duration,
            easing: Easing.out(Easing.exp),
            reduceMotion: ReduceMotion.System,
        });
    }, [animatedProgress, duration, progress]);

    return (
        <Animated.View
            onLayout={onLayout}
            style={{
                borderColor: borderColor,
                borderWidth: borderWidth,
                backgroundColor: fillColor,
            }}>
            <Animated.View
                style={[
                    {
                        height: height,
                        width: 0,
                        backgroundColor: barColor,
                    },
                    progressBar,
                ]}
            />
        </Animated.View>
    );
};

class AccountUpdate extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        accountId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        onComplete: PropTypes.func,
        firstUpdate: PropTypes.bool,
        autoLoginUpdate: PropTypes.object,
    };

    static get initialState() {
        return {
            progress: 0,
            duration: 0,
            status: null,
            complete: false,
            result: {},
        };
    }

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.startClientUpdate = this.startClientUpdate.bind(this);
        this.stopClientUpdate = this.stopClientUpdate.bind(this);
        this.stop = this.stop.bind(this);
        this.close = this.close.bind(this);
        this.statusCallback = this.statusCallback.bind(this);
        this.onProgressBarComplete = this.onProgressBarComplete.bind(this);
        this.onRequestClose = this.onRequestClose.bind(this);

        this.timeoutId = null;

        this.state = AccountUpdate.initialState;
    }

    componentDidMount() {
        Updater.setQuestionAction((accountId, data) => SecurityQuestionPopup({data, accountId}));
        Updater.setPasswordAction((accountId, data) => LocalPasswordPopup({data, accountId}));
    }

    componentWillUnmount() {
        this.accountState = null;
        clearTimeout(this.timeoutId);
        this.stopClientUpdate();
        Updater.end();
    }

    get autoLoginUpdater() {
        const {autoLoginUpdate} = this.props;

        return autoLoginUpdate;
    }

    getAccount = () => {
        const {accountId} = this.props;

        return AccountsList.getAccount(accountId);
    };

    getAccountState = (key) => Updater.getCollection().getElement(key);

    start() {
        const {accountId} = this.props;

        Updater.start([accountId], this.statusCallback, null, this.startClientUpdate, (reason) => {
            if (this.autoLoginUpdater) {
                this.autoLoginUpdater.abort(reason);
            }
        });

        this.accountState = this.getAccountState(accountId);

        if (_.isObject(this.accountState)) {
            this.accountState.setChecking = (duration) => {
                this.accountState.progressDuration = duration;
                this.accountState.state = 'checking';
                this.setState({
                    progress: 90,
                    duration: duration * 1000,
                });
            };
        }
    }

    startClientUpdate(accountId, onError) {
        if (this.autoLoginUpdater) {
            this.autoLoginUpdater.start({
                accountId,
                onError,
                onShow: () => this.setState({visible: false}),
                onHide: () => this.setState({visible: true}),
            });
        }
    }

    stopClientUpdate(cb) {
        if (this.autoLoginUpdater) {
            this.autoLoginUpdater.stop(cb);
        }
    }

    statusCallback(status) {
        const {accountId} = this.props;

        if (['done', 'fail'].indexOf(status) > -1) {
            const accountState = this.getAccountState(accountId);

            if (accountState) {
                const {result, state: status} = accountState;

                this.setState({
                    progress: 100,
                    duration: 1000,
                    result,
                    status,
                });
            }
        }
    }

    onProgressBarComplete() {
        const {status, progress} = this.state;
        const {accountId} = this.props;

        if (status && progress === 100) {
            this.timeoutId = setTimeout(() =>
                this.setState(
                    {
                        complete: true,
                    },
                    () => {
                        const account = Updater.getAccount(accountId);

                        if (_.isObject(account)) {
                            AccountsList.setAccount(account);
                        }
                    },
                ),
            );
        }
    }

    stop() {
        const {onComplete} = this.props;
        const {complete} = this.state;

        clearTimeout(this.timeoutId);

        if (!complete) {
            Updater.stop();
        }

        Updater.end();

        this.close(onComplete);
    }

    close(cb) {
        this.stopClientUpdate(() => {
            this.setState(AccountUpdate.initialState, cb);
        });
    }

    onRequestClose() {
        if (!isIOS) {
            this.stop();
        }
    }

    getFailMessage = (result) => {
        let text = result.failMessage + (result.failCode === -3 ? ' ' : '');

        if (!result.failCode === -3) {
            text += `<a href="${Config.API_URL}/user/pay">${Translator.trans('upgrade-now', {}, 'messages')}</a>`;
        }

        return text;
    };

    renderIcon = (name, color, style) => (
        <View style={[messages.icon, this.isDark && messages.iconDark]}>
            <Icon name={name} color={color} size={24} style={style} />
        </View>
    );

    renderTrips = (num) => (
        <View style={messages.success}>
            <View style={[messages.icon, this.isDark && messages.iconDark, {backgroundColor: 'transparent'}]}>
                <Icon name='reservation' color={this.selectColor('#8e9199', Colors.white)} size={24} />
            </View>
            <View style={messages.successDetails}>
                <View style={messages.successRow}>
                    <View style={messages.successRowItem}>
                        {!isIOS && <Icon style={messages.successIcon} name='reservation' size={24} color='#8e9199' />}
                        <Text style={[messages.successText, this.isDark && messages.textDark]}>
                            {Translator.trans('award.account.list.update.found-trips')}
                        </Text>
                    </View>
                    <Text style={[messages.successText, this.isDark && messages.textDark, messages.successBigText, messages.boldText]}>{num}</Text>
                </View>
            </View>
        </View>
    );

    renderPasswordNotice() {
        const {complete} = this.state;

        if (!complete) {
            return null;
        }

        const account = this.getAccount();

        if (!account) {
            return null;
        }

        const {PwnedNotice} = account;

        if (_.isString(PwnedNotice) && !_.isEmpty(PwnedNotice)) {
            // ScrollView needed for fix height
            return this.renderHTMLBlock(<WarningMessage text={PwnedNotice} />);
        }

        return null;
    }

    renderHTMLBlock = (children) => <ScrollView style={{marginBottom: Platform.select({ios: 20, android: 16})}}>{children}</ScrollView>;

    renderRowText = (text, {bold, big, style} = {bold: false, big: false}) => (
        <Text style={[messages.successText, bold && messages.boldText, big && messages.successBigText, this.isDark && messages.textDark, style]}>
            {text}
        </Text>
    );

    render() {
        const {complete, progress, duration, status, result = {}} = this.state;
        const {theme, displayName, firstUpdate, navigation, route} = this.props;
        const lastChange = result.lastChangeRaw > 0;
        const colors = this.themeColors;
        let lastChangeColor = this.selectColor(Colors.blueDark, colors.blue);
        let paddingTop = 16;

        if (lastChange) {
            lastChangeColor = colors.green;
        } else if (isIOS) {
            lastChangeColor = colors.blue;
        }

        if (!isIOS) {
            paddingTop += StatusBar.currentHeight;
        }

        return (
            <>
                {!complete && <KeepAwake timeout={10 * 60 * 1000 /* 10 min */} />}
                <View style={[popup.overlay, this.isDark && popup.overlayDark]} />
                <SafeAreaView edges={isIOS ? ['top'] : []} style={[popup.safeArea, this.isDark && popup.bgDark]}>
                    <View style={[popup.container, this.isDark && popup.containerDark, {paddingTop}]}>
                        <View style={popup.titleRow}>
                            <AccountDisplayName
                                theme={theme}
                                title={displayName}
                                styles={this.isDark && {title: [popup.title, popup.titleDark], subTitle: popup.subTitle}}
                            />
                            {!isIOS && complete && status === 'unchanged' && <Icon name='square-success' color={colors.green} size={24} />}
                            {!isIOS && complete && status === 'changed' && (
                                <Icon
                                    name='square-arrow'
                                    color={lastChangeColor}
                                    style={
                                        !lastChange && {
                                            transform: [{rotate: '180deg'}],
                                        }
                                    }
                                    size={24}
                                />
                            )}
                        </View>
                        {complete === false && (
                            <View style={popup.progressContainer}>
                                <AnimatedBar
                                    progress={progress / 100}
                                    duration={duration}
                                    height={isIOS ? 18 : 4}
                                    borderColor={isIOS ? colors.border : Colors.white}
                                    fillColor={isIOS ? this.selectColor(Colors.white, DarkColors.bg) : Colors.gray}
                                    barColor={colors.blue}
                                    borderWidth={isIOS ? 1 : 0}
                                    onProgressComplete={this.onProgressBarComplete}
                                />
                            </View>
                        )}
                        {complete && status === 'unchanged' && (
                            <View>
                                <View style={messages.success}>
                                    {this.renderIcon('square-success', colors.green)}
                                    <View style={messages.successDetails}>
                                        <View style={messages.successRow}>
                                            {this.renderRowText(
                                                firstUpdate
                                                    ? Translator.trans('popups.update.unchanged.current-balance', {}, 'mobile')
                                                    : Translator.trans('popups.update.unchanged.message', {}, 'mobile'),
                                            )}
                                            {this.renderRowText(result.balance, {big: true})}
                                        </View>
                                    </View>
                                </View>
                                {result.trips > 0 && this.renderTrips(result.trips)}
                            </View>
                        )}
                        {complete && status === 'changed' && (
                            <View>
                                <View style={messages.success}>
                                    {this.renderIcon('square-arrow', lastChangeColor, [
                                        !lastChange && {
                                            transform: [{rotate: '180deg'}],
                                        },
                                    ])}
                                    <View style={messages.successDetails}>
                                        <View style={messages.successRow}>
                                            {this.renderRowText(Translator.trans('popups.update.changed.title', {}, 'mobile'), {bold: true})}
                                        </View>
                                        <View style={messages.successRow}>
                                            {this.renderRowText(Translator.trans('popups.update.changed.balance', {}, 'mobile'))}
                                            {this.renderRowText(result.lastBalance, {bold: true})}
                                        </View>
                                        <View style={messages.successRow}>
                                            {this.renderRowText(Translator.trans('popups.update.changed.changedby', {}, 'mobile'))}
                                            {this.renderRowText(result.lastChange, {big: true, style: {color: lastChangeColor}})}
                                        </View>
                                        <View style={messages.successRow}>
                                            {this.renderRowText(Translator.trans('popups.update.changed.newbalance', {}, 'mobile'), {bold: !isIOS})}
                                            {this.renderRowText(result.balance, {big: true, bold: true})}
                                        </View>
                                    </View>
                                </View>
                                {result.trips > 0 && this.renderTrips(result.trips)}
                            </View>
                        )}
                        {complete && status === 'error' && (
                            <View style={[messages.container, messages.containerHTML]}>
                                <View style={messages.messageHTML}>
                                    {this.renderHTMLBlock(
                                        <AccountNotice
                                            theme={theme}
                                            item={{
                                                Val: {
                                                    Title: result.notice.Title,
                                                    Message: result.notice.Message,
                                                },
                                            }}
                                            renderSeparator={false}
                                            customStyles={{container: messages.html}}
                                        />,
                                    )}
                                </View>
                            </View>
                        )}
                        {complete && status === 'disabled' && (
                            <View style={[messages.container, messages.containerHTML]}>
                                <View style={messages.messageHTML}>
                                    {this.renderHTMLBlock(
                                        <AccountDisabled
                                            navigation={navigation}
                                            route={route}
                                            theme={theme}
                                            item={{
                                                Val: {
                                                    Title: result.notice.Title,
                                                    Message: result.notice.Message,
                                                },
                                            }}
                                            renderSeparator={false}
                                            customStyles={{container: messages.html}}
                                        />,
                                    )}
                                </View>
                            </View>
                        )}
                        {complete && status === 'failed' && (
                            <View style={[messages.container, messages.containerHTML]}>
                                <View style={messages.messageHTML}>
                                    {this.renderHTMLBlock(
                                        <AccountNotice
                                            navigation={navigation}
                                            theme={theme}
                                            item={{
                                                Val: {
                                                    Title: result.notice && result.notice.Title,
                                                    Message: this.getFailMessage(result),
                                                },
                                            }}
                                            renderSeparator={false}
                                            customStyles={{container: messages.html}}
                                        />,
                                    )}
                                </View>
                            </View>
                        )}
                        {this.renderPasswordNotice()}
                        <View style={popup.containerRow}>
                            <Form.Button
                                theme={theme}
                                label={
                                    complete ? Translator.trans('close.btn', {}, 'messages') : Translator.trans('alerts.btn.cancel', {}, 'messages')
                                }
                                raised
                                onPress={this.stop}
                                color={isIOS ? this.selectColor(Colors.blueDark, DarkColors.blue) : Colors.blueDark}
                            />
                        </View>
                    </View>
                </SafeAreaView>
                {complete === true && (status === 'changed' || status === 'unchanged') && <RateApp onClose={this.close} />}
            </>
        );
    }
}

const popup = StyleSheet.create({
    safeArea: Platform.select({
        ios: {
            backgroundColor: Colors.grayLight,
        },
        android: {},
    }),
    bgDark: {
        backgroundColor: DarkColors.bgLight,
    },
    overlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        ...Platform.select({
            ios: {
                backgroundColor: 'rgba(255,255,255,0.5)',
            },
            android: {
                backgroundColor: 'rgba(0,0,0,0.38)',
            },
        }),
    },
    overlayDark: {
        backgroundColor: fromColor(DarkColors.bg).alpha(0.7).rgb().string(),
    },
    progressContainer: Platform.select({
        ios: {
            height: 18,
            marginVertical: 20,
            paddingHorizontal: 15,
        },
        android: {
            paddingHorizontal: 16,
            marginBottom: 16,
            height: 4,
        },
    }),
    container: Platform.select({
        ios: {
            paddingVertical: 20,
            backgroundColor: Colors.grayLight,
            borderStyle: 'solid',
            borderBottomWidth: 1,
            borderBottomColor: Colors.gray,
        },
        android: {
            paddingVertical: 16,
            backgroundColor: Colors.white,
            elevation: 2,
        },
    }),
    containerDark: {
        backgroundColor: DarkColors.bgLight,
        borderBottomColor: DarkColors.border,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                justifyContent: 'center',
            },
            android: {
                marginBottom: 20,
                paddingHorizontal: 16,
                justifyContent: 'space-between',
            },
        }),
    },
    containerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
    title: {
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 15,
                fontFamily: Fonts.regular,
            },
            android: {
                fontSize: 14,
                fontFamily: Fonts.bold,
                fontWeight: '500',
            },
        }),
    },
    titleDark: {
        color: Colors.white,
    },
    subTitle: Platform.select({
        ios: {
            fontSize: 15,
            color: '#8e9199',
        },
        android: {
            fontSize: 14,
            color: Colors.grayDarkLight,
            fontFamily: Fonts.bold,
            fontWeight: '500',
        },
    }),
});

const messages = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                margin: 20,
            },
            android: {
                marginBottom: 16,
            },
        }),
    },
    containerHTML: {
        marginVertical: 5,
    },
    messageHTML: {
        marginTop: 10,
    },
    html: {
        borderBottomWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    boldText: {
        fontFamily: Fonts.bold,
        ...Platform.select({
            ios: {
                fontWeight: 'bold',
            },
            android: {
                fontWeight: '500',
            },
        }),
    },
    success: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    successDetails: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
    },
    successRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                marginBottom: 5,
            },
            android: {
                marginBottom: 10,
            },
        }),
    },
    successRowItem: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
    },
    successText: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                color: Colors.textGray,
                fontSize: 15,
            },
            android: {
                color: Colors.grayDark,
                fontSize: 14,
            },
        }),
    },
    successBigText: {
        fontSize: Platform.select({
            ios: 17,
            android: 14,
        }),
    },
    successIcon: {
        marginRight: 10,
    },
    icon: Platform.select({
        ios: {
            marginRight: 10,
        },
        android: {
            width: 0,
            height: 0,
            opacity: 0,
        },
    }),
    iconDark: {
        backgroundColor: Colors.white,
        width: 24,
        height: 24,
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
});

const Component = withAutoLoginUpdate(withTheme(AccountUpdate));

export default React.forwardRef((props, forwardedRef) => React.createElement(Component, {forwardedRef, ...props}));
