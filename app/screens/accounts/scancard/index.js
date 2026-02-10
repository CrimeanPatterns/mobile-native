import {useNavigation} from '@react-navigation/native';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

import {BaseThemedComponent} from '../../../components/baseThemed';
import CardCamera from '../../../components/card/camera';
import Icon from '../../../components/icon';
import {isIOS} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import uuid from '../../../helpers/uuid';
import {PathConfig} from '../../../navigation/linking';
import Card from '../../../services/card';
import {Dirs} from '../../../services/files';
import {resetByPath} from '../../../services/navigator';
import {Colors, DarkColors} from '../../../styles';
import {IconColors} from '../../../styles/icons';
import {useTheme} from '../../../theme';
import styles from '../add/styles';

const TouchableRow = getTouchableComponent(TouchableHighlight);

class ScanCard extends BaseThemedComponent {
    constructor(props) {
        super(props);

        this.openCrop = this.openCrop.bind(this);

        this.onTakePicture = this.onTakePicture.bind(this);
        this.onCrop = this.onCrop.bind(this);

        this.setStep = this.setStep.bind(this);
        this.skip = this.skip.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        this.step = 'Front';
        this.images = {};
        this.uuid = uuid();
        this.promises = [];
        this.barcode = null;
    }

    openAccountForm() {
        const params = {
            images: this.images,
            promises: this.promises,
            barcode: this.barcode,
        };

        return resetByPath(PathConfig.AccountScanAdd, params);
    }

    setStep(step) {
        this.step = step;
    }

    openCamera = (step) => {
        const {navigation} = this.props;

        this.step = step;

        CardCamera.checkPermissions().then(() => {
            navigation.push(isIOS ? 'Account' : 'ModalScreens', {
                screen: 'ScanCardCamera',
                params: {
                    side: step,
                    onTakePicture: this.onTakePicture,
                    skip: this.skip,
                    setStep: this.setStep,
                },
            });
        });
    };

    openCrop(imagePath) {
        const {navigation} = this.props;

        navigation.push('ScanCardCrop', {
            side: this.step,
            onCrop: this.onCrop,
            imagePath,
        });
    }

    onTakePicture(imageData) {
        const {barcode} = imageData;
        let {uri: arrPath} = imageData;
        const fileName = `${this.step}-${Date.now()}.jpg`;
        const dstPath = Dirs.temp;
        const localFilePath = `${dstPath}/${fileName}`;

        arrPath = arrPath.replace('file://', '');

        Card.copyFile(arrPath, dstPath, fileName).then(() => {
            this.openCrop(localFilePath);
            RNFetchBlob.fs.unlink(arrPath);
        });

        if (_.isNil(this.barcode)) {
            this.barcode = barcode;
        }

        this.images[this.step] = {
            UUID: uuid(),
            fileName,
            filePath: localFilePath,
            side: this.step,
        };
    }

    onCrop(event) {
        const {imagePath} = event;

        if (_.isObject(this.images) && _.isString(this.step) && _.isObject(this.images[this.step])) {
            this.images[this.step].filePath = imagePath;
            this.upload(this.images[this.step]);

            if (this.step === 'Front') {
                this.openCamera('Back');
            } else {
                this.openAccountForm();
            }
        }
    }

    upload(image) {
        const promise = new Promise((resolve, reject) => {
            Card.upload({
                uploadUrl: Card.getUploadUrl(),
                ...image,
            })
                .then((response) => {
                    resolve({
                        response,
                        side: image.side,
                    });
                })
                .catch((response) => {
                    reject({
                        response,
                        side: image.side,
                    });
                });
        });

        this.promises.push(promise);
    }

    skip() {
        this.openAccountForm();
    }

    render() {
        const colors = this.themeColors;

        const iconColors = {
            primary: this.selectColor(IconColors.gray, Colors.white),
            secondary: this.selectColor(Colors.white, IconColors.gray),
        };

        return (
            <>
                <TouchableRow
                    style={[styles.row, this.isDark && styles.rowDark]}
                    underlayColor={this.selectColor(Colors.grayLight, DarkColors.bgLight)}
                    onPress={() => this.openCamera('Front')}>
                    <View style={[styles.containerTall, this.isDark && styles.containerTallDark, styles.containerMain]} pointerEvents='box-only'>
                        <View style={styles.containerIcon}>
                            <Icon name='scan-card-path1' style={{position: 'relative', left: 0}} color={iconColors.primary} size={30} />
                            <Icon name='scan-card-path2' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.primary} size={30} />
                            <Icon name='scan-card-path3' style={{position: 'absolute', left: 0, top: 0}} color={Colors.red} size={30} />
                            <Icon name='scan-card-path4' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                            <Icon name='scan-card-path5' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                            <Icon name='scan-card-path6' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                            <Icon name='scan-card-path7' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                            <Icon name='scan-card-path8' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                            <Icon name='scan-card-path9' style={{position: 'absolute', left: 0, top: 0}} color={iconColors.secondary} size={30} />
                        </View>
                        <View style={styles.containerTitle}>
                            <Text style={[styles.title, this.isDark && styles.textDark]} numberOfLines={1} ellipsizeMode='tail'>
                                {Translator.trans('scan.card', {}, 'mobile')}
                            </Text>
                            <Text style={[styles.info, this.isDark && styles.textGray]}>{Translator.trans('scan.card.tip', {}, 'mobile')}</Text>
                        </View>
                        {isIOS && <Icon name='arrow' color={colors.grayDarkLight} size={20} />}
                    </View>
                </TouchableRow>
                <Text style={[styles.smallTitle, this.isDark && [styles.textDark, styles.smallTitleDark]]}>
                    {Translator.trans('account.add.tip', {}, 'mobile')}
                </Text>
            </>
        );
    }
}

export default () => {
    const navigation = useNavigation();
    const theme = useTheme();

    return <ScanCard navigation={navigation} theme={theme} />;
};
