import {useAttachments} from '@hooks/trips/attachments';
import {RouteProp, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';

import {isAndroid} from '../../../../../helpers/device';
import {TripStackParamList} from '../../../../../types/navigation';
import {AttachmentBlock, AttachmentsBlock} from '../../../../../types/trips/blocks';
import {AttachmentRow} from './row';

type IAttachmentsList = React.FunctionComponent<Omit<AttachmentsBlock, 'val'>>;

const AttachmentsList: IAttachmentsList = () => {
    const {files} = useAttachments();
    const route = useRoute<RouteProp<TripStackParamList, 'TimelineSegmentDetails'>>();

    const renderFile = useCallback(
        (file: AttachmentBlock | null, index: number) => (
            <View key={`${index}`}>{!_.isNil(file) && <AttachmentRow file={file} noteId={route.params.id} index={0} isTravelPlan={false} />}</View>
        ),
        [],
    );

    return (
        <>
            {!_.isEmpty(files) && (
                <>
                    {files.map(renderFile)}
                    {isAndroid && <View style={{height: 60}} />}
                </>
            )}
        </>
    );
};

const Attachments: React.FunctionComponent<AttachmentsBlock> = ({val}) => {
    const {setFiles} = useAttachments();

    useEffect(() => {
        setFiles(val);
    }, [setFiles, val]);

    return <AttachmentsList />;
};

export {Attachments};
