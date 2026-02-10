import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {Animated, Easing, FlatList, LayoutAnimation, StyleSheet, Text, View} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import {Colors, Fonts} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import Spinner from '../../spinner';
import TimeAgo from '../../timeAgo';

const PULL_TO_REFRESH = 0;
const RELEASE_TO_REFRESH = 1;
const REFRESHING = 2;
const COMPLETED = 3;

const RF_HEIGHT = 50;
const MIN_PULLDOWN_DISTANCE = -RF_HEIGHT * 1.5;
const DELAY_TIME = 3000;
const RunAnimate = false;

const animate = () => {
    if (RunAnimate) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
};

class Arrow extends PureComponent {
    static propTypes = {
        status: PropTypes.number,
    };

    static defaultProps = {
        status: PULL_TO_REFRESH,
    };

    constructor(props) {
        super(props);

        this.arrowAngle = new Animated.Value(0);
        this.animationTransform = [
            {
                rotate: this.arrowAngle.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ];
    }

    componentDidUpdate(prevProps) {
        const {status} = this.props;

        if (status !== prevProps.status) {
            if (status === RELEASE_TO_REFRESH || status === PULL_TO_REFRESH) {
                this.triggerAnimation(status);
            }
        }
    }

    triggerAnimation(toValue) {
        Animated.timing(this.arrowAngle, {
            toValue,
            duration: 250,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }

    render() {
        return (
            <Animated.View style={{transform: this.animationTransform}}>
                <Icon name='refresh-path1' color='rgb(141, 146, 157);' size={24} style={{position: 'relative', left: 0}} />
                <Icon name='refresh-path2' color='rgb(206, 208, 213);' size={24} style={{position: 'absolute', left: 0}} />
                <Icon name='refresh-path3' color='rgb(238, 239, 241);' size={24} style={{position: 'absolute', left: 0}} />
            </Animated.View>
        );
    }
}

@withTheme
class RefreshableFlatList extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        ListComponent: PropTypes.any,
        ListHeaderComponent: PropTypes.any,
        ListFooterComponent: PropTypes.any,
        forceRefresh: PropTypes.bool,
        inverted: PropTypes.any,
        onRefresh: PropTypes.func,
        onScroll: PropTypes.func,
        lastSyncDate: PropTypes.any,
    };

    static defaultProps = {
        ListComponent: FlatList,
        forceRefresh: false,
        lastSyncDate: Date.now(),
    };

    _scrollView = React.createRef();

    timeoutId = null;

    constructor(props) {
        super(props);

        this.safeSetState = this.safeSetState.bind(this);
        this.handleRelease = this.handleRelease.bind(this);

        this.dragStart = false;
        this.scrollY = new Animated.Value(0);
        this.onScrollY = Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: this.scrollY,
                        },
                    },
                },
            ],
            {
                useNativeDriver: false,
            },
        );

        this.state = {
            status: PULL_TO_REFRESH,
            date: props.lastSyncDate,
        };
    }

    componentDidMount() {
        const {forceRefresh, onRefresh} = this.props;

        this.mounted = true;

        if (onRefresh) {
            this.scrollY.addListener(this.handleScroll);

            if (forceRefresh) {
                this._prepare(false, forceRefresh);
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {forceRefresh, lastSyncDate} = this.props;
        const needRefresh = prevProps.forceRefresh !== forceRefresh && forceRefresh === true;
        const needUpdateDate = prevState.date !== lastSyncDate;

        if (needUpdateDate || needRefresh) {
            this._prepare(needUpdateDate, needRefresh);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
        this.mounted = false;
        if (this.scrollY) {
            this.scrollY.removeAllListeners();
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    scrollToTop = () => {
        this.scrollTo(0);
    };

    scrollTo = (offset) => {
        this.scrollToOffset({offset, animated: true});
    };

    scrollToOffset = (...args) => {
        this._scrollView.current?.scrollToOffset(...args);
    };

    scrollToEnd = () => this._scrollView.current?.scrollToEnd();

    scrollToItem = (...args) => this._scrollView.current?.scrollToItem(...args);

    _prepare(needUpdateDate, needRefresh) {
        const {lastSyncDate} = this.props;
        let {status, date} = this.state;

        if (needUpdateDate) {
            date = lastSyncDate;
        }

        if (needRefresh) {
            status = REFRESHING;
        }

        this.safeSetState(
            {
                date,
                status,
            },
            needRefresh ? this._handleOnRefresh : null,
        );
    }

    _delay() {
        return new Promise((resolve) => {
            this.timeoutId = setTimeout(resolve, DELAY_TIME);
        });
    }

    async _handleOnRefresh() {
        const {onRefresh} = this.props;

        try {
            if (_.isFunction(onRefresh)) {
                await onRefresh();
            }
        } finally {
            this._onRefreshComplete();
            await this._delay();
            this._endLoading();
        }
    }

    _onRefreshComplete() {
        this.safeSetState({
            status: COMPLETED,
        });
    }

    _endLoading() {
        animate();
        this.safeSetState({
            status: PULL_TO_REFRESH,
        });
    }

    handleRelease() {
        const {status} = this.state;

        if (this.dragStart) {
            if ([REFRESHING, COMPLETED].indexOf(status) > -1) {
                return;
            }

            if (status === RELEASE_TO_REFRESH) {
                animate();
                this.safeSetState({status: REFRESHING}, this._handleOnRefresh);
            } else {
                this.safeSetState({status: PULL_TO_REFRESH});
            }
        }
    }

    handleScroll = ({value}) => {
        const {status} = this.state;

        if ([REFRESHING, COMPLETED].indexOf(status) > -1) {
            return;
        }

        if (value <= MIN_PULLDOWN_DISTANCE) {
            if (status !== RELEASE_TO_REFRESH) {
                const options = {
                    enableVibrateFallback: false,
                    ignoreAndroidSystemSettings: false,
                };

                ReactNativeHapticFeedback.trigger('impactLight', options);
                this.safeSetState({status: RELEASE_TO_REFRESH});
            }
        } else if (status !== PULL_TO_REFRESH) {
            this.safeSetState({status: PULL_TO_REFRESH});
        }
    };

    onScroll = (eventScroll) => {
        const {onScroll, onRefresh} = this.props;

        if (_.isFunction(onScroll)) {
            onScroll(eventScroll);
        }

        if (_.isFunction(onRefresh)) {
            const {
                nativeEvent: {
                    contentOffset: {y},
                },
            } = eventScroll;

            this.dragStart = y < 0;

            if (this.dragStart) {
                this.onScrollY(eventScroll);
            }
        }
    };

    renderRefreshHeader() {
        const {status, date} = this.state;
        const translations = [
            Translator.trans('pull.to.refresh', {}, 'mobile'),
            Translator.trans('release.to.refresh', {}, 'mobile'),
            Translator.trans('synchronizing', {}, 'mobile'),
            Translator.trans('complete.sync', {}, 'mobile'),
        ];

        return (
            <View
                style={[[REFRESHING, COMPLETED].indexOf(status) === -1 && styles.absolute, styles.container, this.isDark && styles.containerDark]}
                key='refresher'>
                <View style={styles.spinner}>{this.renderSpinner(status)}</View>
                <View style={styles.status}>
                    <Text style={[styles.statusTitle, this.isDark && styles.textDark]} numberOfLines={1}>
                        {translations[status].toUpperCase()}
                    </Text>
                    <Text style={[styles.date, this.isDark && styles.textDark]} numberOfLines={1}>
                        {Translator.trans('last.sync', {time: ''}, 'mobile')}
                        <TimeAgo date={new Date(parseInt(date, 10))} style={[styles.date, this.isDark && styles.textDark]} />
                    </Text>
                </View>
            </View>
        );
    }

    renderSpinner = (status) => {
        const colors = this.themeColors;

        if (status === REFRESHING) {
            return <Spinner color={colors.grayDarkLight} />;
        }

        if (status === COMPLETED) {
            return <Icon name='square-success' size={17} color={colors.green} style={styles.successIcon} />;
        }

        return <Arrow status={status} />;
    };

    renderHeader = () => {
        const {ListHeaderComponent, inverted} = this.props;

        return (
            <>
                {!inverted && this.renderRefreshHeader()}
                {_.isFunction(ListHeaderComponent) ? ListHeaderComponent() : ListHeaderComponent}
            </>
        );
    };

    renderFooter = () => {
        const {ListFooterComponent, inverted} = this.props;

        return (
            <>
                {inverted && this.renderRefreshHeader()}
                {_.isFunction(ListFooterComponent) ? ListFooterComponent() : ListFooterComponent}
            </>
        );
    };

    render() {
        const {ListComponent, ListHeaderComponent, ListFooterComponent, onRefresh, onScroll, ...rest} = this.props;

        return (
            <ListComponent
                ref={this._scrollView}
                scrollEventThrottle={5}
                onScroll={this.onScroll}
                onScrollEndDrag={this.handleRelease}
                ListHeaderComponent={onRefresh ? this.renderHeader() : ListHeaderComponent}
                ListFooterComponent={onRefresh ? this.renderFooter() : ListFooterComponent}
                {...rest}
            />
        );
    }
}

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: -RF_HEIGHT,
        left: 0,
        right: 0,
    },
    container: {
        height: RF_HEIGHT,
        backgroundColor: Colors.white,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingLeft: 10,
    },
    containerDark: {
        backgroundColor: Colors.black,
    },
    textDark: {
        color: Colors.white,
    },
    status: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'center',
    },
    statusTitle: {
        fontSize: 10,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    date: {
        fontSize: 12,
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
    },
    spinner: {
        width: 24,
        flexDirection: 'column',
        alignItems: 'center',
    },
    successIcon: {
        width: 17,
        height: 17,
        backgroundColor: Colors.white,
    },
});

export default React.forwardRef((props, forwardedRef) => React.createElement(RefreshableFlatList, {forwardedRef, ...props}));
export {PULL_TO_REFRESH, RELEASE_TO_REFRESH, REFRESHING, COMPLETED};
