import {useNavigation, useRoute} from '@react-navigation/native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';

export function withNavigation(Component: React.ComponentType<any>) {
    const ComponentWithNavigation = ({forwardedRef, ...props}) => {
        const navigation = useNavigation();
        const route = useRoute();

        return <Component {...props} ref={forwardedRef} navigation={navigation} route={route} />;
    };

    hoistNonReactStatics(ComponentWithNavigation, Component);
    return ComponentWithNavigation;
}
