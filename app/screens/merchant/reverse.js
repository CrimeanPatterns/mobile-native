import {CancelToken} from 'axios';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Dimensions, Platform, ScrollView, StyleSheet, View} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {stylesMaker} from '../../components/form';
import Icon from '../../components/icon';
import OfferWebView from '../../components/offerWebview';
import Spinner from '../../components/spinner';
import {isIOS} from '../../helpers/device';
import {sendClientHeight} from '../../helpers/webview/sendClientHeight';
import API from '../../services/api';
import Storage from '../../storage';
import {Colors, DarkColors} from '../../styles';
import {withTheme} from '../../theme';

const window = Dimensions.get('window');

class MerchantReverse extends BaseThemedPureComponent {
    static navigationOptions = () => ({
        headerBackTitle: Translator.trans('buttons.back', {}, 'mobile'),
        title: Translator.trans(/** @Desc("Reverse Lookup Tool") */ 'merchant.reverse-tool', {}, 'mobile-native'),
        // tabBarIcon: ({tintColor}) => <Icon color={tintColor} size={24} name='menu-merchant-reverse' />,
    });

    form = React.createRef();

    constructor(props) {
        super(props);

        this.cancelToken = CancelToken.source();

        this.init = this.init.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);

        this.onWebViewMessage = this.onWebViewMessage.bind(this);
        this.onWebViewLoadEnd = this.onWebViewLoadEnd.bind(this);

        this.getOffer = this.getOffer.bind(this);

        this.state = {
            data: null,
            offer: null,
            loading: false,
            webViewHeight: window.height,
            formHeight: 0,
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        this._mounted = true;

        this.didFocusSubscription = navigation.addListener('focus', this.init);
    }

    componentWillUnmount() {
        this.cancelToken.cancel();
        this.cancelToken = null;
        this._mounted = false;
        this.didFocusSubscription();
    }

    safeSetState(...args) {
        if (this._mounted) {
            this.setState(...args);
        }
    }

    init() {
        const {data} = this.state;

        if (_.isArray(data) === false) {
            this.getData();
        }
    }

    getData() {
        this.safeSetState({
            loading: true,
        });

        API.get('/merchant-reverse/data', {
            cancelToken: this.cancelToken.token,
        }).then(
            (response) => {
                if (_.isObject(response) && response.data) {
                    const {data} = response;

                    if (_.isArray(data)) {
                        const creditCard = {
                            type: 'choice',
                            required: false,
                            name: 'credit_card',
                            full_name: 'credit_card',
                            label: 'Credit Card',
                            value: '',
                            choices: [{value: '', label: ''}],
                        };
                        const category = {
                            type: 'choice',
                            required: false,
                            name: 'category',
                            full_name: 'category',
                            label: 'Category',
                            value: '',
                            choices: [{value: '', label: ''}],
                        };

                        data.forEach((row) => {
                            const {name, cardId} = row;

                            creditCard.choices.push({value: cardId, label: name});
                        });

                        this.safeSetState({
                            data,
                            fields: [creditCard, category],
                            loading: false,
                        });
                    }
                }
            },
            () => {
                this.safeSetState({
                    loading: false,
                });
            },
        );
    }

    getOffer(id) {
        this.safeSetState({
            loading: true,
        });

        API.get(`/merchant-reverse/offer/${id}`).then(
            (response) => {
                if (_.isObject(response)) {
                    const {data: offer} = response;

                    if (_.isString(offer)) {
                        this.safeSetState({offer, loading: false});
                    }
                }
            },
            () => {
                this.safeSetState({
                    loading: false,
                });
            },
        );
    }

    onFieldChange(form, fieldName) {
        this.safeSetState({offer: null});
        const value = form.getValue(fieldName);

        if (fieldName === 'credit_card') {
            const {data} = this.state;
            const options = [{value: '', label: ''}];

            if (_.isArray(data)) {
                for (const row of data) {
                    const {cardId, multipliers} = row;

                    if (cardId === value) {
                        multipliers.forEach((multiplier) => {
                            const {id, groupName} = multiplier;

                            options.push({value: id, label: groupName});
                        });
                        break;
                    }
                }

                form.setOptions('category', options);
            }
        }

        if (fieldName === 'category') {
            if (value !== '') {
                this.getOffer(value);
            }
        }
    }

    isFree = () => {
        const {Free} = Storage.getItem('profile');

        return Free === true;
    };

    onWebViewMessage(e) {
        const height = parseInt(e.nativeEvent.data, 10);

        this.setState({
            webViewHeight: height,
        });
    }

    onWebViewLoadEnd() {
        if (this._webView) {
            this._webView.injectJavaScript(sendClientHeight);
        }

        const {formHeight} = this.state;

        if (this._scrollView) {
            this._scrollView.scrollTo({y: formHeight, animated: true});
        }
    }

    onLayout = ({
        nativeEvent: {
            layout: {height},
        },
    }) => {
        this.setState({formHeight: height});
    };

    _renderHeader = () => {
        const {loading, fields} = this.state;

        return (
            <View onLayout={this.onLayout}>
                {_.isArray(fields) && (
                    <Form
                        ref={this.form}
                        style={styles.page}
                        fields={fields}
                        onFieldChange={this.onFieldChange}
                        fieldsStyles={{
                            ...(!isIOS ? stylesMaker(this.selectColor(Colors.chetwodeBlue, DarkColors.chetwodeBlue)) : undefined),
                        }}
                        customStyle={{
                            fieldsContainer: {
                                base: {
                                    paddingTop: 0,
                                },
                            },
                            container: {
                                base: {
                                    backgroundColor: Platform.select({
                                        ios: Colors.bgGray,
                                        android: Colors.white,
                                    }),
                                },
                            },
                        }}
                    />
                )}
                {loading && (
                    <View style={{flex: 1, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                        <Spinner androidColor={this.selectColor(Colors.chetwodeBlue, DarkColors.chetwodeBlue)} />
                    </View>
                )}
            </View>
        );
    };

    _renderEmpty = () => {
        const {loading} = this.state;

        if (loading === false) {
            return (
                <View style={styles.searchIconContainer}>
                    <Icon name='search' size={100} style={[styles.searchIcon, this.isDark && styles.searchIconDark]} />
                </View>
            );
        }

        return null;
    };

    renderOffer() {
        const {navigation} = this.props;
        const {offer, webViewHeight} = this.state;

        if (_.isString(offer)) {
            return (
                <OfferWebView
                    ref={(ref) => {
                        this._webView = ref;
                    }}
                    height={webViewHeight}
                    source={offer}
                    onLoadEnd={this.onWebViewLoadEnd}
                    onMessage={this.onWebViewMessage}
                    originWhitelist={['*']}
                    scrollEnabled={false}
                    builtInZoomControls={false}
                    navigation={navigation}
                />
            );
        }

        return null;
    }

    render() {
        const {offer} = this.state;

        return (
            <ScrollView
                ref={(ref) => {
                    this._scrollView = ref;
                }}
                style={[styles.page, this.isDark && styles.pageDark]}
                contentContainerStyle={{flexGrow: 1}}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
                contentInsetAdjustmentBehavior='automatic'>
                {this._renderHeader()}
                {_.isNull(offer) && this._renderEmpty()}
                {this.renderOffer()}
            </ScrollView>
        );
    }
}

export default withTheme(MerchantReverse);

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Platform.select({
            ios: Colors.bgGray,
            android: Colors.white,
        }),
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
    searchIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchIcon: {
        alignSelf: 'center',
        color: Colors.gray,
    },
    searchIconDark: {
        color: DarkColors.gray,
    },
});
