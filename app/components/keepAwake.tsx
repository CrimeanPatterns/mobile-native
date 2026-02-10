import {activateKeepAwake, deactivateKeepAwake} from '@sayem314/react-native-keep-awake';
import React, {useEffect} from 'react';

const KeepAwake: React.FunctionComponent<{
    timeout: number;
}> = ({timeout}) => {
    useEffect(() => {
        activateKeepAwake();
        setTimeout(deactivateKeepAwake, timeout);
        return deactivateKeepAwake;
    }, []);

    return null;
};

export {KeepAwake};
