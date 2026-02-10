import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {Dimensions, Modal, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import {RNCamera} from 'react-native-camera';

import Barcode from '../../components/barcode';
import {Header} from '../../components/page/header';
import HeaderButton from '../../components/page/header/button';
import {isAndroid} from '../../helpers/device';
import {BARCODE_FORMATS} from '../../services/barcode';
import {Colors, Fonts} from '../../styles';
import {withTheme} from '../../theme';

const {datamatrix, code39mod43, itf14, ...otherTypes} = RNCamera.Constants.BarCodeType;
const BarCodeTypes = Object.values(otherTypes);

class ScanBarcode extends PureComponent {
    static propTypes = {
        onBarCodeRead: PropTypes.func,
        type: PropTypes.string,
    };

    static defaultProps = {
        type: 'barcode',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
    }

    open() {
        if (isAndroid) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
                if (granted) {
                    this._open();
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then((granted) => {
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            this._open();
                        }
                    });
                }
            });
        } else {
            this._open();
        }
    }

    _open() {
        this.mounted = true;
        this.setState({
            visible: true,
        });
    }

    close() {
        this.mounted = false;
        this.setState({
            visible: false,
        });
    }

    onBarCodeRead(event) {
        const {onBarCodeRead} = this.props;
        const {data, type} = event;

        if (this.mounted && BARCODE_FORMATS[type]) {
            const barcode = {data, type: BARCODE_FORMATS[type]};

            if (_.isFunction(onBarCodeRead)) {
                onBarCodeRead(barcode);
            }

            this.close();
        }
    }

    get headerLeft() {
        return <HeaderButton onPress={this.close} iconName='android-clear' />;
    }

    render() {
        const {visible} = this.state;
        const {type} = this.props;
        const {width} = Dimensions.get('window');
        const offset = width / 12;
        const rectWidth = Math.min(width - offset * 2, 400);
        const isQR = type === 'qrcode';
        const title = {
            qrcode: Translator.trans(/** @Desc("Scan QR code") */ 'scan.qrcode', {}, 'mobile-native'),
            barcode: Translator.trans('scan.barcode', {}, 'mobile'),
        };

        return (
            <Modal
                presentationStyle='overFullScreen'
                statusBarTranslucent
                visible={visible}
                transparent={false}
                animationType='slide'
                onRequestClose={this.close}>
                <Header headerLeft={this.headerLeft} title={isQR ? title.qrcode : title.barcode} transparent={isAndroid} />
                <View style={[styles.container]}>
                    <RNCamera
                        ref={(ref) => {
                            this.camera = ref;
                        }}
                        captureAudio={false}
                        style={styles.preview}
                        onBarCodeRead={this.onBarCodeRead}
                        barCodeTypes={BarCodeTypes}>
                        <View style={styles.overlay}>
                            {!isQR && (
                                <Text style={styles.tooltip}>{Translator.trans('camera.scan.barcode', {}, 'mobile').replace('\\n', '\n')}</Text>
                            )}
                        </View>
                        <View style={[styles.contentRow, {height: rectWidth}]}>
                            <View style={styles.overlay} />
                            <View style={[styles.content, {width: rectWidth, height: rectWidth}]}>
                                {!isQR && (
                                    <Barcode
                                        value='4650001796271'
                                        format='EAN_13'
                                        height={80}
                                        width={rectWidth * 0.8}
                                        lineColor='ffffff'
                                        barcodeStyle={{opacity: 0.5}}
                                    />
                                )}
                            </View>
                            <View style={styles.overlay} />
                        </View>
                        <View style={styles.overlay} />
                    </RNCamera>
                </View>
            </Modal>
        );
    }
}

export default React.forwardRef((props, forwardedRef) => React.createElement(withTheme(ScanBarcode), {forwardedRef, ...props}));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Platform.select({ios: Colors.white, android: Colors.black}),
    },
    preview: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentRow: {
        flexDirection: 'row',
    },
    content: {
        borderWidth: 1,
        borderColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tooltip: {
        alignSelf: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontFamily: Fonts.regular,
        color: Colors.white,
        ...Platform.select({
            android: {
                textAlign: 'left',
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
                fontSize: 15,
                paddingLeft: 45,
                marginHorizontal: 16,
                marginTop: StatusBar.currentHeight + 20,
            },
            ios: {},
        }),
    },
});
