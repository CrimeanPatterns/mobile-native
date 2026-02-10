import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Dimensions, Platform, StyleSheet, View} from 'react-native';
import Geocoder from 'react-native-geocoder';

import AccountHeader from '../../components/accounts/header';
import {BaseThemedPureComponent} from '../../components/baseThemed';
import Form, {stylesMaker, SubmitButton} from '../../components/form';
import {HeaderRightButton} from '../../components/page/header/button';
import Spinner from '../../components/spinner';
import MapPreview, {distanceDelta} from '../../components/storeLocation/map';
import {isAndroid, isIOS} from '../../helpers/device';
import {getMainColor} from '../../helpers/header';
import AccountsListService from '../../services/accountsList';
import StoreLocationService from '../../services/http/storeLocation';
import NotificationManager from '../../services/notification';
import Session from '../../services/session';
import {Colors, DarkColors} from '../../styles';
import {useTheme} from '../../theme';
import {ProfileStackParamList, ProfileStackScreenFunctionalComponent} from '../../types/navigation';

function getPermissions(account) {
    return {
        allowAddingOrEditing: _.get(account, 'Access.edit', false),
        allowRemove: _.get(account, 'Access.delete', false),
    };
}

function getTitleData(account) {
    return {
        displayName: _.get(account, 'DisplayName', undefined),
        kind: _.get(account, 'Kind', undefined),
        login: _.get(account, 'Login', undefined),
    };
}

function getAccountRelatedData(accountId) {
    let account = null;

    if (accountId) {
        account = AccountsListService.getAccount(accountId);
    }

    return {
        ...getPermissions(account),
        ...getTitleData(account),
    };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    /* eslint-disable no-param-reassign */
    lat1 = toRadians(lat1);
    lat2 = toRadians(lat2);
    /* eslint-enable no-param-reassign */

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c * 1000;
}

function isEmptyPlaceCoords({latitude, longitude}) {
    return !_.isNumber(latitude) || !_.isNumber(longitude) || (latitude === 0 && longitude === 0);
}

function region2locationBias({latitude, longitude, latitudeDelta, longitudeDelta}) {
    return {
        latitudeSW: latitude - latitudeDelta / 2,
        longitudeSW: longitude - longitudeDelta / 2,
        latitudeNE: latitude + latitudeDelta / 2,
        longitudeNE: longitude + longitudeDelta / 2,
    };
}

function log(...args) {
    console.log('[store location]', ...args);
}

const DEFAULT_ZOOM = 19;
const DEFAULT_DELTA = distanceDelta(DEFAULT_ZOOM);

class StoreLocations extends BaseThemedPureComponent<
    {
        navigation: StackNavigationProp<ProfileStackParamList, 'StoreLocations'>;
        route: RouteProp<ProfileStackParamList, 'StoreLocations'>;
    },
    {
        fields?: unknown[];
        errors?: string[];
        formExtension?: string;
        version: number;
        submitLabel?: string;
        region?: string;
        allowAddingOrEditing: boolean;
        allowRemove: boolean;
        displayName?: string;
        kind?: number;
        login?: string;
    }
