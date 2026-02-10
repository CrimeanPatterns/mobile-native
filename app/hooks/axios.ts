import axios, {CancelTokenSource} from 'axios';
import {useCallback, useEffect, useRef} from 'react';

export const useCancelToken = () => {
    const axiosSource = useRef<CancelTokenSource>(axios.CancelToken.source());
    const updateCancelToken = useCallback(() => {
        axiosSource.current = axios.CancelToken.source();
        return axiosSource.current.token;
    }, []);
    const cancelRequest = useCallback(() => axiosSource.current?.cancel?.(), []);

    useEffect(
        () => () => {
            axiosSource.current?.cancel?.();
        },
        [],
    );

    return {cancelToken: axiosSource.current.token, updateCancelToken, cancelRequest};
};
