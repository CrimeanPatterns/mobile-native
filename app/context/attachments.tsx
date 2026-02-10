import React, {createContext, PropsWithChildren, useRef, useState} from 'react';

import ActionSheet from '../components/page/actionSheet';
import {AttachmentBlock} from '../types/trips/blocks';

export const AttachmentsFileContext = createContext<{
    files: Array<AttachmentBlock | null>;
    setFiles: (files: Array<AttachmentBlock | null>) => void;
    filePicker: React.MutableRefObject<ActionSheet> | null;
}>({
    files: [],
    setFiles: () => {},
    filePicker: null,
});

export const AttachmentsFileProvider: React.FunctionComponent<PropsWithChildren> = ({children}) => {
    const filePicker = useRef<ActionSheet>(null);
    const [files, setFiles] = useState<Array<AttachmentBlock | null>>([]);

    return <AttachmentsFileContext.Provider value={{files, setFiles, filePicker}}>{children}</AttachmentsFileContext.Provider>;
};
