import {createContext} from 'react';
import {SharedValue} from 'react-native-reanimated';

export interface ScrollViewHandlerContextType {
    lastContentOffset: SharedValue<number>;
    isScrolling: SharedValue<boolean>;
}

export const ScrollViewHandlerContext = createContext<ScrollViewHandlerContextType | null>(null);
export const ScrollViewHandlerProvider = ScrollViewHandlerContext.Provider;
