import {Colors, DarkColors} from '@styles/index';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {PropsWithChildren, useCallback, useEffect, useMemo, useState} from 'react';
import {FormattedDate} from 'react-intl';
import {Alert, Text, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import CircularProgress from 'react-native-circular-progress-indicator';
import {RectButton} from 'react-native-gesture-handler';
import {PhotoViewerModule} from 'react-native-photo-viewer';
import Animated, {
    cancelAnimation,
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import {isIOS} from '../../../../../helpers/device';
import {useCancelToken} from '../../../../../hooks/axios';
import {useForceUpdate} from '../../../../../hooks/forceUpdate';
import {useAttachments} from '../../../../../hooks/trips/attachments';
import {BASE_URL, getAPIHeaders} from '../../../../../services/api';
import {Dirs} from '../../../../../services/files';
import {ColorSchemeDark, ThemeColors, useColorTheme, useTheme} from '../../../../../theme';
import {AttachmentBlock} from '../../../../../types/trips/blocks';
import Icon from '../../../../icon';
import styles from '../styles';
import {style} from './styles';

type AttachmentRowProps = {
    file: AttachmentBlock & {path?: string; type?: string};
    noteId: string;
    isTravelPlan: boolean;
    index: number;
};

function bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB'];

    if (bytes === 0) {
        return 'n/a';
    }

    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);

    if (i === 0) {
        return `${bytes} ${sizes[i]}`;
    }

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

const previewAttachmentFile = ({filePath, name}, removeCallback: () => void) => {
    PhotoViewerModule.preview({filePath: isIOS ? `file://${filePath}` : filePath, fileName: name, remove: true}, () => {
        if (isIOS) {
            Alert.alert(
                '',
                Translator.trans('you-sure-delete-file', {}, 'trips'),
                [
                    {
                        text: Translator.trans('alerts.btn.cancel', {}, 'messages'),
                    },
                    {
                        text: Translator.trans('button.delete', {}, 'messages'),
                        onPress: () => {
                            PhotoViewerModule.close();
                            removeCallback?.();
                        },
                        style: 'destructive',
                    },
                ],
                {cancelable: false},
            );
        } else {
            removeCallback?.();
        }
    });
};

const CircleProgressBar: React.FunctionComponent<
    PropsWithChildren<{
        progress: number;
    }>
> = ({progress, children}) => {
    const theme = useTheme();
    const rotation = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(
        () => ({
            transform: [
                // @ts-ignore
                {
                    rotateZ: `${rotation.value}deg`,
                },
            ],
        }),
        [rotation.value],
    );

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
        );
        return () => cancelAnimation(rotation);
    }, []);

    return (
        <>
            <View style={{alignContent: 'center', alignItems: 'center'}}>
                <Animated.View style={animatedStyles}>
                    <CircularProgress
                        value={progress}
                        maxValue={100}
                        inActiveStrokeOpacity={0.5}
                        activeStrokeWidth={2}
                        inActiveStrokeWidth={2}
                        radius={10}
                        showProgressValue={false}
                        progressValueColor={'transparent'}
                        activeStrokeColor={isIOS ? ThemeColors[theme].blue : ThemeColors[theme].green}
                    />
                </Animated.View>
                {children}
            </View>
        </>
    );
};

const getLocalFilePath: (id: number, name: string) => string = (id, name) => `${Dirs.attachments}/${id}-${name}`;

const getLocalFileOldPath: (path: string, name: string) => string = (path, name) => {
    const tempPath = path.replace('file://', '');

    return tempPath.slice(0, tempPath.lastIndexOf('/') + 1) + name;
};

