import {HeaderLeftButton} from '@components/page/header/button';
import {TouchableOpacity} from '@components/page/touchable';
import {RichEditorComponent} from '@components/trips/rich-editor';
import {useForceUpdate} from '@hooks/forceUpdate';
import {useAttachments} from '@hooks/trips/attachments';
import API from '@services/api';
import {Colors, DarkColors} from '@styles/index';
import Translator from 'bazinga-translator';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {RichEditor} from 'react-native-pell-rich-editor';

import {AttachmentsFileProvider} from '../../../context/attachments';
import {isIOS} from '../../../helpers/device';
import TimelineService from '../../../services/timeline';
import {AttachmentBlock} from '../../../types/trips/blocks';

const Note = ({navigation, route}) => {
    const [initContentHTML, setInitContentHTML] = useState<string>('');
    const [contentHTML, setContentHTML] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const richTextRef = useRef<RichEditor>(null);
    const forceUpdate = useForceUpdate();
    const {setFiles} = useAttachments();
    const {id, isTravelPlan} = route.params;
    const isChangedNote = initContentHTML !== contentHTML && _.isString(initContentHTML);

    const saveChanges = useCallback(async () => {
        API.post(`/timeline/notes/${id}`, {notes: contentHTML}).then(() => {
            setInitContentHTML(contentHTML);
            richTextRef.current?.dismissKeyboard();
            forceUpdate();
        });
    }, [contentHTML]);

    const initialSetData = (notes: string, files: AttachmentBlock[]) => {
        setFiles(files);
        setInitContentHTML(notes);
        setContentHTML(notes);
        setIsLoading(false);
    };

    useEffect(() => {
        TimelineService.getNotes(id).then((response) => {
            const {data} = response;

            initialSetData(data.notes, data.files);
        });
    }, [id]);

    useEffect(() => {
        navigation.setParams({saveChanges, isChangedNote});
    }, [isChangedNote, saveChanges]);

    return (
        <>
            {!isLoading && (
                <View style={{height: '100%'}}>
                    <RichEditorComponent
                        initContentHTML={contentHTML}
                        setContentHTML={setContentHTML}
                        id={id}
                        isTravelPlan={isTravelPlan}
                        richTextRef={richTextRef}
                    />
                </View>
            )}
        </>
    );
};

const NoteScreen = ({navigation, route}) => (
    <AttachmentsFileProvider>
        <Note navigation={navigation} route={route} />
    </AttachmentsFileProvider>
);

NoteScreen.navigationOptions = ({navigation, route, selectColor}) => {
    const saveChanges = route.params?.saveChanges;
    const isChangedNote = route.params?.isChangedNote ?? false;

    const handlePressLeftButton = () => {
        navigation.goBack();
    };

    const getRightButtonColor = () => {
        if (isChangedNote) {
            return isIOS ? selectColor(Colors.blue, DarkColors.blue) : Colors.white;
        }

        return isIOS ? selectColor(Colors.grayDark, DarkColors.grayLight) : selectColor(Colors.grayDark, DarkColors.grayLight);
    };

    return {
        headerLeft: () => (
            <TouchableOpacity onPress={handlePressLeftButton} style={{width: isIOS && 30}}>
                <HeaderLeftButton
                    testID='close'
                    iconName='android-clear'
                    style={{left: isIOS ? 12 : 0}}
                    color={isIOS ? Colors.grayDark : Colors.white}
                    onPress={handlePressLeftButton}
                />
            </TouchableOpacity>
        ),
        title: '',
        headerRight: () => (
            <TouchableOpacity onPress={saveChanges} disabled={!isChangedNote}>
                <Text style={{fontSize: 17, color: getRightButtonColor()}}>{Translator.trans('form.button.save', {}, 'messages')}</Text>
            </TouchableOpacity>
        ),
        headerStyle: {
            backgroundColor: !isIOS && selectColor(Colors.green, DarkColors.bgLight),
        },
    };
};

export {NoteScreen};
