import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import AnimatedBar from 'react-native-animated-bar';
import Config from 'react-native-config';
import HTML from 'react-native-render-html';

import {AccountNotice} from '../../components/accounts/details';
import {LocalPasswordPopup, SecurityQuestionPopup} from '../../components/accounts/update/popups';
import {withAutoLoginUpdate} from '../../components/autologin/update';
import {BaseThemedPureComponent} from '../../components/baseThemed';
import * as Form from '../../components/form';
import Icon from '../../components/icon';
import {KeepAwake} from '../../components/keepAwake';
import {TouchableOpacity} from '../../components/page/touchable/opacity';
import RateApp from '../../components/rateApp';
import {isAndroid, isIOS} from '../../helpers/device';
import {handleOpenUrl} from '../../helpers/handleOpenUrl';
import {getTouchableComponent} from '../../helpers/touchable';
import {PathConfig} from '../../navigation/linking';
import AccountsList from '../../services/accountsList';
import {navigateByPath} from '../../services/navigator';
import StorageSync from '../../services/storageSync';
import Updater from '../../services/updater';
import Storage from '../../storage';
import {Colors, DarkColors, Fonts} from '../../styles';
import {withTheme} from '../../theme';
import accountListStyles from './list/styles';

const TouchableItem = getTouchableComponent(TouchableOpacity);

