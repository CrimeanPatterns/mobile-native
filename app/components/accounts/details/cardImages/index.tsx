import _ from 'lodash';
import React, {ReactElement} from 'react';
import {Text, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

import Card from '../../../../services/card';
import AccountDetailsRow, {AccountBlockItem, AccountKind} from '../row';
import styles from '../styles';
import CardImage from './cardImage';
import cardStyle from './styles';

type Image = {
    Label: string;
    CardImageId?: string;
    FileName?: string;
    Url?: string;
};
type Val = {
    Back: Image;
    Front: Image;
};

type AccountCardImagesProps = AccountBlockItem<AccountKind.card_images, Val>;

class AccountCardImages extends AccountDetailsRow<AccountCardImagesProps> {
    componentWillUnmount(): void {
        this.cleanup();
    }

    getAccountInfo = () => {
        const {
            account: {SubAccountID: subAccountId, Access},
            parentAccount,
        } = this.props;
        let {
            account: {FID: accountId},
        } = this.props;
        let accountsAccess = Access;

        if (_.isObject(parentAccount)) {
            accountId = parentAccount.FID;
            accountsAccess = parentAccount.Access;
        }

        return {accountId, subAccountId, access: accountsAccess};
    };

    cleanup(): void {
        const images = this.getImages();
        const excludedFiles = Object.entries(images)
            .filter(([, image]) => _.isString(image.FileName))
            .map(([, {FileName}]) => FileName);

        this._cleanup(excludedFiles);
    }

    _cleanup(excludedFiles): void {
        const localPath = this.getLocalPath();

        console.log('start cleanup', {localPath, excludedFiles});

        RNFetchBlob.fs
            .ls(localPath)
            .then((result) => {
                let lsResult = result;

                if (!_.isEmpty(excludedFiles)) {
                    lsResult = lsResult.filter((fileName) => !excludedFiles.includes(fileName));
                }

                lsResult.forEach((fileName) => {
                    console.log('cleanup, remove image', {fileName});
                    RNFetchBlob.fs.unlink(`${localPath}${fileName}`);
                });
            })
            .catch(() => {});
    }

    getLocalPath = () => {
        const {accountId, subAccountId} = this.getAccountInfo();

        return Card.getLocalFilePath(accountId, subAccountId);
    };

    getImages = (): Val => {
        const {
            item: {Val},
        } = this.props;

        return Val;
    };

    renderImage = (imageData: [string, Image]): ReactElement => {
        const {theme} = this.props;
        const {accountId, subAccountId, access} = this.getAccountInfo();
        const [side, image] = imageData;
        const {FileName: fileName, Label: label, Url: url, CardImageId} = image;

        // @ts-ignore
        return React.createElement(CardImage, {
            theme,
            key: [side, CardImageId, fileName].filter((item) => item).join('-'),
            id: String(CardImageId),
            side,
            fileName,
            label,
            url,
            accountId,
            subAccountId,
            canRemove: (_.isObject(access) && access.delete) || false,
        });
    };

    renderImages = (): ReactElement[] | null => {
        const images = this.getImages();

        if (_.isObject(images)) {
            return Object.entries(images).map(this.renderImage);
        }

        return null;
    };

    render(): ReactElement {
        const {
            item: {Name},
        } = this.props;

        return (
            <>
                {this.renderTopSeparator()}
                <View style={styles.column}>
                    <Text style={[styles.text, this.isDark && styles.textDark]}>{Name}</Text>
                    <View style={[cardStyle.card, this.isDark && cardStyle.cardDark]}>
                        <View style={[cardStyle.card, this.isDark && cardStyle.cardDark]}>{this.renderImages()}</View>
                    </View>
                </View>
                {this.renderBottomSeparator()}
            </>
        );
    }
}

export default AccountCardImages;
