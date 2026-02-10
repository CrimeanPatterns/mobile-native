import _ from 'lodash';
import {RNCamera} from 'react-native-camera';

import AccountsList from './accountsList';
import API from './api';

const {code39, code93, code128, ean8, ean13, pdf417, qr, upce, interleaved2of5, aztec} = RNCamera.Constants.BarCodeType;

const BARCODE_FORMATS = {};

BARCODE_FORMATS[code39] = 'CODE_39';
BARCODE_FORMATS[code93] = 'CODE_93';
BARCODE_FORMATS[code128] = 'CODE_128';
BARCODE_FORMATS[ean8] = 'EAN_8';
BARCODE_FORMATS[ean13] = 'EAN_13';
BARCODE_FORMATS[interleaved2of5] = 'ITF';
BARCODE_FORMATS[pdf417] = 'PDF417';
BARCODE_FORMATS[qr] = 'QR_CODE';
BARCODE_FORMATS[upce] = 'UPC_E';
BARCODE_FORMATS[aztec] = 'AZTECCODE';

class BarcodeManager {
    static save(id, data, method = 'put') {
        let accountId = id;
        let url;
        let subAccountId;

        if (_.isObject(accountId)) {
            const {Id, subId} = accountId;

            subAccountId = subId;
            accountId = Id;
        }

        const account = AccountsList.setAccountProperties(accountId, subAccountId, {
            BarCodeCustom: data,
        });

        url = ['', 'customLoyaltyProperty', account.TableName.toLowerCase(), account.ID];

        if (subAccountId) {
            url.push(subAccountId);
        }

        url = url.join('/');

        console.log({
            url,
            method,
            data,
            retry: 5,
        });

        return API({
            url,
            method,
            data,
            retry: 5,
        });
    }

    static remove(accountId, properties) {
        return BarcodeManager.save(accountId, properties, 'delete');
    }
}

export default BarcodeManager;
export {BARCODE_FORMATS};
