import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
// eslint-disable-next-line import/default
import Swiper from 'react-native-swiper';

import {isAndroid} from '../../helpers/device';
import {ThemedPasscodeSetup} from '../../screens/passcode/setup';
import Intro from '../../services/intro';
import NotificationManager from '../../services/notification';
import PasscodeService from '../../services/passcode';
import {useTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import ThemedModal from '../page/modal';
import LocationIntro from './locationIntro';
import {BackgroundLocationIntro} from './locationIntro/background';
import NotificationsIntro from './notificationsIntro';
import styles from './styles';

class AppIntro extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onClose: PropTypes.func,
    };

    _passcode = React.createRef();

    _swiper = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            visibleIntro: false,
            permissions: [],
            visiblePasscode: false,
        };

        this.close = this.close.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.open = this.open.bind(this);
    }

    async componentDidMount() {
        const visibleIntro = this.isVisibleIntro();
        const visiblePasscode = this.checkPasscode();
        const visibleNotifications = await this.checkNotifications();
        let visibleLocation = false;
        let visibleBackgroundLocation = false;

        if (isAndroid && Platform.Version >= 30) {
            visibleBackgroundLocation = await this.checkBackgroundLocation();
        }

        if (!isAndroid || (isAndroid && Platform.Version < 30)) {
            visibleLocation = await this.checkLocation();
        }

        const permissions = [visibleNotifications, visibleLocation, visibleBackgroundLocation];

        this.setState(
            {
                visibleIntro: visibleIntro && permissions.includes(true),
                permissions,
                visiblePasscode,
            },
            () => {
                const {visibleIntro} = this.state;

                if (visibleIntro === false) {
                    this.close();
                }
            },
        );
    }

    get passcodeSetup() {
        return this._passcode.current;
    }

    get swiper() {
        return this._swiper.current;
    }

    close() {
        const {visiblePasscode} = this.state;

        this.setState({
            permissions: [],
        });

        if (visiblePasscode) {
            this.passcodeSetup.open(this.onClose);
        } else {
            this.onClose();
        }
    }

    next() {
        this.swiper.scrollBy(1);
    }

    previous() {
        this.swiper.scrollBy(-1);
    }

    onClose() {
        const {onClose} = this.props;

        Intro.performedIntro();
        Intro.performedPasscode();

        if (_.isFunction(onClose)) {
            onClose();
        }
    }

    onComplete() {
        const {total, index} = this.swiper.fullState();

        if (index + 1 < total) {
            this.next();

            return 'next';
        }

        this.close();

        return 'close';
    }

    open() {
        this.setState({
            visibleIntro: !Intro.checkPerformedIntro(),
        });
    }

    isVisibleIntro = () => {
        if (PasscodeService.checkPasscode()) {
            return false;
        }

        return Intro.checkPerformedIntro() === false && PasscodeService.checkPasscode() === false;
    };

    checkNotifications = async () => {
        const notification = await NotificationManager.checkNotificationsPermission();

        return !notification && !Intro.checkPerformedNotifications();
    };

    checkLocation = async () => {
        const location = await NotificationManager.checkLocationPermission();

        return !location && !Intro.checkPerformedLocation();
    };

    checkBackgroundLocation = async () => {
        const hasPermission = await NotificationManager.checkBackgroundLocationPermission();

        return !hasPermission && !Intro.checkPerformedLocation();
    };

    checkPasscode = () => !PasscodeService.checkPasscode() && !Intro.checkPerformedPasscode();

    get pageIntroProps() {
        const {theme} = this.props;

        return {onComplete: this.onComplete, closeIntro: this.close, goBack: this.previous, theme};
    }

    render() {
        const {visibleIntro, permissions} = this.state;
        const [visibleNotifications, visibleLocation, visibleBackgroundLocation] = permissions;

        return (
            <>
                {visibleIntro && (
                    <>
                        {permissions.includes(true) && (
                            <ThemedModal headerShown={false} visible onClose={this.close} key='app-intro'>
                                <SafeAreaProvider>
                                    <SafeAreaView style={[styles.swiper, this.isDark && styles.swiperDark]} edges={['bottom']}>
                                        <Swiper
                                            loop={false}
                                            paginationStyle={[styles.paginationSwiper, this.isDark && styles.paginationSwiperDark]}
                                            dotStyle={[styles.dot, this.isDark && styles.dotDark]}
                                            activeDotStyle={[styles.activeDot, this.isDark && styles.activeDotDark]}
                                            ref={this._swiper}>
                                            {!!visibleNotifications && <NotificationsIntro {...this.pageIntroProps} />}
                                            {!!visibleLocation && <LocationIntro {...this.pageIntroProps} />}
                                            {!!visibleBackgroundLocation && <BackgroundLocationIntro {...this.pageIntroProps} />}
                                        </Swiper>
                                    </SafeAreaView>
                                </SafeAreaProvider>
                            </ThemedModal>
                        )}
                    </>
                )}
                <ThemedPasscodeSetup ref={this._passcode} />
            </>
        );
    }
}

const ForwardedRefAppIntro = React.forwardRef((props, ref) => {
    const theme = useTheme();

    return React.createElement(AppIntro, {...props, ref, theme});
});

ForwardedRefAppIntro.displayName = 'ForwardedRefAppIntro';

export default ForwardedRefAppIntro;
