import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {LayoutAnimation, LayoutAnimationConfig, Platform, StyleSheet, Text, View} from 'react-native';
import {Switch} from 'react-native-paper';

import {BaseThemedComponent} from '../../components/baseThemed';
import Icon from '../../components/icon';
import {HeaderRightButton} from '../../components/page/header/button';
import {SwipeableFlatList} from '../../components/page/swipeableList';
import {TouchableOpacity} from '../../components/page/touchable/opacity';
import Spinner from '../../components/spinner';
import {isAndroid, isIOS} from '../../helpers/device';
import {getMainColor} from '../../helpers/header';
import {getTouchableComponent} from '../../helpers/touchable';
import {useProfileScreenReload} from '../../hooks/profile';
import API from '../../services/api';
import StoreLocation from '../../services/http/storeLocation';
import {Colors, DarkColors, Fonts} from '../../styles';
import {IconColors} from '../../styles/icons';
import {useTheme, withTheme} from '../../theme';
import {ProfileStackParamList, ProfileStackScreenFunctionalComponent} from '../../types/navigation';

type StoreLocationItem = {
    locationId: string;
    tracked: false;
    disabled?: boolean;
};

class StoreLocationsList extends BaseThemedComponent<
    {
        navigation: StackNavigationProp<ProfileStackParamList, 'StoreLocationsList'>;
        route: RouteProp<ProfileStackParamList, 'StoreLocationsList'>;
        reload: () => void;
    },
    {
        edit: boolean;
        locations: StoreLocationItem[];
        warning?: string;
        disableAll: boolean;
        lastSyncDate: number;
    }
