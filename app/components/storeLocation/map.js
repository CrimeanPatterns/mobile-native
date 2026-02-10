import Geolocation from '@react-native-community/geolocation';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MapView, {Animated, AnimatedRegion, PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';

import {isAndroid, isIOS} from '../../helpers/device';
import NotificationManager from '../../services/notification';
import {Colors, DarkColors} from '../../styles';
import {IconColors} from '../../styles/icons';
import {useTheme} from '../../theme';
import {BaseThemedPureComponent} from '../baseThemed';
import Icon from '../icon';
import {MAP_DARK_THEME} from './themes/dark';

export function distanceDelta(zoom) {
    return Math.exp(Math.log(360) - zoom * Math.LN2);
}

class Map extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        ...MapView.propTypes,
        defaultZoom: PropTypes.number,
    };

    static defaultProps = {
        ...MapView.defaultProps,
        provider: isIOS ? PROVIDER_DEFAULT : PROVIDER_GOOGLE,
        showsUserLocation: false,
        showsMyLocationButton: false,
        showsPointsOfInterest: false,
        showsCompass: false,
        showsScale: false,
        showsBuildings: true,
        showsTraffic: false,
        showsIndoors: false,
        showsIndoorLevelPicker: false,
        zoomEnabled: true,
        zoomTapEnabled: true,
        zoomControlEnabled: false,
        rotateEnabled: false,
        scrollEnabled: true,
        pitchEnabled: false,
        toolbarEnabled: false,
        cacheEnabled: false,
        loadingEnabled: false,
        defaultZoom: 19,
    };

    initialRegion = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: distanceDelta(1),
        longitudeDelta: distanceDelta(1),
    };

    region = new AnimatedRegion(_.isNull(this.props.region) ? this.initialRegion : this.props.region);

    constructor(props) {
        super(props);

        this._handleInnerRef = this._handleInnerRef.bind(this);
        this._onRegionChange = this._onRegionChange.bind(this);

        this.state = {
            initial: _.isNull(this.props.region),
        };
    }

    moveToCurrentPlace(...args) {
        return this._input.moveToCurrentPlace(...args);
    }

    changeRegion(region, duration = 500) {
        const mapView = this._input;

        mapView.animateToRegion(region, duration);
    }

    _handleInnerRef(ref) {
        const {innerRef = _.noop} = this.props;

        this._input = ref;
        innerRef(this._input);
    }

    _onRegionChange(region) {
        const {onRegionChangeComplete = _.noop} = this.props;

        if (region.latitude !== 0 || region.latitude !== 0) {
            this.setState({initial: false});
        }
        this.region.setValue(region);
        onRegionChangeComplete(region);
    }

    _getCurrentPlace = () =>
        new Promise((resolve, reject) => {
            NotificationManager.checkAndRequestLocationPermission()
                .then(() => {
                    NotificationManager.checkAndRequestLocationSettings().finally(() => {
                        Geolocation.getCurrentPosition(
                            (result) => {
                                resolve({
                                    latitude: _.get(result, 'coords.latitude'),
                                    longitude: _.get(result, 'coords.longitude'),
                                });
                            },
                            reject,
                            {enableHighAccuracy: false, timeout: 15000},
                        );
                    });
                })
                .catch(reject);
        });

    moveToCurrentPlace = async () => {
        try {
            const region = await this._getCurrentPlace();

            if (this._input) {
                const delta = distanceDelta(this.props.defaultZoom);

                this.changeRegion({
                    ...region,
                    latitudeDelta: delta,
                    longitudeDelta: delta,
                });
            }
        } catch (e) {
            console.log('current position error', e);
        }
    };

    getCustomMapStyle = () => {
        if (isAndroid && this.isDark) {
            return MAP_DARK_THEME;
        }

        return undefined;
    };

    render() {
        const {onRegionChangeComplete, region: propRegion, ...rest} = this.props;
        const {initial} = this.state;
        const colors = this.themeColors;

        return (
            <View style={styles.container}>
                <Animated
                    style={styles.container}
                    ref={this._handleInnerRef}
                    region={this.region}
                    onRegionChangeComplete={this._onRegionChange}
                    customMapStyle={this.getCustomMapStyle()}
                    {...rest}
                />
                {initial === false && (
                    <View pointerEvents='none' style={styles.balloon}>
                        <Icon name='location' color={this.selectColor(IconColors.red, colors.red)} size={32} />
                    </View>
                )}
                <TouchableOpacity
                    style={[
                        styles.currentPosition,
                        {
                            backgroundColor: this.selectColor(Colors.white, DarkColors.bg),
                        },
                    ]}
                    onPress={this.moveToCurrentPlace}>
                    <Icon name='current-location' color={this.selectColor(IconColors.gray, Colors.white)} size={24} />
                </TouchableOpacity>
            </View>
        );
    }
}

const ThemedMapComponent = React.forwardRef((props, forwardedRef) => {
    const theme = useTheme();

    return <Map ref={forwardedRef} theme={theme} {...props} />;
});

export default ThemedMapComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    balloon: {
        position: 'absolute',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
        top: '50%',
    },
    currentPosition: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 36,
        width: 36,
        padding: 2,
        borderRadius: 7,
        elevation: 2,
    },
});