class AccountsUpdate extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        autoLoginUpdate: PropTypes.object,
    };

    static get initialState() {
        return {
            progress: 0,
            duration: 5000,
            status: null,
            complete: false,
            elements: {},
            total: 0,
            updated: 0,
        };
    }

    constructor(props) {
        super(props);

        this.start = this.start.bind(this);
        this.startClientUpdate = this.startClientUpdate.bind(this);
        this.stop = this.stop.bind(this);
        this.statusCallback = this.statusCallback.bind(this);
        this.onProgressBarComplete = this.onProgressBarComplete.bind(this);
        this.openBlog = this.openBlog.bind(this);

        this.timeoutId = null;

        this.state = AccountsUpdate.initialState;
    }

    componentDidMount() {
        Updater.setQuestionAction((accountId, data) => SecurityQuestionPopup({data, accountId}));
        Updater.setPasswordAction((accountId, data) => LocalPasswordPopup({data, accountId}));

        this.start();
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
        this.stopClientUpdate();
        Updater.end();
    }

    get _autoLoginUpdate() {
        const {autoLoginUpdate} = this.props;

        return autoLoginUpdate;
    }

    getProfile = () => Storage.getItem('profile') || {};

    getBlog = () => Storage.getItem('blog') || {};

    openBlog() {
        const {link} = this.getBlog();

        handleOpenUrl({url: link});
    }

    getAccountsKeys = () => {
        const accountsKeys = this.props.route.params?.accountsKeys ?? [];
        const accounts = AccountsList.getAccounts();

        if (accountsKeys.length > 0) {
            return accountsKeys;
        }

        for (const key in accounts) {
            if (_.isObject(accounts[key]) && _.isObject(accounts[key].Access) && accounts[key].Access.update) {
                accountsKeys.push(key);
            }
        }

        return accountsKeys;
    };

    setAccounts = (data) => {
        if (!data) {
            return;
        }

        const accounts = AccountsList.getAccounts();

        for (const id in data) {
            if (data[id]) {
                accounts[id] = data[id];
            }
        }

        AccountsList.set({accounts});
    };

    start() {
        const accountsKeys = this.getAccountsKeys();

        Updater.start(accountsKeys, this.statusCallback, this.setAccounts, this.startClientUpdate, (reason) => {
            if (this._autoLoginUpdate) {
                this._autoLoginUpdate.abort(reason);
            }
        });

        this.setState({
            total: accountsKeys.length,
        });
    }

    startClientUpdate(accountId, onError) {
        if (this._autoLoginUpdate) {
            this._autoLoginUpdate.start({accountId, onError});
        }
    }

    stopClientUpdate(cb) {
        if (this._autoLoginUpdate) {
            this._autoLoginUpdate.stop(cb);
        }
    }

    stop(result, status = 'done') {
        const {complete} = this.state;

        this.setState({
            ...result,
            progress: 100,
            duration: 1000,
            status,
        });

        if (!complete) {
            Updater.stop();
        }

        this.stopClientUpdate();
    }

    statusCallback(status) {
        if (['done', 'fail'].indexOf(status) > -1) {
            this.stop(this.getResults(), status);

            if (Updater.getTrips().length > 0) {
                StorageSync.forceUpdate();
            }
        }

        if (status === 'progress') {
            const counters = Updater.getCounters();

            if (counters.all > 0) {
                this.setState({
                    ...this.getResults(),
                    status,
                });
            }
        }
    }

    getResults = () => {
        const counters = Updater.getCounters();
        const collection = Updater.getCollection();
        const {progress, all: total, updated} = counters;
        const results = {
            progress,
            total,
            updated,
        };

        if (_.isFunction(collection.length) && collection.length()) {
            results.elements = collection.findUpdated();
        }

        return results;
    };

    onProgressBarComplete() {
        const {status, progress} = this.state;

        if (status && progress === 100) {
            this.timeoutId = setTimeout(() =>
                this.setState({
                    complete: true,
                }),
            );
        }
    }

    getFailMessage = (result) => {
        let text = result.failMessage + (result.failCode === -3 ? ' ' : '');

        if (!result.failCode === -3) {
            text += `<a href="${Config.API_URL}/user/pay">${Translator.trans('upgrade-now', {}, 'messages')}</a>`;
        }

        return text;
    };

    renderTitle = (title, key, icon) => (
        <View style={[styles.title, this.isDark && styles.titleDark]} key={key}>
            {isAndroid && this.renderIcon(icon)}
            <Text style={[styles.titleText, this.isDark && styles.textDark]}>{title}</Text>
        </View>
    );

    renderIcon = ({name, color, size}) => {
        const style = name !== 'warning' && {backgroundColor: Colors.white};

        return (
            <View style={styles.icon}>
                <Icon name={name} color={color} size={size} style={[style, {width: size, height: size}]} />
            </View>
        );
    };

    renderRow = ({id, icon, displayName, login, errorMessage, balance, lastChange, lastChangeRaw}) => {
        const {theme} = this.props;
        const colors = this.themeColors;

        return (
            <View
                style={[styles.container, _.isObject(errorMessage) && styles.containerCol, this.isDark && styles.containerDark]}
                key={`element-${id}`}>
                <View style={[styles.container, styles.containerItem]}>
                    {isIOS && this.renderIcon(icon)}
                    <View style={styles.caption}>
                        <Text style={[styles.captionTitle, this.isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {displayName}
                        </Text>
                        <Text style={[styles.captionLogin, this.isDark && styles.captionLoginDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {login}
                        </Text>
                    </View>
                    <View style={styles.balance}>
                        <Text style={[styles.balanceText, this.isDark && styles.textDark]}>{balance}</Text>
                        {_.isFinite(lastChangeRaw) && (
                            <View style={styles.balanceContainer}>
                                <Text
                                    style={[
                                        styles.balanceContainerText,
                                        {
                                            color: {
                                                true: colors.green,
                                                false: isIOS ? colors.blue : Colors.blueDark,
                                            }[lastChangeRaw > 0],
                                        },
                                    ]}>
                                    {lastChange}
                                </Text>
                                {lastChangeRaw > 0 ? (
                                    <Icon
                                        name='square-arrow'
                                        color={colors.green}
                                        size={isIOS ? 10 : 12}
                                        style={accountListStyles.balanceBlockImage}
                                    />
                                ) : (
                                    <Icon
                                        name='square-arrow'
                                        color={Platform.select({
                                            ios: colors.blue,
                                            android: this.selectColor(Colors.blueDark, DarkColors.blue),
                                        })}
                                        size={isIOS ? 10 : 12}
                                        style={[{transform: [{rotate: '180deg'}]}, accountListStyles.balanceBlockImage]}
                                    />
                                )}
                            </View>
                        )}
                    </View>
                </View>
                {_.isObject(errorMessage) && (
                    <View style={styles.error}>
                        <AccountNotice
                            theme={theme}
                            displayDateInfo={false}
                            displayIcon={false}
                            renderSeparator={false}
                            item={{Val: errorMessage}}
                            customStyles={{container: styles.errorHtml}}
                        />
                    </View>
                )}
            </View>
        );
    };

    renderChangedAccounts = (elements = []) => {
        const rows = [];
        const colors = this.themeColors;

        rows.push(
            this.renderTitle(Translator.trans('account.update.changed', {}, 'mobile'), 'title-changed', {
                name: 'square-updated',
                color: Colors.blueDark,
                size: 24,
            }),
        );

        elements.forEach((element) => {
            const {
                id,
                result: {balance, lastChange, lastChangeRaw},
            } = element;
            const account = AccountsList.getAccount(element.id);

            if (account) {
                const {DisplayName, Login} = account;

                rows.push(
                    this.renderRow({
                        id,
                        displayName: DisplayName,
                        login: Login,
                        balance,
                        lastChange,
                        lastChangeRaw,
                        icon: {
                            name: 'square-updated',
                            color: colors.blue,
                            size: 24,
                        },
                    }),
                );
            }
        });

        return rows;
    };

    renderUnchangedAccounts = (elements = []) => {
        const colors = this.themeColors;
        const rows = [];

        rows.push(
            this.renderTitle(Translator.trans('account.update.unchanged', {}, 'mobile'), 'title-unchanged', {
                name: 'square-success',
                color: colors.green,
                size: 24,
            }),
        );

        elements.forEach((element) => {
            const {
                id,
                result: {balance},
            } = element;
            const account = AccountsList.getAccount(element.id);

            if (account) {
                const {DisplayName, Login} = account;

                rows.push(
                    this.renderRow({
                        id,
                        displayName: DisplayName,
                        login: Login,
                        balance,
                        icon: {
                            name: 'square-success',
                            color: colors.green,
                            size: 24,
                        },
                    }),
                );
            }
        });

        return rows;
    };

    renderErrorAccounts = (elements = []) => {
        const colors = this.themeColors;
        const rows = [];

        rows.push(
            this.renderTitle(Translator.trans('account.update.with-errors', {}, 'mobile'), 'title-error', {
                name: 'square-error',
                color: colors.red,
                size: 24,
            }),
        );

        elements.forEach((element) => {
            const {
                id,
                result: {balance, notice},
            } = element;
            const account = AccountsList.getAccount(element.id);

            if (account) {
                const {DisplayName, Login} = account;

                rows.push(
                    this.renderRow({
                        id,
                        displayName: DisplayName,
                        login: Login,
                        balance,
                        errorMessage: notice,
                        icon: {
                            name: 'square-error',
                            color: colors.red,
                            size: 24,
                        },
                    }),
                );
            }
        });

        return rows;
    };

    renderNotUpdatedAccounts(disabled = [], failed = []) {
        const colors = this.themeColors;
        const rows = [];

        rows.push(
            this.renderTitle(Translator.trans('account.update.not-able-update', {}, 'mobile'), 'title-notupdated', {
                name: 'warning',
                color: colors.orange,
                size: 24,
            }),
        );

        disabled.forEach((element) => {
            const {id} = element;
            const account = AccountsList.getAccount(element.id);

            if (account) {
                const {DisplayName, Login} = account;

                rows.push(
                    this.renderRow({
                        id,
                        displayName: DisplayName,
                        login: Login,
                        balance: Translator.trans('disabled', {}, 'messages'),
                        icon: {
                            name: 'warning',
                            color: colors.orange,
                            size: 24,
                        },
                    }),
                );
            }
        });

        failed.forEach((element) => {
            const {id, result} = element;
            const {balance} = result;
            const account = AccountsList.getAccount(element.id);

            if (account) {
                const {DisplayName, Login} = account;

                rows.push(
                    this.renderRow({
                        id,
                        displayName: DisplayName,
                        login: Login,
                        balance,
                        errorMessage: {
                            Message: this.getFailMessage(result),
                        },
                        icon: {
                            name: 'warning',
                            color: colors.orange,
                            size: 24,
                        },
                    }),
                );
            }
        });

        return rows;
    }

    renderBlog() {
        const {title} = this.getBlog();

        return (
            _.isString('title') && (
                <TouchableOpacity
                    testID='blog-offer-link'
                    onPress={this.openBlog}
                    style={[accountListStyles.blog, this.isDark && accountListStyles.blogDark]}>
                    <Text style={[accountListStyles.blogLink, this.isDark && accountListStyles.blogLinkDark]} numberOfLines={1}>
                        {title}
                    </Text>
                </TouchableOpacity>
            )
        );
    }

    renderBanner() {
        const tagsStyles = {
            p: {
                marginVertical: 0,
                marginHorizontal: 0,
                textAlign: 'center',
            },
        };
        const textSelectable = false;
        const textProps = {
            tagsStyles,
            textSelectable,
        };
        const {Free} = this.getProfile();
        const color = Platform.select({
            ios: Colors.white,
            android: this.selectColor(Colors.white, DarkColors.text),
        });

        return (
            Free === true && (
                <TouchableItem style={styles.awPlusBanner} onPress={() => navigateByPath(PathConfig.SubscriptionPayment)}>
                    <View
                        style={[styles.awPlusBannerContainer, {backgroundColor: this.selectColor(Colors.blueDark, DarkColors.blue)}]}
                        pointerEvents='box-only'>
                        <View style={styles.awPlusBannerRow}>
                            <HTML
                                source={{html: Translator.trans('awplus-advertise.1', {}, 'messages')}}
                                baseFontStyle={{
                                    color,
                                    fontFamily: Fonts.regular,
                                    fontSize: 12,
                                    textAlign: 'center',
                                }}
                                {...textProps}
                            />
                        </View>
                        <View style={[styles.awPlusBannerTitle]}>
                            <HTML
                                source={{html: Translator.trans('awplus-advertise.2', {}, 'messages')}}
                                containerStyle={styles.awPlusBannerTitleText}
                                baseFontStyle={{
                                    color,
                                    fontSize: 20,
                                    fontFamily: Fonts.bold,
                                    fontWeight: '500',
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                }}
                                {...textProps}
                            />
                            <HTML
                                source={{html: Translator.trans('awplus-advertise.3', {}, 'messages')}}
                                baseFontStyle={{
                                    color,
                                    fontSize: isIOS ? 14 : 12,
                                    fontFamily: Fonts.regular,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                }}
                                {...textProps}
                            />
                        </View>
                        <View style={[styles.awPlusBannerRow, {alignItems: 'flex-end'}]}>
                            <HTML
                                source={{html: Translator.trans('awplus-advertise.4', {}, 'messages')}}
                                baseFontStyle={{
                                    flex: 1,
                                    color,
                                    fontSize: isIOS ? 22 : 24,
                                    fontFamily: Fonts.regular,
                                }}
                                {...textProps}
                            />
                        </View>
                    </View>
                </TouchableItem>
            )
        );
    }

    render() {
        const {progress, duration, complete, elements = {}, updated, total} = this.state;
        const {changed, unchanged, error, failed, disabled} = elements;
        const colors = this.themeColors;
        const animatedBarProps = Platform.select({
            ios: {
                height: 18,
                borderColor: colors.border,
                fillColor: this.selectColor(Colors.white, DarkColors.bg),
                barColor: colors.blue,
                borderWidth: 1,
            },
            android: {
                height: 4,
                borderColor: this.selectColor(Colors.white, DarkColors.border),
                fillColor: this.selectColor(Colors.gray, DarkColors.gray),
                barColor: this.selectColor(Colors.blueDark, DarkColors.blue),
                borderWidth: 0,
            },
        });

        return (
            <>
                {!complete && <KeepAwake timeout={10 * 60 * 1000 /* 10 min */} />}
                <ScrollView style={[styles.page, this.isDark && styles.pageDark]} contentInsetAdjustmentBehavior='automatic'>
                    {this.renderBlog()}
                    {complete === false && (
                        <View style={[styles.updateContainer, this.isDark && styles.updateContainerDark]}>
                            <View style={styles.updateContainerTop}>
                                <Text style={[styles.updateContainerText, this.isDark && styles.textDark]}>
                                    {Translator.trans(
                                        'account.update.progress',
                                        {
                                            updated,
                                            accounts: Translator.transChoice('accounts.n', total, {accounts: total}),
                                        },
                                        'mobile',
                                    )}
                                </Text>
                            </View>
                            <View style={styles.updateProgress}>
                                <AnimatedBar
                                    progress={progress / 100}
                                    duration={duration}
                                    {...animatedBarProps}
                                    onProgressComplete={this.onProgressBarComplete}
                                />
                            </View>
                            <View style={styles.updateButton}>
                                <Form.Button
                                    label={Translator.trans('account.update.stop', {}, 'mobile')}
                                    color={this.selectColor(Colors.blueDark, DarkColors.blue)}
                                    raised
                                    onPress={this.stop}
                                />
                            </View>
                        </View>
                    )}
                    {complete === true && (
                        <View style={[styles.updateContainer, this.isDark && styles.updateContainerDark]}>
                            <View style={styles.updateContainerTop}>
                                <Icon
                                    name='square-success'
                                    style={[styles.updateIcon, this.isDark && styles.updateIconDark]}
                                    color={colors.green}
                                    size={17}
                                />
                                <Text style={[styles.updateContainerText, this.isDark && styles.textDark]}>
                                    {Translator.trans(
                                        'account.update.complete',
                                        {accounts: Translator.transChoice('accounts.n', updated, {accounts: updated})},
                                        'mobile',
                                    )}
                                </Text>
                            </View>
                        </View>
                    )}
                    {complete === true && _.isEmpty(failed) && <RateApp />}
                    {this.renderBanner()}
                    {_.isArray(changed) && changed.length > 0 && this.renderChangedAccounts(changed)}
                    {_.isArray(unchanged) && unchanged.length > 0 && this.renderUnchangedAccounts(unchanged)}
                    {_.isArray(error) && error.length > 0 && this.renderErrorAccounts(error)}
                    {((_.isArray(failed) && failed.length > 0) || (_.isArray(disabled) && disabled.length > 0)) &&
                        this.renderNotUpdatedAccounts(disabled, failed)}
                </ScrollView>
            </>
        );
    }
}

export default withTheme(withAutoLoginUpdate(AccountsUpdate));

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    textDark: {
        ...Platform.select({
            ios: {
                color: Colors.white,
            },
            android: {
                color: DarkColors.text,
            },
        }),
    },
    updateContainer: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
            android: {
                elevation: 3,
                padding: 16,
                backgroundColor: Colors.white,
            },
        }),
    },
    updateContainerDark: {
        backgroundColor: DarkColors.bg,
        ...Platform.select({
            ios: {
                borderBottomColor: Colors.black,
            },
            android: {
                borderBottomColor: DarkColors.border,
            },
        }),
    },
    updateContainerTop: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            android: {
                flexDirection: 'row-reverse',
                justifyContent: 'space-between',
                paddingVertical: 8,
            },
        }),
    },
    updateIcon: {
        backgroundColor: Colors.white,
        width: 17,
        height: 17,
        ...Platform.select({
            ios: {
                marginRight: 10,
            },
        }),
    },
    updateIconDark: {
        ...Platform.select({
            android: {backgroundColor: Colors.black},
        }),
    },
    updateContainerText: {
        color: Colors.textGray,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 13 : 14,
    },
    updateProgress: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                marginVertical: 10,
                minHeight: 18,
            },
            android: {
                marginVertical: 16,
                minHeight: 4,
            },
        }),
    },
    updateButton: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                marginTop: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderBottomColor: Colors.borderGray,
                borderBottomWidth: 2,
            },
            android: {
                paddingVertical: 16,
                paddingRight: 16,
                marginLeft: 16,
                marginTop: 24,
                borderBottomColor: Colors.gray,
                borderBottomWidth: 1,
            },
        }),
    },
    titleDark: {
        borderBottomColor: DarkColors.border,
    },
    titleText: {
        fontSize: 20,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    container: {
        height: 60,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
            },
            android: {
                marginLeft: 16,
                paddingRight: 16,
                paddingVertical: 10,
            },
        }),
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    containerItem: {
        borderBottomWidth: 0,
        paddingHorizontal: 0,
        ...Platform.select({
            android: {
                marginLeft: 0,
            },
        }),
    },
    containerCol: {
        height: 'auto',
        minHeight: 60,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    icon: {
        width: isIOS ? 40 : 55,
    },
    caption: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        paddingRight: 10,
    },
    captionTitle: {
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        fontSize: isIOS ? 15 : 16,
    },
    captionLogin: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 13,
                color: '#8e9199',
            },
            android: {
                fontSize: 14,
                color: Colors.grayDarkLight,
            },
        }),
    },
    captionLoginDark: {
        color: DarkColors.text,
    },
    balance: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
    },
    balanceText: {
        textAlign: 'right',
        color: Colors.grayDark,
        fontFamily: Fonts.bold,
        fontWeight: '500',
        fontSize: isIOS ? 17 : 16,
    },
    balanceContainer: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    balanceContainerText: {
        marginRight: 5,
        fontFamily: Fonts.regular,
        fontSize: isIOS ? 13 : 14,
    },
    error: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        marginTop: -15,
        paddingVertical: 10,
    },
    errorHtml: {
        borderBottomWidth: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    awPlusBanner: Platform.select({
        ios: {
            paddingHorizontal: 10,
            paddingTop: 10,
        },
        android: {
            paddingHorizontal: 8,
            paddingTop: 8,
        },
    }),
    awPlusBannerContainer: {
        flexDirection: 'column',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
                paddingVertical: 10,
            },
            android: {
                paddingHorizontal: 15,
                paddingVertical: 14,
            },
        }),
    },
    awPlusBannerTitleText: Platform.select({
        android: {
            marginBottom: 5,
        },
    }),
    awPlusBannerTitle: {
        paddingVertical: 10,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    awPlusBannerRow: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
});
