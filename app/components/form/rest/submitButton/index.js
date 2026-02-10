import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import Button from '../button';

const styles = StyleSheet.create({
    container: {
        flexWrap: 'nowrap',
        ...Platform.select({
            ios: {
                paddingVertical: 20,
                paddingHorizontal: 10,
            },
            android: {
                paddingVertical: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            },
        }),
    },
});

const ForwardRefSubmitButtonComponent = React.forwardRef((props, ref) => (
    <View style={styles.container}>
        <Button accessibilityRole='button' accessibilityComponentType='button' accessibilityTraits='button' testID='submit' ref={ref} {...props} />
    </View>
));

ForwardRefSubmitButtonComponent.displayName = 'ForwardRefSubmitButtonComponent';

export default ForwardRefSubmitButtonComponent;
