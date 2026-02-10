import hoistNonReactStatics from 'hoist-non-react-statics';
import React from 'react';

import {ThemeConsumer} from './context';

export function withTheme<P>(Component) {
    const ThemedComponent = ({forwardedRef, ...props}: P & {forwardedRef: React.Ref<any>}) => (
        <ThemeConsumer>{(theme) => <Component {...props} ref={forwardedRef} theme={theme} />}</ThemeConsumer>
    );

    hoistNonReactStatics(ThemedComponent, Component);
    return ThemedComponent;
}
