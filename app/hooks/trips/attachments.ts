import update from 'immutability-helper';
import _ from 'lodash';
import {useCallback, useContext} from 'react';

import {AttachmentsFileContext} from '../../context/attachments';
import API from '../../services/api';
import {AttachmentBlock} from '../../types/trips/blocks';

type AttachmentsProps = {
    isTravelPlan?: boolean | null;
    noteId?: string | null;
};

const removeAttachmentFile = async (url: string): Promise<void> => {
    await API.delete(url);
};

export const useAttachments = ({isTravelPlan = null, noteId = null}: AttachmentsProps = {}) => {
    const {files, setFiles, filePicker} = useContext(AttachmentsFileContext);

    const openFilePicker = useCallback(() => {
        filePicker?.current?.show?.();
    }, [filePicker]);

    const getDownloadRoute = useCallback(
        (file) => (isTravelPlan ? `/timeline/notes/files/${noteId}/${file.id}` : `/timeline/itinerary/file/${file.id}`),
        [files, setFiles],
    );

    const deleteFile = useCallback(
        (file: AttachmentBlock) => {
            if (_.isNil(file.id) === false) {
                const url = isTravelPlan ? `/timeline/notes/files/${noteId}/${file.id}` : `/timeline/itinerary/file/${file.id}`;

                removeAttachmentFile(url);
            }

            setFiles(update(files, {$splice: [[files.indexOf(file), 1, null]]}));
        },
        [files, setFiles],
    );

    const addFile = useCallback(
        (file) => {
            setFiles(update(files, {$push: [file]}));
        },
        [files, setFiles],
    );

    const updateFile = useCallback(
        (previousFile, newFile) => {
            setFiles(update(files, {$splice: [[files.indexOf(previousFile), 1, newFile]]}));
        },
        [files, setFiles],
    );

    const uploadFile = (formData, config) => {
        const url = isTravelPlan ? `/timeline/notes/${noteId}` : `/timeline/itinerary/${noteId}/file`;
        const response = API.post<{
            files: AttachmentBlock[];
            uploadedFileId: number;
        }>(url, formData, config);

        return response;
    };

    return {
        files,
        setFiles,
        deleteFile,
        addFile,
        filePicker,
        openFilePicker,
        updateFile,
        uploadFile,
        getDownloadRoute,
    };
};
