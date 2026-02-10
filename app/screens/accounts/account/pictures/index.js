import Translator from 'bazinga-translator';
import _ from 'lodash';
import React from 'react';
import {Alert, Dimensions, FlatList, LayoutAnimation, Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import {PhotoViewerModule} from 'react-native-photo-viewer';

import {AccountPicture} from '../../../../components/accounts/pictures';
import {BaseThemedComponent} from '../../../../components/baseThemed';
import DocumentScanCrop from '../../../../components/document-scan-crop';
import Icon from '../../../../components/icon';
import ActionButton from '../../../../components/page/actionButton';
import HeaderButton from '../../../../components/page/header/button';
import {isIOS, isTablet} from '../../../../helpers/device';
import {getHeaderHeight} from '../../../../helpers/header';
import {getTouchableComponent} from '../../../../helpers/touchable';
import AccountsList from '../../../../services/accountsList';
import API from '../../../../services/api';
import Card from '../../../../services/card';
import {Dirs} from '../../../../services/files';
import GlobalError from '../../../../services/globalError';
import {Colors, DarkColors} from '../../../../styles';
import {IconColors} from '../../../../styles/icons';
import {withTheme} from '../../../../theme';
import {AccountDetails} from '../details';

const TouchableRow = getTouchableComponent(TouchableOpacity);

const PICTURE_SIZE = 250;
const PICTURE_MARGIN = 20;

@withTheme
class AccountPictures extends BaseThemedComponent {
    static navigationOptions = ({route}) => {
        const edit = route.params?.edit ?? false;
        const changeEditMode = route.params?.changeEditMode;
        const removeSelected = route.params?.removeSelected;
        const canRemove = route.params?.canRemove;
        let headerRight = () => (
            <HeaderButton
                title={isIOS ? Translator.trans('button.edit') : undefined}
                iconName={isIOS ? undefined : 'footer-edit'}
                onPress={changeEditMode}
            />
        );
        let headerLeft;

        if (edit === true) {
            if (isIOS) {
                headerLeft = () => (
                    <HeaderButton
                        color={Colors.blue}
                        colorDark={DarkColors.blue}
                        title={Translator.trans('alerts.btn.cancel', {}, 'messages')}
                        onPress={changeEditMode}
                    />
                );
                headerRight = () => (
                    <HeaderButton
                        disabled={!canRemove}
                        color={Colors.red}
                        colorDark={DarkColors.red}
                        title={Translator.trans('card-pictures.label.remove', {}, 'messages')}
                        onPress={removeSelected}
                    />
                );
            } else {
                headerLeft = () => (
                    <HeaderButton
                        accessible
                        accessibilityLabel={Translator.trans('alerts.btn.cancel', {}, 'messages')}
                        onPress={changeEditMode}
                        iconName='android-clear'
                        color={Colors.white}
                    />
                );
                headerRight = () =>
                    canRemove && (
                        <HeaderButton
                            accessible
                            accessibilityLabel={Translator.trans('card-pictures.label.remove', {}, 'messages')}
                            iconName='android-delete_outline'
                            onPress={removeSelected}
                        />
                    );
            }
        }

        return {
            title: 'Pictures',
            headerLeft,
            headerRight,
        };
    };

    static getNumColumns(width) {
        if (isTablet) {
            return Math.max(Math.min(Math.floor(width / PICTURE_SIZE), 4), 1);
        }

        return 1;
    }

    static getPictureSize(numColumns) {
        const headerHeight = getHeaderHeight();
        const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
        const width = screenWidth / numColumns - PICTURE_MARGIN;

        if (isTablet) {
            return {
                width,
                height: width,
            };
        }

        return {
            width,
            height: screenHeight - headerHeight,
        };
    }

    _documentScanCrop = React.createRef();

    constructor(props) {
        super(props);

        const {width: screenWidth} = Dimensions.get('window');

        this.preview = this.preview.bind(this);
        this.remove = this.remove.bind(this);
        this.uploadPicture = this.uploadPicture.bind(this);

        this.removeSelected = this.removeSelected.bind(this);
        this.onPicturePress = this.onPicturePress.bind(this);

        this.orientationDidChange = this.orientationDidChange.bind(this);

        const {account} = this.getAccount();
        const {Documents} = account;

        this.state = {
            edit: false,
            pictures: [...this.getPictures(Documents)],
            numColumns: AccountPictures.getNumColumns(screenWidth),
        };

        this.layoutLinear = {
            duration: 250,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
        };
    }

    componentDidMount() {
        const {navigation, route} = this.props;
        const newPicture = route.params?.newPicture;

        this.mounted = true;

        if (_.isObject(newPicture)) {
            this.addPicture(newPicture);
        }

        if (isTablet) {
            this.dimensionsListener = Dimensions.addEventListener('change', this.orientationDidChange);
        }

        navigation.setParams({
            changeEditMode: this.changeEditMode,
            removeSelected: this.removeSelected,
            canRemove: false,
        });
    }

    componentWillUnmount() {
        this.removeOldFiles();
        this.mounted = false;
        if (isTablet) {
            this.dimensionsListener?.remove();
        }
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    get documentScanCrop() {
        return this._documentScanCrop.current;
    }

    get accountId() {
        const {route} = this.props;

        return route.params?.ID;
    }

    orientationDidChange(e) {
        const {width} = e.window;

        this.safeSetState({
            numColumns: AccountPictures.getNumColumns(width),
        });
    }

    setAccount = (account) => {
        if (_.isObject(account)) {
            AccountsList.setAccount(account);
        }
    };

    getPictures(documents) {
        return documents.map((document) => {
            const {id, file: fileName, width, height} = document;
            const newFileName = `${id}-${fileName}`;

            return {
                id,
                originalFileName: fileName,
                fileName: newFileName,
                filePath: this.getLocalFilePath(newFileName),
                localPath: this.getLocalPath(),
                width: parseInt(width, 10),
                height: parseInt(height, 10),
                selected: false,
                uploadState: null,
            };
        });
    }

    getLocalPath() {
        let path = Dirs.images;

        path += `/${this.accountId}`;

        return `${path}/`;
    }

    getLocalFilePath(localFileName) {
        let path = this.getLocalPath();

        path += localFileName;

        return path;
    }

    getAccount() {
        return AccountDetails.getAccount(this.accountId);
    }

    capture = () => {
        if (this.documentScanCrop) {
            this.documentScanCrop.capture();
        }
    };

    upload = async (filePath, fileName) => {
        const {
            account: {ID},
        } = this.getAccount();
        const uploadUrl = `/documentImage/document/${ID}`;
        const response = await Card.upload({uploadUrl, filePath, fileName});

        const {data} = response;

        if (_.isObject(data)) {
            const {coupon, id} = data;

            console.log('picture uploaded', data);

            this.updatePictureState(fileName, {id});
            this.setAccount(coupon);
        }
    };

    addPicture = ({filePath, fileName}, cb) => {
        const {pictures} = this.state;
        const newPicture = {filePath, fileName, selected: false, uploadState: null};

        LayoutAnimation.configureNext(this.layoutLinear);

        this.safeSetState(
            {
                pictures: [...pictures, newPicture],
            },
            () => {
                this.uploadPicture(newPicture);
                if (_.isFunction(cb)) {
                    cb();
                }
            },
        );
    };

    uploadPicture = async ({fileName, filePath}) => {
        let uploadState = 'uploading';

        this.updatePictureState(fileName, {uploadState});

        try {
            await this.upload(filePath, fileName);
            uploadState = 'uploaded';
        } catch (error) {
            console.log('upload picture error', {error});
            GlobalError.showMessage(
                Translator.trans(/** @Desc("Image failed to upload, please try again.") */ 'image.upload-error', {}, 'mobile-native'),
            );
            uploadState = 'error';
        } finally {
            this.updatePictureState(fileName, {uploadState});
        }
    };

    updatePictureState(fileName, pictureState = {}) {
        this.safeSetState((state) => {
            const {pictures} = state;
            const picture = pictures.find((picture) => picture.fileName === fileName);
            const index = pictures.indexOf(picture);

            pictures[index] = {
                ...pictures[index],
                ...pictureState,
            };

            console.log('update picture state', fileName, pictureState, pictures[index]);

            return {
                ...state,
                pictures: [...pictures],
            };
        });
    }

    changeEditMode = () => {
        const {navigation} = this.props;
        const {pictures} = this.state;
        let {edit} = this.state;

        edit = !edit;

        navigation.setParams({
            edit,
        });

        this.safeSetState({edit});

        if (edit === false) {
            navigation.setParams({
                canRemove: false,
            });
            this.safeSetState({
                pictures: pictures.map((picture) => {
                    picture.selected = false;
                    return picture;
                }),
            });
        }
    };

    preview(index) {
        const {pictures} = this.state;
        const picture = pictures[index];
        const {filePath: path, fileName} = picture;
        let filePath = path;

        if (isIOS) {
            filePath = `file://${filePath}`;
        }

        PhotoViewerModule.preview({filePath, fileName, remove: true}, (response) => {
            if (isIOS) {
                this.confirmRemove([picture], PhotoViewerModule.close);
            } else {
                this.remove([picture]);
            }
        });
    }

    removeSelected() {
        const {pictures} = this.state;
        const documents = [];

        pictures.forEach((picture) => {
            if (picture.selected) {
                documents.push(picture);
            }
        });

        this.confirmRemove(documents);
    }

    confirmRemove(documents, callback) {
        const picturesTranslation = Translator.transChoice(/** @Desc("picture|pictures") */ 'pictures', documents.length, {}, 'mobile-native');
        let questionsTranslation = Translator.trans(
            /** @Desc("Please confirm you want to delete this picture") */ 'confirm-delete',
            {subject: picturesTranslation},
            'mobile-native',
        );

        if (documents.length > 1) {
            questionsTranslation = Translator.trans(
                /** @Desc("Please confirm you want to delete %num% %subject%") */ 'confirm-delete.many',
                {num: documents.length, subject: picturesTranslation},
                'mobile-native',
            );
        }

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
                        this.remove(documents);
                    },
                    style: 'destructive',
                },
            ],
            {cancelable: false},
        );
    }

    remove(documents) {
        const {navigation} = this.props;
        let {pictures} = this.state;
        const files = documents.map((document) => document.fileName);

        pictures = pictures.filter(({fileName}) => !files.includes(fileName));

        LayoutAnimation.configureNext(this.layoutLinear);

        this.safeSetState({
            pictures,
        });

        this._remove(documents);

        if (_.isEmpty(pictures)) {
            navigation.goBack();
        } else {
            navigation.setParams({
                canRemove: false,
            });
        }
    }

    _remove = async (documents) => {
        this._removeFiles(documents);

        console.log('remove', {data: documents.map((document) => document.id)});

        try {
            const response = await API({
                method: 'delete',
                url: '/documentImage',
                data: documents.map((document) => document.id),
                retry: 5,
            });
            const {data} = response;

            console.log('remove, success', data);

            if (_.isObject(data)) {
                const {coupon} = data;

                this.setAccount(coupon);
            }
        } catch (error) {
            console.log('remove, fail', {error});
        }
    };

    _removeFiles = (documents, exclude = false) => {
        const localPath = this.getLocalPath();
        const files = documents.map((document) => document.fileName);

        RNFetchBlob.fs
            .ls(localPath)
            .then((result) => {
                let lsResult = result;

                lsResult = lsResult.filter((fileName) => files.includes(fileName) === !exclude);

                lsResult.forEach((fileName) => {
                    RNFetchBlob.fs.unlink(this.getLocalFilePath(fileName));
                });
            })
            .catch(() => {});
    };

    removeOldFiles = () => {
        const {pictures} = this.state;

        this._removeFiles(pictures, true);
    };

    onPicturePress(image) {
        const {navigation, route} = this.props;
        const {pictures, edit} = this.state;
        const {fileName} = image;
        const picture = pictures.find((picture) => picture.fileName === fileName);
        const index = pictures.indexOf(picture);

        if (_.isObject(picture)) {
            if (edit) {
                const canRemove = route.params?.canRemove ?? false;
                let hasSelected = false;

                picture.selected = !picture.selected;
                pictures[index] = picture;
                hasSelected = pictures.some((picture) => picture.selected === true);

                if (canRemove !== hasSelected) {
                    navigation.setParams({canRemove: hasSelected});
                }

                this.safeSetState({pictures});

                return false;
            }

            this.preview(index);
        }

        return true;
    }

    renderButtonAdd = () => {
        if (isIOS) {
            return (
                <View style={[styles.addButton]}>
                    <TouchableRow
                        onPress={this.capture}
                        delayPressIn={0}
                        accessible
                        accessibilityLabel={Translator.trans('button.add', {}, 'messages')}>
                        <Icon name='group' color={this.selectColor(IconColors.gray, Colors.black)} size={32} />
                    </TouchableRow>
                </View>
            );
        }

        return <ActionButton color={Colors.blueDark} onPress={this.capture} iconName='plus' />;
    };

    renderItem = ({item}) => {
        const {edit, numColumns} = this.state;
        const {selected, uploadState} = item;
        const {width: scaleWidth, height: scaleHeight} = AccountPictures.getPictureSize(numColumns);
        const style = {marginHorizontal: PICTURE_MARGIN / 2};

        return (
            <AccountPicture
                edit={edit}
                image={item}
                uploadState={uploadState}
                selected={selected}
                onPress={this.onPicturePress}
                upload={this.uploadPicture}
                scaleWidth={scaleWidth}
                scaleHeight={scaleHeight}
                style={style}
            />
        );
    };

    renderFooter = () => <View style={{flex: 1, minHeight: 90}} />;

    keyExtractor = (item, index) => `${index}-${item.fileName}`;

    render() {
        const {pictures, numColumns} = this.state;

        console.log(pictures);
        return (
            <View style={[styles.page, this.isDark && styles.pageDark]}>
                <DocumentScanCrop accountId={this.accountId} key='document-scan-crop' ref={this._documentScanCrop} onCapture={this.addPicture} />
                <FlatList
                    key={`picture-list-${numColumns}`}
                    style={styles.documents}
                    data={pictures}
                    extraData={this.state}
                    renderItem={this.renderItem}
                    ListFooterComponent={this.renderFooter}
                    keyExtractor={this.keyExtractor}
                    numColumns={numColumns}
                    automaticallyAdjustContentInsets
                    contentInsetAdjustmentBehavior='automatic'
                />
                {this.renderButtonAdd()}
            </View>
        );
    }
}

export default AccountPictures;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Platform.select({
            ios: Colors.bgGray,
            android: Colors.white,
        }),
    },
    pageDark: {
        ...Platform.select({
            ios: {
                backgroundColor: Colors.black,
            },
            android: {
                backgroundColor: DarkColors.bg,
            },
        }),
    },
    documents: {
        flex: 1,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 35,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.white,
    },
});