> {
    private layoutLinear: LayoutAnimationConfig;

    private mounted = false;

    private changed = false;

    private willBlurSubscription: (() => void) | undefined;

    constructor(props) {
        super(props);

        this.getList = this.getList.bind(this);
        this.reload = this.reload.bind(this);
        this.changeMode = this.changeMode.bind(this);

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);

        this.state = {
            edit: false,
            locations: [],
            warning: undefined,
            disableAll: false,
            lastSyncDate: Date.now(),
        };

        this.layoutLinear = {
            duration: 100,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
        };
    }

    componentDidMount() {
        const {navigation} = this.props;

        this.mounted = true;
        this.changed = false;
        this.getList();

        this.willBlurSubscription = navigation.addListener('blur', () => {
            if (this.changed) {
                this.refreshData();
            }
        });
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.willBlurSubscription) {
            this.willBlurSubscription();
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getList() {
        API.get<{
            locations: StoreLocationItem[];
            warning: string;
            disableAll: boolean;
        }>('/profile/location/list').then((response) => {
            const {data} = response;

            if (_.isObject(data) && _.isArray(data.locations)) {
                const {locations, warning, disableAll} = data;

                this.setEditMode();
                this.safeSetState({
                    locations,
                    warning,
                    disableAll,
                    lastSyncDate: Date.now(),
                });
            }
        });
    }

    reload() {
        this.safeSetState(
            {
                locations: [],
                edit: false,
                warning: null,
            },
            () => {
                this.getList();
            },
        );
    }

    refreshData() {
        const {reload} = this.props;

        if (_.isFunction(reload)) {
            reload();
        }
    }

    setEditMode() {
        this.changeMode(false);
    }

    changeMode(edit) {
        const {navigation} = this.props;

        navigation.setOptions({
            headerRight: () => {
                const color = !edit ? IconColors.gray : Colors.blue;
                const colorDark = !edit ? Colors.white : DarkColors.blue;

                return (
                    <HeaderRightButton
                        color={color}
                        colorDark={colorDark}
                        title={!edit ? Translator.trans('button.edit', {}, 'messages') : Translator.trans('done', {}, 'messages')}
                        onPress={() => this.changeMode(!edit)}
                    />
                );
            },
        });

        LayoutAnimation.easeInEaseOut();

        this.safeSetState({
            edit,
        });
    }

    saveChanges() {
        const {route} = this.props;
        const {locations} = this.state;
        const {formLink} = route.params;

        if (!_.isNil(formLink) && !_.isEmpty(locations)) {
            API({
                url: formLink,
                method: 'put',
                data: locations.map(({locationId, tracked}) => ({
                    locationId,
                    tracked,
                })),
                retry: 5,
            })
                .then(() => {
                    this.changed = true;
                })
                .catch(_.noop);
        }
    }

    deleteLocation(index) {
        const {navigation} = this.props;
        const {locations} = this.state;
        const {locationId} = locations[index];

        LayoutAnimation.configureNext(this.layoutLinear);

        StoreLocation.remove(locationId);
        locations.splice(index, 1);
        this.safeSetState({locations}, () => this.enableLocations());

        if (locations.length < 1) {
            this.refreshData();
            navigation.goBack();
        }
    }

    onSwitchChange(index, value) {
        this.safeSetState(
            (state) => {
                state.locations[index].tracked = value;

                const trackedLocations = state.locations.filter((location) => location.tracked === true);

                if ((value === true && trackedLocations.length >= 20) || (value === false && trackedLocations.length < 20)) {
                    state.locations.forEach((location) => {
                        if (location.tracked === false) {
                            location.disabled = value;
                        }
                    });
                }

                return state;
            },
            () => {
                this.saveChanges();
            },
        );
    }

    enableLocations() {
        const {locations, disableAll} = this.state;
        const trackedLocations = locations.filter((location) => location.tracked);

        if (!disableAll) {
            if (trackedLocations.length < 20) {
                locations.forEach((location) => {
                    location.disabled = false;
                });
            }

            this.setState({locations});
        }
    }

    renderItem = ({item, index}) => {
        const {navigation} = this.props;
        const {edit} = this.state;
        const {accountId, subAccountId, address, name, locationId, lat, lng, tracked, disabled} = item;
        const colors = this.themeColors;
        const color = getMainColor(Colors.gold, this.isDark);
        let TouchableRow = getTouchableComponent(View);
        let props = {};

        if (!edit) {
            TouchableRow = getTouchableComponent(TouchableOpacity);

            props = {
                onPress: () =>
                    navigation.navigate('StoreLocations', {
                        accountId,
                        subId: subAccountId,
                        locationId,
                        lat,
                        lng,
                        reload: this.reload,
                    }),
            };
        }

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <TouchableRow {...props} style={styles.flex1}>
                    <View style={styles.flex1}>
                        <View style={styles.containerInner}>
                            <View style={styles.containerLabel}>
                                <View style={styles.link} pointerEvents='box-only'>
                                    <View style={styles.info}>
                                        {_.isString(name) && <Text style={[styles.label, this.isDark && styles.textDark]}>{name}</Text>}
                                        {_.isString(address) && <Text style={[styles.hint, this.isDark && styles.textDark]}>{address}</Text>}
                                    </View>
                                    {isIOS && edit !== true && (
                                        <View style={styles.status}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Text style={styles.statusText}>
                                                    {tracked === true && Translator.trans(/** @Desc("On") */ 'switcher.on', {}, 'mobile-native')}
                                                    {tracked === false && Translator.trans(/** @Desc("Off") */ 'switcher.off', {}, 'mobile-native')}
                                                </Text>
                                                <Icon name='arrow' color={colors.grayDarkLight} size={20} />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                            {(isAndroid || edit === true) && (
                                <>
                                    <View style={styles.switchSeparator} />
                                    <View style={styles.containerSwitch}>
                                        <Switch
                                            color={isIOS ? colors.green : color}
                                            value={tracked}
                                            style={switchStyle}
                                            disabled={disabled}
                                            onValueChange={(value) => !disabled && this.onSwitchChange(index, value)}
                                        />
                                    </View>
                                </>
                            )}
                        </View>
                        {disabled === true && <View style={[styles.overlay, this.isDark && styles.overlayDark]} />}
                    </View>
                </TouchableRow>
            </View>
        );
    };

    renderQuickActions = ({index}) => {
        const {edit} = this.state;

        if (isIOS && edit === true) {
            return (
                <View style={[styles.quickActions, this.isDark && styles.quickActionsDark]}>
                    <TouchableOpacity onPress={() => this.deleteLocation(index)}>
                        <View style={styles.swipeButton}>
                            <Text style={styles.swipeButtonText}>{Translator.trans('card-pictures.label.remove', {}, 'messages')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        return null;
    };

    renderHeader() {
        const {warning} = this.state;
        const colors = this.themeColors;

        return (
            <View style={isIOS && {paddingTop: 20}}>
                {!_.isEmpty(warning) && (
                    <View style={[styles.warning, this.isDark && styles.warningDark, {backgroundColor: colors.orange}]}>
                        <Text style={styles.warningText}>{warning}</Text>
                    </View>
                )}
                <View style={[styles.headerTitle, this.isDark && styles.headerTitleDark]}>
                    {isIOS && (
                        <Text style={[styles.title, this.isDark && styles.textDark]}>
                            {Translator.trans('store-location.title', {}, 'mobile').toUpperCase()}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    renderFooter() {
        const {navigation} = this.props;
        const {disableAll} = this.state;
        const TouchableRow = getTouchableComponent(TouchableOpacity);
        const colors = this.themeColors;

        return (
            <View style={[styles.footer, this.isDark && styles.footerDark]}>
                <TouchableRow
                    delayPressIn={0}
                    onPress={() =>
                        navigation.navigate('ProfileEdit', {
                            formLink: '/profile/notifications/push',
                        })
                    }>
                    <View style={[styles.button, this.isDark && styles.buttonDark]} pointerEvents='box-only'>
                        <Text style={[styles.buttonText, this.isDark && styles.textDark]}>
                            {!disableAll && Translator.trans('disable_all_locations', {}, 'messages')}
                            {disableAll &&
                                Translator.trans(/** @Desc("Enable All Retail Cards Notifications") */ 'enable_all_locations', {}, 'mobile-native')}
                        </Text>
                        {isIOS && <Icon name='arrow' color={colors.grayDarkLight} size={20} />}
                    </View>
                </TouchableRow>
            </View>
        );
    }

    renderSeparator = () => (
        <View style={[styles.separatorContainer, this.isDark && styles.separatorContainerDark]}>
            <View style={[styles.separator, this.isDark && styles.separatorDark]} />
        </View>
    );

    keyExtractor = ({locationId, tracked, disabled}) => `location-${locationId}-${tracked}-${disabled}`;

    render() {
        const {locations, lastSyncDate} = this.state;
        const color = getMainColor(Colors.gold, this.isDark);
        const containerStyle = [styles.page, this.isDark && styles.pageDark];

        if (_.isArray(locations) && !_.isEmpty(locations)) {
            return (
                <SwipeableFlatList
                    keyExtractor={this.keyExtractor}
                    style={containerStyle}
                    maxSwipeDistance={70}
                    data={locations}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    renderQuickActions={this.renderQuickActions}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    contentInsetAdjustmentBehavior='automatic'
                    onRefresh={this.getList}
                    lastSyncDate={lastSyncDate}
                />
            );
        }

        return (
            <View style={containerStyle}>
                <Spinner style={styles.spinner} androidColor={color} />
            </View>
        );
    }
}

export const StoreLocationsListScreen: ProfileStackScreenFunctionalComponent<'StoreLocationsList'> = ({navigation, route}) => {
    const theme = useTheme();
    const reload = useProfileScreenReload();

    return <StoreLocationsList theme={theme} navigation={navigation} route={route} reload={reload} />;
};

StoreLocationsListScreen.navigationOptions = () => ({
    title: '',
});

const styles = StyleSheet.create({
    spinner: {
        top: 20,
        alignSelf: 'center',
    },
    flex1: {
        flex: 1,
    },
    page: {
        flex: 1,
        ...Platform.select({
            ios: {
                backgroundColor: Colors.grayLight,
            },
            android: {
                backgroundColor: Colors.white,
            },
        }),
    },
    pageDark: Platform.select({
        ios: {
            backgroundColor: Colors.black,
        },
        android: {
            backgroundColor: DarkColors.bg,
        },
    }),
    textDark: Platform.select({
        ios: {
            color: Colors.white,
        },
        android: {
            fontSize: 16,
            color: DarkColors.text,
        },
    }),
    headerTitle: {
        ...Platform.select({
            ios: {
                borderBottomWidth: 1,
                borderColor: Colors.gray,
                paddingBottom: 5,
            },
        }),
    },
    headerTitleDark: Platform.select({
        ios: {
            borderColor: DarkColors.border,
        },
    }),
    title: {
        fontSize: 12,
        fontFamily: Fonts.regular,
        paddingHorizontal: 16,
        color: Colors.grayDark,
    },
    container: {
        minHeight: 90,
        backgroundColor: Colors.white,
        justifyContent: 'center',
    },
    containerInner: {
        paddingRight: 16,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerDark: {
        backgroundColor: DarkColors.bg,
    },
    containerLabel: {
        flex: 1,
        flexDirection: 'column',
    },
    link: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingVertical: 10,
        ...Platform.select({
            ios: {
                paddingLeft: 16,
            },
            android: {
                paddingHorizontal: 16,
            },
        }),
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingRight: 16,
            },
        }),
    },
    label: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                lineHeight: 18,
                color: '#000',
            },
            android: {
                fontSize: 16,
                lineHeight: 19,
                color: Colors.grayDark,
            },
        }),
    },
    hint: {
        fontFamily: Fonts.regular,
        marginTop: 4,
        ...Platform.select({
            ios: {
                fontSize: 12,
                lineHeight: 14,
                color: '#8e9199',
            },
            android: {
                fontSize: 14,
                lineHeight: 16,
                color: Colors.grayDarkLight,
            },
        }),
    },
    status: {
        flexDirection: 'column',
    },
    statusText: {
        flexDirection: 'column',
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: '#8e9199',
        paddingRight: 10,
    },
    separatorContainer: {
        paddingLeft: 16,
        backgroundColor: Colors.white,
    },
    separatorContainerDark: {
        backgroundColor: DarkColors.bg,
    },
    separator: {
        borderBottomWidth: 1,
        borderColor: Colors.gray,
    },
    separatorDark: {
        borderColor: DarkColors.border,
    },
    footer: Platform.select({
        ios: {
            borderTopWidth: 1,
            borderColor: Colors.gray,
            paddingTop: 40,
        },
    }),
    footerDark: Platform.select({
        ios: {
            borderTopWidth: 1,
            borderColor: DarkColors.border,
        },
    }),
    button: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                borderColor: Colors.gray,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                paddingHorizontal: 16,
                paddingVertical: 12,
            },
            android: {
                paddingHorizontal: 16,
                paddingVertical: 20,
            },
        }),
    },
    buttonDark: {
        backgroundColor: DarkColors.bg,
        borderColor: DarkColors.border,
    },
    buttonText: {
        fontFamily: Fonts.regular,
        ...Platform.select({
            ios: {
                fontSize: 15,
                lineHeight: 20,
                color: Colors.black,
            },
            android: {
                fontSize: 16,
                lineHeight: 16,
                color: Colors.grayBlue,
            },
        }),
    },
    warning: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        ...Platform.select({
            ios: {
                marginTop: -20,
                marginBottom: 24,
                borderBottomWidth: 1,
                borderColor: Colors.gray,
            },
        }),
    },
    warningDark: {
        ...Platform.select({
            ios: {
                borderColor: DarkColors.border,
            },
        }),
    },
    warningText: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.white,
        lineHeight: 14,
    },
    quickActions: {
        flex: 1,
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
    },
    quickActionsDark: {
        backgroundColor: DarkColors.bgLight,
    },
    swipeButton: {
        width: 70,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    swipeButtonText: {
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: Colors.white,
    },
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.7,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
    },
    overlayDark: {
        opacity: 0.5,
        backgroundColor: Colors.black,
    },
    switchSeparator: Platform.select({
        android: {
            flexDirection: 'column',
            justifyContent: 'flex-end',
            borderColor: Colors.gray,
            borderLeftWidth: 1,
            paddingVertical: 10,
            width: 1,
        },
    }),
    containerSwitch: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        ...Platform.select({
            android: {
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
            },
        }),
    },
});

const switchStyle = {
    paddingHorizontal: 0,
    ...Platform.select({
        android: {
            height: 20,
        },
    }),
};

export default withTheme(StoreLocationsList);
