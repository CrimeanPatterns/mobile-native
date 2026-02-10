import Translator from 'bazinga-translator';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

import {isIOS, isTablet} from '../../../helpers/device';
import {getTouchableComponent} from '../../../helpers/touchable';
import {BASE_URL} from '../../../services/api';
import Card from '../../../services/card';
import GlobalError from '../../../services/globalError';
import {Colors, DarkColors} from '../../../styles';
import {withTheme} from '../../../theme';
import {BaseThemedPureComponent} from '../../baseThemed';
import Icon from '../../icon';
import ScalableImage from '../../scalableImage';
import Spinner from '../../spinner';

const TouchableRow = getTouchableComponent(TouchableOpacity);
const LOADING = 3;
const LOADING_FAIL = 2;
const LOADED = 1;
// const REJECTED = 0;

@withTheme
class AccountPictureCheckbox extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        onPress: PropTypes.func,
        selected: PropTypes.bool,
    };

    render() {
        const {selected, onPress} = this.props;
        const ParentView = (_.isFunction(onPress) && TouchableRow) || View;
        const colors = this.themeColors;

        if (isIOS) {
            return (
                <ParentView onPress={onPress}>
                    <>
                        <Icon
                            name='photo-check-blank-path1'
                            style={{position: 'absolute'}}
                            color={this.selectColor(Colors.black, colors.border)}
                            size={30}
                        />
                        <Icon
                            name='photo-check-blank-path2'
                            style={{position: 'absolute'}}
                            color={this.selectColor(Colors.white, selected ? Colors.white : DarkColors.bgLight)}
                            size={30}
                        />
                        {selected === true && <Icon name='photo-check' style={{position: 'absolute'}} color={colors.blue} size={30} />}
                    </>
                </ParentView>
            );
        }

        return (
            <ParentView onPress={onPress}>
                <>
                    {selected === false && (
                        <Icon name='android-photo-check-inner-circle' style={{position: 'absolute'}} color='rgba(0,0,0,0.3)' size={30} />
                    )}
                    <Icon name='android-photo-check' style={{position: 'absolute'}} color={Colors.white} size={30} />
                    {selected === true && <Icon name='android-photo-check-blank' style={{position: 'absolute'}} color={Colors.white} size={30} />}
                </>
            </ParentView>
        );
    }
}

@withTheme
class AccountPicture extends BaseThemedPureComponent {
    static propTypes = {
        ...BaseThemedPureComponent.propTypes,
        edit: PropTypes.bool,
        image: PropTypes.shape({
            id: PropTypes.number,
            originalFileName: PropTypes.string,
            fileName: PropTypes.string,
            filePath: PropTypes.string,
            localPath: PropTypes.string,
            width: PropTypes.number,
            height: PropTypes.number,
        }).isRequired,
        uploadState: PropTypes.string,
        onPress: PropTypes.func,
        upload: PropTypes.func,
        selected: PropTypes.bool,
        scaleWidth: PropTypes.number.isRequired,
        scaleHeight: PropTypes.number.isRequired,
        style: PropTypes.any,
    };