export const AttachmentRow: React.FunctionComponent<AttachmentRowProps> = ({file, noteId, isTravelPlan, index}) => {
    const {id, name, date} = file;
    const theme = useTheme();
    const isDark = theme === ColorSchemeDark;
    const forceUpdate = useForceUpdate();
    const {
        deleteFile,
        setFiles,
        updateFile,
        uploadFile: uploadFileQuery,
        getDownloadRoute,
    } = useAttachments({
        noteId,
        isTravelPlan,
    });
    const [isUploadingError, setUploadingError] = useState<boolean>();
    const [newFile, setNewFile] = useState<AttachmentBlock | null>(null);
    const [isDownloading, setDownloading] = useState(false);
    const selectColor = useColorTheme();
    const [uploadingState, setUploadingState] = useState<
        | {
              loaded: number;
              total: number;
          }
        | undefined
    >(undefined);
    const [progress, setProgress] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const filePath = getLocalFilePath(id, name);
    const isUploading = useMemo(() => uploadProgress > 0 && uploadProgress < 100, [uploadProgress]);
    const {cancelToken: uploadCancelToken, cancelRequest: cancelUploadRequest} = useCancelToken();
    const translateY = useSharedValue(index * 300);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(translateY.value, {
                    duration: 2000,
                    dampingRatio: 0.8,
                    stiffness: 100,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 5 * (index + 1),
                    reduceMotion: ReduceMotion.System,
                }),
            },
        ],
    }));

    const removeFile = useCallback(() => {
        deleteFile(file);
        forceUpdate();
    }, [deleteFile, file]);

    const cancelUpload = useCallback(() => {
        cancelUploadRequest();
        removeFile();
    }, [cancelUploadRequest, removeFile]);

    const previewFile = useCallback(() => {
        if (!_.isNil(id)) {
            previewAttachmentFile(
                {
                    filePath,
                    name,
                },
                removeFile,
            );
            return;
        }

        previewAttachmentFile(
            {
                filePath: getLocalFileOldPath(file.path as string, name),
                name,
            },
            removeFile,
        );
    }, [filePath, name, removeFile]);

    const downloadFile = useCallback(() => {
        if (isDownloading) {
            return;
        }

        setProgress(10);
        setDownloading(true);
        ReactNativeBlobUtil.config({
            path: filePath,
        })
            .fetch('GET', BASE_URL + getDownloadRoute(file), getAPIHeaders())
            .progress({interval: 500}, (received, total) => {
                setProgress(Math.max((received / total) * 100, 10));
            })
            .then(previewFile)
            .finally(() => {
                setProgress(100);
                setTimeout(() => setDownloading(false), 750);
            });
    }, [filePath, id, isDownloading, previewFile]);

    const processFile = useCallback(async () => {
        if (isDownloading || isUploading) {
            return;
        }

        if (_.isNil(id)) {
            previewFile();
            return;
        }

        const isExists = await ReactNativeBlobUtil.fs.exists(filePath);

        if (isExists) {
            previewFile();
        } else {
            downloadFile();
        }
    }, [downloadFile, filePath, isDownloading, isUploading, previewFile]);

    const onUploadProgress = useCallback((event) => {
        const percentCompleted = Math.min(Math.max(Math.round((event.loaded * 100) / event.total) - 1, 10), 90);

        setUploadingState({
            loaded: event.loaded,
            total: event.total,
        });
        setUploadProgress(percentCompleted);
    }, []);

    const getNewFile = (files: AttachmentBlock[], name: string) => {
        files.forEach((resultFile) => {
            if (resultFile.name === name) {
                setNewFile(resultFile);
            }
        });
    };

    const uploadFile = useCallback(async () => {
        setUploadingError(false);
        setUploadProgress(10);

        try {
            const formData = new FormData();

            formData.append('file', {
                uri: `file://${file.path?.replace('file://', '')}`,
                name: file.name,
                type: file.type,
            });

            const response = await uploadFileQuery(formData, {
                onUploadProgress,
                cancelToken: uploadCancelToken,
            });

            if (_.isObject(response.data)) {
                const {files, uploadedFileId} = response.data;

                if (_.isArray(files)) {
                    getNewFile(files, file.name);
                    forceUpdate();

                    const fileId = !_.isNil(uploadedFileId) ? uploadedFileId : files[files.length - 1].id;

                    if (!_.isNil(fileId)) {
                        ReactNativeBlobUtil.fs.cp(getLocalFileOldPath(file.path as string, file.name), getLocalFilePath(fileId, file.name));
                    }
                }
            }
        } catch {
            setUploadingError(true);
        } finally {
            setUploadingState(undefined);
            setUploadProgress(100);
        }
    }, [file.name, file.path, file.type, onUploadProgress, noteId, setFiles, uploadCancelToken]);

    const onLeftSidePress = useCallback(() => {
        if (isUploadingError) {
            return uploadFile();
        }
        if (isUploading) {
            return cancelUpload();
        }
    }, [cancelUpload, isUploading, isUploadingError, uploadFile]);

    const getCurrentDateTime = () => {
        let currentDate;

        if (!date.includes('T')) {
            currentDate = new Date(Date.UTC(1970, 0, 1));

            currentDate.setSeconds(file.time);
        } else {
            currentDate = new Date(date);
        }

        return <FormattedDate value={currentDate} year='numeric' month='short' day='numeric' hour='numeric' minute='2-digit' />;
    };

    useEffect(() => {
        if (_.isNil(file.id) && _.isNil(newFile)) {
            uploadFile();
        }

        if (!_.isNil(newFile)) {
            updateFile(file, newFile);
        }
    }, [file.id]);

    useEffect(() => {
        translateY.value = 0;
    }, [name]);

    useEffect(() => {
        if (!_.isNil(newFile)) {
            updateFile(file, newFile);
        }
    }, [newFile]);

    return (
        <Animated.View style={animatedStyle}>
            <RectButton onPress={processFile}>
                <View style={[style.attachmentRow, isDark && styles.containerDark]}>
                    <RectButton onPress={onLeftSidePress} enabled={isUploading || isUploadingError}>
                        <View style={style.leftColumn}>
                            {isDownloading && <CircleProgressBar progress={progress} />}
                            {isUploading && (
                                <CircleProgressBar progress={uploadProgress}>
                                    <Icon
                                        name={'android-clear'}
                                        color={isDark ? DarkColors.text : Colors.grayDarkLight}
                                        size={14}
                                        style={style.iconCancel}
                                    />
                                </CircleProgressBar>
                            )}
                            {isUploadingError && <Icon name={'update'} color={ThemeColors[theme].red} size={24} />}
                            {!isDownloading && !isUploading && !isUploadingError && (
                                <Icon
                                    name={'attach'}
                                    size={18}
                                    color={isIOS ? selectColor(Colors.grayDark, DarkColors.text) : selectColor(Colors.grayDarkLight, DarkColors.gray)}
                                />
                            )}
                        </View>
                    </RectButton>
                    <View style={style.middleColumn}>
                        <Text
                            style={[
                                style.fileName,
                                isDark && style.fileNameDark,
                                isUploading && {color: isDark ? Colors.white : Colors.grayDarkLight},
                                isUploadingError && {color: ThemeColors[theme].red},
                            ]}>
                            {name}
                        </Text>
                        {_.isString(date) && <Text style={[style.caption, isDark && style.captionDark]}>{getCurrentDateTime()}</Text>}
                        {_.isObject(uploadingState) && (
                            <Text style={[style.caption, isDark && style.captionDark]}>{`${bytesToSize(uploadingState.loaded)} / ${bytesToSize(
                                uploadingState.total,
                            )}`}</Text>
                        )}
                        {isUploadingError && (
                            <Text style={[style.caption, isDark && style.captionDark]}>
                                {Translator.trans(/** @Desc("Upload failed") */ 'upload-fail', {}, 'mobile-native')}
                            </Text>
                        )}
                    </View>
                    <RectButton onPress={removeFile} enabled={!isUploading || !isUploadingError}>
                        <View style={style.rightColumn}>
                            <Icon
                                name={'footer-delete'}
                                size={18}
                                color={
                                    isIOS ? selectColor(Colors.grayDarkLight, DarkColors.text) : selectColor(Colors.grayDarkLight, DarkColors.gray)
                                }
                            />
                        </View>
                    </RectButton>
                </View>
            </RectButton>
        </Animated.View>
    );
};
