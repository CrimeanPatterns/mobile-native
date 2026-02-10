import {firebase} from '@react-native-firebase/analytics';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as StoreReview from 'react-native-store-review';

import {isIOS} from '../helpers/device';
import {withNavigation} from '../navigation/withNavigation';
import AccountsList from '../services/accountsList';
import API from '../services/api';
import Storage from '../storage';
import {Colors, DarkColors, Fonts} from '../styles';
import {withTheme} from '../theme';
import {BaseThemedPureComponent} from './baseThemed';
import Icon from './icon';

const steps = {INITIAL_STEP: 0, DISCARD_STEP: 1, AGREE_STEP: 2};
const actions = {ACTION_SKIP: 1, ACTION_CONTACTUS: 2, ACTION_RATE: 3};

const {INITIAL_STEP, DISCARD_STEP, AGREE_STEP} = steps;
const {ACTION_SKIP, ACTION_CONTACTUS, ACTION_RATE} = actions;

let answered = false;

class RateApp extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        navigation: PropTypes.any,
        onClose: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.discard = this.discard.bind(this);
        this.agree = this.agree.bind(this);

        this.state = {
            question: Translator.trans('rateApp.question-like', {}, 'mobile'),
            visible: this.isVisible(),
            step: INITIAL_STEP,
        };
    }

    componentDidMount() {
        if (this.isVisible()) {
            firebase.analytics().logEvent('RATE_APP_OPEN');
        }
    }

    isVisible = () => {
        const counters = AccountsList.getCounters();
        const {Logons, feedbacks} = Storage.getItem('profile');

        if (answered) {
            return false;
        }

        return (
            Logons > 50 &&
            (counters.errors * 100) / counters.accounts < 20 &&
            counters.accounts > 8 &&
            (_.isEmpty(feedbacks) || (_.isArray(feedbacks) && feedbacks.some((feedback) => _.startsWith(feedback.appVersion, '4.'))) === false) // TODO: rewrite
        );
    };

    agree() {
        const {step} = this.state;

        if (step === DISCARD_STEP) {
            this.openContactUs();
        }
        if (step === AGREE_STEP) {
            this.openReview();
        }
        if (step === INITIAL_STEP) {
            if (StoreReview.isAvailable) {
                StoreReview.requestReview();
            }

            this.setState({
                question: Translator.trans('rateApp.awesome', {}, 'mobile'),
                step: AGREE_STEP,
            });
        }
    }

    discard() {
        const {step} = this.state;

        if (step === DISCARD_STEP) {
            this.skip();
        }
        if (step === INITIAL_STEP || step === AGREE_STEP) {
            this.setState({
                question: Translator.trans('rateApp.whats-wrong', {}, 'mobile'),
                step: DISCARD_STEP,
            });
        }
    }

    skip() {
        this._save(ACTION_SKIP);
        firebase.analytics().logEvent('RATE_APP_SKIP');
    }

    openReview() {
        const url = Platform.select({
            ios: 'itms-apps://itunes.apple.com/app/id388442727?action=write-review',
            android: 'market://details?id=com.itlogy.awardwallet&reviewId=0',
        });

        this._save(ACTION_RATE);
        Linking.openURL(url);
        firebase.analytics().logEvent('OPEN_REVIEW');
    }

    openContactUs() {
        const {navigation, onClose} = this.props;

        if (_.isFunction(onClose)) {
            onClose();
        }

        navigation.navigate('ContactUs');
        this._save(ACTION_CONTACTUS);
        firebase.analytics().logEvent('OPEN_CONTACTUS');
    }

    _save(action) {
        const date = Math.floor(new Date().getTime() / 1000);

        answered = true;

        this.setState({visible: false});

        API.post(
            '/feedback/add',
            {
                action,
                date,
            },
            {
                timeout: 60000,
                retry: 5,
            },
        );
    }

    render() {
        const {visible, question} = this.state;

        return (
            visible && (
                <View style={[styles.container, this.isDark && styles.containerDark]}>
                    <Text style={[styles.text, this.isDark && styles.textDark]}>{question}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonGray, this.isDark && styles.buttonDark]} onPress={this.discard}>
                            <Icon name='error' color={isIOS ? Colors.white : Colors.blueDark} size={isIOS ? 24 : 18} />
                            <Text style={[styles.buttonText, this.isDark && styles.textDark, !isIOS && {color: Colors.blueDark}]}>
                                {isIOS ? Translator.trans('button.no', {}, 'messages') : Translator.trans('button.no', {}, 'messages').toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonGrayDark, this.isDark && styles.buttonDark]} onPress={this.agree}>
                            <Icon name='success' color={Colors.white} size={isIOS ? 24 : 18} />
                            <Text style={[styles.buttonText, this.isDark && styles.textDark]}>
                                {isIOS
                                    ? Translator.trans('button.yes', {}, 'messages')
                                    : Translator.trans('button.yes', {}, 'messages').toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.grayLight,
        marginTop: 10,
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderTopWidth: 1,
                borderTopColor: Colors.gray,
                borderBottomWidth: 1,
                borderBottomColor: Colors.gray,
            },
            android: {
                padding: 16,
            },
        }),
    },
    containerDark: {
        backgroundColor: DarkColors.bgLight,
        ...Platform.select({
            ios: {
                borderTopColor: DarkColors.border,
                borderBottomColor: DarkColors.border,
            },
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
    text: {
        marginTop: 5,
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 17,
            },
            android: {
                fontSize: 16,
            },
        }),
    },
    buttonContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
    },
    button: {
        height: 38,
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                width: 135,
                borderWidth: 1,
                borderColor: '#d6dae6',
            },
            android: {
                width: '48%',
                borderRadius: 2,
                elevation: 1,
            },
        }),
    },
    buttonDark: Platform.select({
        ios: {
            borderColor: DarkColors.border,
            backgroundColor: DarkColors.bgLight,
        },
    }),
    buttonText: {
        marginLeft: 5,
        ...Platform.select({
            ios: {
                fontSize: 15,
                color: Colors.blueDark,
                fontFamily: Fonts.regular,
            },
            android: {
                fontSize: 14,
                color: Colors.white,
                fontFamily: Fonts.bold,
                fontWeight: '500',
            },
        }),
    },
    buttonGray: Platform.select({
        ios: {
            backgroundColor: '#eaedf4',
        },
        android: {
            backgroundColor: Colors.white,
            marginRight: 8,
        },
    }),
    buttonGrayDark: Platform.select({
        ios: {
            backgroundColor: '#d6dae6',
        },
        android: {
            backgroundColor: Colors.blueDark,
            marginLeft: 8,
        },
    }),
});

export default withNavigation(withTheme(RateApp));