    constructor(props) {
        super(props);

        this.download = this.download.bind(this);

        this.downloadTask = null;
        this.state = {
            loadingState: undefined,
            filePath: undefined,
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.getImage();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(state, cb) {
        if (this.mounted) {
            this.setState(state, cb);
        }
    }

    _onPress = () => {
        const {image, onPress} = this.props;

        if (_.isFunction(onPress)) {
            onPress(image);
        }
    };

    onPress = () => {
        const {image, uploadState, upload, edit} = this.props;

        if (edit) {
            this._onPress();
        } else if (this.isLoadingError()) {
            if (uploadState === 'error') {
                if (_.isFunction(upload)) {
                    upload(image);
                }
            } else {
                this.getImage();
            }
        } else {
            this._onPress();
        }
    };

    getOldImage = async () => {
        const {image} = this.props;
        const {originalFileName, localPath, fileName} = image;
        const oldPath = `${localPath}${originalFileName}`;

        const exist = await RNFetchBlob.fs.exists(oldPath);

        console.log('getOldImage', {oldPath, exist, localPath, fileName});

        if (exist) {
            await Card.moveFile(oldPath, localPath, fileName);
        }
    };

    async getImage() {
        const {image} = this.props;
        const {filePath} = image;
        const {loadingState} = this.state;

        if (loadingState === LOADING_FAIL || loadingState === undefined) {
            await this.getOldImage();

            RNFetchBlob.fs.exists(filePath).then((exist) => {
                if (!exist) {
                    this.download();
                } else {
                    this.safeSetState({filePath});
                }
            });
        }
    }

    download() {
        const {image} = this.props;
        const {filePath, fileName, id} = image;
        const url = `${BASE_URL}/documentImage/${id}`;

        this.safeSetState({loadingState: LOADING});
        this.abortDownload();

        console.log('download start', {fileName, filePath, url});

        this.downloadTask = RNFetchBlob.config({path: filePath}).fetch('GET', url);
        this.downloadTask
            .then((response) => {
                console.log('download done', {fileName, response});
                this.safeSetState({filePath, loadingState: LOADED});
            })
            .catch((errorMessage, statusCode) => {
                GlobalError.showMessage(
                    Translator.trans(/** @Desc("Image could not be downloaded, please try again.") */ 'image.download-error', {}, 'mobile-native'),
                );
                console.log('download fail', {fileName, errorMessage, statusCode});
                this.safeSetState({loadingState: LOADING_FAIL});
            });
    }

    abortDownload() {
        if (this.downloadTask !== null) {
            this.downloadTask.cancel();
        }
    }

    isLoading() {
        const {uploadState} = this.props;
        const {loadingState} = this.state;

        return uploadState === 'uploading' || loadingState === LOADING;
    }

    isLoadingError() {
        const {uploadState} = this.props;
        const {loadingState} = this.state;

        if (uploadState === 'error' || loadingState === LOADING_FAIL) {
            return true;
        }

        return false;
    }

    render() {
        const {
            image: {width, height},
            selected,
            edit,
            scaleWidth,
            scaleHeight,
            style,
        } = this.props;
        const {filePath} = this.state;
        const checkboxPosition = Platform.select({
            ios: {bottom: 35, right: 35},
            android: {top: 5, left: 5},
        });
        let imageProps = {
            width: scaleWidth,
        };

        if (isTablet) {
            imageProps = {
                width: scaleWidth,
                height: scaleHeight,
            };
        }

        if (_.isEmpty(filePath) === false) {
            imageProps.source = {uri: `file://${filePath}`};
        }

        return (
            <TouchableRow onPress={this.onPress}>
                <View
                    style={[
                        styles.container,
                        this.isDark && styles.containerDark,
                        {width: scaleWidth, minWidth: scaleWidth, maxWidth: scaleWidth},
                        isTablet && {height: scaleHeight, minHeight: scaleHeight, maxHeight: scaleHeight},
                        style,
                    ]}
                    pointerEvents='box-only'>
                    <ScalableImage sourceWidth={width} sourceHeight={height} {...imageProps} background />
                    {(this.isLoading() || selected) && (
                        <View style={styles.overlay}>
                            <View style={styles.overlayInner} />
                            {this.isLoading() && <Spinner color={Colors.white} />}
                        </View>
                    )}
                    {this.isLoadingError() && (
                        <View style={styles.overlay}>
                            <View style={styles.overlayInner} />
                            <Icon name='update' color={Colors.white} size={24} />
                        </View>
                    )}
                    {edit === true && (
                        <View style={[{position: 'absolute'}, checkboxPosition]}>
                            <AccountPictureCheckbox selected={selected} />
                        </View>
                    )}
                </View>
            </TouchableRow>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray,
    },
    containerDark: {
        backgroundColor: DarkColors.bgLight,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayInner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        ...Platform.select({
            ios: {backgroundColor: 'rgba(255,255,255,0.3)'},
            android: {backgroundColor: 'rgba(0,0,0,0.3)'},
        }),
    },
});

export {AccountPicture, AccountPictureCheckbox};
