import PropTypes from 'prop-types';
import React from 'react';
import {Text, View} from 'react-native';

// eslint-disable-next-line react/display-name
const Message = React.memo(({text, style, titleStyle}) => {
    if (React.isValidElement(text)) {
        return <View style={style}>{text}</View>;
    }

    return (
        <View style={style}>
            <Text style={titleStyle}>{text}</Text>
        </View>
    );
});

Message.propTypes = {
    style: PropTypes.any,
    text: PropTypes.string,
    titleStyle: PropTypes.any,
};

export default Message;