> {
    private readonly subAccountId: string;

    private readonly accountId: string;

    private readonly locationId: string;

    private mounted = false;

    private _lastRegion: string | undefined;

    private form = React.createRef<typeof Form>();

    private map = React.createRef<typeof MapPreview>();

    private submitButton = React.createRef<typeof SubmitButton>();

    constructor(props) {
        super(props);

        const {route} = this.props;

        this.locationId = route.params?.locationId;
        this.accountId = route.params?.accountId;
        this.subAccountId = route.params?.subId;

        this.state = {
            ...getAccountRelatedData(this.accountId),
            fields: undefined,
            errors: [],
            formExtension: undefined,
            version: 1,
            submitLabel: undefined,
            region: undefined,
        };

        this._onRegionChange = this._onRegionChange.bind(this);
        this._onMapReady = this._onMapReady.bind(this);
        this._onFieldChange = this._onFieldChange.bind(this);
        this._submit = this._submit.bind(this);
        this._remove = this._remove.bind(this);
        this._onResponse = this._onResponse.bind(this);
        this._onFail = this._onFail.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
    }

    componentDidMount() {
        const {navigation} = this.props;
        const {allowAddingOrEditing} = this.state;

        this.mounted = true;
        if (this.locationId) {
            StoreLocationService.edit(this.locationId).then(this._onResponse, this._onFail);
        } else if (this.accountId && allowAddingOrEditing) {
            StoreLocationService.add(this.accountId, this.subAccountId).then(this._onResponse, this._onFail);
        } else {
            navigation.navigate('AccountsList');
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    _onRegionChange(region) {
        if (!this.mounted) {
            return;
        }

        this._lastRegion = region;

        const place = this.form.current.getValue('place');

        if (calculateDistance(place.latitude, place.longitude, region.latitude, region.longitude) > 1) {
            const setPlace = (place) => {
                this.form.current.setValue('place', place);
                this.form.current.setValue('name', place.name);
                this.form.current.setValue('lat', place.latitude);
                this.form.current.setValue('lng', place.longitude);

                const refPlace = this.form.current.getRef('place');

                if (refPlace) {
                    refPlace.setLocationBias(region2locationBias(region));
                }
            };
            const newPlace = {
                latitude: region.latitude,
                longitude: region.longitude,
                name: `${region.latitude}, ${region.longitude}`,
            };

            Geocoder.geocodePosition({
                lat: region.latitude,
                lng: region.longitude,
            })
                .then((res) => {
                    if (region !== this._lastRegion) {
                        return;
                    }
                    if (res[0]) {
                        setPlace({
                            ...newPlace,
                            name: res[0].formattedAddress,
                        });
                    } else {
                        setPlace(newPlace);
                    }
                })
                .catch(() => {
                    if (region !== this._lastRegion) {
                        return;
                    }

                    setPlace(newPlace);
                });
        }
    }

    _onMapReady() {
        if (this.locationId) {
            return;
        }

        const value = this.form.current.getValue('place');

        if (isEmptyPlaceCoords(value)) {
            this.map.current?.moveToCurrentPlace();
        }
    }

    _onFieldChange(form, fieldName) {
        if (!this.mounted) {
            return;
        }

        if (fieldName === 'place') {
            const value = form.getValue('place');

            if (!_.isObject(value)) {
                return;
            }

            form.setValue('name', value.name);
            form.setValue('lat', value.latitude);
            form.setValue('lng', value.longitude);

            this.map.current?.changeRegion({
                ...value,
                latitudeDelta: DEFAULT_DELTA,
                longitudeDelta: DEFAULT_DELTA,
            });
        }
    }

    _submit(fields) {
        this.setLoading(true);
        if (this.locationId) {
            StoreLocationService.edit(this.locationId, fields).then(this._onResponse, this._onFail);
        } else {
            StoreLocationService.add(this.accountId, this.subAccountId, fields).then(this._onResponse, this._onFail);
        }
    }

    _remove() {
        Alert.alert(
            Translator.trans('alerts.text.confirm'),
            Translator.trans('delete.location', {}, 'mobile'),
            [
                {
                    text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => {
                        if (!this.locationId) {
                            return;
                        }

                        this.setLoading(true);
                        StoreLocationService.remove(this.locationId).then(this._onResponse, this._onFail);
                    },
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    _onResponse(response) {
        const {data} = response;

        this.setLoading(false);
        if (_.isObject(data)) {
            this._setForm(data);
        }
    }

    _onFail() {
        this.setLoading(false);
    }

    _setForm(data) {
        const {navigation, route} = this.props;
        const reload = route.params?.reload;
        const {locations, warning, account, error, jsProviderExtension, DisplayName, Kind, Login} = data;

        if (_.isObject(locations)) {
            Session.setProperty('locations-total', locations.total || 0);
            Session.setProperty('locations-tracked', locations.tracked || 0);
        }

        if (warning && this.mounted) {
            Alert.alert(
                '',
                Translator.trans('favorite_locations.limit', {num: 20}, 'mobile'),
                [
                    {
                        text: Translator.trans('button.ok', {}, 'messages'),
                        onPress: () => {},
                    },
                ],
                {cancelable: false},
            );
        }

        if (account) {
            NotificationManager.checkAndRequestLocationPermission().then(() => {
                NotificationManager.checkAndRequestLocationSettings().catch((err) => {
                    log('checkAndRequestLocationSettings error', err);
                });
            });
            AccountsListService.setAccount(account);
            if (_.isFunction(reload)) {
                reload();
            }

            if (this.mounted) {
                if (Session.getProperty('locations-total') > 0) {
                    navigation.goBack();
                } else if (this.accountId) {
                    navigation.navigate('AccountDetails', {ID: this.accountId, SubAccountID: this.subAccountId});
                } else {
                    navigation.popToTop();
                }
            }
        } else if (this.mounted) {
            this.setState(
                (state) => {
                    let children;
                    let errors;
                    let submitLabel;

                    if (_.isObject(data.formData)) {
                        /* eslint-disable prefer-destructuring */
                        children = data.formData.children;
                        errors = data.formData.errors;
                        submitLabel = data.formData.submitLabel;
                        /* eslint-enable prefer-destructuring */
                    }

                    const formSubmitLabel = submitLabel || Translator.trans('buttons.save', {}, 'mobile');
                    let version;
                    let fields;
                    let formErrors;
                    let formExtension;

                    if (_.isArray(children)) {
                        version = state.version + 1;
                        fields = children;
                        if (_.isArray(errors)) {
                            formErrors = errors;
                        }
                    }
                    if (_.isString(jsProviderExtension) || _.isArray(jsProviderExtension)) {
                        formExtension = jsProviderExtension;
                    }
                    if (_.isString(error) && !_.isEmpty(error)) {
                        formErrors = [error];
                    }

                    return {
                        ...state,
                        displayName: DisplayName,
                        kind: Kind,
                        login: Login,
                        version: version || state.version,
                        errors: formErrors || [],
                        formExtension: formExtension || state.formExtension,
                        submitLabel: formSubmitLabel,
                        ...this._prepareState(fields || state.fields),
                    };
                },
                () => {
                    const {allowRemove} = this.state;

                    if (this.locationId && allowRemove) {
                        navigation.setOptions({
                            headerRight: () =>
                                Platform.select({
                                    ios: <HeaderRightButton title={Translator.trans('card-pictures.label.remove')} onPress={this._remove} />,
                                    android: <HeaderRightButton iconName='android-delete_outline' onPress={this._remove} />,
                                }),
                        });
                    }
                },
            );
        }
    }

    _prepareState(fields) {
        const preparedFields = [...fields];
        const placePickerValue = {};

        for (let i = 0, l = fields.length; i < l; i += 1) {
            switch (fields[i].name) {
                case 'lat':
                    placePickerValue.latitude = _.toNumber(fields[i].value);
                    break;
                case 'lng':
                    placePickerValue.longitude = _.toNumber(fields[i].value);
                    break;
                case 'name':
                    placePickerValue.name = fields[i].value;
                    break;
                default:
                    break;
            }
        }

        preparedFields.unshift({
            type: 'place',
            name: 'place',
            value: placePickerValue,
            label: Translator.trans(/** @Desc("Address") */ 'address', {}, 'mobile-native'),
            hint: Translator.trans('store-location.label', {}, 'mobile'),
            mapped: false,
            required: true,
            // @ts-ignore
            locationBias: region2locationBias({
                ...placePickerValue,
                latitudeDelta: DEFAULT_DELTA,
                longitudeDelta: DEFAULT_DELTA,
            }),
        });

        const prepared = {
            fields: preparedFields,
        };

        const {region} = this.state;

        if (_.isNil(region) && !isEmptyPlaceCoords(placePickerValue)) {
            const {name, ...region} = placePickerValue;

            prepared.region = {
                ...region,
                latitudeDelta: DEFAULT_DELTA,
                longitudeDelta: DEFAULT_DELTA,
            };
        }

        return prepared;
    }

    private setLoading(loading) {
        this.submitButton.current?.setLoading(loading);
    }

    _renderHeader() {
        const {kind, displayName, login, region} = this.state;

        return (
            <>
                <AccountHeader kind={kind} login={login} displayName={displayName} />
                <MapPreview
                    ref={this.map}
                    region={region}
                    onRegionChangeComplete={this._onRegionChange}
                    onMapReady={this._onMapReady}
                    defaultZoom={DEFAULT_ZOOM}
                    style={{height: Math.max(Dimensions.get('window').height / 3, 200)}}
                />
            </>
        );
    }

    _renderFooter() {
        const {submitLabel} = this.state;
        const {theme} = this.props;
        const color = getMainColor(this.selectColor(Colors.blueDark, DarkColors.blue), this.isDark);

        return (
            <SubmitButton
                ref={this.submitButton}
                color={isAndroid ? color : this.selectColor(Colors.blueDark, DarkColors.blue)}
                onPress={() => this.form.current.submit()}
                label={submitLabel}
                raised
                theme={theme}
            />
        );
    }

    render() {
        const {fields, errors, formExtension, version} = this.state;
        const isLoading = !_.isArray(fields);
        const color = getMainColor(this.selectColor(Colors.blueDark, DarkColors.blue), this.isDark);

        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                {isLoading && <Spinner androidColor={color} style={{top: 10, alignSelf: 'center'}} />}
                {!isLoading && fields && fields.length > 0 && (
                    <Form
                        key={`form${version}`}
                        ref={this.form}
                        fields={fields}
                        errors={errors}
                        formExtension={formExtension}
                        onFieldChange={this._onFieldChange}
                        headerComponent={this._renderHeader()}
                        footerComponent={this._renderFooter}
                        onSubmit={this._submit}
                        fieldsStyles={isAndroid ? stylesMaker(color) : undefined}
                    />
                )}
            </View>
        );
    }
}
export const StoreLocationsScreen: ProfileStackScreenFunctionalComponent<'StoreLocations'> = ({navigation, route}) => {
    const theme = useTheme();

    return <StoreLocations theme={theme} navigation={navigation} route={route} />;
};

StoreLocationsScreen.navigationOptions = () => ({
    title: '',
});

export default StoreLocations;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: isIOS ? Colors.grayLight : Colors.white,
    },
    pageDark: {
        backgroundColor: isIOS ? Colors.black : DarkColors.bg,
    },
});
