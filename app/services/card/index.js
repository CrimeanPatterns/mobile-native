import _ from 'lodash';
import RNFetchBlob from 'react-native-blob-util';

import API from '../api';
import {Dirs} from '../files';

class Card {
    static getLocalFilePath(accountId, subAccountId) {
        let path = Dirs.images;

        if (accountId) {
            path += `/${accountId}`;

            if (subAccountId) {
                path += `/${subAccountId}`;
            }
        } else {
            path = Dirs.temp;
        }

        return `${path}/`;
    }

    static upload({uploadUrl, side: kind, filePath, fileName, barcode, UUID}) {
        const data = new FormData();

        data.append(
            'data',
            JSON.stringify({
                kind,
                barcode,
                UUID,
            }),
        );

        data.append('upload', {
            uri: `file://${filePath.replace('file://', '')}`,
            type: 'image/jpeg',
            name: fileName,
        });

        return API.post(uploadUrl, data);
    }

    static moveFromTemp(fileName, accountId) {
        const arrPath = `${Dirs.temp}/${fileName}`;
        const dstPath = `${Dirs.images}/${accountId}/`;

        return new Promise((resolve, reject) => {
            RNFetchBlob.fs
                .exists(arrPath)
                .then((exists) => {
                    if (exists) {
                        Card.moveFile(arrPath, dstPath, fileName).then(resolve).catch(reject);
                    } else {
                        reject();
                    }
                })
                .catch(reject);
        });
    }

    static copyFile(arrPath, dstPath, fileName) {
        // eslint-disable-next-line no-param-reassign
        dstPath = _.trim(dstPath, '/');
        return new Promise((resolve, reject) => {
            Card.createFolder(dstPath).then(() => {
                RNFetchBlob.fs.cp(arrPath, `${dstPath}/${fileName}`).then(resolve).catch(reject);
            });
        });
    }

    static moveFile(arrPath, dstPath, fileName) {
        // eslint-disable-next-line no-param-reassign
        dstPath = _.trim(dstPath, '/');
        return new Promise((resolve, reject) => {
            Card.createFolder(dstPath).then(() => {
                RNFetchBlob.fs.mv(arrPath, `${dstPath}/${fileName}`).then(resolve).catch(reject);
            });
        });
    }

    static createFolder(path) {
        return new Promise((resolve) => {
            RNFetchBlob.fs
                .mkdir(path)
                .catch(() => {})
                .finally(resolve);
        });
    }

    static getUploadUrl(accountId, subAccountId) {
        let uploadUrl;

        if (accountId) {
            const accountType = accountId.charAt(0) === 'a' ? 'account' : 'coupon';

            uploadUrl = ['', 'cardImage', accountType, accountId.substr(1)].join('/');
            if (subAccountId) {
                uploadUrl = [uploadUrl, subAccountId].join('/');
            }
        } else {
            uploadUrl = ['', 'cardImage', ''].join('/');
        }

        return uploadUrl;
    }

    static removeAccountFolder(accountId) {
        return RNFetchBlob.fs.unlink(`${Dirs.images}/${accountId}`);
    }

    static cleanup({localPath, excludeFileName, prefix}) {
        console.log('start cleanup', {localPath, prefix, excludeFileName});
        RNFetchBlob.fs
            .ls(localPath)
            .then((result) => {
                if (!_.isEmpty(excludeFileName)) {
                    // eslint-disable-next-line no-param-reassign
                    result = result.filter((fileName) => fileName !== excludeFileName);
                }
                result
                    .filter((fileName) => fileName.indexOf(prefix) === 0)
                    .forEach((fileName) => {
                        console.log('cleanup, remove image', {localPath, fileName});
                        RNFetchBlob.fs.unlink(localPath + fileName);
                    });
            })
            .catch(() => {});
    }

    static destroy() {
        Card.cleanup({localPath: Dirs.root});
    }
}

export default Card;
