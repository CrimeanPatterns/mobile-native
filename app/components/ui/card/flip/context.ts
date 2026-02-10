import {createContext} from 'react';
import {SharedValue} from 'react-native-reanimated';

export const GestureFlipViewContext = createContext<{
    cardFace: SharedValue<number>;
    flipValue: SharedValue<number>;
    startValue: SharedValue<number>;
    width: number;
    height: number;
} | null>(null);
export const GestureFlipViewProvider = GestureFlipViewContext.Provider;
