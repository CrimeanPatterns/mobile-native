import Icon from '@components/icon';
import {AttachmentRow} from '@components/trips/details/list/attachments/row';
import {useAttachments} from '@hooks/trips/attachments';
import {useHeaderHeight} from '@react-navigation/elements';
import {Colors, DarkColors, Fonts} from '@styles/index';
import {useDark} from '@theme/use-theme';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, KeyboardAvoidingView, Linking, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {pickSingle, types as DocumentPickerTypes} from 'react-native-document-picker';
import {RectButton} from 'react-native-gesture-handler';
import {launchImageLibrary} from 'react-native-image-picker';
import {RichEditor, RichToolbar} from 'react-native-pell-rich-editor';
import Animated, {ReduceMotion, useAnimatedStyle, useDerivedValue, withSpring} from 'react-native-reanimated';

import {isIOS, osVersion} from '../../../helpers/device';
import {AttachmentBlock} from '../../../types/trips/blocks';
import ActionSheet from '../../page/actionSheet';

type RichEditorComponentProps = {
    initContentHTML: string | undefined;
    setContentHTML: React.Dispatch<React.SetStateAction<string>>;
    id: string;
    isTravelPlan: boolean;
    richTextRef: React.RefObject<RichEditor>;
};

type IEditor = React.FunctionComponent<RichEditorComponentProps>;

const FontFamilyStylesheet = `
@font-face {
    font-family: '${Fonts.regular}';
    src: local('Open Sans Regular'), local('OpenSans'), url('opensans-regular-webfont.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
`;
const hasElements = (array) => array.some((element) => !_.isNil(element));

