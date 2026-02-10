import _ from 'lodash';
import React, {forwardRef, useEffect} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';

import {Colors} from '../../../styles';
import Icon from '../../icon';
import {IForm} from '../index';

export const FormError = forwardRef<
    View,
    {
        form: IForm;
        error: string | React.ReactNode;
        styles: {
            errorContainer: StyleProp<ViewStyle>;
            errorIcon: StyleProp<ViewStyle>;
            errorIconPane: StyleProp<ViewStyle>;
            error: StyleProp<ViewStyle>;
            errorText: StyleProp<TextStyle>;
        };
    }
>((props, forwardedRef) => {
    const {styles, error, form} = props;
    const textError = _.isObject(error) && !_.isString(error) ? error : <Text style={styles.errorText}>{error}</Text>;

    useEffect(() => {
        form.scrollToFirstError();
    }, []);

    return (
        <View style={styles.errorContainer} ref={forwardedRef}>
            <View style={styles.errorIcon}>
                <View style={styles.errorIconPane} />
                <Icon name='warning' color={Colors.orange} size={18} />
            </View>
            <View style={styles.error}>{textError}</View>
        </View>
    );
});
