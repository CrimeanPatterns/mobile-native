import React from 'react';
import {Platform, Text} from 'react-native';

const SelectableText = ({...props}) => {
    const baseProps = {
        selectable: true,
        ...Platform.select({
            android: {
                // [Android] Text in FlatList not selectable https://github.com/facebook/react-native/issues/14746
                key: Math.random(),
            },
        }),
    };

    return <Text {...baseProps} {...props} />;
};

export default SelectableText;
