import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors, Fonts} from '../../styles';

// eslint-disable-next-line react/prop-types,react/display-name
const Card = React.memo(({backgroundColor, title, titleColor, handleColor, children}) => (
    <View style={[styles.card, backgroundColor && {backgroundColor}]}>
        <View style={[styles.header]}>
            <View style={[styles.handle, handleColor && {backgroundColor: handleColor}]} />
            {_.isString(title) && <Text style={[styles.title, titleColor && {color: titleColor}]}>{title}</Text>}
        </View>
        {children}
    </View>
));

export default Card;

const styles = StyleSheet.create({
    card: {
        flex: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        backgroundColor: Colors.white,
    },
    header: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    handle: {
        width: '10%',
        height: 5,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    title: {
        fontFamily: Fonts.regular,
        fontSize: 24,
        color: Colors.white,
        paddingVertical: 10,
        marginBottom: 15,
    },
});
