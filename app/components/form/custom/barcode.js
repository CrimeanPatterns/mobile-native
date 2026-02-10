import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, Platform, StyleSheet, Text} from 'react-native';

import BarcodePopup from '../../../screens/barcode';
import ScanBarcode from '../../../screens/barcode/scan';
import {Colors, DarkColors, Fonts} from '../../../styles';
import Barcode from '../../barcode';
import {BaseThemedComponent} from '../../baseThemed';
import Icon from '../../icon';
import {TouchableOpacity} from '../../page/touchable/opacity';

const DEVICE_SCREEN = Dimensions.get('window');

class FormBarcode extends BaseThemedComponent {
    static propTypes = {
        ...BaseThemedComponent.propTypes,
        form: PropTypes.object,
        name: PropTypes.string,
        value: PropTypes.any,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const {value} = nextProps;
        const {text, format} = prevState;

        if (_.isObject(value)) {
            if (value.text !== text || value.format !== format) {
                return value;
            }
        }

        return null;
    }

    _barcodePopup = React.createRef();

    _scanBarcode = React.createRef();

    constructor(props) {
        super(props);

        this.onBarCodeRead = this.onBarCodeRead.bind(this);
        this.onBarCodeClose = this.onBarCodeClose.bind(this);

        this.state = {
            text: null,
            format: null,
        };

        if (_.isObject(props.value)) {
            const {text, format} = props.value;

            this.state = {
                text,
                format,
            };
        }
    }

    get barcodePopup() {
        return this._barcodePopup.current;
    }

    get scanBarcode() {
        return this._scanBarcode.current;
    }

    setBarcode(barcode) {
        const {form, name} = this.props;

        form.setValue(name, {...barcode});
    }

    onBarCodeRead(barcode) {
        const {data: text, type: format} = barcode;

        this.setBarcode({text, format});
    }

    onBarCodeClose(barcode) {
        const {text, format} = barcode;

        this.setBarcode({text, format});
    }

    render() {
        const {format, text} = this.state;
        const {attr} = this.props;

        if (_.isString(format) && _.isString(text)) {
            return (
                <>
                    <BarcodePopup type={attr.type} ref={this._barcodePopup} onClose={this.onBarCodeClose} />
                    <TouchableOpacity style={[style.barcode]} onPress={() => this.barcodePopup.open({text, format})}>
                        <>
                            <Barcode value={text} format={format} height={60} width={DEVICE_SCREEN.width * 0.8} />
                            {['QR_CODE', 'DATA_MATRIX'].indexOf(format) === -1 && (
                                <Text style={[style.text, this.isDark && style.textDark]}>{text}</Text>
                            )}
                        </>
                    </TouchableOpacity>
                </>
            );
        }

        return (
            <>
                <ScanBarcode type={attr.type} ref={this._scanBarcode} onBarCodeRead={this.onBarCodeRead} />
                <TouchableOpacity style={[style.noBarcode, this.isDark && style.noBarcodeDark]} onPress={() => this.scanBarcode.open()}>
                    <>
                        <Text style={[style.barcodeCaption, this.isDark && style.barcodeCaptionDark]}>{attr.title}</Text>
                        <Icon name={attr.type === 'qrcode' ? 'qr-code' : 'footer-barcode'} style={style.barcodeIcon} size={24} />
                        <Text style={[style.barcodeText, this.isDark && style.textDark]}>{attr.hint}</Text>
                    </>
                </TouchableOpacity>
            </>
        );
    }
}

const style = StyleSheet.create({
    barcode: {
        paddingTop: 10,
        paddingBottom: 16,
    },
    noBarcode: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 10,
        paddingBottom: 16,
        backgroundColor: Colors.grayLight,
    },
    noBarcodeDark: {
        backgroundColor: DarkColors.bg,
    },
    barcodeCaption: {
        textAlign: 'center',
        fontFamily: Fonts.regular,
        color: Colors.grayDark,
        ...Platform.select({
            ios: {
                fontSize: 13,
            },
            android: {
                fontSize: 14,
            },
        }),
    },
    barcodeCaptionDark: {
        color: DarkColors.text,
    },
    barcodeIcon: {
        color: '#c6c8cc',
        marginTop: 5,
    },
    barcodeText: {
        textAlign: 'center',
        fontSize: 13,
        fontFamily: Fonts.regular,
        color: '#c6c8cc',
    },
    text: {
        fontFamily: Fonts.regular,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                fontSize: 15,
                color: Colors.textGray,
            },
            android: {
                fontSize: 16,
                color: Colors.grayDark,
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
});

export default FormBarcode;
