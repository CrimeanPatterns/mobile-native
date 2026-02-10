import {useNavigation, useRoute} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, Modal, Platform, View} from 'react-native';

import {HeaderButton} from '../../components/page';
import Header from '../../components/page/header';
import {HeaderRightButton} from '../../components/page/header/button';
import {isAndroid, isIOS} from '../../helpers/device';
import {Colors} from '../../styles';
import {useTheme} from '../../theme';
import {AccountDetailsBarcode} from '../accounts/account/barcode';

class BarcodePopup extends AccountDetailsBarcode {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        type: PropTypes.string,
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            text: null,
            format: null,
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.removeBarcode = this.removeBarcode.bind(this);
        this.onBarCodeRead = this.onBarCodeRead.bind(this);
    }

    getBarcode() {
        const {text, format} = this.state;

        return {BarCodeData: text, BarCodeType: format};
    }

    get isQR() {
        return this.props.type === 'qrcode';
    }

    open(barcode) {
        this.setState({
            visible: true,
            ...barcode,
        });
    }

    close(barcode) {
        const {text, format} = this.state;
        const {onClose} = this.props;

        this.setState(
            {
                visible: false,
            },
            () => {
                if (_.isObject(barcode)) {
                    onClose(barcode);
                } else {
                    onClose({
                        text,
                        format,
                    });
                }
            },
        );
    }

    removeBarcode() {
        const message = {
            qrcode: Translator.trans(/** @Desc("Please confirm you want to delete this QR code") */ 'delete-qrcode', {}, 'mobile-native'),
            barcode: Translator.trans('delete.barcode', {}, 'mobile'),
        };

        Alert.alert(
            Translator.trans('alerts.text.confirm', {}, 'messages'),
            this.isQR ? message.qrcode : message.barcode,
            [
                {
                    text: Translator.trans('cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => this.close({text: null, format: null}),
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    onBarCodeRead(barcode) {
        const {data: text, type: format} = barcode;

        this.setState({text, format});
    }

    hasAccess = () => true;

    headerLeft = () => <HeaderButton onPress={this.close} iconName='android-clear' />;

    headerRight = () => (
        <HeaderButton
            {...Platform.select({
                ios: {
                    title: Translator.trans('card-pictures.label.remove', {}, 'messages'),
                },
                android: {
                    iconName: 'android-delete_outline',
                },
            })}
            onPress={this.removeBarcode}
        />
    );

    renderHeader = () => <View style={{height: 40}} />;

    render() {
        const {visible} = this.state;

        if (visible) {
            return (
                <Modal visible transparent={false} animationType='slide' onRequestClose={() => this.close()}>
                    <Header headerLeft={this.headerLeft} headerRight={this.headerRight} transparentHeaderColor={Colors.blueDark} fullScreen={isIOS} />
                    {super.render()}
                </Modal>
            );
        }

        return null;
    }
}

export default React.forwardRef((props, forwardedRef) => {
    const theme = useTheme();
    const navigation = useNavigation();
    const route = useRoute();

    return <BarcodePopup {...props} ref={forwardedRef} theme={theme} navigation={navigation} route={route} />;
});
