import {useFocusEffect} from '@react-navigation/native';
import _ from 'lodash';
import React, {useCallback} from 'react';

export default React.memo(({onDidFocus, onDidBlur}) => {
    useFocusEffect(
        useCallback(() => {
            if (_.isFunction(onDidFocus)) {
                onDidFocus();
            }

            return () => _.isFunction(onDidBlur) && onDidBlur();
        }, [onDidFocus, onDidBlur]),
    );

    return null;
});
