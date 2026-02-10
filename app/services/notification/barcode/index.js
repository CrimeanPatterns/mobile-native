import Translator from 'bazinga-translator';
import _ from 'lodash';
import Config from 'react-native-config';

import {isAndroid, isIOS} from '../../../helpers/device';

/**
 * @return {boolean}
 */
function isLastChangeDate(date) {
    const date1 = new Date(date);
    const date2 = new Date();

    return Math.abs(date2.getTime() - date1.getTime()) / 3600000 < 24;
}

function getAccountProperties(account) {
    const {BalancePush, LastChangeDate, LastChange, EliteStatus, ExpirationDatePush} = account;
    const properties = [];
    let property;

    if (!_.isUndefined(BalancePush)) {
        property = {
            type: 'balance',
            name: Translator.trans('award.account.balance', {}, 'messages'),
            value: BalancePush,
        };

        if (isLastChangeDate(LastChangeDate * 1000)) {
            property.change = LastChange;
        }

        properties.push(property);
    }

    if (EliteStatus && EliteStatus.Name) {
        properties.push({
            name: Translator.trans('award.account.list.column.status', {}, 'messages'),
            value: EliteStatus.Name,
        });
    }

    if (_.isString(ExpirationDatePush)) {
        properties.push({
            name: Translator.trans('account.label.expiration', {}, 'messages'),
            value: ExpirationDatePush,
        });
    }

    return properties;
}

class BarcodeNotification {
    constructor(properties, location) {
        const {barcode} = properties;
        const {account} = properties;
        const {subAccount} = properties;

        const accountKey = account.TableName.toLowerCase()[0] + account.ID;
        let url = `${Config.API_URL}/m/account/details/${accountKey}`;

        if (subAccount) {
            url += `/${subAccount.SubAccountID}`;
        }

        // eslint-disable-next-line no-useless-escape
        const regexDisplayName = /^(.+?)(\((?:[^\)]+)\))?$/;
        const displayName = regexDisplayName.exec(account.DisplayName);

        let title;
        let body;
        const translations = [
            Translator.trans(
                /** @Desc("Here is your %programName% card") */ 'notifications.barcode.body',
                {programName: displayName[1].trim()},
                'mobile',
            ),
            Translator.trans(
                /** @Desc("Long press this notification to instantly scan the bar code") */ 'notifications.barcode.desc',
                {},
                'mobile-native',
            ),
        ];

        if (isIOS) {
            [title, body] = translations;
        } else {
            [body] = translations;
        }

        return {
            notification: {
                title,
                body,
                categoryIdentifier: isAndroid || ['QR_CODE', 'AZTECCODE'].includes(barcode.BarCodeType) === false ? 'barcode' : 'qrcode',
                userInfo: {
                    ex: url,
                    displayName: displayName[1].trim(),
                    barCodeData: barcode.BarCodeData,
                    barCodeType: barcode.BarCodeType,
                    userName: account.UserName,
                    providerFontColor: `#${account.FontColor || 'FFFFFF'}`,
                    providerBgColor: `#${account.BackgroundColor || '515766'}`,
                    providerLogo: account.ProviderCode || '',
                    properties: getAccountProperties(subAccount || account),
                },
            },
            trigger: {
                type: 'geofence',
                geofence: {
                    lat: location.Lat,
                    lng: location.Lng,
                    radius: location.Radius,
                    locationId: location.LocationID,
                },
            },
        };
    }
}

// eslint-disable-next-line import/prefer-default-export
export {BarcodeNotification};
