import NetInfo from '@react-native-community/netinfo';
import {Colors, DarkColors, Fonts} from '@styles/index';
import {useTheme} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {lazy} from 'react';
import {Alert, Dimensions, Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {PhotoViewerModule} from 'react-native-photo-viewer';

import {isIOS, isTablet} from '../../../../helpers/device';
import AccountsList from '../../../../services/accountsList';
import API from '../../../../services/api';
import Card from '../../../../services/card';
import {BaseThemedPureComponent} from '../../../baseThemed';
import CardCapture from '../../../card/capture';
import DocumentCrop from '../../../document-scan-crop/crop';
import {TouchableBackground} from '../../../page/touchable';
import Spinner from '../../../spinner';

const LOADING = 3;
const LOADING_FAIL = 2;
const LOADED = 1;
// const REJECTED = 0;

let isConnected = null;
let additional;

const TakePhotoSvg = {
    ios: {
        light: lazy(() => import('@assets/svg/take-photo--light.ios.svg')),
        dark: lazy(() => import('@assets/svg/take-photo--dark.ios.svg')),
    },
    android: {
        light: lazy(() => import('@assets/svg/take-photo--light.android.svg')),
        dark: lazy(() => import('@assets/svg/take-photo--dark.android.svg')),
    },
};
const TakePhotoIcon = () => {
    const theme = useTheme();
    const Component = TakePhotoSvg[Platform.OS][theme];

    return <Component />;
};

class CardImage extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onRemove: PropTypes.func,
        onCapture: PropTypes.func,
        onUpload: PropTypes.func,
        url: PropTypes.string,
        accountId: PropTypes.string,
        subAccountId: PropTypes.string,
        fileName: PropTypes.string,
        id: PropTypes.string,
        side: PropTypes.string,
        label: PropTypes.string,
        canRemove: PropTypes.bool,
    };

    downloadTask = null;

    constructor(props) {
        super(props);

        this._orientationDidChange = this._orientationDidChange.bind(this);
        this._handleFirstConnectivityChange = this._handleFirstConnectivityChange.bind(this);

        this.onTakePicture = this.onTakePicture.bind(this);
        this.onCrop = this.onCrop.bind(this);

        this.translations = {
            Front: {
                title: Translator.trans(/** @Desc("Front of the Card") */ 'camera.front.title', {}, 'mobile'),
                tooltip: Translator.trans(/** @Desc("Please take picture of the front of the card") */ 'camera.front.tooltip', {}, 'mobile'),
            },
            Back: {
                title: Translator.trans(/** @Desc("Back of the Card") */ 'camera.back.title', {}, 'mobile'),
                tooltip: Translator.trans(/** @Desc("Please take picture of the back of the card") */ 'camera.back.tooltip', {}, 'mobile'),
            },
        };

        const {width, height} = Dimensions.get('window');

        this.state = {
            fileName: props.fileName,
            filePath: null,
            localFilePath: null,
            loadingState: null,
            id: props.id,
            visibleCardCapture: false,
            visibleDocumentCrop: false,
            ...CardImage.getClientImageSize(width),
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.unsubscribeNetInfoListener = NetInfo.addEventListener(this._handleFirstConnectivityChange);
        this.getImage();
        if (isTablet) {
            this.dimensionsListener = Dimensions.addEventListener('change', this._orientationDidChange);
        }
    }

    componentDidUpdate(prevProps) {
        const {url} = this.props;

        if (url !== prevProps.url) {
            if (_.isString(url)) {
                this.getImage(true);
            } else {
                this.resetState();
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.abortDownload();
        this.unsubscribeNetInfoListener();
        if (isTablet) {
            this.dimensionsListener?.remove();
        }
    }

    safeSetState(state, cb?) {
        if (this.mounted) {
            this.setState(state, cb);
        }
    }

    asyncSetState = (state) =>
        new Promise((resolve) => {
            this.safeSetState(state, () => resolve());
        });

    _orientationDidChange(e) {
        const {width} = e.window;

        this.setState(CardImage.getClientImageSize(width));
    }

    resetState() {
        this.safeSetState({
            fileName: null,
            filePath: null,
            localFilePath: null,
            loadingState: null,
            id: null,
        });
    }

    _handleFirstConnectivityChange({isInternetReachable}) {
        if (isConnected !== null && isConnected === false && isInternetReachable) {
            console.log('connectionChange', {isConnected, isInternetReachable});
            this.getImage();
        }
        isConnected = isInternetReachable;
    }

    static getClientImageSize = (width) => {
        let imageWidth;

        if (isTablet) {
            imageWidth = width * 0.45;

            if (imageWidth > 450) {
                imageWidth = 450;
            }
        } else {
            imageWidth = width * 0.9;
        }

        return {
            imageWidth,
            imageHeight: imageWidth * 0.6,
        };
    };

    setCardImageID(id) {
        this.safeSetState({id});
    }

    getLocalPath() {
        const {accountId, subAccountId} = this.props;

        return Card.getLocalFilePath(accountId, subAccountId);
    }

    getLocalFilePath(localFileName) {
        let localFilePath = this.getLocalPath();

        localFilePath += localFileName;

        return localFilePath;
    }

    getImagePrefix() {
        const {side} = this.props;

        return side;
    }

    getUploadUrl() {
        const {accountId, subAccountId} = this.props;

        return Card.getUploadUrl(accountId, subAccountId);
    }

    getImage(forceDownload = false) {
        const {fileName, url} = this.props;
        const {loadingState, filePath} = this.state;
        const path = this.getLocalFilePath(fileName);

        if (_.isString(fileName)) {
            ReactNativeBlobUtil.fs.exists(path).then((exist) => {
                console.log('check file exist', {fileName, exist, path});
                if (exist) {
                    if (!forceDownload && filePath !== path) {
                        this.safeSetState({filePath: path});
                    }
                } else if (!_.isEmpty(url) && (forceDownload || loadingState === LOADING_FAIL || _.isNil(loadingState))) {
                    this.download();
                }
            });
        }
    }

    download() {
        const {fileName, url} = this.props;
        const filePath = this.getLocalFilePath(fileName);

        this.safeSetState({loadingState: LOADING});
        this.abortDownload();

        console.log('download start', {fileName, filePath, url});
        this.downloadTask = ReactNativeBlobUtil.config({path: filePath}).fetch('GET', url);
        this.downloadTask
            .then((response) => {
                console.log('download done', {fileName, response});
                this.safeSetState({filePath, loadingState: LOADED});
            })
            .catch((errorMessage, statusCode) => {
                console.log('download fail', {fileName, errorMessage, statusCode});
                this.safeSetState({loadingState: LOADING_FAIL});
            });
    }

    abortDownload() {
        if (this.downloadTask !== null) {
            this.downloadTask.cancel();
        }
    }

    remove() {
        const {onRemove, side: kind, accountId} = this.props;

        if (_.isFunction(onRemove)) {
            onRemove(kind);
        }

        this.resetState();

        if (_.isUndefined(accountId) === false) {
            API({
                method: 'delete',
                url: this.getUploadUrl(),
                data: {
                    kind,
                },
                retry: 5,
            }).then((response) => {
                const {data} = response;

                if (_.isObject(data)) {
                    const {account} = data;

                    if (_.isObject(account)) {
                        AccountsList.setAccount(account);
                    }
                }
            });
        }
    }

    confirmRemove(callback) {
        const picturesTranslation = Translator.transChoice(/** @Desc("picture|pictures") */ 'pictures', 1, {}, 'mobile-native');
        const questionsTranslation = Translator.trans(
            /** @Desc("Please confirm you want to delete this picture") */ 'confirm-delete',
            {subject: picturesTranslation},
            'mobile-native',
        );

        Alert.alert(
            null,
            questionsTranslation,
            [
                {
                    text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                },
                {
                    text: Translator.trans('button.delete', {}, 'messages'),
                    onPress: () => {
                        if (_.isFunction(callback)) {
                            callback();
                        }
                        this.remove();
                    },
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    preview = () => {
        const {accountId} = this.props;
        let {canRemove: remove} = this.props;
        let {fileName, filePath} = this.state;

        if (isIOS) {
            filePath = `file://${filePath}`;
        }

        if (_.isNil(accountId)) {
            // account add
            remove = true;
        }

        PhotoViewerModule.preview({filePath, fileName, remove}, () => {
            if (isIOS) {
                this.confirmRemove(PhotoViewerModule.close);
            } else {
                this.remove();
            }
        });
    };

    onTakePicture(imageData) {
        let {uri: arrPath} = imageData;
        const fileName = `${this.getImagePrefix()}-${Date.now()}.jpg`;
        const dstPath = this.getLocalPath();
        const localFilePath = this.getLocalFilePath(fileName, true);

        arrPath = arrPath.replace('file://', '');

        console.log('onTakePicture', imageData);
        console.log('move file', {arrPath, dstPath});

        this.safeSetState(
            {
                visibleCardCapture: false,
            },
            () => {
                setTimeout(
                    () =>
                        Card.moveFile(arrPath, dstPath, fileName).then(() => {
                            console.log('file moved', {dstPath, fileName});
                            this.safeSetState({fileName, localFilePath, visibleDocumentCrop: true});
                        }),
                    500,
                ); // issue with multiply present modals
            },
        );
    }

    upload() {
        const {side, onUpload} = this.props;
        const {filePath, fileName, barcode} = this.state;
        const uploadUrl = this.getUploadUrl();

        Card.upload({uploadUrl, side, filePath, fileName, barcode})
            .then((response) => {
                const {data} = response;

                if (_.isObject(data)) {
                    const {account, CardImageId} = data;

                    if (_.isNil(CardImageId) === false) {
                        this.setCardImageID(String(CardImageId));
                    }

                    if (_.isFunction(onUpload)) {
                        onUpload({side, fileName, filePath, CardImageId});
                    }

                    if (_.isObject(account)) {
                        AccountsList.setAccount(account);
                    }
                }
                console.log('upload success', response);
            })
            .catch((response) => {
                console.log('upload fail', response);
            });
    }

    onCrop(filePath) {
        const {side, onCapture} = this.props;
        const {fileName} = this.state;

        if (_.isFunction(onCapture)) {
            onCapture({side, fileName, filePath});
        }

        this.safeSetState(
            {
                filePath,
                visibleCardCapture: false,
            },
            () => {
                this.upload();
            },
        );
    }

    openCardCapture = () => this.safeSetState({visibleCardCapture: true});

    onCloseCardCapture = () => this.asyncSetState({visibleCardCapture: false});

    onCloseDocumentCrop = () => this.asyncSetState({visibleDocumentCrop: false});

    renderImage() {
        const {filePath, imageWidth: width, imageHeight: height} = this.state;

        return <Image source={{uri: `file://${filePath}`, width, height}} borderRadius={10} style={{marginTop: 10, alignSelf: 'center'}} />;
    }

    renderEmptyContent() {
        const {label} = this.props;
        const {loadingState, imageWidth: width, imageHeight: height} = this.state;
        const colors = this.themeColors;
        const containerStyle = [cardStyle.container, this.isDark && cardStyle.containerDark, {width, height}];

        return (
            <TouchableBackground
                rippleColor={this.selectColor(Colors.gray, DarkColors.border)}
                activeBackgroundColor={this.selectColor(Colors.grayLight, DarkColors.bg)}
                style={containerStyle}
                onPress={this.openCardCapture}>
                {!_.isNil(loadingState) && (
                    <View style={cardStyle.row}>
                        <Spinner androidColor={this.selectColor(Colors.blueDark, DarkColors.blue)} />
                    </View>
                )}
                {_.isNil(loadingState) && (
                    <View style={cardStyle.row}>
                        <Text style={[cardStyle.title, this.isDark && cardStyle.textDark]}>{label}</Text>
                        <View style={{position: 'relative'}}>
                            <TakePhotoIcon />
                        </View>
                        <Text style={[cardStyle.silver, this.isDark && {color: colors.text}]}>{Translator.trans('take.picture', {}, 'mobile')}</Text>
                    </View>
                )}
            </TouchableBackground>
        );
    }

    render() {
        const {side} = this.props;
        const {visibleCardCapture, visibleDocumentCrop, localFilePath, filePath} = this.state;
        const {title, tooltip} = this.translations[side];

        return (
            <>
                {!_.isEmpty(filePath) && <TouchableWithoutFeedback onPress={this.preview}>{this.renderImage()}</TouchableWithoutFeedback>}
                {_.isEmpty(filePath) && this.renderEmptyContent()}
                {visibleCardCapture && (
                    <CardCapture title={title} tooltip={tooltip} onTakePicture={this.onTakePicture} onClose={this.onCloseCardCapture} />
                )}
                {visibleDocumentCrop && (
                    <DocumentCrop key='document-scan-crop' file={localFilePath} onCrop={this.onCrop} onClose={this.onCloseDocumentCrop} />
                )}
            </>
        );
    }
}

const base = {
    container: {
        backgroundColor: Colors.white,
        ...Platform.select({
            ios: {
                marginTop: 10,
                borderRadius: 10,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: Colors.gray,
            },
            android: {
                marginTop: 16,
                elevation: 2,
                borderRadius: 6,
            },
        }),
        alignSelf: 'center',
        overflow: 'hidden',
    },
    containerDark: {
        backgroundColor: DarkColors.bgLight,
        borderColor: DarkColors.border,
    },
    row: {
        flex: 1,
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontFamily: Fonts.regular,
        marginBottom: 5,
        ...Platform.select({
            ios: {
                fontSize: 17,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 16,
                color: Colors.grayDarkLight,
            },
        }),
    },
    textDark: {
        color: isIOS ? Colors.white : DarkColors.text,
    },
    icon: Platform.select({
        ios: {
            color: Colors.gray,
        },
        android: {
            color: '#bdbdbd',
        },
    }),
    silver: {
        fontFamily: Fonts.regular,
        marginTop: 5,
        ...Platform.select({
            ios: {
                fontSize: 12,
                color: Colors.grayDark,
            },
            android: {
                fontSize: 14,
                color: Colors.grayDarkLight,
            },
        }),
    },
};

if (isTablet) {
    additional = {
        container: {
            ...base.container,
            /* minWidth: 300,
             maxWidth: 300, */
            marginHorizontal: 10,
        },
    };
}

const cardStyle = StyleSheet.create({...base, ...additional});

export default CardImage;
