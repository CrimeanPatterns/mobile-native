import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {Image, PermissionsAndroid, StatusBar, Text, TouchableHighlight, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {isAndroid, isIOS} from '../../helpers/device';
import {BARCODE_FORMATS} from '../../services/barcode';
import {BaseThemedPureComponent} from '../baseThemed';
import ShootButton from './shootButton';
import styles from './styles/camera';

class CardCamera extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onTakePicture: PropTypes.func,
        tooltip: PropTypes.string,
    };

    static checkPermissions() {
        return new Promise((resolve, reject) => {
            if (isAndroid) {
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
                    .then((granted) => {
                        if (granted) {
                            resolve();
                        } else {
                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
                                .then((granted) => {
                                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                        resolve();
                                    }
                                })
                                .catch(reject);
                        }
                    })
                    .catch(reject);
            } else {
                resolve();
            }
        });
    }

    barcode = null;

    state = {
        lastCameraRollPhoto: null,
    };

    constructor(props) {
        super(props);

        this.selectFromCameraRoll = this.selectFromCameraRoll.bind(this);
        this.takePicture = this.takePicture.bind(this);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
        this.resumePreview = this.resumePreview.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        this.getLastCameraRollPhoto();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    getLastCameraRollPhoto() {
        if (isIOS) {
            CameraRoll.getPhotos({
                first: 1,
                assetType: 'Photos',
                groupTypes: 'All',
            }).then((response) => {
                if (_.isObject(response) && _.isArray(response.edges) && response.edges.length > 0) {
                    this.safeSetState({
                        lastCameraRollPhoto: response.edges[0].node.image.uri,
                    });
                }
            });
        }
    }

    async selectFromCameraRoll() {
        const {onTakePicture} = this.props;

        const {assets} = await launchImageLibrary({});

        if (_.isArray(assets)) {
            const {uri} = assets[0];

            if (_.isFunction(onTakePicture) && _.isString(uri)) {
                onTakePicture({uri});
            }
        }
    }

    takePicture() {
        if (this.camera) {
            const {onTakePicture} = this.props;
            const options = {
                cropToPreview: true,
                forceUpOrientation: true,
                // orientation: 'auto',
                fixOrientation: isAndroid,
                exif: false,
                pauseAfterCapture: true,
            };

            this.camera.takePictureAsync(options).then((response) => {
                if (_.isFunction(onTakePicture)) {
                    onTakePicture({...response, barcode: this.barcode});
                }
            });
        }
    }

    onBarCodeRead(event) {
        const {data, type} = event;

        if (this.mounted && BARCODE_FORMATS[type]) {
            this.barcode = {data, type: BARCODE_FORMATS[type]};
        }
    }

    resumePreview() {
        if (this.camera) {
            this.camera.resumePreview();
        }
    }

    render() {
        const {lastCameraRollPhoto} = this.state;
        const {tooltip} = this.props;

        return (
            <View style={[styles.container, this.isDark && styles.containerDark]}>
                <RNCamera
                    ref={(ref) => {
                        this.camera = ref;
                    }}
                    captureAudio={false}
                    onBarCodeRead={this.onBarCodeRead}
                    autoFocus={'on'}
                    autoFocusPointOfInterest={{x: 0.5, y: 0.5}}
                    style={styles.preview}>
                    <SafeAreaProvider style={{flex: 1}}>
                        <View>
                            {_.isString(tooltip) && (
                                <View style={[styles.overlay, isAndroid && {marginTop: StatusBar.currentHeight + 50}]}>
                                    <Text style={styles.tooltip}>{tooltip}</Text>
                                </View>
                            )}
                        </View>
                        <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
                            <View style={styles.bottomInnerContainer}>
                                <View style={styles.bottomContainerView}>
                                    {lastCameraRollPhoto && (
                                        <TouchableHighlight onPress={this.selectFromCameraRoll}>
                                            <Image
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    resizeMode: 'cover',
                                                }}
                                                source={{uri: lastCameraRollPhoto}}
                                            />
                                        </TouchableHighlight>
                                    )}
                                </View>
                                <ShootButton onPress={this.takePicture} />
                                <View style={styles.bottomContainerView} />
                            </View>
                        </SafeAreaView>
                    </SafeAreaProvider>
                </RNCamera>
            </View>
        );
    }
}

export default CardCamera;