export const RichEditorComponent: IEditor = ({initContentHTML, setContentHTML, id, isTravelPlan, richTextRef}) => {
    const isDark = useDark();
    const contentStyle = {
        backgroundColor: isDark ? DarkColors.bg : Colors.grayLight,
        color: isDark ? Colors.white : Colors.grayDark,
        caretColor: isDark ? DarkColors.blue : Colors.blue,
        placeholderColor: '#a9a9a9',
        initialCSSText: `${FontFamilyStylesheet}`,
        contentCSSText: `font-size: 17px; min-height: 50px; line-height: 22px; margin-bottom: 50px;${isIOS ? 'font-family: "OpenSans"' : ''}`,
        cssText: `* {margin: 0;} a {color: ${isDark ? DarkColors.blue : Colors.blue}}`,
    };
    const scrollRef = useRef<ScrollView>(null);
    const {height: windowHeight} = useWindowDimensions();
    const {files, addFile, filePicker, openFilePicker} = useAttachments();
    const [isLoadEnd, setIsLoadEnd] = useState(false);
    const [isShowAttachments, setIsShowAttachments] = useState(false);
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const height = useHeaderHeight();
    const filesHasElements = hasElements(files);
    const translateY = useDerivedValue(() => (isLoadEnd && filesHasElements ? 0 : windowHeight));
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: withSpring(translateY.value, {
                    duration: 2000,
                    dampingRatio: 0.8,
                    stiffness: 100,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 20,
                    reduceMotion: ReduceMotion.System,
                }),
            },
        ],
    }));
    const getContainerBackgroundColor = () => {
        if (!filesHasElements) {
            return isDark ? DarkColors.bg : Colors.grayLight;
        }

        return isDark ? DarkColors.bgLight : Colors.white;
    };

    const pickFile = useCallback(
        async (index: number) => {
            let file;

            if (index === 1) {
                file = await pickSingle({
                    mode: 'import',
                    copyTo: 'cachesDirectory',
                    type: [
                        DocumentPickerTypes.doc,
                        DocumentPickerTypes.docx,
                        DocumentPickerTypes.pdf,
                        DocumentPickerTypes.images,
                        DocumentPickerTypes.plainText,
                        DocumentPickerTypes.ppt,
                        DocumentPickerTypes.pptx,
                        DocumentPickerTypes.csv,
                        DocumentPickerTypes.xls,
                        DocumentPickerTypes.xlsx,
                    ],
                });

                file = {
                    path: file.fileCopyUri,
                    name: file.name,
                    type: file.type,
                };
            }
            if (index === 0) {
                const {assets} = await launchImageLibrary({
                    mediaType: 'photo',
                });

                if (assets) {
                    file = {
                        path: assets[0].uri,
                        name: assets[0].fileName,
                        type: assets[0].type,
                    };
                }
            }

            if (_.isUndefined(file) === false) {
                addFile(file);
            }
        },
        [addFile],
    );

    const renderSheet = useCallback(
        () => (
            <ActionSheet
                cancelButton={Translator.trans('cancel', {}, 'messages')}
                ref={filePicker}
                options={[Translator.trans('select-from-gallery', {}, 'mobile-native'), Translator.trans('select-from-files', {}, 'mobile-native')]}
                warnColor={isDark ? DarkColors.red : Colors.red}
                onPress={pickFile}
                buttonUnderlayColor={isDark ? DarkColors.bgLight : Colors.grayLight}
                onCancel={_.noop}
            />
        ),
        [filePicker, isDark, pickFile],
    );

    const handleCursorPosition = useCallback((scrollY) => {
        scrollRef.current?.scrollTo({y: scrollY - windowHeight / 3, animated: true});
    }, []);

    const dismissKeyboard = () => {
        richTextRef.current?.dismissKeyboard();
        setIsShowKeyboard(false);
    };

    const renderFile = (file: AttachmentBlock | null, index: number) => (
        <View key={`${index}`}>
            {!_.isNil(file) && (
                <RectButton onPress={dismissKeyboard}>
                    <AttachmentRow file={file} noteId={id} isTravelPlan={isTravelPlan} index={index} />
                </RectButton>
            )}
        </View>
    );

    const handleFocus = () => {
        if (isIOS) {
            richTextRef.current?.focusContentEditor();
        }
        setIsShowKeyboard(true);
    };

    const getIconColor = () => {
        if (isDark) {
            return Colors.white;
        }

        return isIOS ? null : Colors.textGray;
    };

    const getEnterKeyHint = () => {
        if (!isIOS && Number(osVersion) > 11) {
            return 'previous';
        }

        return undefined;
    };

    useEffect(() => {
        if (isLoadEnd && filesHasElements) {
            setIsShowAttachments(true);
        } else if (isLoadEnd && !filesHasElements) {
            setTimeout(() => {
                setIsShowAttachments(false);
            }, 500);
        }
    }, [isLoadEnd, files]);

    return (
        <KeyboardAvoidingView behavior='height' keyboardVerticalOffset={height} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, backgroundColor: getContainerBackgroundColor()}}>
                <ScrollView
                    style={{backgroundColor: getContainerBackgroundColor()}}
                    contentContainerStyle={[styles.scrollContainer, isDark && styles.scrollContainerDark]}
                    keyboardDismissMode={'none'}
                    ref={scrollRef}
                    nestedScrollEnabled={true}
                    scrollEnabled={true}
                    scrollEventThrottle={20}>
                    <TouchableOpacity activeOpacity={1} onPress={dismissKeyboard}>
                        <RichToolbar
                            style={[styles.richBar, isDark && styles.richBarDark]}
                            flatContainerStyle={styles.flatStyle}
                            editor={richTextRef}
                            selectedIconTint={isIOS ? '#2095F2' : isDark ? Colors.green : DarkColors.green}
                            disabledIconTint={'#bfbfbf'}
                            iconTint={getIconColor()}
                            actions={['bold', 'italic', 'underline']}>
                            <View style={{paddingHorizontal: 7, flexDirection: 'row'}}>
                                <View style={styles.customButtonWrap}>
                                    <TouchableOpacity style={styles.icon} onPress={() => richTextRef.current?.sendAction('undo', 'result')}>
                                        <Image
                                            source={require('react-native-pell-rich-editor/img/undo.png')}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                tintColor: getIconColor(),
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.customButtonWrap}>
                                    <TouchableOpacity style={styles.icon} onPress={() => richTextRef.current?.sendAction('redo', 'result')}>
                                        <Image
                                            source={require('react-native-pell-rich-editor/img/redo.png')}
                                            style={{
                                                height: 20,
                                                width: 20,
                                                tintColor: getIconColor(),
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.customButtonWrap, styles.attachmentsButtonWrap, isDark && styles.attachmentsButtonWrapDark]}>
                                <TouchableOpacity
                                    style={[styles.icon, {paddingHorizontal: 15}]} // change icon color
                                    onPress={() => {
                                        dismissKeyboard();
                                        openFilePicker();
                                    }}>
                                    <Icon name={'attach'} size={20} color={isIOS && !isDark ? Colors.grayDark : getIconColor()} />
                                </TouchableOpacity>
                            </View>
                        </RichToolbar>
                    </TouchableOpacity>
                    <RichEditor
                        initialFocus={false}
                        firstFocusEnd={false}
                        editorStyle={contentStyle}
                        ref={richTextRef}
                        style={[styles.rich, isDark && styles.richDark]}
                        useContainer={true}
                        initialHeight={50}
                        placeholder={'Type something'}
                        initialContentHTML={initContentHTML}
                        pasteAsPlainText={true}
                        onChange={(value) => {
                            setContentHTML(value);
                        }}
                        enterKeyHint={getEnterKeyHint()}
                        onLayout={async () => {
                            richTextRef.current?.sendAction('setHtml', initContentHTML as string);
                        }}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        onFocus={handleFocus}
                        onCursorPosition={handleCursorPosition}
                        onLoadEnd={() => setIsLoadEnd(true)}
                        defaultParagraphSeparator={'p'}
                        autoCapitalize={'sentences'}
                        onLink={(url) => {
                            dismissKeyboard();
                            Linking.openURL(url);
                        }}
                        baseUrl={isIOS ? ReactNativeBlobUtil.fs.dirs.MainBundleDir : ''}
                    />
                    {isShowAttachments ? (
                        <Animated.View style={[styles.attacmentsWrap, isDark && styles.attacmentsWrapDark, animatedStyle]}>
                            {files.map(renderFile)}
                        </Animated.View>
                    ) : (
                        <View style={{marginTop: 50}} />
                    )}
                </ScrollView>

                {isShowKeyboard && <TouchableOpacity activeOpacity={1} onPressOut={dismissKeyboard} style={styles.hideKeyboardBlock} />}
                {renderSheet()}
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    rich: {
        marginHorizontal: 3,
        backgroundColor: Colors.grayLight,
    },
    richDark: {
        backgroundColor: DarkColors.bg,
    },
    richBar: {
        alignItems: 'stretch',
        flexDirection: 'row',
        marginHorizontal: 15,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 6,
        backgroundColor: isIOS ? '#EFF2F4' : Colors.white,
    },
    richBarDark: {
        backgroundColor: '#252527',
    },
    scrollContainer: {
        minHeight: '100%',
        backgroundColor: Colors.grayLight,
    },
    scrollContainerDark: {
        backgroundColor: DarkColors.bg,
    },
    flatStyle: {
        flexDirection: 'row',
        flex: 1,
        paddingLeft: 5,
    },
    icon: {
        height: '100%',
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attacmentsWrap: {
        flex: 1,
        marginTop: 16,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: 'hidden',
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    attacmentsWrapDark: {
        backgroundColor: DarkColors.bgLight,
        borderWidth: 0,
    },
    hideKeyboardBlock: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        width: '100%',
    },
    customButtonWrap: {
        justifyContent: 'center',
    },
    attachmentsButtonWrap: {
        borderLeftWidth: 2,
        borderColor: Colors.grayLight,
    },
    attachmentsButtonWrapDark: {
        borderColor: DarkColors.bg,
    },
});
