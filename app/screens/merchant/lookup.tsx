import {useIsFocused} from '@react-navigation/native';
import {CancelToken} from 'axios';
import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import React, {PureComponent, useEffect} from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';

import {BaseThemedPureComponent} from '../../components/baseThemed';
import {TextField} from '../../components/form';
import Icon from '../../components/icon';
import {HeaderRightButton} from '../../components/page/header/button';
import Spinner from '../../components/spinner';
import {getDefaultNavigationOptions} from '../../config/defaultHeader';
import {isIOS} from '../../helpers/device';
import {getTouchableComponent} from '../../helpers/touchable';
import API from '../../services/api';
import {Colors, DarkColors, Fonts} from '../../styles';
import {useTheme, withTheme} from '../../theme';

const TouchableRow = getTouchableComponent(TouchableHighlight);
const TouchableItem = getTouchableComponent(TouchableOpacity);

class BaseMerchantLookup extends BaseThemedPureComponent<
    any,
    {
        result: any[] | null;
        search: string | null;
        loading: boolean;
        fields: any[];
    }
> {
    constructor(props) {
        super(props);

        this.cancelToken = CancelToken.source();

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.search = this.search.bind(this);
        this.search = _.debounce(this.search, 350);

        this.state = {
            result: null,
            search: null,
            loading: false,
            fields: [
                {
                    type: 'text',
                    name: 'search',
                    required: false,
                    mapped: true,
                    label: Translator.trans('merchant_lookup.name', {}, 'messages'),
                    value: null,
                },
            ],
        };
    }

    get mainColor() {
        return this.selectColor(Colors.chetwodeBlue, DarkColors.chetwodeBlue);
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.cancelToken = null;
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    search(query, cb) {
        if (query.length >= 3) {
            this.safeSetState({
                loading: true,
                result: null,
            });

            API.post(
                '/account/merchants/data',
                {
                    query,
                },
                {
                    cancelToken: this.cancelToken.token,
                },
            ).then(
                (response) => {
                    if (_.isObject(response) && response.data) {
                        const {search} = this.state;
                        const {data} = response;

                        if (_.isArray(data)) {
                            let result = data;

                            if (_.isEmpty(search)) {
                                result = null;
                            }

                            if (_.isFunction(cb)) {
                                cb(result);
                            }

                            this.setSearchResult({result, loading: false});
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
    }

    setSearchResult(response) {
        this.safeSetState(response);
    }

    onSearchChange(search, cb) {
        this.safeSetState({search});

        if (this.cancelToken) {
            this.cancelToken.cancel();
            this.cancelToken = CancelToken.source();
        }

        if (search) {
            this.search(search, cb);
        } else {
            this.setSearchResult({result: null});
        }
    }

    onFieldChange(search) {
        this.onSearchChange(search);
    }

    navigate({id, label, category, nameToUrl}) {
        const {navigation} = this.props;
        const routeName = 'MerchantOffer';

        navigation.navigate(routeName, {
            id,
            label,
            category,
            nameToUrl,
        });
    }

    renderHeader = () => {
        const {theme} = this.props;
        const {loading, search, result} = this.state;

        return (
            <>
                <TextField
                    theme={theme}
                    testID='search-field'
                    returnKeyType='next'
                    enablesReturnKeyAutomatically
                    textContentType='organizationName'
                    value={search}
                    onChangeValue={this.onFieldChange}
                    required={false}
                    autoCapitalize='none'
                    autoCorrect={false}
                    blurOnSubmit
                    clearButtonMode='always'
                    label={Translator.trans('merchant_lookup.name', {}, 'messages')}
                    customStyle={{
                        container: {
                            base: {
                                ...Platform.select({
                                    ios: {
                                        backgroundColor: this.selectColor(Colors.bgGray, Colors.black),
                                    },
                                    android: {
                                        backgroundColor: this.selectColor(Colors.white, DarkColors.bg),
                                    },
                                }),
                                marginBottom: 0,
                            },
                        },
                        ...Platform.select({
                            android: {
                                primaryColor: {
                                    base: this.mainColor,
                                },
                            },
                        }),
                    }}
                />
                {result === null && (
                    <View style={{flex: 1, height: 75, alignItems: 'center', justifyContent: 'center'}}>
                        {loading && <Spinner androidColor={this.mainColor} style={styles.spinner} />}
                    </View>
                )}
            </>
        );
    };

    renderFooter = () => {
        const {navigation} = this.props;
        const trans = 'Reverse Merchant Lookup Tool'; // TODO: trans

        return (
            <TouchableItem onPress={() => navigation.navigate('MerchantReverse')}>
                <View
                    style={[styles.bottomLink, this.isDark && styles.bottomLinkDark, styles.borderTop, this.isDark && styles.borderTopDark]}
                    pointerEvents='box-only'>
                    <View style={styles.bottomLinkWrap}>
                        <Text style={[styles.bottomLinkText, this.isDark && styles.textDark]}>
                            <Text style={{fontWeight: 'bold', color: this.selectColor(Colors.blue, DarkColors.blue)}}>
                                Like this tool? Check out our
                            </Text>
                            <Text style={{fontWeight: 'bold'}}>{` ${trans}`}</Text>
                        </Text>
                    </View>
                    <Icon name='arrow' style={[styles.bottomLinkArrow, this.isDark && styles.bottomLinkArrowDark]} size={20} />
                </View>
            </TouchableItem>
        );
    };

    renderEmpty = () => {
        const {result, loading} = this.state;
        const colors = this.themeColors;

        return (
            <>
                {loading === false && _.isArray(result) && _.isEmpty(result) && (
                    <View style={[styles.noFound, this.isDark && styles.noFoundDark]}>
                        <Icon name='warning' color={colors.orange} size={24} />
                        <Text style={[styles.noFoundText, this.isDark && styles.textDark]}>
                            {Translator.trans('merchant_lookup.noresult', {}, 'messages')}
                        </Text>
                    </View>
                )}
                <View style={styles.searchIconContainer}>
                    <Icon name='search' size={100} style={[styles.searchIcon, this.isDark && styles.searchIconDark]} />
                </View>
            </>
        );
    };

    renderItem = ({item}) => {
        const {label, category} = item;

        return (
            <TouchableRow delayPressIn={0} underlayColor={this.selectColor(Colors.grayLight, DarkColors.bgLight)} onPress={() => this.navigate(item)}>
                <View style={[styles.container, this.isDark && styles.containerDark]} pointerEvents='box-only'>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                        <Text style={[styles.merchantTitle, this.isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                            {`${label} `}
                        </Text>
                        {_.isString(category) && (
                            <Text
                                style={[
                                    styles.merchantTitle,
                                    styles.merchantCategory,
                                    {
                                        color: isIOS ? this.selectColor(Colors.blue, DarkColors.blue) : this.mainColor,
                                    },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode='middle'>
                                {`(${category})`}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableRow>
        );
    };

    render() {
        const {result} = this.state;

        return (
            <FlatList
                style={[styles.page, this.isDark && styles.pageDark]}
                data={result}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={this.renderHeader}
                ListEmptyComponent={this.renderEmpty}
                ListFooterComponent={this.renderFooter}
                contentContainerStyle={{flexGrow: 1}}
                initialNumToRender={15}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
                contentInsetAdjustmentBehavior='automatic'
            />
        );
    }
}

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
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 52,
        flexWrap: 'wrap',
        borderBottomColor: Colors.gray,
        borderBottomWidth: 1,
        ...Platform.select({
            ios: {
                paddingHorizontal: 15,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    containerDark: {
        borderBottomColor: DarkColors.border,
    },
    merchantTitle: {
        color: Colors.grayDark,
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 17,
                lineHeight: 19,
            },
            android: {
                fontSize: 16,
                lineHeight: 18,
            },
        }),
    },
    merchantCategory: {
        color: Platform.select({ios: Colors.blue, android: Colors.chetwodeBlue}),
        fontFamily: Fonts.bold,
        fontWeight: '400',
    },
    noFound: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray,
        paddingHorizontal: 25,
        minHeight: 75,
        maxHeight: 75,
        backgroundColor: Colors.white,
    },
    noFoundDark: {
        borderBottomColor: DarkColors.border,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    noFoundText: {
        fontSize: 13,
        marginLeft: 25,
        color: '#8e9199',
        fontFamily: Fonts.regular,
    },
    searchIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -75,
    },
    searchIcon: {
        alignSelf: 'center',
        color: Colors.gray,
    },
    searchIconDark: {
        ...Platform.select({
            android: {
                color: DarkColors.gray,
            },
        }),
    },
    spinner: {
        alignSelf: 'center',
    },
    bottomLink: {
        borderTopColor: Colors.gray,
        borderTopWidth: 1,
        backgroundColor: Colors.grayLight,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    bottomLinkDark: {
        borderTopColor: DarkColors.border,
        backgroundColor: DarkColors.bgLight,
    },
    bottomLinkWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingRight: 10,
    },
    bottomLinkText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        lineHeight: 17,
        color: Colors.textGray,
    },
    bottomLinkArrow: {
        marginRight: -5,
        color: Colors.grayDarkLight,
    },
    bottomLinkArrowDark: {
        color: DarkColors.text,
    },
});

class MerchantLookupUnauthorized extends BaseMerchantLookup {
    get mainColor() {
        return this.selectColor(Colors.grayBlue, DarkColors.bgLight);
    }

    renderFooter = () => null;
}

const MerchantLookupUnauthorizedScreen = ({navigation, route}) => {
    const theme = useTheme();

    return <MerchantLookupUnauthorized navigation={navigation} route={route} theme={theme} />;
};

MerchantLookupUnauthorizedScreen.navigationOptions = () => ({
    title: Translator.trans(/** @Desc("Lookup Tool") */ 'merchant.lookup-tool', {}, 'mobile-native'),
});

export const MerchantLookupScreen = ({route, navigation}) => {
    const theme = useTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            navigation.getParent('Cards').setOptions({
                title: Translator.trans(/** @Desc("Lookup Tool") */ 'merchant.lookup-tool', {}, 'mobile-native'),
                headerRight: () => null,
            });
        }
    }, [isFocused, navigation]);

    return <BaseMerchantLookup navigation={navigation} route={route} theme={theme} />;
};
export {MerchantLookupUnauthorizedScreen};
